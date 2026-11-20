# Guestbook storage

## Vercel production

The Vercel deployment uses the linked Neon Postgres database via the server-only `DATABASE_URL` variable. The guestbook and private contact endpoints write to separate tables. GitHub activity fetches public GitHub data and can fall back to GitHub's public repository page if its API is rate limited. `SITE_ORIGIN` controls generated canonical URLs and the sitemap. Do not expose database credentials in client code or commit environment files.

Run `npm install` and `npm run dev`. The Vite dev and preview servers share the production guestbook handler. Local notes survive restarts in a SQLite database under `~/.local/share/kabir-portfolio/<project-hash>/guestbook.sqlite`, outside the served files. For disposable tests, set `GUESTBOOK_DB_URL` to a separate `file:` database path.

## Netlify production

The public guestbook uses the existing Netlify Database production branch. The modern function in `netlify/functions/guestbook.mjs` receives the managed `NETLIFY_DB_URL` from Netlify at runtime; do not expose the connection string in browser code. `GUESTBOOK_RATE_SECRET` is optional; when omitted, the database connection string is used as the key for visitor rate-limit hashes. The function creates missing tables and indexes without replacing existing rows. When deploying with the CLI after changing shared server code, use `netlify deploy --prod --skip-functions-cache` to avoid deploying a stale cached function.

## Deploy on Vercel

Create a hosted Turso/libSQL database for the portfolio and a read/write token. Set the following server-side environment variables in the Vercel project and redeploy. Use separate databases for previews and production. The endpoint creates its schema on its first request.

| Variable | Value |
| --- | --- |
| GUESTBOOK_DB_URL | The database's secure libsql:// or https:// URL |
| GUESTBOOK_DB_TOKEN | A read/write authentication token |
| GUESTBOOK_RATE_SECRET | A random secret, e.g. 32 cryptographic random bytes encoded as hex |

The Node function at `api/guestbook.js` requires remote storage when deployed. Missing credentials produce HTTP 503. No credentials belong in browser code or VITE-prefixed variables.

## Publishing and moderation

Guestbook posts are plain text, up to 500 UTF-16 units. The exact input is stored. An English profanity dictionary, control-character checks, and tests for links, email addresses, telephone numbers, and HTML-like markup hold flagged messages for review. This is automated rule-based screening. The filter can miss abuse, particularly in other languages. Review held messages and remove inappropriate published messages from the private database console.

Inspect pending notes using this read-only query:

```sql
SELECT id, message, created_at FROM guestbook_notes
WHERE status = 'held' ORDER BY created_at DESC;
```

To approve an individual note from the private database console, substitute its ID below. To keep a note private, leave it held.

```sql
UPDATE guestbook_notes SET status = 'published'
WHERE id = '<reviewed-note-id>' AND status = 'held';
```

A transaction enforces one record per client-generated UUID, including simultaneous posts and retries after connection loss. New submissions are limited to ten per IP per ten-minute window. The rate table stores only keyed hashes. Expired entries are pruned on subsequent writes. Private Contact submissions are never queried by the public wall.

## Private Contact inbox

Contact writes to the separate `private_contact` table. Only portfolio database administrators can read it. In the private database console, run:

```sql
SELECT name, reply, message, created_at
FROM private_contact ORDER BY created_at DESC;
```

The confirmation means the inbox accepted the note. Email forwarding is not configured.
