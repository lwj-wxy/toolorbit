import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'public', 'featured-tools');
const VIEWPORT = { width: 1280, height: 720 };
const LOAD_TIMEOUT = 18000;
const CONCURRENCY = 4;
const MAX_RETRIES = 2;

// All 113 featured tool URLs → domain-based filename
const SITES = [
  // Developer Tools
  { url: 'https://code.visualstudio.com/', file: 'code.visualstudio.com' },
  { url: 'https://github.com/', file: 'github.com' },
  { url: 'https://www.postman.com/', file: 'postman.com' },
  { url: 'https://vercel.com/', file: 'vercel.com' },
  { url: 'https://www.docker.com/', file: 'docker.com' },
  { url: 'https://codepen.io/', file: 'codepen.io' },
  { url: 'https://stackoverflow.com/', file: 'stackoverflow.com' },
  { url: 'https://railway.app/', file: 'railway.app' },
  { url: 'https://bun.sh/', file: 'bun.sh' },
  { url: 'https://biomejs.dev/', file: 'biomejs.dev' },
  { url: 'https://playwright.dev/', file: 'playwright.dev' },
  { url: 'https://www.prisma.io/', file: 'prisma.io' },
  { url: 'https://turbo.build/', file: 'turbo.build' },
  { url: 'https://storybook.js.org/', file: 'storybook.js.org' },
  { url: 'https://ngrok.com/', file: 'ngrok.com' },
  { url: 'https://www.cloudflare.com/', file: 'cloudflare.com' },
  { url: 'https://transform.tools/', file: 'transform.tools' },
  { url: 'https://bundlephobia.com/', file: 'bundlephobia.com' },
  { url: 'https://caniuse.com/', file: 'caniuse.com' },
  { url: 'https://curlconverter.com/', file: 'curlconverter.com' },
  { url: 'https://jsonplaceholder.typicode.com/', file: 'jsonplaceholder.typicode.com' },
  { url: 'https://orm.drizzle.team/', file: 'orm.drizzle.team' },

  // Design Resources
  { url: 'https://www.figma.com/', file: 'figma.com' },
  { url: 'https://dribbble.com/', file: 'dribbble.com' },
  { url: 'https://coolors.co/', file: 'coolors.co' },
  { url: 'https://unsplash.com/', file: 'unsplash.com' },
  { url: 'https://fonts.google.com/', file: 'fonts.google.com' },
  { url: 'https://excalidraw.com/', file: 'excalidraw.com' },
  { url: 'https://lucide.dev/', file: 'lucide.dev' },
  { url: 'https://www.remove.bg/', file: 'remove.bg' },
  { url: 'https://tinypng.com/', file: 'tinypng.com' },
  { url: 'https://squoosh.app/', file: 'squoosh.app' },
  { url: 'https://colorhunt.co/', file: 'colorhunt.co' },
  { url: 'https://heroicons.com/', file: 'heroicons.com' },
  { url: 'https://app.haikei.app/', file: 'haikei.app' },
  { url: 'https://phosphoricons.com/', file: 'phosphoricons.com' },

  // Productivity
  { url: 'https://www.notion.so/', file: 'notion.so' },
  { url: 'https://obsidian.md/', file: 'obsidian.md' },
  { url: 'https://linear.app/', file: 'linear.app' },
  { url: 'https://www.raycast.com/', file: 'raycast.com' },
  { url: 'https://app.diagrams.net/', file: 'diagrams.net' },
  { url: 'https://www.warp.dev/', file: 'warp.dev' },
  { url: 'https://www.loom.com/', file: 'loom.com' },
  { url: 'https://cleanshot.com/', file: 'cleanshot.com' },
  { url: 'https://slack.com/', file: 'slack.com' },
  { url: 'https://todoist.com/', file: 'todoist.com' },
  { url: 'https://mermaid.js.org/', file: 'mermaid.js.org' },

  // SEO & Marketing
  { url: 'https://search.google.com/search-console', file: 'search.google.com' },
  { url: 'https://ahrefs.com/', file: 'ahrefs.com' },
  { url: 'https://pagespeed.web.dev/', file: 'pagespeed.web.dev' },
  { url: 'https://www.screamingfrog.co.uk/seo-spider/', file: 'screamingfrog.co.uk' },
  { url: 'https://answerthepublic.com/', file: 'answerthepublic.com' },
  { url: 'https://www.semrush.com/', file: 'semrush.com' },
  { url: 'https://trends.google.com/', file: 'trends.google.com' },
  { url: 'https://moz.com/', file: 'moz.com' },
  { url: 'https://surferseo.com/keyword-surfer/', file: 'surferseo.com' },
  { url: 'https://schema.org/', file: 'schema.org' },

  // AI Tools
  { url: 'https://claude.ai/', file: 'claude.ai' },
  { url: 'https://chatgpt.com/', file: 'chatgpt.com' },
  { url: 'https://huggingface.co/', file: 'huggingface.co' },
  { url: 'https://www.perplexity.ai/', file: 'perplexity.ai' },
  { url: 'https://www.midjourney.com/', file: 'midjourney.com' },
  { url: 'https://v0.dev/', file: 'v0.dev' },
  { url: 'https://cursor.com/', file: 'cursor.com' },
  { url: 'https://github.com/features/copilot', file: 'github.copilot' },
  { url: 'https://bolt.new/', file: 'bolt.new' },
  { url: 'https://replit.com/', file: 'replit.com' },
  { url: 'https://elevenlabs.io/', file: 'elevenlabs.io' },
  { url: 'https://suno.com/', file: 'suno.com' },
  { url: 'https://gemini.google.com/', file: 'gemini.google.com' },
  { url: 'https://lovable.dev/', file: 'lovable.dev' },

  // Ecommerce Tools
  { url: 'https://www.shopify.com/', file: 'shopify.com' },
  { url: 'https://stripe.com/', file: 'stripe.com' },
  { url: 'https://toolorbit.site/tools/ecommerce/etsy-fee-calculator', file: 'toolorbit-etsy-fee' },
  { url: 'https://www.printful.com/', file: 'printful.com' },
  { url: 'https://woocommerce.com/', file: 'woocommerce.com' },
  { url: 'https://gumroad.com/', file: 'gumroad.com' },
  { url: 'https://toolorbit.site/tools/ecommerce/stripe-fee-calculator', file: 'toolorbit-stripe-fee' },
  { url: 'https://www.junglescout.com/', file: 'junglescout.com' },
  { url: 'https://www.lemonsqueezy.com/', file: 'lemonsqueezy.com' },

  // Learning Resources
  { url: 'https://developer.mozilla.org/', file: 'developer.mozilla.org' },
  { url: 'https://www.freecodecamp.org/', file: 'freecodecamp.org' },
  { url: 'https://css-tricks.com/', file: 'css-tricks.com' },
  { url: 'https://www.theodinproject.com/', file: 'theodinproject.com' },
  { url: 'https://www.smashingmagazine.com/', file: 'smashingmagazine.com' },
  { url: 'https://roadmap.sh/', file: 'roadmap.sh' },
  { url: 'https://www.frontendmentor.io/', file: 'frontendmentor.io' },
  { url: 'https://leetcode.com/', file: 'leetcode.com' },
  { url: 'https://javascript.info/', file: 'javascript.info' },
  { url: 'https://dev.to/', file: 'dev.to' },
  { url: 'https://news.ycombinator.com/', file: 'news.ycombinator.com' },
  { url: 'https://www.typescriptlang.org/docs/', file: 'typescriptlang.org' },
  { url: 'https://exercism.org/', file: 'exercism.org' },

  // Open Source
  { url: 'https://react.dev/', file: 'react.dev' },
  { url: 'https://nextjs.org/', file: 'nextjs.org' },
  { url: 'https://tailwindcss.com/', file: 'tailwindcss.com' },
  { url: 'https://ui.shadcn.com/', file: 'ui.shadcn.com' },
  { url: 'https://supabase.com/', file: 'supabase.com' },
  { url: 'https://vuejs.org/', file: 'vuejs.org' },
  { url: 'https://trpc.io/', file: 'trpc.io' },
  { url: 'https://astro.build/', file: 'astro.build' },
  { url: 'https://svelte.dev/', file: 'svelte.dev' },
  { url: 'https://tanstack.com/query', file: 'tanstack.com' },
  { url: 'https://zod.dev/', file: 'zod.dev' },
  { url: 'https://zustand-demo.pmnd.rs/', file: 'zustand.pmnd.rs' },
  { url: 'https://remix.run/', file: 'remix.run' },
  { url: 'https://nuxt.com/', file: 'nuxt.com' },
  { url: 'https://nestjs.com/', file: 'nestjs.com' },
  { url: 'https://hono.dev/', file: 'hono.dev' },
  { url: 'https://www.solidjs.com/', file: 'solidjs.com' },
  { url: 'https://vitest.dev/', file: 'vitest.dev' },
  { url: 'https://payloadcms.com/', file: 'payloadcms.com' },
  { url: 'https://tabler.io/icons', file: 'tabler.io' },
];

