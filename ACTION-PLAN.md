# ToolOrbit.site SEO Action Plan

Updated from a fresh live crawl on 2026-05-13 18:04 Asia/Shanghai.

## Fixed

1. Canonical host
   - `https://www.toolorbit.site/` now returns `301` to `https://toolorbit.site/`.
   - `https://toolorbit.site/` returns `200`.

2. Server-rendered H1 coverage
   - Current refreshed crawl: 0/105 pages missing H1.
   - Current refreshed crawl: 0/105 pages with multiple H1s.
   - Tool and category pages now expose H1 in the initial HTML.

3. Title length cleanup
   - Local build verification: 0 generated HTML titles over 60 characters.
   - The metadata layer now prefers compact SEO titles before the global `| ToolOrbit` template is applied.

4. Generic AI tool H1 labels
   - Local build verification: 0 `Parameters` H1s.
   - Updated H1s:
     - `/tools/ai/listing-generator` -> `Listing Generator`
     - `/tools/ai/keyword-analyzer` -> `Keyword Analyzer`
     - `/tools/ai/competitor-tracker` -> `Competitor Tracker`
     - `/tools/ai/market-insights` -> `Market Insights`

5. Crawl/indexability basics
   - Unknown URLs return 404.
   - `/llms.txt` returns `text/plain`.
   - Canonical tags are present on all crawled pages.
   - Schema is present on all crawled pages.

## High

1. Tighten meta descriptions
   - Current refreshed crawl: 50 over 160 chars, 6 under 120 chars.
   - Keep descriptions specific, benefit-led, and accurate about local/browser/AI processing.
   - Target roughly 120-155 characters for important pages.

2. Expand thin category pages
   - Current refreshed crawl: 14 pages under 300 words.
   - Most thin pages are category pages.
   - Add short intros, use cases, and links to recommended tools.

3. Re-run performance validation
   - PageSpeed returned `429` quota errors during the refresh.
   - Re-test homepage, a category page, a tool page, and a blog post.
   - Track mobile LCP, INP, CLS, total JS, and third-party script impact.

## Medium

1. Improve broad category labels
   - Consider more descriptive H1s:
     - `Image` -> `Image Tools`
     - `Games` -> `Online Games`
     - `Typography` -> `Text and Typography Tools`
     - `Webmaster` -> `Webmaster Tools`

2. Add Content Security Policy
   - Current headers include HSTS, `nosniff`, `SAMEORIGIN`, referrer policy, and permissions policy.
   - Add CSP after testing analytics/AdSense/tool functionality.

3. Validate schema
   - Confirm each `FAQPage` schema matches visible FAQ content.
   - Keep `SoftwareApplication` fields consistent across tool pages.
   - Add or verify blog `dateModified`.

4. Strengthen internal linking
   - Link each blog article to related tools.
   - Add contextual links between related tool pages.
   - Use descriptive anchor text.

## Low

1. Add route-specific social images
   - Prioritize homepage, top tools, category pages, and blog posts.

2. Improve AI citability
   - Add concise definitions and examples near the top of category/tool pages.
   - Keep `/llms.txt` updated as the tool inventory changes.

3. Consider multilingual SEO later
   - Current English SEO baseline is valid.
   - Only add `/zh-CN/...` routes and hreflang if Chinese organic traffic becomes a target.

## Verification Checklist

- `curl -I https://www.toolorbit.site/` returns 301 to apex.
- `curl -sL https://toolorbit.site/tools/dev/json-formatter | grep -oi "<h1" | wc -l` returns 1.
- `curl -sL https://toolorbit.site/category/ai-tools | grep -oi "<h1" | wc -l` returns 1.
- Priority page titles are mostly under ~60 characters.
- Priority meta descriptions are mostly 120-155 characters.
- PageSpeed or Lighthouse scores are captured for mobile and desktop.
