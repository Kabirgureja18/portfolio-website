import { createHmac } from 'node:crypto'
import { connect, RequestError, readJson } from './guestbook.js'

async function savePrivatePostgres(db, values, visitor) {
  const client = await db.pool.connect()
  const now = Date.now()
  try {
    await client.query('BEGIN')
    await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [values.id])
    await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [visitor])

    const { rows: existing } = await client.query('SELECT name,reply,message FROM private_contact WHERE id=$1', [values.id])
    if (existing.length) {
      const prior = existing[0]
      if (prior.name !== values.name || prior.reply !== values.reply || prior.message !== values.message) {
        throw new RequestError(409, 'Please start a new message.')
      }
      await client.query('COMMIT')
      return { id: values.id, status: 'received' }
    }

    const { rows } = await client.query(
      'SELECT count(*)::integer AS count FROM private_contact WHERE visitor=$1 AND created_at>$2',
      [visitor, now - 600000],
    )
    if (rows[0].count >= 5) throw new RequestError(429, 'Please try again in ten minutes.')

    await client.query(
      'INSERT INTO private_contact (id,name,reply,message,visitor,created_at) VALUES ($1,$2,$3,$4,$5,$6)',
      [values.id, values.name, values.reply, values.message, visitor, now],
    )
    await client.query('COMMIT')
    return { id: values.id, status: 'received' }
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    throw error
  } finally {
    client.release()
  }
}

export function contactHandler({ env = process.env, local = false } = {}) {
  let connection
  async function openInbox() {
    const db = await connect(env, local)
    await db.execute('CREATE TABLE IF NOT EXISTS private_contact (id TEXT PRIMARY KEY, name TEXT, reply TEXT, message TEXT NOT NULL, visitor TEXT NOT NULL, created_at INTEGER NOT NULL)')
    await db.execute('CREATE INDEX IF NOT EXISTS contact_rate ON private_contact(visitor,created_at)')
    return db
  }
  return async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-store')
    try {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        throw new RequestError(405, 'Only private submissions are accepted.')
      }
      if (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) throw new RequestError(403, 'Use the portfolio contact form.')
      const body = await readJson(req, 16384)
      const {id,name,reply,message} = body || {}
      if (!/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(id) ||
          typeof name !== 'string' || name.length > 100 || !name.trim() ||
          typeof reply !== 'string' || reply.length > 254 || (reply && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reply)) ||
          typeof message !== 'string' || !message.trim() || message.length > 2000) throw new RequestError(400, 'Check your name, email and message.')
      const db = await (connection ??= openInbox().catch(error => {connection = undefined; throw error}))
      const ip = local ? req.socket.remoteAddress : req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for']
      const rateSecret = env.GUESTBOOK_RATE_SECRET || env.DATABASE_URL || env.NETLIFY_DB_URL || 'local-development'
      const visitor = createHmac('sha256', rateSecret).update(String(ip || 'unknown')).digest('hex')
      if (db.dialect === 'postgres') {
        res.end(JSON.stringify(await savePrivatePostgres(db, { id, name, reply, message }, visitor)))
        return
      }
      const now = Date.now()
      const [, saved] = await db.batch([
        {sql:'INSERT INTO private_contact SELECT ?,?,?,?,?,? WHERE (SELECT count(*) FROM private_contact WHERE visitor=? AND created_at>?)<5 ON CONFLICT(id) DO NOTHING',args:[id,name,reply,message,visitor,now,visitor,now-600000]},
        {sql:'SELECT name,reply,message FROM private_contact WHERE id=?',args:[id]}
      ], 'write')
      if (!saved.rows.length) throw new RequestError(429, 'Please try again in ten minutes.')
      const prior = saved.rows[0]
      if (prior.name!==name || prior.reply!==reply || prior.message!==message) throw new RequestError(409,'Please start a new message.')
      res.end(JSON.stringify({id,status:'received'}))
    } catch(error) {
      const expected = error instanceof RequestError
      res.statusCode = expected ? error.code : 503
      res.end(JSON.stringify({error:expected ? error.message : 'Private inbox unavailable. Please retry.'}))
    }
  }
}
