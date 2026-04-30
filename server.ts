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
      const { productInfo, language } = req.body;
      const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
      
      const isChinese = language?.startsWith('zh');
      const targetLanguage = isChinese ? '简体中文' : 'English';
      
      if (!apiKey) {
        throw new Error('DEEPSEEK_API_KEY is not configured');
      }

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const response = await axios.post("https://api.deepseek.com/chat/completions", {
        model: "deepseek-v4-pro",
        messages: [
          {
            role: "system",
            content: `你是一位资深的跨境电商运营专家（精通Etsy、Amazon、eBay）。你的任务是根据用户提供的基础产品信息，创作出具有极高转化率的商品 Listing。请确保内容不仅符合 SEO 逻辑，还要充满诱惑力，触达消费者的情感痛点。重要：请务必使用 ${targetLanguage} 输出内容。`
          },
          {
            role: "user",
            content: `产品信息：${productInfo}\n\n请严格按照以下 4 部分结构返回内容，并使用标准的 Markdown 格式输出：\n\n1. ### 爆款标题 (Title)\n2. ### 核心 SEO 标签 (Tags/Keywords)\n3. ### 走心商品描述 (Description)\n4. ### 核心成交卖点 (Key Selling Points / Bullet Points)`
          }
        ],
        thinking: { type: "enabled" },
        reasoning_effort: "high",
        stream: true
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
      });

      response.data.on('data', (chunk: any) => {
        const lines = chunk.toString().split('\n').filter((line: string) => line.trim() !== '');
        for (const line of lines) {
          const message = line.replace(/^data: /, '');
          if (message === '[DONE]') {
            res.end();
            return;
          }
          try {
            const parsed = JSON.parse(message);
            const content = parsed.choices[0].delta?.content || "";
            if (content) {
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch (e) {
            // Ignore parse errors for partial chunks
          }
        }
      });

      response.data.on('end', () => {
        res.end();
      });

      req.on('close', () => {
        // Optional: close original response if client disconnects
      });

    } catch (err: any) {
      console.error('DeepSeek API Error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.error?.message || err.message;
      // If error happens before streaming starts
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: errorMsg });
      } else {
        res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
        res.end();
      }
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
