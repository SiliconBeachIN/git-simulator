SEO & Prerendering: sitemap, per-module meta, Netlify headers

Summary
- Generate per-module static pages and sitemap for https://gitsimulator.xyz/.
- Inject per-module `title`, `description`, `og:image`, `twitter:image` and JSON-LD (WebSite + BreadcrumbList).
- Add Netlify `_redirects`, `_headers`, and `robots.txt` to prioritize sitemap and security headers.
- Implement prerender pipeline (`scripts/prerender.mjs`) using `puppeteer-core` + `chrome-launcher` to output `dist/<module>/index.html`.

Files modified/added
- `src/constants/modules.js` — module titles/descriptions added
- `src/main.jsx` — `HelmetProvider` wiring
- `src/components/modules/ModuleContent.jsx` — Helmet meta injection
- `scripts/generate-sitemap.mjs` — sitemap generator
- `scripts/prerender.mjs` — prerender pipeline (meta post-processing + JSON-LD)
- `public/_redirects`, `public/_headers`, `public/robots.txt`, `public/sitemap.xml`
- `package.json` — `puppeteer-core`, `chrome-launcher@^1.2.1` devDeps and build scripts

Testing / how to verify
1. Run `npm install`, then `npm run build` locally. Confirm `dist/<module>/index.html` exists for modules.
2. Open `dist/init/index.html` and verify `<title>`, `<meta name="description">`, canonical and social tags present.
3. Upload `dist/` to Netlify (or run local static server) and inspect `https://<your-site>/sitemap.xml`.

CI notes
- Prerender requires a Chrome/Chromium binary. On CI/Netlify either set:
  - `PUPPETEER_SKIP_DOWNLOAD=1` and provide `CHROME_BIN` pointing to Chrome, OR
  - Allow puppeteer to download Chromium during build (ensure runner has network/disk).

Pending
- Add social preview images to `public/social/<id>.png` (placeholders referenced currently).
- (Optional) Enrich JSON-LD BreadcrumbList if you want deeper hierarchy.

If this looks good, create the PR on branch `seo/perfect-seo` in your repo and paste the PR link here; I can update the PR body or push follow-ups if needed.
