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

5. Meta description length cleanup
   - Local build verification: 0 generated HTML meta descriptions over 160 characters.
   - Local build verification: 0 generated HTML meta descriptions under 120 characters.
   - Descriptions are now normalized through the shared metadata layer.

6. Thin category page content
   - Added visible bilingual intro copy and common workflow examples to all 10 category pages.
   - Local verification sampled `webmaster-tools`, `text-tools`, `pdf-tools`, and `ai-tools`; each page included the guide block and returned roughly 306-561 extracted words.
   - This is crawlable page content, not hidden SEO text.

7. Thin AI tool page content
   - Added visible bilingual SEO support sections, quick usage guidance, highlights, FAQ content, and disclaimers to the four thin AI utility pages.
   - Local build verification:
     - `/tools/ai/listing-generator`: roughly 777 extracted words.
     - `/tools/ai/keyword-analyzer`: roughly 733 extracted words.
     - `/tools/ai/competitor-tracker`: roughly 704 extracted words.
     - `/tools/ai/market-insights`: roughly 753 extracted words.
   - These pages now also provide richer structured data fields through their completed locale content.

8. Crawl/indexability basics
   - Unknown URLs return 404.
   - `/llms.txt` returns `text/plain`.
   - Canonical tags are present on all crawled pages.
   - Schema is present on all crawled pages.

## High

1. Deploy and re-crawl category content update
   - The live crawl still reflects the pre-fix category content.
   - After deployment, re-run the crawl and confirm category pages are no longer in the thin-content set.

2. Re-run performance validation
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
- Category pages include visible intro/workflow copy in the initial HTML after deployment.
- The four previously thin AI utility pages include visible guide/highlight/FAQ support copy in the initial HTML after deployment.
- Priority page titles are mostly under ~60 characters.
- Priority meta descriptions are mostly 120-155 characters.
- PageSpeed or Lighthouse scores are captured for mobile and desktop.
