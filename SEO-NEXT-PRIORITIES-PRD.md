# ToolOrbit SEO Next Priorities PRD

Date: 2026-05-15
Owner: ToolOrbit
Scope: Remaining SEO items after P0-P4 optimization rounds

## 1. Why This PRD Exists

The previous SEO audit produced a long list of tasks. Many of them are valid, but they are not equally useful right now.

The immediate goal is not to "do SEO things". The goal is to remove obvious trust and crawlability defects, then build a content architecture that can compound.

Think of this as two systems:

1. Reliability fixes: small bugs that make the site look unfinished or harder to crawl.
2. Content flywheel: hub pages, deeper articles, comparison pages, and off-site mentions that give Google and AI search systems more evidence.

Do not mix these up. The first group should be finished quickly. The second group is the long game.

## 2. Current Completed Baseline

Already completed or mostly completed:

- Privacy and Terms pages are noindexed and excluded from sitemap.
- Blog pagination now uses real paginated routes.
- AI crawler directives were added to robots.txt.
- Blog/category/home/static pages now have richer JSON-LD.
- Blog posts now link to related tools.
- Homepage category links were improved.
- Brand trust signals were added to About, homepage, footer, schema, `llms.txt`, and `humans.txt`.
- ISR/static generation and cache headers were added for main content routes.

Remaining work below assumes that baseline.

## 3. Success Metrics

P0 success:

- No missing favicon assets.
- No obvious internal 404 for `/tools` or `/zh-CN/tools`.
- Security headers include a working CSP.
- AI crawler policy and LLM discovery files are explicit and machine-readable.

P1 success:

- Core SEO content has hub structure.
- Top blog posts are citation-ready and substantially deeper.
- Author/editorial identity is clearer.
- JavaScript payload is measured and reduced, or at least the largest causes are identified.

P2 success:

- Better social previews and image SEO.
- More commercial investigation pages.
- Better repeat visits and content syndication.
- More off-site brand signals.

## 4. P0: Finish The Obvious Defects

P0 is the "do not ship with this missing" layer.

### P0-1. Generate Full Favicon Suite

Problem:

- `public/icon.svg` exists.
- `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, and `apple-touch-icon.png` are missing.

Why it matters:

- This is a basic browser trust signal.
- Missing favicon assets make the site feel unfinished in tabs, bookmarks, and mobile homescreen contexts.

Scope:

- Generate:
  - `public/favicon.ico`
  - `public/favicon-16x16.png`
  - `public/favicon-32x32.png`
  - `public/apple-touch-icon.png`
- Update `src/app/layout.tsx` icon metadata to reference all generated assets.

Acceptance criteria:

- `curl -I https://toolorbit.site/favicon.ico` returns `200`.
- Browser tab icon renders.
- `manifest.json` still references a valid icon.

### P0-2. Add Content-Security-Policy Header

Problem:

- Security headers exist, but CSP is missing.

Why it matters:

- CSP is a concrete trust/security signal.
- It reduces XSS blast radius.

Scope:

- Add a conservative CSP in `next.config.ts`.
- Account for current needs:
  - Next.js scripts
  - inline styles/scripts required by the app
  - Google Analytics
  - Google AdSense
  - external images from Unsplash/picsum until image migration is done

Suggested initial policy:

```txt
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com;
style-src 'self' 'unsafe-inline';
img-src 'self' https: data: blob:;
font-src 'self' data:;
connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com;
frame-src https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com;
object-src 'none';
base-uri 'self';
frame-ancestors 'self';
```

Acceptance criteria:

- Production build passes.
- Key pages render without CSP console errors.
- Ads/analytics scripts are not accidentally broken.

### P0-3. Implement `/tools` And `/zh-CN/tools` All Tools Pages

Problem:

- Audit reported `/tools` and `/zh-CN/tools` returning 404.
- Even if current navigation does not point there, this is an obvious crawler/user trap.

Why it matters:

- It creates a strong all-tools hub.
- It gives crawlers a clean route to discover every utility.
- It can absorb generic "online tools" intent.

Scope:

- Add `/tools` route.
- Ensure `/zh-CN/tools` works through the zh-CN catch-all route or a dedicated localized route.
- Page should include:
  - H1
  - short brand/value paragraph
  - all 10 categories
  - links to every tool
  - visible category anchors
  - `CollectionPage`, `ItemList`, and `BreadcrumbList` schema

