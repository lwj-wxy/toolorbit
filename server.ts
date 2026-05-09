import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import OpenAI from "openai";

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

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com"
});


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
      const { productInfo, details, keywords, tone, targetAudience, language } = req.body;
      
      const isChinese = language?.startsWith('zh');
      const targetLanguage = isChinese ? 'Simplified Chinese' : 'English';

      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      // 1-day limit (24 hours) - Relaxed slightly for better UX while testing, but still present
      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 24 * 60 * 60 * 1000)) {
        const timeLeft = Math.ceil((24 * 60 * 60 * 1000 - (now - lastUse)) / (60 * 60 * 1000));
        return res.status(429).json({ 
          success: false, 
          error: isChinese 
            ? `为了平衡服务器负载，每 24 小时限使用一次。请在大约 ${timeLeft} 小时后再试。` 
            : `To balance load, usage is limited to once every 24 hours. Try again in ${timeLeft}h.` 
        });
      }
      
      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Record usage
      usageMap.set(ip as string, now);

      const isDeepAnalysis = req.body.isDeepAnalysis === true;
      const prompt = isDeepAnalysis
        ? `Please analyze the following text in depth:\n\n${details || productInfo}`
        : `
      Product Name: ${productInfo}
      Key Features: ${details || "Standard features based on name"}
      Keywords to Include: ${keywords || "Most relevant SEO terms"}
      Tone: ${tone || "Professional and Persuasive"}
      Target Audience: ${targetAudience || "General consumers"}

      Please generate a comprehensive listing including:
      1. **High-Converting Title** (Optimized for ${targetLanguage} platforms)
      2. **5 Compelling Bullet Points** (Highlighting benefits, formatted with emojis)
      3. **Strategic SEO Description** (Deeply engaging, story-telling approach)
      4. **Suggested Tags/Meta Keywords** (For backend SEO)
      5. **Conversion Optimization Tips** (Brief advice on photos or pricing for this specific item)
      `;

      const systemPrompt = isDeepAnalysis 
        ? `You are an expert Linguistic Analyst and Sentiment Architect. 
           Analyze the provided text for:
           1. Tone & Voice (Professional, Casual, Grumpy, etc.)
           2. Sentiment Score (0-100)
           3. Key Themes & Narrative Structure
           4. Suggestions for Improvement
           Always output in ${targetLanguage} using Markdown.`
        : `You are an elite E-commerce Copywriting Specialist and SEO Expert. 
           Your goal is to create high-converting product listings for platforms like Amazon, Etsy, and eBay.
           
           STRICT OUTPUT STRUCTURE (REQUIRED):
           You must use the following markers and ONLY output relevant content within them. Do not add intro or outro conversational text.
           
           [TITLE]
           (One high-converting, SEO-optimized title)
           
           [DESCRIPTION]
           (Compelling product description with bullet points if applicable)
           
           [TAGS]
           (List of 10-15 keywords separated by commas)
           
           [SOCIAL]
           (Short, catchy social media copy for Instagram/Pinterest)
           
           Guidelines:
           1. Emphasize emotional benefits, not just technical features.
           2. Use strong, persuasive language suitable for the chosen tone.
           3. Include high-traffic keywords naturally.
           4. Always output in ${targetLanguage}.`;

      const stream = await deepseek.chat.completions.create({
        model: isDeepAnalysis ? "deepseek-reasoner" : "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || "";
        if (chunkText) {
          res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
        }
      }
      
      res.write(`data: [DONE]\n\n`);
      res.end();

    } catch (err: any) {
      console.error('AI Error:', err.message);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: "AI service is currently unavailable. Please try again later." });
      } else {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
      }
    }
  });

  app.post("/api/keywords", async (req, res) => {
    try {
      const { productName, language } = req.body;
      const isChinese = language?.toLowerCase() === '中文' || language?.toLowerCase().startsWith('zh');
      const targetLang = isChinese ? 'Simplified Chinese' : language || 'English';

      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 1000)) {
        return res.status(429).json({ success: false, error: 'Rate limit exceeded.' });
      }
      usageMap.set(ip as string, now);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const systemPrompt = `You are a Keyword Research Expert. Generate a comprehensive keyword analysis in JSON format ONLY. 
      Do no include any surrounding text.
      JSON Schema:
      {
        "summary": {
          "total": number,
          "avgCompetition": "string",
          "topRecommendation": "string"
        },
        "categories": [
          {
            "name": "string",
            "keywords": [
              {
                "term": "string",
                "volume": "string",
                "competition": number,
                "score": number,
                "intent": "string",
                "reason": "string"
              }
            ]
          }
        ]
      }
      Must output in ${targetLang}.`;

      const stream = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Product: ${productName}` }
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || "";
        if (chunkText) res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
      }
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (err: any) {
      if (!res.headersSent) res.status(500).json({ error: err.message });
      else { res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`); res.end(); }
    }
  });

  app.post("/api/competitor", async (req, res) => {
    try {
      const { productName, competitorInfo, language } = req.body;
      const isChinese = language?.toLowerCase() === '中文' || language?.toLowerCase().startsWith('zh');
      const targetLang = isChinese ? 'Simplified Chinese' : language || 'English';

      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 1000)) {
        return res.status(429).json({ success: false, error: 'Rate limit exceeded.' });
      }
      usageMap.set(ip as string, now);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const systemPrompt = `You are a Competitor Analysis AI. Produce a JSON format analysis. Do not include markdown wrapper.
      JSON Schema:
      {
        "comparison": {
          "score": { "mine": number, "competitor": number },
          "metrics": [ { "name": "string", "mine": number, "competitor": number, "comment": "string" } ]
        },
        "swot": {
          "strengths": ["string"], "weaknesses": ["string"], "opportunities": ["string"], "threats": ["string"]
        },
        "strategies": [ { "title": "string", "action": "string", "impact": "string" } ]
      }
      Output language: ${targetLang}.`;

      const stream = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `My Product: ${productName}\nCompetitor Info: ${competitorInfo}` }
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || "";
        if (chunkText) res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
      }
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (err: any) {
      if (!res.headersSent) res.status(500).json({ error: err.message });
      else { res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`); res.end(); }
    }
  });

  app.post("/api/market-research", async (req, res) => {
    try {
      const { platform, timeframe, language } = req.body;
      const targetLang = language === '中文' ? 'Simplified Chinese' : language || 'English';

      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 1000)) {
        return res.status(429).json({ success: false, error: 'Rate limit exceeded.' });
      }
      usageMap.set(ip as string, now);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const todayString = new Date().toISOString().split('T')[0];
      const systemPrompt = `You are a Market Researcher. Output ONLY JSON. No surrounding text. The current date is ${todayString}.
      JSON Schema:
      {
        "lastUpdate": "YYYY-MM-DD",
        "platform": "string",
        "categories": [ { "category": "string", "searchVolume": number, "growth": number } ],
        "products": [ { "rank": number, "name": "string", "price": "string", "sales": "string", "hotpoint": "string", "thumbnail": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" } ],
        "insights": [ "string" ]
      }
      Please use unsplash images for thumbnails. Output in ${targetLang}.`;

      const stream = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Platform: ${platform}\nTimeframe: ${timeframe} days` }
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || "";
        if (chunkText) res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
      }
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (err: any) {
      if (!res.headersSent) res.status(500).json({ error: err.message });
      else { res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`); res.end(); }
    }
  });

  app.post("/api/ai-polisher", async (req, res) => {
    try {
      const { text, tone, language } = req.body;
      const isChinese = language?.startsWith('zh');
      
      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 2 * 60 * 1000)) {
        return res.status(429).json({ 
          success: false, 
          error: isChinese ? '请求过于频繁，请等待 2 分钟后再试。' : 'Too many requests, please wait 2 minutes.' 
        });
      }
      
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      usageMap.set(ip as string, now);

      const targetLang = isChinese ? 'Simplified Chinese' : 'English';
      
      const systemPrompt = `You are an expert copywriter and text editor. Your task is to polish and rewrite the provided text according to the requested tone.
      
      Guidelines:
      1. Correct any grammar, spelling, and punctuation errors.
      2. Improve sentence structure and vocabulary for better flow.
      3. Ensure the output strictly follows the requested tone (${tone}).
      4. ONLY output the polished text. Do not add conversational filler, introductions, or explanations.
      5. Output language MUST match the original text's primary language, leaning towards ${targetLang} if ambiguous.`;

      const stream = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Tone: ${tone}\n\nText to polish:\n${text}` }
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || "";
        if (chunkText) {
          res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
        }
      }
      
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error: any) {
      console.error("AI Polisher Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
      } else {
        res.write(`data: {"error": "${error.message || 'Internal Server Error'}"}\n\n`);
        res.end();
      }
    }
  });

  app.post("/api/ai-translator", async (req, res) => {
    try {
      const { text, targetLang, tone } = req.body;
      
      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 2 * 60 * 1000)) {
        return res.status(429).json({ 
          success: false, 
          error: 'Rate limit exceeded. Please wait 2 minutes.' 
        });
      }
      
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      usageMap.set(ip as string, now);

      const systemPrompt = `You are a world-class professional translator and localization expert.
      Your task is to translate the provided text into ${targetLang}.
      
      Guidelines:
      1. Ensure the translation is highly accurate but also reads naturally to native speakers.
      2. Avoid literal word-for-word translation if it sounds awkward. Rephrase to capture the true meaning and idiom of the target language.
      3. Adapt the tone to be ${tone}.
      4. Keep the original formatting (paragraphs, markdown if any).
      5. ONLY provide the translated text. No conversational filler, no explanations.`;

      const stream = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please translate the following text to ${targetLang} with a ${tone} tone:\n\n${text}` }
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || "";
        if (chunkText) {
          res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
        }
      }
      
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error: any) {
      console.error("AI Translator Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
      } else {
        res.write(`data: {"error": "${error.message || 'Internal Server Error'}"}\n\n`);
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
