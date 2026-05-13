# ToolOrbit.site Full SEO Audit

Audit date: 2026-05-13 18:04 Asia/Shanghai  
Audited URL: https://toolorbit.site/  
Business type: Free browser-based utility/tool platform for developers, creators, ecommerce, PDF, image, text, and AI workflows  
SEO health score: 82/100

## Executive Summary

This refresh crawled the updated live site and ignored prior audit conclusions. The two previous high-priority fixes are now confirmed:

- `https://www.toolorbit.site/` now returns `301` to `https://toolorbit.site/`.
- Server-rendered H1 coverage is now complete: 0/105 crawled HTML pages are missing H1.

The site now has a much stronger crawlable baseline. The live HTML includes H1s, meaningful body copy, canonical tags, JSON-LD, and visible tool support content. Unknown URLs still return 404, `/llms.txt` serves as `text/plain`, and security headers remain present.

The remaining SEO work is mostly refinement rather than indexability repair. The largest opportunities are meta description length cleanup, expanding thinner category pages, and getting real performance data once PageSpeed quota is available.

Top issues:

1. 50/105 meta descriptions are longer than 160 characters, and 6 are under 120 characters.
2. 14/105 pages are under 300 extracted words, mostly category pages and four AI utility pages.
3. PageSpeed Insights is still unavailable due API `429`, so Core Web Vitals remain unverified.
4. No `Content-Security-Policy` header was detected.

Top quick wins:

1. Shorten high-priority meta descriptions.
2. Expand category pages with 100-200 more words of crawlable intro/use-case copy.
3. Add a tested Content Security Policy.
4. Re-run Lighthouse/PageSpeed after quota resets.

## Crawl Evidence

- Refreshed crawl timestamp: 2026-05-13T10:04:57.323Z
- Crawled HTML pages: 105
- Approximate unique URLs: 104
- HTTP 200 pages in crawl: 105
- Sitemap status: 200
- Sitemap URL count: 104
- Robots status: 200
- Robots policy: `Allow: /`
- Canonical tags missing: 0
- Pages missing H1: 0/105
- Pages with multiple H1s: 0/105
- Pages under 150 extracted words: 0/105
- Pages under 300 extracted words: 14/105
- Pages without detected schema: 0/105
- Images detected in server HTML: 78
- Images missing alt text: 0
- PageSpeed API: unavailable due Google API `429` daily quota

## Technical SEO

Score: 88/100

Strengths:

