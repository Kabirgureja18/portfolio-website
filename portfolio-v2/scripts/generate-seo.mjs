import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const originalOrigin = 'https://kabir-gureja-portfolio.netlify.app'
const origin = (process.env.SITE_ORIGIN || originalOrigin).replace(/\/$/, '')
const routes = [
  { path: '/', title: 'Kabir Gureja | Developer, Innovator & Creative', description: "Explore Kabir Gureja's portfolio, featuring T.E.R.R.A., Vibe101, robotics, web development, creative projects and achievements.", heading: 'Kabir Gureja', body: 'Kabir Gureja is a student in Indore who builds robots and websites, takes photos, and explores branding and creative work. His projects include T.E.R.R.A., Vibe101 and RiverSpark.' },
  { path: '/projects', title: 'Projects & Work | Kabir Gureja', description: 'Explore Kabir Gureja’s projects and work across robotics, technology, web development and design.', heading: 'Projects and work by Kabir Gureja', body: 'Explore T.E.R.R.A., Vibe101 and RiverSpark: projects spanning robotics, web development and renewable energy.' },
  { path: '/projects/terra', title: 'T.E.R.R.A. | Kabir Gureja', description: 'Explore T.E.R.R.A., a team project developing a proposed robotic algae application system for degraded land.', heading: 'T.E.R.R.A.', body: 'T.E.R.R.A. is a team project exploring robotic algae application to degraded land. Kabir worked on the technical side as CTO.' },
  { path: '/projects/vibe101', title: 'Vibe101 | Kabir Gureja', description: 'Discover Vibe101, Kabir Gureja’s in-development guide to building projects with AI.', heading: 'Vibe101', body: 'Vibe101 is Kabir Gureja’s in-development guide to finding tools, editing prompts, choosing project blueprints and tracking builds.' },
  { path: '/projects/riverspark', title: 'RiverSpark | Kabir Gureja', description: 'Explore RiverSpark, Kabir Gureja’s portable turbine charger project in development.', heading: 'RiverSpark', body: 'RiverSpark is Kabir Gureja’s portable turbine charger project, exploring whether moving water could charge a phone while paddling.' },
  { path: '/achievements', title: 'Achievements | Kabir Gureja', description: 'View Kabir Gureja’s achievements and certificates, including Bal Vigyan and the IRIS National Fair.', heading: 'Achievements of Kabir Gureja', body: 'Explore Kabir Gureja’s achievements and certificates, including his Bal Vigyan science research presentation and the T.E.R.R.A. team’s IRIS National Fair Grand Prize.' },
]
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const publicUrl = path => origin + path + (path === '/' ? '' : '/')
const template = (await readFile('dist/index.html', 'utf8')).replaceAll(originalOrigin, origin)
const links = routes.map(route => `<li><a href="${route.path}">${escape(route.heading)}</a></li>`).join('')
for (const route of routes) {
  const title = escape(route.title)
  const description = escape(route.description)
  const canonical = publicUrl(route.path)
  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${description}" />`)
    .replace('<div id="root"></div>', `<div id="root"></div><noscript><main><h1>${escape(route.heading)}</h1><p>${escape(route.body)}</p><p>Enable JavaScript to explore the interactive portfolio.</p><nav aria-label="Portfolio pages"><ul>${links}</ul></nav></main></noscript>`)
  if (route.path !== '/') html = html.replace(/\s*<link rel="preload" as="image" href="\/images\/hero.webp"[^>]*>/, '')
  const directory = join('dist', route.path.slice(1))
  await mkdir(directory, { recursive: true })
  await writeFile(join(directory, 'index.html'), html)
}
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`)
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${publicUrl(route.path)}</loc></url>`).join('\n')}\n</urlset>\n`)
await writeFile('dist/404.html', '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found | Kabir Gureja</title><meta name="robots" content="noindex"></head><body><main><h1>Page not found</h1><p><a href="/">Return to Kabir Gureja’s portfolio</a></p></main></body></html>')
