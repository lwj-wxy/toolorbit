# ToolOrbit.site Full SEO Audit

Audit date: 2026-05-13 17:16 Asia/Shanghai  
Audited URL: https://toolorbit.site/  
Business type: Free browser-based utility/tool platform for developers, creators, ecommerce, PDF, image, text, and AI workflows  
SEO health score: 73/100

## Executive Summary

This refresh ignored the older cache and re-crawled the live site. ToolOrbit is now in much stronger shape than the earlier cached audit suggested: invalid URLs return real 404 responses, `/llms.txt` serves as `text/plain`, security headers are present, all crawled pages have canonical tags, and all pages now expose at least global `Organization` and `WebSite` JSON-LD.

The remaining SEO work is mostly on-page quality and crawl clarity. The biggest issue is that 77 of 105 crawled pages still have no server-rendered H1. This affects all 67 tool pages and all 10 category pages in the crawl. Tool pages do have crawlable body copy now, but 52 pages are still under 300 extracted words, and many titles/descriptions are outside typical SERP-friendly length ranges.

Top issues:

1. `https://www.toolorbit.site/` returns `200 OK` instead of a 301 redirect to the canonical apex host.
2. 77/105 pages have no server-rendered H1, including every tool page and category page.
3. 60/105 titles are longer than 60 characters, and 50/105 meta descriptions are longer than 160 characters.
4. 52/105 pages have under 300 extracted words, mostly tool pages that could use more descriptive support copy.
5. PageSpeed Insights was unavailable because the API quota returned `429`, so Core Web Vitals remain unverified.

Quick wins:

1. Add one unique H1 to every tool and category page.
2. 301 redirect `www.toolorbit.site` to `toolorbit.site`.
3. Shorten title tags and meta descriptions for high-priority tools.
4. Add 2-4 concise FAQ/use-case sections to thin tool pages.
5. Re-run Lighthouse or PageSpeed once quota is available.

## Crawl Evidence

- Refreshed crawl timestamp: 2026-05-13T09:16:18.932Z
- Crawled HTML pages: 105
- HTTP 200 pages in crawl: 105
- Sitemap status: 200
- Sitemap URL count: 104
- Robots status: 200
- Robots policy: `Allow: /`
- Canonical tags missing: 0
- Pages missing H1: 77/105
- Pages under 150 extracted words: 0/105
- Pages under 300 extracted words: 52/105
- Pages without detected schema: 0/105
- Images detected in server HTML: 78
- Images missing alt text: 0
- PageSpeed API: unavailable due Google API `429` daily quota

## Technical SEO

Score: 78/100

Strengths:

- `https://toolorbit.site/robots.txt` is reachable and allows crawling.
- `https://toolorbit.site/sitemap.xml` is reachable and lists 104 canonical URLs.
- `http://toolorbit.site/` redirects to `https://toolorbit.site/` with `301`.
- Unknown URLs such as `/not-a-real-seo-audit-page-xyz` and `/tools/not-real` now return `404`.
- Canonical tags are present on all crawled pages.
- `/llms.txt` now returns `200` with `content-type: text/plain; charset=utf-8`.
- Security headers are now present: HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy`.

Issues:

- High: `https://www.toolorbit.site/` returns `200 OK` with duplicate homepage HTML. It should permanently redirect to the apex domain.
- Medium: no `Content-Security-Policy` header was detected. This is not a direct ranking factor, but it is a trust and hardening gap.
- Medium: PageSpeed/CWV could not be validated in this refresh because the PageSpeed API quota was exceeded.

## Content Quality

Score: 72/100

The site no longer looks like a thin JavaScript shell in the raw HTML. The homepage returned 1,350 extracted words, the blog index returned 645 words, static pages returned 390-434 words, and blog posts generally returned 436-939 words.

The main content gap is now at the tool-page level. Tool pages commonly return about 200-400 words, which is enough for basic crawl understanding but still light for competitive keywords such as JSON formatter, Base64 encoder, PDF merge, image compression, and AI translator.

Recommendations:

- Add server-rendered H1s to all tool pages and category pages.
- Expand priority tool pages to 400-700 words of useful support content: what it does, accepted inputs, outputs, privacy behavior, limitations, and examples.
- Add visible FAQs where the page already has FAQ schema.
- Add internal links from blog posts to matching tools with descriptive anchors.

