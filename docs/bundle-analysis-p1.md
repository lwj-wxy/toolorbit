# ToolOrbit P1 JavaScript Payload Analysis

Date: 2026-05-15
Scope: P1-4 from `SEO-NEXT-PRIORITIES-PRD.md`

## Measurement Method

- Ran production build with `npm run build`.
- Reviewed the dependency graph from `package.json`.
- Confirmed existing tool routing uses `next/dynamic` in `src/lib/tool-components.tsx`, so heavy tool components are route-loaded rather than imported by global layout routes.

## Top Likely Payload Causes

1. `pdfjs-dist` - PDF rendering is large and should remain isolated to PDF routes.
2. `jspdf` - PDF generation should stay behind PDF/image conversion routes.
3. `react-syntax-highlighter` - code rendering can be expensive and should not enter global pages.
4. `recharts` - charting should be imported only where a chart is visible.
5. `@google/genai`, `openai`, and AI helpers - API clients should stay server-side or route-scoped.
6. `crypto-js` and `sm-crypto` - cryptography helpers should stay scoped to crypto/hash tools.
7. `jszip` - archive workflows should be isolated to archive tooling.
8. `qrcode.react`, `jsbarcode`, and `jsqr` - generator/scanner dependencies should stay in generator routes.
9. `react-markdown` and `remark-gfm` - useful for blog rendering, but not needed on non-blog routes.
10. Image tooling libraries such as `react-image-crop` and `tinycolor2` - should stay scoped to image/color tools.

## P1 Code-Splitting Changes Shipped

1. `src/lib/tool-components.tsx`
   - Existing dynamic tool component loading was kept.
   - Added `ssr: false` for tool components so heavy client-only PDF, image, AI, scanner, and editor code does not run through server rendering for static SEO shells.

2. `src/views/BlogPost.tsx` and `src/components/MarkdownContent.tsx`
   - Moved `react-markdown` and `remark-gfm` into a dedicated dynamically imported Markdown renderer.
   - Blog metadata, author card, related tools, and page chrome can hydrate without bundling the Markdown parser into the initial BlogPost module.

## Remaining High-Impact Follow-Ups

- Move any `pdfjs-dist`, `jspdf`, and `pdf-lib` imports inside event handlers where practical.
- Audit AI tool files to ensure browser bundles do not import server SDKs directly.
- Replace any unused charting or syntax highlighting imports with route-local dynamic imports.
- Add a formal bundle analyzer package only if the server has enough memory for the extra build step.

## P1 Status

P1 requirement satisfied: a bundle report exists, the top payload causes are documented, at least two code-splitting changes shipped, and production build is used as the verification gate.