- `https://toolorbit.site/robots.txt` is reachable and allows crawling.
- `https://toolorbit.site/sitemap.xml` is reachable and lists 104 URLs.
- `http://toolorbit.site/` redirects to `https://toolorbit.site/` with `301`.
- `https://www.toolorbit.site/` redirects to `https://toolorbit.site/` with `301`.
- Unknown URLs such as `/not-a-real-seo-audit-page-xyz` and `/tools/not-real` return `404`.
- Canonical tags are present on all crawled pages.
- `/llms.txt` returns `200` with `content-type: text/plain; charset=utf-8`.
- Security headers are present: HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy`.

Issues:

- Medium: no `Content-Security-Policy` header was detected.
- Medium: PageSpeed/CWV could not be validated because PageSpeed API quota was exceeded.

## Content Quality

Score: 78/100

The site now exposes useful crawlable content in the initial HTML. Tool pages are no longer app-shell-only, and many priority tools have 400-560+ extracted words. Blog pages generally return 436-939 extracted words.

Remaining content gaps:

- 14 pages are under 300 words.
- Several category pages are thin: `webmaster-tools`, `text-tools`, `generators`, `ecommerce-tools`, `pdf-tools`, `image-tools`, and `fun-tools`.
- Four AI utility pages are just under 300 words: listing generator, keyword analyzer, competitor tracker, and market insights.

Recommendations:

- Add short category intros that explain who each category is for and which tools solve which task.
- Add 100-200 words of useful, visible support copy to the four thin AI utility pages.
- Continue linking blog posts to the most relevant tools with descriptive anchors.

## On-Page SEO

Score: 64/100

The previous H1 issue is fixed:

- Missing H1: 0/105
- Multiple H1: 0/105

Remaining on-page issues:

- 50 meta descriptions are longer than 160 characters.
- 6 meta descriptions are under 120 characters.
- 3 titles are under 30 characters.
- Local build verification after the latest patch found 0 titles over 60 characters and 0 `Parameters` H1s in generated HTML.

Examples needing meta description cleanup:

- `/tools/dev/json-formatter`: title 69 chars, meta description 242 chars.
- `/tools/ai/text-polisher`: title 81 chars, meta description 211 chars.
- `/tools/ai/translator`: title 78 chars, meta description 171 chars.
- `/tools/dev/uuid-generator`: title 69 chars, meta description 228 chars.
- `/blog/why-text-diff-matters`: title 92 chars.

Recommended meta pattern:

`Use [tool] to [specific task]. Supports [key formats/features] and runs [locally/in browser/with AI where true].`

## Schema & Structured Data

Score: 90/100

Detected schema coverage:

- `Organization`: 105 pages
- `WebSite`: 105 pages
- `BreadcrumbList`: 89 pages
- `WebApplication`: 67 pages
- `SoftwareApplication`: 67 pages
- `FAQPage`: 43 pages
- `BlogPosting`: 22 pages

Strengths:

- Global organization and website schema are present everywhere.
- Tool pages include application schema.
- Blog posts use `BlogPosting`.
- FAQ schema is present on many tool pages.

Recommendations:

- Confirm every `FAQPage` block matches visible FAQ content.
- Add or verify `dateModified` on blog schema.
- Keep `SoftwareApplication` fields consistent across tools.

## Performance

Score: provisional 50/100

PageSpeed Insights returned `429` quota errors for both mobile and desktop, so no Lighthouse or field Core Web Vitals scores were available.

Next measurement:

- Re-run PageSpeed when quota is available.
- Run local Lighthouse for homepage, one category page, one priority tool page, and one blog post.
- Track mobile LCP, INP, CLS, total JS transfer, and third-party script impact.

## Images

Score: 95/100

The crawl detected 78 images and 0 missing alt attributes.

Recommendations:

- Confirm images have explicit width/height or stable layout sizing to prevent CLS.
- Ensure social preview images exist for priority routes.
- Keep blog images descriptive and relevant to the article topic.

## AI Search Readiness

Score: 82/100

`/llms.txt` is live as plain text, schema coverage is broad, and tool pages now expose crawlable descriptions in the initial HTML. This is a good baseline for AI crawlers and search assistants.

Recommendations:

- Add concise, quotable summaries near the top of category pages.
- Make privacy and local-processing claims precise and verifiable.
- Add examples and limitations in plain HTML, not only inside interactive UI state.

## Priority Action Plan

High, fix within 1 week:

1. Shorten long meta descriptions on priority pages.
2. Expand thin category pages with more crawlable, task-focused copy.
3. Re-run Lighthouse/PageSpeed once quota is available.

Medium, fix within 1 month:

1. Add a tested Content Security Policy.
2. Improve category H1 wording where labels are too broad, such as `Image`, `Games`, and `Typography`.
3. Strengthen blog internal links to matching tools.
4. Validate FAQ schema against visible FAQ content.
5. Add route-specific OG images for top landing pages.

Low/backlog:

1. Add hreflang only if multilingual routes become indexable.
2. Build topic clusters around high-intent tool categories.
3. Add comparison/alternatives pages after core metadata cleanup.

## Fixed Since Prior Audit

- `www.toolorbit.site` now redirects to the canonical apex domain.
- Tool and category pages now include server-rendered H1 tags.
- Local build now generates no title tags over 60 characters.
- The four AI utility pages no longer use `Parameters` as their H1.
- Unknown URLs return 404.
- `/llms.txt` serves as `text/plain`.
- Security headers are present except CSP.
- All crawled pages had canonical tags and schema.

## Limitations

- PageSpeed Insights was unavailable due API quota (`429`), so performance scoring is provisional.
- This refresh used live crawlable HTML and HTTP headers. It does not include Google Search Console, GA4, backlink APIs, or real SERP ranking data.
- Visual UX screenshots were not part of this refresh.
