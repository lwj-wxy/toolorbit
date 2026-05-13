# ToolOrbit.site SEO Action Plan

Updated from a fresh live crawl on 2026-05-13 22:45 Asia/Shanghai.

## Fixed

1. Canonical host
   - `https://www.toolorbit.site/` returns `301` to `https://toolorbit.site/`.
   - `http://toolorbit.site/` returns `301` to `https://toolorbit.site/`.
   - `https://toolorbit.site/` returns `200`.

2. Crawl/indexability basics
   - `robots.txt` returns 200.
   - `sitemap.xml` returns 200 and lists 104 URLs.
   - Unknown URLs return 404.
   - Canonical tags are present on all 105 crawled HTML pages.
   - Schema is present on all 105 crawled HTML pages.
   - `/llms.txt` returns `text/plain`.

3. H1 and title cleanup
   - Missing H1: 0/105.
   - Multiple H1: 0/105.
   - Titles over 60 characters: 0/105.
   - The four AI utility pages no longer use `Parameters` as their H1.

4. Category page content
   - All 10 category pages now include visible explanatory content.
   - Category pages now range from roughly 304 to 561 extracted words.

5. Thin AI ecommerce pages
   - `/tools/ai/listing-generator`: roughly 758 extracted words.
   - `/tools/ai/keyword-analyzer`: roughly 715 extracted words.
   - `/tools/ai/competitor-tracker`: roughly 700 extracted words.
   - `/tools/ai/market-insights`: roughly 743 extracted words.
   - These pages now include visible guide/highlight/FAQ support copy and FAQ schema.

6. Meta description lower bound
   - Meta descriptions under 120 characters: 0/105.

## High

1. Rewrite the 16 overlong meta descriptions
   - Current live crawl: 16/105 meta descriptions over 160 characters.
   - Keep them semantic and readable; do not hard-truncate sentences.
   - Priority URLs:
     - `/tools/image/image-to-base64` - 252 chars
     - `/tools/dev/json-to-ts` - 226 chars
     - `/tools/ai/logo-generator` - 218 chars
     - `/tools/dev/chinese-crypto` - 214 chars
     - `/tools/dev/regex-tester` - 211 chars
     - `/tools/dev/crypto-symmetric` - 205 chars
     - `/tools/dev/morse-code` - 188 chars
     - `/tools/image/svg-to-png` - 184 chars
     - `/tools/dev/hex-string-converter` - 184 chars
     - `/tools/dev/color-picker` - 181 chars
     - `/tools/dev/color-palette` - 179 chars
     - `/tools/dev/password-generator` - 179 chars
     - `/tools/ecommerce/stripe-fee-calculator` - 174 chars
     - `/blog/coffee-caffeine-guide` - 183 chars
     - `/blog/remote-work-ergonomics` - 172 chars
     - `/blog/sugar-content-rankings` - 170 chars

2. Add visible support content to three remaining thin tool pages
   - `/tools/dev/color-picker`: 272 words.
   - `/tools/dev/password-generator`: 275 words.
   - `/tools/dev/hex-string-converter`: 287 words.
   - Add concise usage guidance, input preparation notes, limitations, and FAQs.

3. Re-run performance validation
   - PageSpeed returned `429` quota errors during this refresh.
   - Re-test homepage, one category page, one AI tool page, and one content-heavy tool page.
   - Track mobile LCP, INP, CLS, total JS, and third-party script impact.

## Medium

1. Add Content Security Policy
   - Current headers include HSTS, `nosniff`, `SAMEORIGIN`, referrer policy, and permissions policy.
   - CSP is still missing.
   - Test analytics, AdSense, API calls, images, and model endpoints before enforcing.

2. Improve broad category labels where useful
   - Consider:
     - `Image` -> `Image Tools`
     - `Games` -> `Online Games`
     - `Typography` -> `Text and Typography Tools`
     - `Webmaster` -> `Webmaster Tools`

3. Validate schema during content edits
   - FAQ schema coverage is now 47 pages.
   - Keep FAQPage schema aligned with visible FAQ content.
   - Add or verify blog `dateModified` if articles are updated.

4. Strengthen internal linking
   - Link blog articles to matching tools with descriptive anchor text.
   - Add related-tool links between high-intent utility pages.

## Low

1. Add route-specific social images
   - Prioritize homepage, top tools, category pages, and blog posts.

2. Improve AI citability
   - Add concise definitions and examples near the top of remaining thin or complex tool pages.
   - Keep `/llms.txt` updated as tool inventory changes.

3. Consider multilingual SEO later
   - Current English SEO baseline is valid.
   - Only add `/zh-CN/...` routes and hreflang if Chinese organic traffic becomes a target.

## Verification Checklist

- `curl -I https://www.toolorbit.site/` returns 301 to apex.
- `curl -sL https://toolorbit.site/tools/dev/json-formatter | grep -oi "<h1" | wc -l` returns 1.
- `curl -sL https://toolorbit.site/category/ai-tools | grep -oi "<h1" | wc -l` returns 1.
- `curl -sL https://toolorbit.site/tools/ai/listing-generator | grep -i "Frequently Asked Questions"` returns the FAQ section in English mode.
- Priority page titles remain under ~60 characters.
- Priority meta descriptions are readable and mostly 120-160 characters.
- PageSpeed or Lighthouse scores are captured for mobile and desktop.
