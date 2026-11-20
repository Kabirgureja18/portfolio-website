import { createHash, createHmac } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { englishDataset, englishRecommendedTransformers, RegExpMatcher } from 'obscenity'

const profanity = new RegExpMatcher({ ...englishDataset.build(), ...englishRecommendedTransformers })
const contactOrMarkup = /(?:https?:\/\/|www\.|[\w.+-]+@[\w.-]+\.[a-z]{2,}|<\/?[a-z][^>]*>|(?:\+?\d[\s().-]*){9,})/iu
const impermissibleControl = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u202a-\u202e\u2066-\u2069]/u
const maxBytes = 4096
const windowMs = 10 * 60 * 1000
const windowLimit = 10
const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export class RequestError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

function localUrl() {
  const project = createHash('sha256').update(process.cwd()).digest('hex').slice(0, 16)
  const dir = join(homedir(), '.local', 'share', 'kabir-portfolio', project)
  mkdirSync(dir, { recursive: true })
  return pathToFileURL(join(dir, 'guestbook.sqlite')).href
}

export async function connect(env, local) {
  const netlifyDbUrl = env.DATABASE_URL || env.NETLIFY_DB_URL || globalThis.Netlify?.env?.get('NETLIFY_DB_URL')
  if (!local && netlifyDbUrl) {
    const { getDatabase } = await import('@netlify/database')
    // The Netlify adapter runs in Lambda compatibility mode, so pass the
    // platform-provided connection string explicitly.
    const database = getDatabase({ connectionString: netlifyDbUrl })
    const db = {
      dialect: 'postgres',
      pool: database.pool,
      async execute(sql) {
        const result = await database.pool.query(sql)
        return { rows: result.rows }
      },
      async batch(statements) {
        const client = await database.pool.connect()
        try {
          await client.query('BEGIN')
          const results = []
          for (const statement of statements) {
            const sql = typeof statement === 'string' ? statement : statement.sql
            const args = typeof statement === 'string' ? [] : statement.args || []
            let parameter = 0
            const result = await client.query(sql.replace(/\?/g, () => `$${++parameter}`), args)
            results.push({ rows: result.rows, rowsAffected: result.rowCount })
          }
          await client.query('COMMIT')
          return results
        } catch (error) {
          await client.query('ROLLBACK')
          throw error
        } finally {
          client.release()
        }
      },
      close() {},
    }
    try {
      await db.batch([
        "CREATE TABLE IF NOT EXISTS guestbook_notes (id TEXT PRIMARY KEY, message TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('published','held')), created_at BIGINT NOT NULL)",
        'CREATE INDEX IF NOT EXISTS guestbook_wall ON guestbook_notes(status, created_at DESC)',
        'CREATE TABLE IF NOT EXISTS guestbook_limits (visitor TEXT PRIMARY KEY, count INTEGER NOT NULL, expires BIGINT NOT NULL)',
        'CREATE INDEX IF NOT EXISTS guestbook_expiry ON guestbook_limits(expires)',
      ], 'write')
    } catch (error) {
      throw error
    }
    return db
  }

  const url = env.GUESTBOOK_DB_URL || (local && localUrl())
  if (!local && (!/^libsql:\/\/|^https:\/\//.test(url || '') || !env.GUESTBOOK_DB_TOKEN)) {
    const error = new Error('No guestbook database connection is configured')
    error.code = 'GUESTBOOK_DATABASE_NOT_CONFIGURED'
    throw error
  }
  // Netlify's Linux bundle must use the web driver; the Node driver loads a
  // platform-native SQLite addon that is unavailable in a Windows-built bundle.
  const driver = local ? 'node' : 'web'
  const { createClient } = await import(`@libsql/client/${driver}`)
  const db = createClient({ url, authToken: env.GUESTBOOK_DB_TOKEN })
  try {
    await db.batch([
      "CREATE TABLE IF NOT EXISTS guestbook_notes (id TEXT PRIMARY KEY, message TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('published','held')), created_at INTEGER NOT NULL)",
      'CREATE INDEX IF NOT EXISTS guestbook_wall ON guestbook_notes(status, created_at DESC)',
      'CREATE TABLE IF NOT EXISTS guestbook_limits (visitor TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL)',
      'CREATE INDEX IF NOT EXISTS guestbook_expiry ON guestbook_limits(expires)',
    ], 'write')
  } catch (error) {
    db.close()
    throw error
  }
  return db
}

export async function readJson(req, byteLimit = maxBytes) {
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) {
    throw new RequestError(415, 'Send the note as JSON.')
  }
  if (Number(req.headers['content-length']) > byteLimit) throw new RequestError(413, 'Note is too large.')
  let payload = req.body
  if (payload === undefined) {
    const chunks = []
    let bytes = 0
    for await (const chunk of req) {
      bytes += chunk.length
      if (bytes > byteLimit) throw new RequestError(413, 'Note is too large.')
      chunks.push(chunk)
    }
    payload = Buffer.concat(chunks).toString('utf8')
  }
  if (typeof payload === 'string' || Buffer.isBuffer(payload)) {
    if (Buffer.byteLength(payload) > byteLimit) throw new RequestError(413, 'Note is too large.')
    try { payload = JSON.parse(payload.toString()) }
    catch { throw new RequestError(400, 'Could not read the note.') }
  }
  return payload
}

