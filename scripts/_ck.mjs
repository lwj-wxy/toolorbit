import { chromium } from 'playwright';
const b = await chromium.launch();
const grab = async (scheme, mode) => {
  const ctx = await b.newContext({ viewport:{width:1320,height:820}, colorScheme:scheme });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8081/zh-CN', { waitUntil:'networkidle', timeout:60000 });
  await p.waitForTimeout(1100);
  if (mode === 'manage') { try { await p.getByText('管理', { exact:true }).click({ timeout:4000 }); await p.waitForTimeout(450);} catch {} }
  const h = await p.evaluate(() => Math.ceil(document.querySelector('section[aria-label]')?.getBoundingClientRect().height || 0));
  await p.screenshot({ path:`scripts/_ck_${scheme}_${mode}.jpg`, type:'jpeg', quality:82, clip:{ x:0, y:Math.max(0,820-(h+20)), width:1320, height:h+20 } });
  await ctx.close();
};
await grab('light','default');
await grab('light','manage');
await grab('dark','manage');
await b.close();
console.log('OK');
