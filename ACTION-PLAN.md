# ToolOrbit.site SEO Action Plan

## Critical

1. Fix soft 404s
   - Ensure unknown URLs return HTTP 404.
   - Add a real Next `not-found.tsx` or equivalent host rewrite.
   - Verify `/not-a-real-seo-audit-page-xyz` returns 404 after deploy.

2. Redirect `www` to apex
   - 301 redirect `https://www.toolorbit.site/*` to `https://toolorbit.site/*`.
   - Keep canonical tags on apex URLs.

3. Server-render indexable content
   - Every tool and blog page should include crawlable HTML content before client hydration.
   - Minimum target: one unique H1, 150-300 words of useful intro/supporting copy for tool pages, fuller body content for blog posts.

4. Fix generic metadata
   - Replace `© 2026 ToolOrbit.site` titles.
   - Replace repeated `One-stop professional efficiency tool aggregation platform.` descriptions.
   - Audit static pages, AI tool routes, `/blog`, and unfinished tools first.

5. Fix `/llms.txt`
   - Serve the existing `public/llms.txt` as `text/plain`.
   - Verify `https://toolorbit.site/llms.txt` returns the markdown-like text file, not app HTML.

## High

1. Add H1 coverage
   - Add one unique H1 per indexable route.
   - Match H1 to user intent, not just brand/category labels.

2. Improve tool page copy
   - Include purpose, input/output, privacy behavior, supported formats, example use cases, and limitations.
   - Prioritize JSON formatter, PDF tools, image tools, Base64, QR/barcode tools, and AI utilities.

3. Add security headers
   - Add `Strict-Transport-Security`.
   - Add `X-Content-Type-Options: nosniff`.
   - Add `Referrer-Policy`.
   - Add `Content-Security-Policy` after testing scripts/AdSense compatibility.
   - Add `Permissions-Policy` for camera/microphone/geolocation where appropriate.

4. Clean sitemap quality
   - Remove incomplete placeholder routes.
   - Use accurate `lastmod` values.
   - Keep only canonical indexable URLs.

5. Tighten titles/descriptions
   - Titles: usually 35-60 characters.
   - Descriptions: usually 120-160 characters.
   - Avoid duplicate `| ToolOrbit | ToolOrbit` patterns.

## Medium

1. Improve schema
   - Add/verify global `Organization`.
   - Enrich `SoftwareApplication` on tool pages.
   - Use FAQ schema only for visible FAQ content.

2. Strengthen blog SEO
   - Expand articles beyond thin summaries.
   - Add author/date/update signals.
   - Link each article to relevant tools and related posts.

3. Measure performance
   - Re-run PageSpeed when quota is available.
   - Track mobile LCP, INP, CLS, JS payload, and third-party impact.

4. Improve AI citability
   - Add compact definitions and examples near the top of pages.
   - Make privacy claims precise and verifiable.
   - Add visible "runs locally" notes only where true.

## Verification Checklist

- `curl -I https://toolorbit.site/not-a-real-seo-audit-page-xyz` returns 404.
- `curl -I https://www.toolorbit.site/` returns 301 to apex.
- `curl https://toolorbit.site/llms.txt` returns the intended text file.
- A no-JavaScript HTML fetch of a priority tool page contains the H1 and useful body copy.
- Sitemap contains only canonical, complete, indexable URLs.
- Search Console validates fixed soft 404 and duplicate host issues.