async function readDraft(req) {
  const payload = await readJson(req)
  if (!payload || Object.keys(payload).length !== 2 || typeof payload.id !== 'string' || !uuidV4.test(payload.id)
    || typeof payload.message !== 'string' || !payload.message.trim() || payload.message.length > 500) {
    throw new RequestError(400, 'Provide a valid note of 1–500 characters.')
  }
  return { id: payload.id.toLowerCase(), message: payload.message }
}

async function savePostgres(db, draft, visitor) {
  const { id, message } = draft
  const normalized = message.normalize('NFKC')
  const status = profanity.hasMatch(normalized) || impermissibleControl.test(normalized) || contactOrMarkup.test(normalized) ? 'held' : 'published'
  const now = Date.now()
  const client = await db.pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [id])
    await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [visitor])

    const { rows: existing } = await client.query('SELECT message,status FROM guestbook_notes WHERE id=$1', [id])
    if (existing.length) {
      if (existing[0].message !== message) throw new RequestError(409, 'This submission ID belongs to another note.')
      await client.query('COMMIT')
      return { id, status: existing[0].status }
    }

    await client.query('DELETE FROM guestbook_limits WHERE expires <= $1', [now])
    const reservation = await client.query(
      'INSERT INTO guestbook_limits (visitor,count,expires) VALUES ($1,1,$2) ON CONFLICT(visitor) DO UPDATE SET count=guestbook_limits.count+1 WHERE guestbook_limits.count < $3 RETURNING visitor',
      [visitor, now + windowMs, windowLimit],
    )
    if (!reservation.rows.length) throw new RequestError(429, 'Too many notes. Try again in ten minutes.')

    await client.query('INSERT INTO guestbook_notes (id,message,status,created_at) VALUES ($1,$2,$3,$4)', [id, message, status, now])
    await client.query('COMMIT')
    return { id, status }
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    throw error
  } finally {
    client.release()
  }
}

async function save(db, draft, visitor) {
  if (db.dialect === 'postgres') return savePostgres(db, draft, visitor)
  const { id, message } = draft
  const normalized = message.normalize('NFKC')
  const status = profanity.hasMatch(normalized) || impermissibleControl.test(normalized) || contactOrMarkup.test(normalized) ? 'held' : 'published'
  const now = Date.now()
  // One write transaction reserves an ID and charges the rate window only for a new note.
  const [, , , result] = await db.batch([
    { sql: 'DELETE FROM guestbook_limits WHERE expires <= ?', args: [now] },
    { sql: 'INSERT INTO guestbook_notes (id,message,status,created_at) SELECT ?,?,?,? WHERE COALESCE((SELECT count FROM guestbook_limits WHERE visitor=?),0) < ? ON CONFLICT(id) DO NOTHING',
      args: [id, message, status, now, visitor, windowLimit] },
    { sql: 'INSERT INTO guestbook_limits (visitor,count,expires) SELECT ?,1,? WHERE changes()=1 ON CONFLICT(visitor) DO UPDATE SET count=count+1',
      args: [visitor, now + windowMs] },
    { sql: 'SELECT message,status FROM guestbook_notes WHERE id=?', args: [id] },
  ], 'write')
  const stored = result.rows[0]
  if (!stored) throw new RequestError(429, 'Too many notes. Try again in ten minutes.')
  if (stored.message !== message) throw new RequestError(409, 'This submission ID belongs to another note.')
  return { id, status: stored.status }
}

export function guestbookHandler({ local = false, env = process.env } = {}) {
  let connection
  const database = () => connection ??= connect(env, local).catch(error => {
    connection = undefined
    throw error
  })
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    try {
      let response
      if (req.method === 'GET') {
        const db = await database()
        const { rows } = await db.execute("SELECT id,message FROM guestbook_notes WHERE status='published' ORDER BY created_at DESC,id DESC")
        response = { notes: rows }
      } else if (req.method === 'POST') {
        if (req.headers.origin) {
          let host
          try { host = new URL(req.headers.origin).host } catch { /* invalid origin */ }
          if (host !== req.headers.host) throw new RequestError(403, 'Post from the portfolio page.')
        }
        const draft = await readDraft(req)
        const ip = !local ? req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'] : req.socket.remoteAddress
        const db = await database()
        const rateSecret = env.GUESTBOOK_RATE_SECRET || env.DATABASE_URL || env.NETLIFY_DB_URL || globalThis.Netlify?.env?.get('NETLIFY_DB_URL') || 'local-development'
        const visitor = createHmac('sha256', rateSecret).update(String(ip || 'unknown')).digest('hex')
        response = await save(db, draft, visitor)
      } else {
        res.setHeader('Allow', 'GET, POST')
        throw new RequestError(405, 'Unsupported method.')
      }
      res.end(JSON.stringify(response))
    } catch (error) {
      const expected = error instanceof RequestError
      res.statusCode = expected ? error.code : 503
      if (!expected) console.error('Guestbook storage unavailable:', error.name, error.code || '')
      res.end(JSON.stringify({ error: expected ? error.message : 'The guestbook is unavailable. Please retry.' }))
    }
  }
}

