# ToolOrbit.site SEO Action Plan

Updated from a fresh live crawl on 2026-05-13 17:16 Asia/Shanghai.

## High

1. Redirect `www` to apex
   - 301 redirect `https://www.toolorbit.site/*` to `https://toolorbit.site/*`.
   - Keep canonical tags on apex URLs.
   - Verify `https://www.toolorbit.site/` no longer returns `200 OK`.

2. Add H1 coverage
   - Add one unique server-rendered H1 per tool page.
   - Add one unique server-rendered H1 per category page.
   - Current refreshed crawl: 77/105 pages missing H1, including 67 tool pages and 10 category pages.

3. Tighten title tags
   - Prioritize titles over 60 characters.
   - Current refreshed crawl: 60/105 titles are longer than 60 characters.
   - Use a compact pattern such as `JSON Formatter | Validate and Beautify JSON | ToolOrbit`.

4. Tighten meta descriptions
   - Prioritize descriptions over 160 characters and under 120 characters.
   - Current refreshed crawl: 50 over 160 chars, 6 under 120 chars.
   - Keep descriptions specific, benefit-led, and accurate about local/browser/AI processing.

5. Re-run performance validation
   - PageSpeed returned `429` quota errors during the refresh.
   - Re-test homepage, a category page, a tool page, and a blog post.
   - Track mobile LCP, INP, CLS, total JS, and third-party script impact.

## Medium

1. Expand tool page copy
   - Raise priority tool pages to roughly 400-700 words of useful crawlable support content.
   - Include purpose, supported inputs, outputs, privacy behavior, limitations, examples, and common use cases.

2. Improve category pages
   - Add H1s and short intros.
   - Describe the category, who it helps, and which tools to use for common tasks.
   - Link to the most important tools first.

3. Add Content Security Policy
   - Current headers include HSTS, `nosniff`, `SAMEORIGIN`, referrer policy, and permissions policy.
   - Add CSP after testing analytics/AdSense/tool functionality.

4. Validate schema
   - Confirm each `FAQPage` schema matches visible FAQ content.
   - Keep `SoftwareApplication` fields consistent across tool pages.
   - Add or verify blog `dateModified`.

5. Strengthen internal linking
   - Link each blog article to related tools.
   - Add contextual links between related tool pages.
   - Use descriptive anchor text instead of generic labels.

## Low

1. Add route-specific social images
   - Prioritize homepage, top tools, category pages, and blog posts.
   - Keep dimensions and alt text stable.

2. Improve AI citability
   - Add concise definitions and examples near the top of tool pages.
   - Make privacy and processing claims precise.
   - Keep `/llms.txt` updated as the tool inventory changes.

3. Build topic clusters
   - Start with developer tools, PDF workflows, image tools, and AI productivity tools.
   - Add supporting blog posts only after core tool pages have strong H1/content/meta coverage.

## Fixed In Refresh

- Unknown URLs now return 404 instead of soft 200.
- `/llms.txt` now serves as `text/plain`.
- Security headers are present except CSP.
- Generic `© 2026 ToolOrbit.site` titles were not found in the refreshed crawl.
- All crawled pages had canonical tags and schema.

## Verification Checklist

- `https://www.toolorbit.site/` returns 301 to apex.
- A no-JavaScript HTML fetch of each priority tool page contains one H1.
- `https://toolorbit.site/tools/dev/json-formatter` has a title under ~60 characters and a meta description under ~160 characters.
- Sitemap contains only canonical, complete, indexable URLs.
- PageSpeed or Lighthouse scores are captured for mobile and desktop.