Acceptance criteria:

- `/tools` returns 200.
- `/zh-CN/tools` returns 200.
- Every tool page is reachable from `/tools`.
- Page is included in sitemap.

### P0-4. Finish AI Crawler And LLM Discovery Files

Problem:

- `robots.txt` has main AI crawler directives, but is missing some training crawlers mentioned in the audit.
- `llms.txt` exists, but `llms-full.txt` does not.

Scope:

- Add to `robots.txt`:
  - `anthropic-ai`
  - `cohere-ai`
- Create `/llms-full.txt` route or static file.
- Keep `llms.txt` concise.
- Put expanded category/tool descriptions in `llms-full.txt`.

Acceptance criteria:

- `/llms.txt` returns 200.
- `/llms-full.txt` returns 200.
- `robots.txt` includes search crawler allow rules and training crawler block rules.

## 5. P1: Build The SEO Compounder

P1 is where the site starts earning topical authority. This is the layer that compounds.

### P1-1. Create Four Pillar Pages

Problem:

- Tools and blog posts exist, but there are no strong hub pages.

Why it matters:

- Google understands hub-and-spoke structures.
- AI search systems prefer clear, citable topical pages.
- Internal link equity gets a better shape.

Pages:

1. `/developer-tools`
   - Target: free online developer tools
   - Length: 3000-4000 words
2. `/ai-tools`
   - Target: free AI content creation tools
   - Length: 2500-3500 words
3. `/pdf-image-tools`
   - Target: free online PDF and image tools
   - Length: 2500-3000 words
4. `/webmaster-toolkit`
   - Target: free webmaster tools online
   - Length: 2000-2500 words

Each page must include:

- Intro that explains who the page is for.
- Category-level comparison table.
- Links to relevant tools.
- Links to relevant blog posts.
- FAQ section for user intent, not for rich-result gaming.
- `CollectionPage`, `ItemList`, and `BreadcrumbList` schema.

Acceptance criteria:

- Each pillar has at least 15 internal links.
- Related tools/blog posts link back to the pillar.
- Pages are in sitemap.

### P1-2. Expand 3-5 High-Potential Blog Posts

Problem:

- Blog posts are useful but short.
- Many are not citation-ready.

Priority posts:

1. `why-use-json-formatter`
2. `base64-encoding-deep-dive`
3. `image-compression-techniques`
4. `modern-pdf-workflow-efficiency`
5. `ai-code-reviewer-guide`

Scope per post:

- Expand to 1200+ words.
- Add TL;DR near top.
- Add question-shaped H2s.
- Add 2-3 authoritative external citations.
- Add concrete examples.
- Add stronger links to relevant tools and pillar pages.
- Add "last reviewed" or "maintained by ToolOrbit Editorial Team".

Acceptance criteria:

- 3 posts completed before moving to optional posts.
- Each expanded post has at least 3 internal links and 2 external citations.
- BlogPosting schema remains valid.

### P1-3. Add Author Bio System

Problem:

- Current byline says ToolOrbit Editorial Team, which is good enough for now.
- Audit asked for stronger author identity: bio, author page, and ideally image.

Scope:

- Add author data model:
  - name
  - role
  - short bio
  - url
  - optional avatar
- Add `/authors/toolorbit-editorial-team`.
- Add author card to blog posts.
- Update BlogPosting schema author to point to author page.

Acceptance criteria:

- Blog posts show author card.
- Author page returns 200.
- BlogPosting author URL points to the author page.

### P1-4. Measure And Reduce JavaScript Payload

Problem:

- Audit reported around 1.3 MB gzipped JS.
- This is likely the largest remaining Core Web Vitals risk.

Scope:

- Run bundle analysis.
- Identify top 10 largest dependencies/routes.
- Lazy-load heavy tool components.
- Keep AI/PDF/image-heavy code out of global routes.
- Move heavy client-only libraries behind dynamic imports.

Acceptance criteria:

- A bundle report exists.
- Top 5 largest causes are documented.
- At least 2 high-impact lazy-loading/code-splitting changes are shipped.
- `npm run build` passes.

### P1-5. Create First Comparison Pages

Problem:

- The site has little commercial investigation content.

First pages:

