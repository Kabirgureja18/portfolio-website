const username = 'Kabirgureja18'
let cached
let cacheUntil = 0
const headers = { 'User-Agent': 'Kabir-portfolio', 'Accept': 'application/vnd.github+json' }

async function readCalendar() {
  const response = await fetch(`https://github.com/users/${username}/contributions`, { headers, signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error('Calendar unavailable')
  const html = await response.text()
  const matches = [...html.matchAll(/<td\b[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="([0-4])"[^>]*><\/td>\s*<tool-tip\b[^>]*>([^<]+)<\/tool-tip>/g)]
  const days = matches.map(([, date, level, text]) => ({ date, level: Number(level), count: text.startsWith('No contributions') ? 0 : Number.parseInt(text.replace(/,/g, ''), 10) }))
  if (days.length < 300 || days.some(day => !Number.isFinite(day.count))) throw new Error('Unexpected calendar')
  return days.sort((a, b) => a.date.localeCompare(b.date))
}

async function readRepositories() {
  const all = []
  for (let page = 1; page <= 10; page++) {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner&page=${page}`, { headers, signal: AbortSignal.timeout(8000) })
    if (!response.ok) throw new Error('Repositories unavailable')
    const data = await response.json()
    if (!Array.isArray(data)) throw new Error('Unexpected repositories')
    all.push(...data)
    if (data.length < 100) break
    if (page === 10) throw new Error('Repository list incomplete')
  }
  return all.filter(repo => !repo.private && repo.owner?.login?.toLowerCase() === username.toLowerCase() && typeof repo.name === 'string')
    .map(repo => ({ name: repo.name, url: `https://github.com/${username}/${encodeURIComponent(repo.name)}`, description: repo.description && repo.description.trim() !== '-' ? repo.description : null, language: repo.language || null, stars: repo.stargazers_count, updated: repo.updated_at, fork: Boolean(repo.fork) }))
}

async function readRepositoryPage() {
  const response = await fetch(`https://github.com/${username}?tab=repositories`, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error('Repositories unavailable')
  const html = await response.text()
  // Avoid presenting a partial repository count if GitHub paginates the list.
  if (/<a\b[^>]*\brel="next"/i.test(html)) throw new Error('Repository list requires pagination')
  const blocks = [...html.matchAll(/<li\b([^>]*\bitemprop="owns"[^>]*)>([\s\S]*?)<\/li>/g)]
  if (!blocks.length) throw new Error('Unexpected repository page')
  const decode = text => text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').trim()
  return blocks.map(([, attributes, block]) => {
    const nameMatch = block.match(new RegExp(`<a\\s+href="/${username}/([^"/]+)"\\s+itemprop="name codeRepository"`, 'i'))
    const updated = block.match(/<relative-time\s+datetime="([^"]+)"/i)?.[1]
    if (!nameMatch || !updated) throw new Error('Unexpected repository entry')
    const name = decode(nameMatch[1])
    const description = block.match(/<p\b[^>]*itemprop="description"[^>]*>([\s\S]*?)<\/p>/i)?.[1]
    const language = block.match(/<span\b[^>]*itemprop="programmingLanguage"[^>]*>([\s\S]*?)<\/span>/i)?.[1]
    const starAnchor = block.match(/<a\b[^>]*href="[^"]*\/stargazers"[^>]*>([\s\S]*?)<\/a>/i)?.[1]
    const starText = starAnchor ? decode(starAnchor).replace(/,/g, '') : '0'
    const stars = Number.parseInt(starText, 10)
    if (!Number.isFinite(stars)) throw new Error('Unexpected star count')
    return { name, url: `https://github.com/${username}/${encodeURIComponent(name)}`, description: description ? decode(description) : null, language: language ? decode(language) : null, stars, updated, fork: /\bfork\b/i.test(attributes) || /forked from/i.test(block) }
  })
}

export async function githubActivityHandler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=900')
  if (req.method !== 'GET') { res.statusCode = 405; res.setHeader('Allow', 'GET'); res.end(JSON.stringify({ error: 'Method not allowed' })); return }
  try {
    if (!cached || Date.now() >= cacheUntil) {
      const [calendar, repositories] = await Promise.allSettled([readCalendar(), readRepositories().catch(() => readRepositoryPage())])
      const days = calendar.status === 'fulfilled' ? calendar.value : null
      const repos = repositories.status === 'fulfilled' ? repositories.value : null
      if (!days && !repos) throw new Error('GitHub unavailable')
      cached = { days, repos, fetchedAt: new Date().toISOString() }
      cacheUntil = Date.now() + (days && repos ? 15 * 60 * 1000 : 60 * 1000)
    }
    if (!cached.days || !cached.repos) res.setHeader('Cache-Control', 'no-store')
    res.end(JSON.stringify(cached))
  } catch {
    res.statusCode = 503; res.setHeader('Cache-Control', 'no-store')
    res.end(JSON.stringify({ error: 'GitHub activity is temporarily unavailable.' }))
  }
}
