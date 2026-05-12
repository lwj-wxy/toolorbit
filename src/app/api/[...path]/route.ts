import axios from 'axios';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const maxDuration = 60;

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || 'missing-key',
  baseURL: 'https://api.deepseek.com',
});

const usageMap: Map<string, number> = (globalThis as any).__toolorbitUsageMap || new Map<string, number>();
(globalThis as any).__toolorbitUsageMap = usageMap;

type ChatMessage = {
  role: 'system' | 'user';
  content: string;
};

function clientIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
}

function rateLimit(ip: string, windowMs = 1000, message = 'Too many requests') {
  if (process.env.NODE_ENV !== 'production') return null;

  const now = Date.now();
  const lastUse = usageMap.get(ip);
  if (lastUse && now - lastUse < windowMs) {
    return Response.json({ success: false, error: message }, { status: 429 });
  }

  usageMap.set(ip, now);
  return null;
}

function markUsage(ip: string) {
  usageMap.set(ip, Date.now());
}

function streamChat(model: string, messages: ChatMessage[], options: Record<string, unknown> = {}) {
  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          const stream = await deepseek.chat.completions.create({
            model,
            messages,
            stream: true,
            ...options,
          });

          for await (const chunk of stream) {
            const chunkText = chunk.choices[0]?.delta?.content || '';
            if (chunkText) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunkText })}\n\n`));
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (error: any) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message || 'Error' })}\n\n`));
        } finally {
          controller.close();
        }
      },
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    },
  );
}

function targetLanguage(language?: string) {
  return language?.startsWith('zh') || language === '中文' ? 'Simplified Chinese' : 'English';
}

