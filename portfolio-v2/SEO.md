# Search indexing and migration

The build generates route-specific HTML, canonical and social metadata, `robots.txt` and `sitemap.xml`. The no-JavaScript content is a readable fallback for the same portfolio content; the interactive React site remains the primary experience. Do not add an invented Search Console verification token.

To verify ownership in Google Search Console, add the Vercel URL as a URL-prefix property and use Google's provided HTML verification file or meta tag. If using a meta tag, add the exact tag to `index.html`, rebuild and deploy, then complete verification in Search Console. Submit `https://kabir-gureja.vercel.app/sitemap.xml` in Sitemaps. Use URL Inspection to request indexing of the homepage and important project pages. Verification and submission do not guarantee rankings or indexing.

The old `https://kabirgureja.vercel.app/` site still responds. Do not change it until its ownership and the redirect have been explicitly authorized. If authorized and confirmed to be the correct Vercel project, the root-only redirect below can be merged into its existing `vercel.json` and deployed. Check old routes before adding any additional mappings; preserve working deep links where possible.

```json
{
  "redirects": [
    { "source": "/", "destination": "https://kabir-gureja.vercel.app/", "permanent": true }
  ]
}
```
