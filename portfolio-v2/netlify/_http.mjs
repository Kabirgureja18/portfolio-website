export function adaptHandler(handler) {
  return async (event) => {
    const headers = Object.fromEntries(
      Object.entries(event.headers || {}).map(([key, value]) => [key.toLowerCase(), value]),
    )
    const body = event.isBase64Encoded && event.body
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body
    const req = {
      method: event.httpMethod,
      headers,
      body,
      socket: { remoteAddress: headers['x-nf-client-connection-ip'] || headers['x-forwarded-for'] || 'unknown' },
    }
    const responseHeaders = {}
    const res = {
      statusCode: 200,
      setHeader(name, value) { responseHeaders[name] = value },
      end(value = '') { this.body = value },
    }

    await handler(req, res)
    return {
      statusCode: res.statusCode,
      headers: responseHeaders,
      body: res.body || '',
    }
  }
}