async function shorten(body: any) {
  const trimmedUrl = body.url?.trim();
  if (!trimmedUrl) return Response.json({ error: 'URL is required' }, { status: 400 });

  const results: Array<{ provider: string; url: string; note?: string }> = [];

  await Promise.all([
    axios.get(`https://is.gd/create.php?format=json&url=${encodeURIComponent(trimmedUrl)}`, { timeout: 4000 })
      .then((r) => {
        if (r.data.shorturl) results.push({ provider: '路线 A (极简)', url: r.data.shorturl, note: '最简洁，但部分网络环境可能受限' });
      })
      .catch(() => {}),
    axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(trimmedUrl)}`, { timeout: 4000 })
      .then((r) => {
        if (r.data && typeof r.data === 'string') results.push({ provider: '路线 B (稳定)', url: r.data, note: '全球最稳，部分链接需经过确认页' });
      })
      .catch(() => {}),
    axios.post('https://cleanuri.com/api/v1/shorten', new URLSearchParams({ url: trimmedUrl }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 4000,
    })
      .then((r) => {
        if (r.data.result_url) results.push({ provider: '路线 C (备用)', url: r.data.result_url, note: '针对长参数链接优化' });
      })
      .catch(() => {}),
  ]);

  if (results.length > 0) return Response.json({ success: true, links: results });
  return Response.json({ error: '所有线路均无法响应，请检查长链接或稍后再试' }, { status: 500 });
}

function streamConfig(path: string, body: any): { model: string; messages: ChatMessage[]; options?: Record<string, unknown>; rateMs?: number; rateMessage?: string } | null {
  switch (path) {
    case 'listing-craft': {
      const lang = targetLanguage(body.language);
      const prompt = body.isDeepAnalysis
        ? `Please analyze the following text in depth:\n\n${body.details || body.productInfo}`
        : `Product Name: ${body.productInfo}
Key Features: ${body.details || 'Standard features based on name'}
Keywords to Include: ${body.keywords || 'Most relevant SEO terms'}
Tone: ${body.tone || 'Professional and Persuasive'}
Target Audience: ${body.targetAudience || 'General consumers'}

Please generate a comprehensive listing including title, bullet points, SEO description, tags, and conversion tips.`;
      const system = body.isDeepAnalysis
        ? `You are an expert Linguistic Analyst and Sentiment Architect. Analyze tone, sentiment, themes, structure, and improvements. Always output in ${lang} using Markdown.`
        : `You are an elite E-commerce Copywriting Specialist and SEO Expert. Use the required markers [TITLE], [DESCRIPTION], [TAGS], [SOCIAL]. Output in ${lang}.`;

      return { model: body.isDeepAnalysis ? 'deepseek-reasoner' : 'deepseek-chat', messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }], rateMs: 24 * 60 * 60 * 1000 };
    }
    case 'keywords': {
      const lang = body.language?.toLowerCase?.() === '中文' || body.language?.toLowerCase?.().startsWith('zh') ? 'Simplified Chinese' : body.language || 'English';
      return {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: `You are a Keyword Research Expert. Generate keyword analysis in JSON only with summary and categories. Output in ${lang}.` },
          { role: 'user', content: `Product: ${body.productName}` },
        ],
      };
    }
    case 'competitor': {
      const lang = body.language?.toLowerCase?.() === '中文' || body.language?.toLowerCase?.().startsWith('zh') ? 'Simplified Chinese' : body.language || 'English';
      return {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: `You are a Competitor Analysis AI. Produce JSON only with comparison, swot, and strategies. Output language: ${lang}.` },
          { role: 'user', content: `My Product: ${body.productName}\nCompetitor Info: ${body.competitorInfo}` },
        ],
      };
    }
    case 'xiaohongshu':
      return {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: `你是一个深谙小红书爆款逻辑的顶级内容文案写手。生成包含爆款标题、正文结构和话题标签的小红书文案。输出语言：${body.language === '中文' ? 'Simplified Chinese' : body.language || 'Simplified Chinese'}。风格定向：${body.style || '种草测评'}。只输出文案。` },
          { role: 'user', content: `主题: ${body.topic}\n关键词: ${body.keywords}` },
        ],
      };
    case 'market-research':
      return {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: `You are a Market Researcher. Output ONLY JSON with lastUpdate, platform, categories, products, and insights. Current date: ${new Date().toISOString().split('T')[0]}. Use unsplash thumbnails. Output in ${body.language === '中文' ? 'Simplified Chinese' : body.language || 'English'}.` },
          { role: 'user', content: `Platform: ${body.platform}\nTimeframe: ${body.timeframe} days` },
        ],
      };
    case 'ai-polisher':
      return {
        model: 'deepseek-chat',
        rateMs: 2 * 60 * 1000,
        rateMessage: body.language?.startsWith('zh') ? '请求过于频繁，请等待 2 分钟后再试。' : 'Too many requests, please wait 2 minutes.',
        messages: [
          { role: 'system', content: `You are an expert copywriter and text editor. Polish the text in a ${body.tone} tone. Only output the polished text. Output language should match the original text, leaning toward ${targetLanguage(body.language)} if ambiguous.` },
          { role: 'user', content: `Tone: ${body.tone}\n\nText to polish:\n${body.text}` },
        ],
      };
    case 'ai-translator':
      return {
        model: 'deepseek-chat',
        rateMs: 2 * 60 * 1000,
        rateMessage: 'Rate limit exceeded. Please wait 2 minutes.',
        messages: [
          { role: 'system', content: `You are a professional translator. Translate into ${body.targetLang}, adapt tone to ${body.tone}, keep formatting, and only provide translated text.` },
          { role: 'user', content: `Please translate the following text to ${body.targetLang} with a ${body.tone} tone:\n\n${body.text}` },
        ],
      };
    case 'ai-prompt-generator':
      return {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: `You are an expert AI image prompt engineer. Create exactly 4 detailed prompts separated by "==========". Include English prompt and ${targetLanguage(body.language)} translation. Do not add extra text.` },
          { role: 'user', content: `Topic: ${body.topic}\nStyle: ${body.style}` },
        ],
      };
    case 'ai-weekly-report':
      return {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: `You are a professional project manager. Generate a polished weekly report in ${targetLanguage(body.language)}. Tone: ${body.tone}. Output only the report body.` },
          { role: 'user', content: `Done:\n${body.done}\n\nTodo:\n${body.todo}\n\nProblems/Risks:\n${body.problems}` },
        ],
      };
    case 'ai-video-script':
      return {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: `You are a viral short-video director and scriptwriter. Create a script for ${body.platform}, around ${body.duration}, in a ${body.tone} tone. Include hook, scenes, CTA, and BGM suggestions where appropriate. Output in ${targetLanguage(body.language)}.` },
          { role: 'user', content: `Topic/Core Message:\n${body.topic}` },
        ],
      };
    case 'youtube-generator':
      return {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: `You are an expert YouTube SEO specialist. Output sections [TITLE], [DESCRIPTION], [TAGS], [THUMBNAIL_IDEAS]. Audience: ${body.targetAudience || 'General'}. Tone: ${body.tone || 'Engaging'}. Output in ${targetLanguage(body.language)}.` },
          { role: 'user', content: `Video Topic / Details:\n${body.topic}` },
        ],
      };
    case 'ai-meeting-minutes': {
      const formatInstruction = body.formatType === 'action'
        ? 'Focus heavily on Action Items with owners and deadlines.'
        : body.formatType === 'executive'
          ? 'Provide a very concise executive summary, decisions, and outcome.'
          : 'Provide a detailed summary with discussion points, decisions, and action items.';
      return {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: `You are a professional executive assistant. ${formatInstruction} Use Markdown and output only meeting minutes in ${targetLanguage(body.language)}.` },
          { role: 'user', content: `Raw Meeting Notes:\n${body.rawInput}` },
        ],
      };
    }
    case 'ai-excel-formula':
      return {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: `You are an expert spreadsheet analyst. Generate ${body.formulaType === 'google-sheets' ? 'Google Sheets' : 'Microsoft Excel'} formulas, explain briefly, and output in ${targetLanguage(body.language)}.` },
          { role: 'user', content: `Requirement:\n${body.requirement}` },
        ],
      };
    case 'ai-regex':
      return {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: `You are a Senior Regex Architect. Regex flavor: ${(body.flavor || 'javascript').toUpperCase()}. Provide regex, breakdown, 3 matching and 3 non-matching cases. Output in ${targetLanguage(body.language)}.` },
          { role: 'user', content: `Requirement to match:\n${body.requirement}` },
        ],
      };
    case 'ai-code-reviewer':
      return {
        model: 'deepseek-coder',
        messages: [
          { role: 'system', content: `You are a senior software engineer conducting a code review. Analyze bugs, performance, security, and code smells. Tone: ${body.tone}. Output in ${targetLanguage(body.language)}.` },
          { role: 'user', content: `Code:\n\`\`\`${body.codeLang}\n${body.code}\n\`\`\`` },
        ],
      };
    default:
      return null;
  }
}

