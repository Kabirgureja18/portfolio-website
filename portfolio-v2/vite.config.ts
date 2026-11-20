import { defineConfig, loadEnv, type Connect, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { guestbookHandler } from './server/guestbook.js'

import { githubActivityHandler } from './server/github-activity.js'
import { contactHandler } from './server/contact.js'

function localApi(env: Record<string, string>): Plugin {
  const guestbook = guestbookHandler({ local: true, env })
  const contact = contactHandler({ local: true, env })
  const attach = (server: { middlewares: Connect.Server }) => {
    server.middlewares.use((req, res, next) => {
      const path = req.url?.split('?')[0]
      if (path === '/api/github-activity') void githubActivityHandler(req, res)
      else if (path === '/api/guestbook') void guestbook(req, res)
      else if (path === '/api/contact') {
        void contact(req, res)
      } else next()
    })
  }
  return { name: 'local-portfolio-api', configureServer: attach, configurePreviewServer: attach }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), localApi(loadEnv(mode, process.cwd(), 'GUESTBOOK_'))],
  build: { rollupOptions: { output: { manualChunks(id) {
    if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion-dom') || id.includes('node_modules/motion-utils') || id.includes('node_modules/motion/')) return 'motion'
    if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) return 'gsap'
  } } } },
}))