async function tryDismissPopups(page) {
  const dismissSelectors = [
    'button[aria-label*="accept" i]',
    'button[aria-label*="close" i]',
    'button:has-text("Accept")',
    'button:has-text("Accept all")',
    'button:has-text("Accept All")',
    'button:has-text("同意")',
    'button:has-text("OK")',
    'button:has-text("Got it")',
    'button:has-text("Dismiss")',
    '[data-testid="cookie-banner"] button',
    '#onetrust-accept-btn-handler',
    '.cc-btn.cc-allow',
    '.cookie-consent button',
    '[class*="cookie"] button',
    'button[aria-label="Dismiss"]',
  ];
  for (const sel of dismissSelectors) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 800 }).catch(() => false)) {
        await btn.click({ timeout: 1500 }).catch(() => {});
        await page.waitForTimeout(600);
      }
    } catch {}
  }
}

async function captureSite(browser, { url, file }, index, total) {
  const outPath = `${OUT_DIR}/${file}.png`;
  if (existsSync(outPath)) {
    console.log(`[${index + 1}/${total}] SKIP (exists): ${file}`);
    return { file, status: 'skipped' };
  }

  const context = await browser.newContext({
    viewport: VIEWPORT,
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: LOAD_TIMEOUT });
      await page.waitForTimeout(1500);
      await tryDismissPopups(page);
      await page.waitForTimeout(500);

      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`[${index + 1}/${total}] OK:  ${file}`);
      await context.close();
      return { file, status: 'ok' };
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        console.log(`[${index + 1}/${total}] RETRY ${attempt + 1}: ${file} (${err.message?.slice(0, 60)})`);
        await page.waitForTimeout(2000);
      } else {
        // Last attempt: try with 'load' instead of 'networkidle'
        try {
          await page.goto(url, { waitUntil: 'load', timeout: 12000 });
          await page.waitForTimeout(2000);
          await tryDismissPopups(page);
          await page.screenshot({ path: outPath, fullPage: false });
          console.log(`[${index + 1}/${total}] OK* (load-only): ${file}`);
          await context.close();
          return { file, status: 'ok-fallback' };
        } catch (e2) {
          console.log(`[${index + 1}/${total}] FAIL: ${file} — ${e2.message?.slice(0, 80)}`);
          await context.close();
          return { file, status: 'failed' };
        }
      }
    }
  }
  await context.close();
  return { file, status: 'failed' };
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const total = SITES.length;

  console.log(`Capturing ${total} screenshots → ${OUT_DIR}`);
  console.log(`Concurrency: ${CONCURRENCY}, Timeout: ${LOAD_TIMEOUT}ms\n`);

  const browser = await chromium.launch({ headless: true });

  const results = [];
  for (let i = 0; i < SITES.length; i += CONCURRENCY) {
    const batch = SITES.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map((site, bi) => captureSite(browser, site, i + bi, total)),
    );
    results.push(...batchResults);
  }

  await browser.close();

  const ok = results.filter((r) => r.status === 'ok' || r.status === 'ok-fallback').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;
  const failed = results.filter((r) => r.status === 'failed').length;

  console.log(`\nDone. OK: ${ok}, Skipped: ${skipped}, Failed: ${failed}`);
  if (failed) {
    console.log('Failed:');
    results.filter((r) => r.status === 'failed').forEach((r) => console.log(`  - ${r.file}`));
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
