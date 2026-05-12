import express from "express";
import compression from "compression";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

import axios from "axios";

// @ts-ignore
import zhLocale from "./src/locales/zh.json";
// @ts-ignore
import enLocale from "./src/locales/en.json";

function injectSEO(html: string, title: string, description: string, url: string, jsonLd: string = "", isZh: boolean = false, seoLinksHtml: string = ""): string {
  let injected = html;
  
  // Set html lang
  if (isZh) {
    injected = injected.replace(/<html[^>]*>/, '<html lang="zh-CN">');
  } else {
    injected = injected.replace(/<html[^>]*>/, '<html lang="en">');
  }

  if (seoLinksHtml) {
    injected = injected.replace('</body>', `<div id="seo-links-container" style="display:none;" aria-hidden="true">${seoLinksHtml}</div>\n</body>`);
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

  let seoLinksHtml = "";
  try {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      const sitemapData = fs.readFileSync(sitemapPath, 'utf-8');
      const urls = [...sitemapData.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
      seoLinksHtml = `<ul>${urls.map(u => `<li><a href="${u}">${u}</a></li>`).join('')}</ul>`;
    }
  } catch (err) {
    console.warn("Failed to load sitemap for SEO injection.");
  }

  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
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

  app.post("/api/xiaohongshu", async (req, res) => {
    try {
      const { topic, keywords, style, language } = req.body;
      const targetLang = language === '中文' ? 'Simplified Chinese' : language || 'Simplified Chinese';

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

      const systemPrompt = `你是一个深谙小红书爆款逻辑的顶级内容文案写手。
      请根据用户提供的主题、关键词和风格，生成一篇吸睛、高转化的小红书图文笔记文案。
      
      输出要求 (必须严格遵守)：
      1. 【爆款标题】：自带网感，善用数字、情绪词、猎奇感或痛点直击（如：“绝了！”“千万别买…”“熬夜也要整理…”），标题中必须带有 Emoji。
      2. 【正文结构】：
         - 开篇：抓眼球/提出痛点/共鸣代入。
         - 中段：条理清晰的干货/测评/使用体验，多分段，多用 Emoji 作为视觉锚点。
         - 结尾：引导互动（点赞、收藏、留言）。
      3. 【话题标签】：在文章最后列出 5-10 个精准的 #话题。
      4. 输出语言格式：全部采用 ${targetLang} 的口吻，直接输出文案即可，不需要解释说明。
      5. 风格定向：${style || '种草测评'}`;

      const stream = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `主题: ${topic}\n关键词: ${keywords}` }
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

  app.post("/api/ai-prompt-generator", async (req, res) => {
    try {
      const { topic, style, language } = req.body;
      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 1000)) {
        return res.status(429).json({ success: false, error: 'Too many requests' });
      }
      
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      usageMap.set(ip as string, now);

      const isChinese = language?.startsWith('zh');
      const targetLang = isChinese ? 'Simplified Chinese' : 'English';
      
      const systemPrompt = `You are an expert AI image generation prompt engineer (Midjourney, Stable Diffusion, DALL-E).
      Your task is to create 4 distinct, highly detailed prompts based on the user's topic and requested style.
      
      Guidelines:
      1. Structure each prompt clearly. Use comma-separated tags and descriptive phrases.
      2. Include subjects, lighting, environment, camera angles, color palette, and rendering details.
      3. If the style is specific (e.g., Cyberpunk), heavily emphasize keywords associated with that style.
      4. You MUST output EXACTLY 4 prompts. Format EACH prompt exactly like this, separated by "==========":
      
      ### Prompt 1: [Short Title]
      [English Prompt]
      ---
      [${targetLang} Translation]
      ==========
      ### Prompt 2: [Short Title]
      [English Prompt]
      ---
      [${targetLang} Translation]
      
      Do NOT include any other text, introductory or concluding remarks.`;

      const stream = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Topic: ${topic}\nStyle: ${style}` }
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || "";
        if (chunkText) res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
      }
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error: any) {
      if (!res.headersSent) res.status(500).json({ error: error.message || 'Error' });
      else { res.write(`data: {"error": "${error.message || 'Error'}"}\n\n`); res.end(); }
    }
  });

  app.post("/api/ai-weekly-report", async (req, res) => {
    try {
      const { done, todo, problems, tone, language } = req.body;
      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 1000)) {
        return res.status(429).json({ success: false, error: 'Too many requests' });
      }
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      usageMap.set(ip as string, now);

      const targetLang = language?.startsWith('zh') ? 'Simplified Chinese' : 'English';
      
      const systemPrompt = `You are a professional project manager and executive assistant. Your task is to generate a well-structured, professional weekly work report.
      
      Guidelines:
      1. Synthesize the provided raw notes into a cohesive, polished report.
      2. Use clear headings: "Done This Week", "Plans for Next Week", "Issues & Support Needed" (or their equivalents in ${targetLang}).
      3. Adapt the tone to: ${tone}.
      4. Ensure bullet points are concise, professional, and emphasize business value or completion.
      5. Output ONLY the report body in ${targetLang}. No introductory pleasantries.`;

      const userContent = `Done:\n${done}\n\nTodo:\n${todo}\n\nProblems/Risks:\n${problems}`;

      const stream = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || "";
        if (chunkText) res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
      }
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error: any) {
      if (!res.headersSent) res.status(500).json({ error: error.message || 'Error' });
      else { res.write(`data: {"error": "${error.message || 'Error'}"}\n\n`); res.end(); }
    }
  });

  app.post("/api/ai-video-script", async (req, res) => {
    try {
      const { topic, duration, platform, tone, language } = req.body;
      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 1000)) {
        return res.status(429).json({ success: false, error: 'Too many requests' });
      }
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      usageMap.set(ip as string, now);

      const targetLang = language?.startsWith('zh') ? 'Simplified Chinese' : 'English';
      
      const systemPrompt = `You are a viral short-video director and scriptwriter expert. 
      Your task is to create a highly engaging, high-retention video script.
      
      Guidelines:
      1. Tailor the pacing and format for ${platform}.
      2. Keep the estimated duration around ${duration}.
      3. Use a ${tone} tone.
      4. Format the script clearly (e.g., Markdown table or structured sections with Scene, Visual/Action, Dialogue/Text, Duration).
      5. Include a catchy hook in the first 3 seconds, a clear call-to-action (CTA) at the end, and BGM suggestions if appropriate.
      6. Output the entire response in ${targetLang}.`;

      const userContent = `Topic/Core Message:\n${topic}`;

      const stream = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || "";
        if (chunkText) res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
      }
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error: any) {
      if (!res.headersSent) res.status(500).json({ error: error.message || 'Error' });
      else { res.write(`data: {"error": "${error.message || 'Error'}"}\n\n`); res.end(); }
    }
  });

  app.post("/api/youtube-generator", async (req, res) => {
    try {
      const { topic, tone, targetAudience, language } = req.body;
      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 1000)) {
        return res.status(429).json({ success: false, error: 'Too many requests' });
      }
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      usageMap.set(ip as string, now);

      const targetLang = language?.startsWith('zh') ? 'Simplified Chinese' : 'English';
      
      const systemPrompt = `You are an expert YouTube SEO specialist and viral content creator.
      Your task is to generate high-converting YouTube video metadata based on the user's topic.
      
      Output exactly this format, using markdown:

      [TITLE]
      (Provide 5 catchy, high-CTR video title options. Make them irresistible but not clickbait. Consider the target audience: ${targetAudience || 'General'} and tone: ${tone || 'Engaging'})

      [DESCRIPTION]
      (Write a full SEO-optimized video description. Include: A strong hook in the first 2 lines, a summary of the video, timestamps template, and placeholders for social links.)

      [TAGS]
      (Provide 20-30 highly relevant, comma-separated YouTube tags starting from broad to specific long-tail keywords.)

      [THUMBNAIL_IDEAS]
      (Provide 3 creative concepts for the video thumbnail that complement the titles.)

      Output the entire response in ${targetLang}. DO NOT deviate from the section tags [TITLE], [DESCRIPTION], [TAGS], [THUMBNAIL_IDEAS].`;

      const userContent = `Video Topic / Details:\n${topic}`;

      const stream = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || "";
        if (chunkText) res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
      }
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error: any) {
      if (!res.headersSent) res.status(500).json({ error: error.message || 'Error' });
      else { res.write(`data: {"error": "${error.message || 'Error'}"}\n\n`); res.end(); }
    }
  });

  app.post("/api/ai-meeting-minutes", async (req, res) => {
    try {
      const { rawInput, formatType, language } = req.body;
      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 1000)) {
        return res.status(429).json({ success: false, error: 'Too many requests' });
      }
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      usageMap.set(ip as string, now);

      const targetLang = language?.startsWith('zh') ? 'Simplified Chinese' : 'English';
      
      let formatInstruction = "";
      if (formatType === 'action') {
        formatInstruction = "Focus heavily on listing Action Items with assigned people and deadlines. Keep everything else to a bare minimum.";
      } else if (formatType === 'executive') {
        formatInstruction = "Provide a high-level summary of the meeting, the main decisions made, and the overall outcome. Be extremely concise.";
      } else {
        formatInstruction = "Provide a detailed summary including key discussion points, arguments made, decisions, and action items.";
      }

      const systemPrompt = `You are a professional executive assistant and AI secretary.
      Your task is to re-structure messy raw meeting notes or voice transcripts into formal, polished meeting minutes.
      
      Guidelines:
      1. Ignore filler words and off-topic chat.
      2. Extract core topics, decisions, and action items.
      3. ${formatInstruction}
      4. Use professional corporate language. Format using clear Markdown headings and bullet points.
      5. Output ONLY the meeting minutes in ${targetLang}.`;

      const userContent = `Raw Meeting Notes:\n${rawInput}`;

      const stream = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || "";
        if (chunkText) res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
      }
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error: any) {
      if (!res.headersSent) res.status(500).json({ error: error.message || 'Error' });
      else { res.write(`data: {"error": "${error.message || 'Error'}"}\n\n`); res.end(); }
    }
  });

  app.post("/api/ai-excel-formula", async (req, res) => {
    try {
      const { requirement, formulaType, language } = req.body;
      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 1000)) {
        return res.status(429).json({ success: false, error: 'Too many requests' });
      }
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      usageMap.set(ip as string, now);

      const targetLang = language?.startsWith('zh') ? 'Simplified Chinese' : 'English';
      
      const typeStr = formulaType === 'google-sheets' ? 'Google Sheets' : 'Microsoft Excel';

      const systemPrompt = `You are an expert Data Analyst and Spreadsheet Master.
      Your task is to generate complex ${typeStr} formulas based on the user's natural language requirements.
      
      Guidelines:
      1. Provide the exact formula inside a markdown code block (e.g. \`=SUM(A1:A10)\`).
      2. Briefly explain how the formula works step-by-step.
      3. Give examples or conditions where they might need to change cell references.
      4. Output the explanation in ${targetLang}.`;

      const userContent = `Requirement:\n${requirement}`;

      const stream = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || "";
        if (chunkText) res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
      }
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error: any) {
      if (!res.headersSent) res.status(500).json({ error: error.message || 'Error' });
      else { res.write(`data: {"error": "${error.message || 'Error'}"}\n\n`); res.end(); }
    }
  });

  app.post("/api/ai-regex", async (req, res) => {
    try {
      const { requirement, flavor, language } = req.body;
      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 1000)) {
        return res.status(429).json({ success: false, error: 'Too many requests' });
      }
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      usageMap.set(ip as string, now);

      const targetLang = language?.startsWith('zh') ? 'Simplified Chinese' : 'English';
      
      const systemPrompt = `You are a Senior Regex Architect.
      Your task is to write accurate Regular Expressions based on natural language requirements.
      
      Requirements:
      - Regex Flavor/Language: ${flavor.toUpperCase()}
      
      Guidelines:
      1. Provide the regex pattern within a code block (labeled with the correct language or just 'regex').
      2. If it's JS or similar, include the delimiters (e.g. \`/pattern/g\`) if helpful.
      3. Explain the regex breakdown step-by-step.
      4. Provide 3 matching and 3 non-matching test cases to prove it works.
      5. Output all explanations in ${targetLang}.`;

      const userContent = `Requirement to match:\n${requirement}`;

      const stream = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || "";
        if (chunkText) res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
      }
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error: any) {
      if (!res.headersSent) res.status(500).json({ error: error.message || 'Error' });
      else { res.write(`data: {"error": "${error.message || 'Error'}"}\n\n`); res.end(); }
    }
  });

  app.post("/api/ai-svg-generator", async (req, res) => {
    try {
      const { prompt, style, language } = req.body;
      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 1000)) {
        return res.status(429).json({ success: false, error: 'Too many requests' });
      }
      usageMap.set(ip as string, now);

      const targetLang = language?.startsWith('zh') ? 'Simplified Chinese' : 'English';
      
      const systemPrompt = `You are an expert SVG designer and front-end developer.
      Your task is to generate complete, high-quality, valid raw SVG code based on the user's description.
      
      Requirements:
      1. Style: ${style}
      2. Responsive: Use a generic viewBox (e.g., viewBox="0 0 500 500") rather than fixed width/height.
      3. ONLY output the raw <svg>...</svg> code. DO NOT wrap it in \`\`\`svg or markdown blocks. Provide absolutely no explanation.
      4. Ensure the SVG forms a complete, well-designed illustration or icon.
      5. Include necessary namespaces like xmlns="http://www.w3.org/2000/svg".`;

      const userContent = `Description:\n${prompt}`;

      const response = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        stream: false,
      });

      const content = response.choices[0]?.message?.content || "";
      res.json({ content });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error' });
    }
  });

  app.post("/api/ai-vision-describe", async (req, res) => {
    try {
      const { imageBase64, language } = req.body;
      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 1000)) {
        return res.status(429).json({ success: false, error: 'Too many requests' });
      }
      usageMap.set(ip as string, now);

      const zhipuApiKey = process.env.ZHIPU_API_KEY;
      if (!zhipuApiKey) {
        throw new Error('Zhipu API key is missing.');
      }

      const prompt = language?.startsWith('zh') 
        ? "请分析这张图片中的核心主体和构图。提取出它的视觉概念，并将其主体核心轮廓转化为一段基础但具有结构性的SVG代码。最后，请将视觉描述和该SVG代码构造成一段英文提示词（Prompt），要求接下来的AI图像模型严格按照提供的SVG结构和视觉描述来生成一个新的Logo或头像。你只需直接输出这段英文的Prompt，不要输出任何其他的解释说明或回答语气词。" 
        : "Analyze the core subject and composition of this picture. Extract its visual concepts and convert its main contour into an explicit but basic structural SVG code snippet. Finally, output an English prompt intended for an AI image generation model, instructing it to strictly follow the provided SVG structure and visual description to generate a new logo or avatar. Output ONLY the English prompt text, without any additional explanations.";

      const response = await axios.post(
        "https://open.bigmodel.cn/api/paas/v4/chat/completions",
        {
          model: "glm-4v-flash",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: imageBase64 } }
              ]
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${zhipuApiKey}`
          }
        }
      );

      const content = response.data.choices[0]?.message?.content || "";
      res.json({ description: content.trim() });
    } catch (error: any) {
      res.status(500).json({ error: error.response?.data?.error?.message || error.message || 'Error' });
    }
  });

  app.post("/api/ai-image-generator", async (req, res) => {
    try {
      const { prompt, style, ratio, imageBase64, language } = req.body;
      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;

      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 1000)) {
        return res.status(429).json({ success: false, error: 'Too many requests' });
      }
      usageMap.set(ip as string, now);

      const zhipuApiKey = process.env.ZHIPU_API_KEY;
      if (!zhipuApiKey) {
        throw new Error("Missing ZHIPU_API_KEY.");
      }

      let sizeStr = "1280x1280";
      if (ratio === "16:9") sizeStr = "1440x960"; // Supported by glm-image
      if (ratio === "9:16") sizeStr = "960x1440";

      // Optimize prompt using DeepSeek LLM
      let finalPrompt = prompt;
      try {
        const sysMsg = language?.startsWith('zh') 
          ? "你是一个专业的AI图像提示词生成大师。你的任务是将用户的描述扩写并优化成适合通过AI图像生成模型（如CogView）生成高质量Logo或头像的英文提示词（Prompt）。提示词应该包含主体详细描述、构图、光影、材质、艺术风格和背景等。注意：如果用户输入中包含了SVG代码片段，你必须原封不动地保留所有SVG代码在你的输出末尾，它是指导生图模型构成形状的关键。不要输出任何解释说明，直接输出纯英文文本。"
          : "You are a professional AI image prompt master. Your task is to expand and optimize the user's description into a high-quality English prompt suitable for AI image generation models (like CogView) to generate logos or avatars. Include detailed subject description, composition, lighting, material, art style, background, etc. VERY IMPORTANT: If the user input contains any SVG code snippet, you MUST preserve the entire SVG code exactly as is at the end of your output, as it guides the model's structural generation. Output ONLY the English prompt text + SVG, no explanations.";
        
        let userReq = finalPrompt;
        if (style) {
          userReq += `\nRequired Style: ${style}`;
        }
        
        const llmRes = await deepseek.chat.completions.create({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: sysMsg },
            { role: "user", content: userReq }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        });
        
        const optPrompt = llmRes.choices[0]?.message?.content?.trim();
        if (optPrompt) {
          finalPrompt = optPrompt;
        }
      } catch (err: any) {
        console.warn('Failed to optimize prompt with LLM, using original prompt instead:', err.message);
        if (style) {
          finalPrompt = `${prompt} (艺术风格要求/Art Style: ${style})`;
        }
      }

      const payload: any = {
        model: "glm-image",
        prompt: finalPrompt,
        size: sizeStr,
      };

      if (imageBase64) {
        // Strip out the data URL prefix if it exists to properly send base64
        const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|webp|jpg);base64,/, '');
        payload.image_base64 = base64Data;
      }

      const zhipuResponse = await axios.post(
        "https://open.bigmodel.cn/api/paas/v4/images/generations",
        payload,
        {
          headers: {
            'Authorization': `Bearer ${zhipuApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const fetchUrl = zhipuResponse.data?.data?.[0]?.url;
      if (!fetchUrl) {
        throw new Error("Failed to generate image from GLM.");
      }

      // Fetch the actual image into a buffer to bypass CORS issues on the frontend
      const imgRes = await axios.get(fetchUrl, { responseType: 'arraybuffer', timeout: 30000 });
      const base64Image = Buffer.from(imgRes.data, 'binary').toString('base64');
      const contentType = imgRes.headers['content-type'] || 'image/png';
      const imageUrl = `data:${contentType};base64,${base64Image}`;

      res.json({ imageUrl, prompt: finalPrompt });
    } catch (error: any) {
      res.status(500).json({ error: error.response?.data?.error?.message || error.message || 'Error' });
    }
  });

  app.post("/api/ai-code-reviewer", async (req, res) => {
    try {
      const { code, codeLang, tone, language } = req.body;
      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const now = Date.now();
      const lastUse = usageMap.get(ip as string);

      if (process.env.NODE_ENV === "production" && lastUse && (now - lastUse < 1000)) {
        return res.status(429).json({ success: false, error: 'Too many requests' });
      }
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      usageMap.set(ip as string, now);

      const targetLang = language?.startsWith('zh') ? 'Simplified Chinese' : 'English';
      
      const systemPrompt = `You are a senior software engineer conducting a code review.
      
      Guidelines:
      1. Analyze the provided ${codeLang} code for bugs, performance issues, security vulnerabilities, and code smells.
      2. Provide constructive feedback with a ${tone} tone.
      3. Format the review clearly with Markdown (e.g., Summary, Issues found, Suggestions, and Refactored Code with explanations).
      4. Provide output in ${targetLang}.`;

      const stream = await deepseek.chat.completions.create({
        model: "deepseek-coder",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Code:\n\`\`\`${codeLang}\n${code}\n\`\`\`` }
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || "";
        if (chunkText) res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
      }
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error: any) {
      if (!res.headersSent) res.status(500).json({ error: error.message || 'Error' });
      else { res.write(`data: {"error": "${error.message || 'Error'}"}\n\n`); res.end(); }
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
    app.use(express.static(distPath, { 
      index: false,
      setHeaders: (res, path) => {
        if (path.includes('/assets/')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    }));
    
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

      html = injectSEO(html, title, desc, url, jsonLd, isZh, seoLinksHtml);
      res.send(html);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
