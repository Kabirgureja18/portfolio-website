# Kabir Gureja portfolio

Run `npm install` and `npm run dev` for local development. Run `npm run build` to check TypeScript and create the production build.

The homepage and project descriptions are currently in `src/portfolio/App.tsx`. Certificate entries are in `src/portfolio/certificates.ts`, interest images and colors are in `content/interest-images.json`, and journey copy is in `src/portfolio/Journey.tsx`. Images are under `public`.

`GUESTBOOK.md` describes persistent storage, moderation, and the separate private inbox. The Vercel deployment uses the linked Neon Postgres database; the inbox does not forward email.

Vercel builds this `portfolio-v2` directory from the repository’s `main` branch. Keep the repository’s existing root project intact. `SITE_ORIGIN` sets the production canonical URL; `DATABASE_URL` is configured securely in Vercel.

The journey image is an illustration of the proposed support hub, not a prototype photograph. Certificate images were provided by Kabir and have not been independently verified with issuers. The Design for Bharat certificate with a disputed date is held in `asset-review`.

