import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

import axios from "axios";

// @ts-ignore
import zhLocale from "./src/locales/zh.json";
// @ts-ignore
import enLocale from "./src/locales/en.json";

function injectSEO(html: string, title: string, description: string, url: string, jsonLd: string = "", isZh: boolean = false): string {
  let injected = html;
  
  // Set html lang
  if (isZh) {
    injected = injected.replace(/<html[^>]*>/, '<html lang="zh-CN">');
  } else {
    injected = injected.replace(/<html[^>]*>/, '<html lang="en">');
  }

  if (title) {
    injected = injected.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    injected = injected.replace(/<meta property="og:title" content=".*?"\s*\/?>/, '');
    injected = injected.replace(/<meta name="twitter:title" content=".*?"\s*\/?>/, '');
    injected = injected.replace('</head>', `<meta property="og:title" content="${title}">\n<meta name="twitter:title" content="${title}">\n</head>`);
  }
  
  if (description) {
    injected = injected.replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${description}">`);
    injected = injected.replace(/<meta property="og:description" content=".*?"\s*\/?>/, '');
    injected = injected.replace(/<meta name="twitter:description" content=".*?"\s*\/?>/, '');
    injected = injected.replace('</head>', `<meta property="og:description" content="${description}">\n<meta name="twitter:description" content="${description}">\n</head>`);
  }

  if (url) {
    injected = injected.replace('</head>', `<link rel="canonical" href="${url}">\n<meta property="og:url" content="${url}">\n</head>`);
  }

  if (jsonLd) {
    injected = injected.replace('</head>', `${jsonLd}\n</head>`);
  }

  return injected;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.set('trust proxy', 1);

  const usageMap = new Map<string, number>();

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

      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      // 1-day limit (24 hours)
      if (lastUse && (now - lastUse < 24 * 60 * 60 * 1000)) {
        const timeLeft = Math.ceil((24 * 60 * 60 * 1000 - (now - lastUse)) / (60 * 60 * 1000));
        return res.status(429).json({ 
          success: false, 
          error: isChinese 
            ? `为了节省 API 配额，每位用户 24 小时内仅限使用一次。请在大约 ${timeLeft} 小时后再试。` 
            : `To conserve API quota, usage is limited to once every 24 hours. Please try again in about ${timeLeft} hours.` 
        });
      }
      
      if (!apiKey) {
        throw new Error('DEEPSEEK_API_KEY is not configured');
      }

      // Record usage
      usageMap.set(ip as string, now);

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
    const indexPath = path.join(distPath, 'index.html');
    
    // Serve static assets but not index.html directly
    app.use(express.static(distPath, { index: false }));
    
    app.get('*', (req, res) => {
      // 1. Determine base HTML
      let html = "";
      try {
        html = fs.readFileSync(indexPath, "utf-8");
      } catch (e) {
        return res.status(404).send("Not found");
      }

      // 2. Determine App Locale
      const acceptLang = req.headers['accept-language'] || '';
      const isZh = acceptLang.toLowerCase().startsWith('zh');
      const locale = isZh ? zhLocale : enLocale;
      const url = `https://toolorbit.site${req.path}`;
      let title = locale.common?.footerText?.split(' - ')[0] || "ToolOrbit";
      let desc = locale.common?.footer_desc || "Modern toolset for developers.";
      let jsonLd = "";

      if (req.path === "/") {
        title = locale.search?.results ? `ToolOrbit | ${desc}` : "ToolOrbit";
        jsonLd = `
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ToolOrbit",
            "url": "https://toolorbit.site",
            "description": "${desc}"
          }
          </script>
        `;
      } else if (req.path.startsWith('/tools/')) {
        const parts = req.path.split('/');
        if (parts.length >= 4) {
          const toolId = parts[3];
          if (locale.tools?.[toolId]) {
             title = locale.tools[toolId].seoTitle || locale.tools[toolId].name || title;
             desc = locale.tools[toolId].seoDesc || locale.tools[toolId].description || desc;
             const toolName = title;
             title = `${title} | ToolOrbit`;
             
             jsonLd = `
              <script type="application/ld+json">
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                  "@type": "ListItem",
                  "position": 1,
                  "name": "${isZh ? "首页" : "Home"}",
                  "item": "https://toolorbit.site"
                },{
                  "@type": "ListItem",
                  "position": 2,
                  "name": "${toolName}",
                  "item": "${url}"
                }]
              }
              </script>
              <script type="application/ld+json">
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "${toolName}",
                "operatingSystem": "Web",
                "applicationCategory": "UtilitiesApplication",
                "description": "${desc}"
              }
              </script>
             `;
          }
        }
      } else if (req.path.startsWith('/blog/')) {
        const parts = req.path.split('/');
        if (parts.length >= 3) {
          const slug = parts[2];
          if (locale.blog?.posts?.[slug]) {
             title = locale.blog.posts[slug].title || title;
             desc = locale.blog.posts[slug].summary || desc;
             const articleName = title;
             title = `${title} | ToolOrbit Blog`;
             
             jsonLd = `
              <script type="application/ld+json">
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                  "@type": "ListItem",
                  "position": 1,
                  "name": "${isZh ? "首页" : "Home"}",
                  "item": "https://toolorbit.site"
                },{
                  "@type": "ListItem",
                  "position": 2,
                  "name": "${isZh ? "博客" : "Blog"}",
                  "item": "https://toolorbit.site/blog"
                },{
                  "@type": "ListItem",
                  "position": 3,
                  "name": "${articleName}",
                  "item": "${url}"
                }]
              }
              </script>
              <script type="application/ld+json">
              {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": "${articleName}",
                "description": "${desc}"
              }
              </script>
             `;
          }
        }
      }

      html = injectSEO(html, title, desc, url, jsonLd, isZh);
      res.send(html);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