async function svgGenerator(body: any) {
  const response = await deepseek.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: `You are an expert SVG designer. Generate complete raw SVG code only. Style: ${body.style}. Use viewBox, include xmlns, and do not wrap in markdown.` },
      { role: 'user', content: `Description:\n${body.prompt}` },
    ],
    stream: false,
  });

  return Response.json({ content: response.choices[0]?.message?.content || '' });
}

async function visionDescribe(body: any) {
  const zhipuApiKey = process.env.ZHIPU_API_KEY;
  if (!zhipuApiKey) throw new Error('Zhipu API key is missing.');

  const prompt = body.language?.startsWith('zh')
    ? '请分析这张图片中的核心主体和构图。提取视觉概念并转化为英文生图提示词。只输出英文 Prompt，不要解释。'
    : 'Analyze the core subject and composition of this picture, then output an English image-generation prompt only.';

  const response = await axios.post(
    'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    {
      model: 'glm-4v-flash',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: body.imageBase64 } },
          ],
        },
      ],
    },
    { headers: { Authorization: `Bearer ${zhipuApiKey}` } },
  );

  return Response.json({ description: (response.data.choices[0]?.message?.content || '').trim() });
}

async function imageGenerator(body: any) {
  const zhipuApiKey = process.env.ZHIPU_API_KEY;
  if (!zhipuApiKey) throw new Error('Missing ZHIPU_API_KEY.');

  let size = '1280x1280';
  if (body.ratio === '16:9') size = '1440x960';
  if (body.ratio === '9:16') size = '960x1440';

  let finalPrompt = body.prompt;
  try {
    const system = body.language?.startsWith('zh')
      ? '你是专业 AI 图像提示词生成大师。将用户描述扩写成英文高质量生图 Prompt。只输出英文文本。'
      : 'You are a professional AI image prompt master. Expand the user description into a high-quality English image prompt. Output only the prompt text.';
    const prompt = body.style ? `${finalPrompt}\nRequired Style: ${body.style}` : finalPrompt;
    const optimized = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });
    finalPrompt = optimized.choices[0]?.message?.content?.trim() || finalPrompt;
  } catch {
    if (body.style) finalPrompt = `${body.prompt} (Art Style: ${body.style})`;
  }

  const payload: any = {
    model: 'glm-image',
    prompt: finalPrompt,
    size,
  };

  if (body.imageBase64) {
    payload.image_base64 = body.imageBase64.replace(/^data:image\/(png|jpeg|webp|jpg);base64,/, '');
  }

  const zhipuResponse = await axios.post('https://open.bigmodel.cn/api/paas/v4/images/generations', payload, {
    headers: {
      Authorization: `Bearer ${zhipuApiKey}`,
      'Content-Type': 'application/json',
    },
  });

  const fetchUrl = zhipuResponse.data?.data?.[0]?.url;
  if (!fetchUrl) throw new Error('Failed to generate image from GLM.');

  const imgRes = await axios.get(fetchUrl, { responseType: 'arraybuffer', timeout: 30000 });
  const base64Image = Buffer.from(imgRes.data).toString('base64');
  const contentType = imgRes.headers['content-type'] || 'image/png';

  return Response.json({ imageUrl: `data:${contentType};base64,${base64Image}`, prompt: finalPrompt });
}

export async function POST(request: Request) {
  const path = new URL(request.url).pathname.replace(/^\/api\/?/, '');
  const ip = clientIp(request);
  const body = await request.json().catch(() => ({}));

  try {
    if (path === 'shorten') return await shorten(body);

    const jsonRateLimit = rateLimit(ip);
    if (jsonRateLimit && ['ai-svg-generator', 'ai-vision-describe', 'ai-image-generator'].includes(path)) return jsonRateLimit;

    if (path === 'ai-svg-generator') {
      markUsage(ip);
      return await svgGenerator(body);
    }
    if (path === 'ai-vision-describe') {
      markUsage(ip);
      return await visionDescribe(body);
    }
    if (path === 'ai-image-generator') {
      markUsage(ip);
      return await imageGenerator(body);
    }

    const config = streamConfig(path, body);
    if (!config) return Response.json({ error: 'Not found' }, { status: 404 });

    const limited = rateLimit(ip, config.rateMs || 1000, config.rateMessage || 'Too many requests');
    if (limited) return limited;
    markUsage(ip);

    return streamChat(config.model, config.messages, config.options);
  } catch (error: any) {
    return Response.json({ error: error.response?.data?.error?.message || error.message || 'Error' }, { status: 500 });
  }
}
