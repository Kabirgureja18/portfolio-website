import { guestbookHandler } from '../../server/guestbook.js'

const handleGuestbook = guestbookHandler()

export default async function guestbook(request, context) {
  const headers = Object.fromEntries(request.headers)
  headers.host ||= new URL(request.url).host
  headers['x-forwarded-for'] ||= context.ip || ''
  const req = {
    method: request.method,
    headers,
    body: request.method === 'POST' ? await request.text() : undefined,
    socket: { remoteAddress: context.ip || 'unknown' },
  }
  const responseHeaders = new Headers()
  const res = {
    statusCode: 200,
    setHeader(name, value) { responseHeaders.set(name, value) },
    end(value = '') { this.body = value },
  }
  await handleGuestbook(req, res)
  return new Response(res.body || '', { status: res.statusCode, headers: responseHeaders })
}
