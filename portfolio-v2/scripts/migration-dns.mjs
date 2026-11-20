// Optional fallback for environments whose DNS resolver cannot resolve database hosts.
import dns from 'node:dns'

const systemLookup = dns.lookup.bind(dns)
dns.lookup = (hostname, options, callback) => {
  if (typeof options === 'function') { callback = options; options = {} }
  systemLookup(hostname, options, async (error, address, family) => {
    if (!error || error.code !== 'ENOTFOUND') return callback(error, address, family)
    try {
      const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=A`, { signal: AbortSignal.timeout(5000) })
      const result = await response.json()
      const addresses = (result.Answer || []).filter(item => item.type === 1).map(item => ({ address: item.data, family: 4 }))
      if (!addresses.length) return callback(error)
      if (options?.all) return callback(null, addresses)
      callback(null, addresses[0].address, 4)
    } catch { callback(error) }
  })
}
