import { randomUUID } from 'node:crypto'
import { guestbookHandler } from '../server/guestbook.js'
import { contactHandler } from '../server/contact.js'

if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL to the destination database.')
async function call(handler, method, body) {
  const req = { method, headers: { host: 'example.test', origin: 'https://example.test', 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.1' }, body, socket: { remoteAddress: '127.0.0.1' } }
  const res = { statusCode: 200, setHeader() {}, end(value) { this.body = JSON.parse(value) } }
  await handler(req, res)
  if (res.statusCode !== 200) throw new Error(`API verification failed: ${res.statusCode} ${res.body?.error || ''}`)
  return res.body
}
const guestbook = guestbookHandler()
const before = await call(guestbook, 'GET')
if (!before.notes.length) throw new Error('Expected migrated notes were not found.')
const note = before.notes[0]
await call(guestbook, 'POST', note)
const after = await call(guestbook, 'GET')
if (after.notes.length !== before.notes.length || after.notes.filter(item => item.id === note.id).length !== 1) throw new Error('Duplicate protection verification failed.')
const contact = await call(contactHandler(), 'POST', { id: randomUUID(), name: 'Migration verification', reply: '', message: 'Test of the private contact form during the Vercel migration.' })
if (contact.status !== 'received') throw new Error('Private contact verification failed.')
console.log(`Guestbook: ${after.notes.length} notes; duplicate retry verified. Private contact: test message saved.`)
