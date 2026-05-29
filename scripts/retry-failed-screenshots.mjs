import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'public', 'featured-tools');
const VIEWPORT = { width: 1280, height: 720 };

const SITES = [
  { url: 'https://www.docker.com/', file: 'docker.com' },
  { url: 'https://unsplash.com/', file: 'unsplash.com' },
  { url: 'https://trends.google.com/', file: 'trends.google.com' },
  { url: 'https://gumroad.com/', file: 'gumroad.com' },
  { url: 'https://news.ycombinator.com/', file: 'news.ycombinator.com' },
];

async function tryDismissPopups(page) {
  const selectors = [
    'button:has-text("Accept")',
    'button:has-text("Accept all")',
    'button:has-text("Accept All")',
    'button:has-text("同意")',
    'button:has-text("OK")',
    'button:has-text("Got it")',
    'button:has-text("Dismiss")',
    '#onetrust-accept-btn-handler',
    '.cc-btn.cc-allow',
  ];
  for (const sel of selectors) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 800 }).catch(() => false)) {
        await btn.click({ timeout: 1500 }).catch(() => {});
        await page.waitForTimeout(600);
      }
    } catch {}
  }
}

async function captureSite(browser, { url, file }) {
  const outPath = `${OUT_DIR}/${file}.png`;
  if (existsSync(outPath)) {
    console.log(`  SKIP (exists): ${file}`);
    return { file, status: 'skipped' };
  }

  const context = await browser.newContext({
    viewport: VIEWPORT,
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  // Try networkidle first, then load, then domcontentloaded
  const strategies = ['networkidle', 'load', 'domcontentloaded'];
  for (const strategy of strategies) {
    try {
      console.log(`  Trying ${file} with "${strategy}"...`);
      await page.goto(url, { waitUntil: strategy, timeout: 25000 });
      await page.waitForTimeout(2000);
      await tryDismissPopups(page);
      await page.waitForTimeout(500);
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`  OK:  ${file} (${strategy})`);
      await context.close();
      return { file, status: 'ok' };
    } catch (err) {
      const msg = err.message?.slice(0, 60);
      console.log(`  ${strategy} failed: ${msg}`);
    }
  }

  console.log(`  FAIL: ${file}`);
  await context.close();
  return { file, status: 'failed' };
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Retrying ${SITES.length} failed sites...\n`);

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const site of SITES) {
    results.push(await captureSite(browser, site));
  }

  await browser.close();

  const ok = results.filter((r) => r.status === 'ok').length;
  const failed = results.filter((r) => r.status === 'failed').length;
  console.log(`\nDone. OK: ${ok}, Failed: ${failed}`);
  if (failed) {
    console.log('Still failed:');
    results.filter((r) => r.status === 'failed').forEach((r) => console.log(`  - ${r.file}`));
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
