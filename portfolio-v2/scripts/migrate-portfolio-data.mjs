import { getDatabase } from '@netlify/database'

const { SOURCE_DATABASE_URL, DATABASE_URL } = process.env
if (!SOURCE_DATABASE_URL || !DATABASE_URL || SOURCE_DATABASE_URL === DATABASE_URL) {
  throw new Error('Set distinct SOURCE_DATABASE_URL and DATABASE_URL values in the environment.')
}
const source = getDatabase({ connectionString: SOURCE_DATABASE_URL }).pool
const target = getDatabase({ connectionString: DATABASE_URL }).pool
const definitions = {
  guestbook_notes: { fields: ['id', 'message', 'status', 'created_at'], create: "CREATE TABLE IF NOT EXISTS guestbook_notes (id TEXT PRIMARY KEY, message TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('published','held')), created_at BIGINT NOT NULL)" },
  private_contact: { fields: ['id', 'name', 'reply', 'message', 'visitor', 'created_at'], create: 'CREATE TABLE IF NOT EXISTS private_contact (id TEXT PRIMARY KEY, name TEXT, reply TEXT, message TEXT NOT NULL, visitor TEXT NOT NULL, created_at BIGINT NOT NULL)' },
}
let destination
try {
  destination = await target.connect()
  await destination.query('BEGIN')
  for (const [table, { fields, create }] of Object.entries(definitions)) {
    await destination.query(create)
    const exists = await source.query('SELECT to_regclass($1) IS NOT NULL AS present', [`public.${table}`])
    if (!exists.rows[0].present) { console.log(`${table}: source table absent`); continue }
    const { rows } = await source.query(`SELECT ${fields.join(',')} FROM ${table} ORDER BY id`)
    for (const row of rows) {
      const result = await destination.query(`INSERT INTO ${table} (${fields.join(',')}) VALUES (${fields.map((_, i) => `$${i + 1}`).join(',')}) ON CONFLICT (id) DO NOTHING RETURNING id`, fields.map(field => row[field]))
      if (!result.rowCount) {
        const existing = await destination.query(`SELECT ${fields.join(',')} FROM ${table} WHERE id=$1`, [row.id])
        if (!fields.every(field => {
          const previous = existing.rows[0]?.[field]
          return previous == null ? row[field] == null : row[field] != null && String(previous) === String(row[field])
        })) throw new Error(`Conflicting record in ${table}; no changes committed.`)
      }
    }
    const copied = await destination.query(`SELECT count(*)::int AS count FROM ${table} WHERE id = ANY($1::text[])`, [rows.map(row => row.id)])
    if (copied.rows[0].count !== rows.length) throw new Error(`Verification failed for ${table}; no changes committed.`)
    console.log(`${table}: ${rows.length} records verified`)
  }
  await destination.query('COMMIT')
} catch (error) {
  if (destination) await destination.query('ROLLBACK').catch(() => {})
  throw error
} finally {
  destination?.release()
  await Promise.all([source.end(), target.end()])
}