## On-Page SEO

Score: 56/100

On-page metadata improved substantially: only one duplicate title pair was detected, caused by both `https://toolorbit.site` and `https://toolorbit.site/` being crawled. The old generic `© 2026 ToolOrbit.site` title issue was not present in the refreshed crawl.

Remaining issues:

- 77 pages have no H1.
- 60 titles are longer than 60 characters.
- 50 meta descriptions are longer than 160 characters.
- 6 meta descriptions are under 120 characters.
- 3 titles are under 30 characters.

Examples with long metadata:

- `/tools/dev/json-formatter`: title 69 chars, meta description 242 chars.
- `/tools/ai/text-polisher`: title 81 chars, meta description 211 chars.
- `/tools/ai/translator`: title 78 chars, meta description 171 chars.
- `/tools/dev/uuid-generator`: title 69 chars, meta description 228 chars.
- `/blog/why-text-diff-matters`: title 92 chars.

Recommended title pattern:

`Primary Tool Name | Main Use Case | ToolOrbit`

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

- Global organization and website schema are now present everywhere.
- Tool pages include application schema.
- Blog posts use `BlogPosting`.
- FAQ schema is present on many tool pages.

Recommendations:

- Confirm that every `FAQPage` block matches visible FAQ text on the page.
- Add `dateModified` to blog schema if not already included in rendered JSON-LD.
- Keep `SoftwareApplication` fields consistent: `applicationCategory`, `operatingSystem`, `offers.price: 0`, and canonical `url`.

## Performance

Score: provisional 50/100

PageSpeed Insights returned `429` quota errors for both mobile and desktop, so no Lighthouse or field Core Web Vitals scores were available.

Observed risks:

- The site uses analytics/ads-related third-party scripts, which can affect INP and main-thread time.
- Many pages are tool-heavy and may ship route-specific JavaScript.
- Image/blog routes now include crawlable images, so image sizing and lazy loading should be verified in Lighthouse.

Next measurement:

- Re-run PageSpeed when quota is available.
- Run local Lighthouse for homepage, one category page, one popular tool page, and one blog post.
- Track mobile LCP, INP, CLS, total JS transfer, and third-party script impact.

## Images

Score: 95/100

The refreshed crawl detected 78 images and 0 missing alt attributes. This is a strong baseline.

Recommendations:

- Confirm images include explicit width/height or stable layout sizing to prevent CLS.
- Ensure social preview images exist for priority routes.
- Keep blog images descriptive and relevant to the article topic.

## AI Search Readiness

Score: 78/100

`https://toolorbit.site/llms.txt` now serves the intended text file as `text/plain`, which is a good improvement for AI crawlers and agents. The site also exposes crawlable descriptions, schema, and blog content.

Recommendations:

- Add concise, quotable summaries near the top of every tool page.
- Include verifiable privacy claims such as "runs in your browser" only where technically true.
- Add examples and limitations in plain HTML, not only inside interactive UI state.
- Keep author/date/update signals visible on blog pages.

## Priority Action Plan

High, fix within 1 week:

1. Redirect `www.toolorbit.site` to `toolorbit.site` with a permanent 301.
2. Add unique H1s to every tool and category page.
3. Tighten long titles and meta descriptions on priority pages.
4. Expand thin tool pages with useful crawlable support copy and visible FAQs.
5. Re-run Lighthouse/PageSpeed once quota is available.

Medium, fix within 1 month:

1. Add a tested Content Security Policy.
2. Improve category page copy and headings.
3. Strengthen blog internal links to matching tools.
4. Validate FAQ schema against visible FAQ content.
5. Add route-specific OG images for top landing pages.

Low/backlog:

1. Add hreflang only if multilingual routes become indexable.
2. Build topic clusters around high-intent tool categories.
3. Add comparison/alternatives pages after core on-page cleanup.

## Limitations

- PageSpeed Insights was unavailable due API quota (`429`), so performance scoring is provisional.
- This refresh used live crawlable HTML and HTTP headers. It does not include Google Search Console, GA4, backlink APIs, or real SERP ranking data.
- Visual UX screenshots were not part of this refresh.