1. `/best-json-formatters`
2. `/best-free-pdf-tools`
3. `/best-ai-tools-for-content-creators`

Scope:

- Honest comparison pages.
- ToolOrbit can be included, but should not pretend competitors do not exist.
- Include use cases, criteria, pros/cons, and links to ToolOrbit tools.

Acceptance criteria:

- At least 3 comparison pages.
- Each page has 1500+ words.
- Each page links to at least 5 internal pages.

## 6. P2: Polish, Distribution, And Long Tail

P2 is valuable, but should not block P0/P1.

### P2-1. Per-Page OG Images

Scope:

- Tool pages get branded OG image with tool name/category.
- Blog pages use hero image with title overlay.
- Pillar pages get dedicated OG style.

Acceptance criteria:

- `/og-image?type=tool&title=...` works.
- Blog/social previews no longer all look identical.

### P2-2. Tool Page Screenshots

Scope:

- Create standardized screenshots for top tools or categories.
- Prefer WebP.
- Add descriptive alt text.
- Use in tool pages and OG generation.

Acceptance criteria:

- At least 10 screenshots exist.
- Top 10 tools have screenshots or category-level visuals.

### P2-3. Image Pipeline Cleanup

Scope:

- Replace `picsum.photos` placeholders.
- Self-host blog images.
- Add explicit width/height where applicable.
- Serve WebP/AVIF with fallback where practical.

Acceptance criteria:

- No `picsum.photos` remains in `src/constants/blogData.ts`.
- Blog card/post images have stable dimensions.

### P2-4. RSS Feed

Scope:

- Add `/feed.xml`.
- Include latest blog posts.
- Link it in metadata where appropriate.

Acceptance criteria:

- `/feed.xml` returns valid RSS.
- Latest posts appear with title, URL, date, and summary.

### P2-5. FAQ Schema Gap Review

Scope:

- Find tool pages with visible FAQ content but no FAQPage JSON-LD.
- Add missing FAQ schema only where the FAQ content is actually visible.

Acceptance criteria:

- FAQ schema count matches visible FAQ availability.
- No hidden FAQ schema is added.

### P2-6. UI Semantics And Mobile Polish

Scope:

- Replace excessive homepage card headings with non-heading elements where appropriate.
- Check mobile touch targets.
- Verify H1 consistency across locales and viewports.
- Add visible breadcrumbs where useful.

Acceptance criteria:

- Homepage heading hierarchy is cleaner.
- Key mobile controls are at least 44-48px tappable.
- Breadcrumb UI exists for category/blog/tool routes or is intentionally deferred.

### P2-7. PWA / Service Worker

Scope:

- Consider Workbox or another minimal service worker setup.
- Precache stable static assets.
- Add offline fallback for basic browsing.

Acceptance criteria:

- Repeat visits are faster.
- No stale-content bug for frequently updated pages.

### P2-8. Off-Site Brand Signals

Scope:

- Create real profiles only if they will be maintained:
  - GitHub organization
  - X/Twitter
  - Product Hunt
  - YouTube demos
- Add real URLs to Organization `sameAs`.
- Submit to relevant directories.

Acceptance criteria:

- No placeholder social links.
- `sameAs` only contains live profiles.
- At least 3 off-site listings exist.

## 7. Explicit Non-Goals

Do not do these now:

- Do not add fake social profiles.
- Do not add FAQPage schema for invisible FAQ content.
- Do not create thin pillar pages just to check a box.
- Do not over-tighten CSP until pages are browser-tested.
- Do not start 20 comparison pages before the first 3 are validated.

## 8. Recommended Execution Order

1. P0-1 favicon suite
2. P0-2 CSP header
3. P0-3 `/tools` all-tools page
4. P0-4 `llms-full.txt` and robots completion
5. P1-1 first pillar page: Developer Tools Hub
6. P1-2 expand JSON Formatter blog post
7. P1-4 bundle measurement
8. P1-3 author bio system
9. P1-5 first comparison page
10. P2 items as capacity allows

## 9. Definition Of Done

Every completed task must include:

- Code change or content artifact.
- `npm run build` passes.
- A manual route check for any new page.
- Updated sitemap if a new indexable route was added.
- No placeholder claims, fake social links, or hidden schema.

SEO is mostly boring reliability work plus a content flywheel. Do the boring reliability work first. Then compound.
