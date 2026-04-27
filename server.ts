import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";

import axios from "axios";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 短链接中转接口 - 多线路并行抓取，彻底解决供应商不稳定或网络拦截问题
  app.post("/api/shorten", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const results: Array<{ provider: string, url: string, note?: string }> = [];
    const trimmedUrl = url.trim();

    // 并行请求多个供应商
    const fetchers = [
      // 线路 1: is.gd (极简，但部分地区需翻墙)
      axios.get(`https://is.gd/create.php?format=json&url=${encodeURIComponent(trimmedUrl)}`, { timeout: 4000 })
        .then(r => { if (r.data.shorturl) results.push({ provider: '路线 A (极简)', url: r.data.shorturl, note: '最简洁，但部分网络环境可能受限' }); })
        .catch(() => {}),

      // 线路 2: TinyURL (最悠久稳定，但偶尔有预览页)
      axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(trimmedUrl)}`, { timeout: 4000 })
        .then(r => { if (r.data && typeof r.data === 'string') results.push({ provider: '路线 B (稳定)', url: r.data, note: '全球最稳，部分链接需经过确认页' }); })
        .catch(() => {}),

      // 线路 3: GoTiny (现代极简，由于 POST 限制，我们尝试请求它的备用接口或备选 CleanURI)
      axios.post('https://cleanuri.com/api/v1/shorten', new URLSearchParams({ url: trimmedUrl }).toString(), { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 4000 
      })
      .then(r => { if (r.data.result_url) results.push({ provider: '路线 C (备用)', url: r.data.result_url, note: '针对长参数链接优化' }); })
      .catch(() => {})
    ];

    await Promise.all(fetchers);

    if (results.length > 0) {
      res.json({ success: true, links: results });
    } else {
      res.status(500).json({ error: '所有线路均无法响应，请检查长链接或稍后再试' });
    }
  });

  // API router
  app.post("/api/listing-craft", async (req, res) => {
    try {
      const { productInfo } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `作为一位资深的跨境电商运营（如Etsy、Amazon），请根据以下产品信息，生成一个高转化率的商品Listing。\n产品信息：${productInfo}\n\n请严格返回以下4部分结构，并使用Markdown格式：\n1. 吸引人的标题（Title）\n2. 高频搜索关键词（Tags/Keywords）\n3. 详细且带有感情色彩的商品描述（Description）\n4. 五大卖点（Bullet Points，清晰分点）`,
      });
      res.json({ success: true, text: response.text });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express v4, we use * 
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
