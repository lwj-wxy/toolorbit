import axios from 'axios';
import OpenAI from 'openai';
import { getNavigationMenuData } from '../../../lib/navigation-menu';
import { buildAiRuntimeStreamConfig } from '../../../lib/ai-runtime';

export const runtime = 'nodejs';
export const maxDuration = 60;

const DEEPSEEK_TEXT_MODEL = 'deepseek-v4-pro';
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';
const ZHIPU_IMAGE_MODEL = process.env.ZHIPU_IMAGE_MODEL || 'glm-image';
const ZHIPU_IMAGE_FALLBACK_MODEL = process.env.ZHIPU_IMAGE_FALLBACK_MODEL || 'cogview-3-flash';
const ZHIPU_IMAGE_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4/images/generations';
const ZHIPU_VISION_MODEL = process.env.ZHIPU_VISION_MODEL || 'glm-4v-flash';
const IMAGE_GENERATION_TIMEOUT_MS = 45_000;
const TRACE_MOE_API_URL = 'https://api.trace.moe/search';
const TRACE_MOE_TIMEOUT_MS = 20_000;
const TRACE_MOE_MAX_FILE_SIZE = 8 * 1024 * 1024;
const TRACE_MOE_SUPPORTED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);

type AiToolCategory = 'copy' | 'document' | 'code' | 'image' | 'vision';

const AI_TOOL_CATEGORIES: Record<string, AiToolCategory> = {
  'listing-craft': 'copy',
  'market-research': 'document',
  'worldcup-match-predictor': 'document',
  'ai-polisher': 'copy',
  'ai-translator': 'copy',
  'ai-prompt-generator': 'copy',
  'ai-video-script': 'copy',
  'youtube-generator': 'copy',
  'ai-resume-optimizer': 'document',
  'ai-hs-code-assistant': 'document',
  'ai-excel-formula': 'document',
  'ai-regex': 'code',
  'ai-image-generator': 'image',
  'ai-product-image-generator': 'image',
  'ai-svg-generator': 'image',
  'ai-vision-describe': 'vision',
  'ai-product-asset-checker': 'vision',
};

const TEXT_AI_CATEGORIES = new Set<AiToolCategory>(['copy', 'document', 'code']);

function getAiToolCategory(path: string) {
  return AI_TOOL_CATEGORIES[path] || null;
}

const usageMap: Map<string, number> = (globalThis as any).__toolorbitUsageMap || new Map<string, number>();
(globalThis as any).__toolorbitUsageMap = usageMap;

export async function GET(request: Request) {
  const path = new URL(request.url).pathname.replace(/^\/api\/?/, '');

  if (path === 'navigation-menu') {
    return Response.json(getNavigationMenuData(), {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  return Response.json({ error: 'Not found' }, { status: 404 });
}

type ChatMessage = {
  role: 'system' | 'user';
  content: string;
};

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getDeepseekClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey || apiKey === 'missing-key') {
    throw new Error('DEEPSEEK_API_KEY is not configured on the server.');
  }

  return new OpenAI({
    apiKey,
    baseURL: DEEPSEEK_BASE_URL,
  });
}

function getZhipuApiKey() {
  const apiKey = process.env.ZHIPU_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('ZHIPU_API_KEY is not configured on the server.');
  }
  return apiKey;
}

function buildImagePrompt(body: any, mode: 'image' | 'svg' = 'image') {
  const prompt = String(body.prompt || '').trim();
  const style = String(body.style || '').trim();
  const base = style ? `${prompt}\nRequired style: ${style}` : prompt;

  if (mode === 'svg') {
    return [
      'Create a clean vector-style illustration suitable for SVG export.',
      'Use a centered, recognizable subject with clear silhouette, simple background, crisp edges, and minimal text.',
      'Avoid abstract placeholder symbols unless explicitly requested.',
      base,
    ].join('\n');
  }

  return base;
}

function productImageSize(ratio: string) {
  if (ratio === '16:9') return '1440x960';
  if (ratio === '9:16') return '960x1440';
  if (ratio === '4:5') return '1024x1280';
  return '1280x1280';
}

function buildProductImagePrompt(body: any, variantIndex: number) {
  const productName = String(body.productName || '').trim();
  const productDescription = String(body.productDescription || '').trim();
  const sellingPoint = String(body.sellingPoint || '').trim();
  const targetPlatform = String(body.targetPlatform || '').trim();
  const targetMarket = String(body.targetMarket || '').trim();
  const imageUse = String(body.imageUse || '').trim();
  const style = String(body.style || '').trim();
  const scene = String(body.scene || '').trim();
  const background = String(body.background || '').trim();

  return [
    'Create a commercial product image for a cross-border ecommerce listing from the text brief only.',
    'Build the product from the product name, description, selling point, platform use, style, scene, and background.',
    'Make the product visually plausible and concrete. Do not treat the product name as text to render in the image.',
    'Do not render visible headlines, Chinese characters, labels, price tags, discount badges, fake logos, watermarks, or UI text unless packaging text is explicitly requested.',
    'The product must be the clear focal point and should look ready for marketplace listing or overseas ads.',
    `Product name: ${productName}`,
    `Product description: ${productDescription}`,
    `Key selling point: ${sellingPoint}`,
    `Target platform: ${targetPlatform}`,
    `Target market: ${targetMarket}`,
    `Image use: ${imageUse}`,
    `Visual style: ${style}`,
    `Scene direction: ${scene}`,
    `Background: ${background}`,
    `Variant: ${variantIndex + 1}. Change camera angle, composition, props, or lighting slightly while keeping the same real product.`,
  ].join('\n');
}

function imageUrlToSvg(imageUrl: string, prompt: string) {
  const title = escapeSvgText(prompt || 'Generated SVG graphic');
  const href = escapeSvgText(imageUrl);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" role="img" aria-labelledby="title">
  <title id="title">${title}</title>
  <rect width="1024" height="1024" rx="64" fill="#f8fafc"/>
  <image href="${href}" x="0" y="0" width="1024" height="1024" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
}

async function requestZhipuImage(prompt: string, size: string, imageBase64?: string, options?: { disableWatermark?: boolean }) {
  const zhipuApiKey = getZhipuApiKey();

  const createPayload = (model: string) => {
    const payload: any = { model, prompt, size };

    if (imageBase64) {
      payload.image_base64 = imageBase64.replace(/^data:image\/(png|jpeg|webp|jpg);base64,/, '');
    }

    if (options?.disableWatermark) {
      payload.watermark = false;
    }

    return payload;
  };

  const requestImage = (model: string) =>
    axios.post(ZHIPU_IMAGE_BASE_URL, createPayload(model), {
      headers: {
        Authorization: `Bearer ${zhipuApiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: IMAGE_GENERATION_TIMEOUT_MS,
    });

  let usedModel = ZHIPU_IMAGE_MODEL;
  let zhipuResponse;

  try {
    zhipuResponse = await requestImage(ZHIPU_IMAGE_MODEL);
  } catch (primaryError) {
    if (ZHIPU_IMAGE_FALLBACK_MODEL === ZHIPU_IMAGE_MODEL) {
      throw primaryError;
    }
    usedModel = ZHIPU_IMAGE_FALLBACK_MODEL;
    zhipuResponse = await requestImage(ZHIPU_IMAGE_FALLBACK_MODEL);
  }

  const imageUrl = zhipuResponse.data?.data?.[0]?.url;
  if (!imageUrl) throw new Error(`Failed to generate image from ${usedModel}.`);

  return {
    imageUrl,
    model: usedModel,
    fallbackUsed: usedModel !== ZHIPU_IMAGE_MODEL,
  };
}

function clientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  const cfIp = request.headers.get('cf-connecting-ip')?.trim();
  const trueClientIp = request.headers.get('true-client-ip')?.trim();

  return forwardedFor || realIp || cfIp || trueClientIp || 'anonymous';
}

function rateLimit(ip: string, windowMs = 1000, message = 'Too many requests') {
  if (process.env.NODE_ENV !== 'production') return null;

  const now = Date.now();
  const lastUse = usageMap.get(ip);
  if (lastUse && now - lastUse < windowMs) {
    const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (now - lastUse)) / 1000));
    return Response.json(
      { success: false, error: message, retryAfter: retryAfterSeconds },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
    );
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
          const deepseek = getDeepseekClient();
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
  const normalizedLanguage = language?.toLowerCase();
  return normalizedLanguage?.startsWith('zh') ||
    normalizedLanguage === '中文' ||
    normalizedLanguage === 'chinese' ||
    normalizedLanguage === 'simplified chinese'
    ? 'Simplified Chinese'
    : 'English';
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
  const category = getAiToolCategory(path);
  if (category && !TEXT_AI_CATEGORIES.has(category)) return null;

  switch (path) {
    case 'competitor': {
      const lang = body.language?.toLowerCase?.() === '中文' || body.language?.toLowerCase?.().startsWith('zh') ? 'Simplified Chinese' : body.language || 'English';
      return {
        model: DEEPSEEK_TEXT_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a Competitor Analysis AI. Produce JSON only. Output language: ${lang}. Use exactly this shape: {"comparison":{"score":{"mine":number,"competitor":number},"metrics":[{"name":string,"mine":string,"competitor":string,"comment":string}]},"swot":{"strengths":string[],"weaknesses":string[],"opportunities":string[],"threats":string[]},"strategies":string[]}. The comparison.score values must be 0-100 numbers. Include 4-6 comparison.metrics items.`,
          },
          { role: 'user', content: `My Product: ${body.productName}\nCompetitor Info: ${body.competitorInfo}` },
        ],
      };
    }
    case 'xiaohongshu':
      return {
        model: DEEPSEEK_TEXT_MODEL,
        messages: [
          { role: 'system', content: `你是一个深谙小红书爆款逻辑的顶级内容文案写手。生成包含爆款标题、正文结构和话题标签的小红书文案。输出语言：${body.language === '中文' ? 'Simplified Chinese' : body.language || 'Simplified Chinese'}。风格定向：${body.style || '种草测评'}。只输出文案。` },
          { role: 'user', content: `主题: ${body.topic}\n关键词: ${body.keywords}` },
        ],
      };
    case 'market-research':
      return {
        model: DEEPSEEK_TEXT_MODEL,
        messages: [
          { role: 'system', content: `You are a Market Researcher. Output ONLY JSON with lastUpdate, platform, categories, products, and insights. Current date: ${new Date().toISOString().split('T')[0]}. Use unsplash thumbnails. Output in ${body.language === '中文' ? 'Simplified Chinese' : body.language || 'English'}.` },
          { role: 'user', content: `Platform: ${body.platform}\nTimeframe: ${body.timeframe} days` },
        ],
      };
    case 'ai-polisher':
      return {
        model: DEEPSEEK_TEXT_MODEL,
        rateMs: 2 * 60 * 1000,
        rateMessage: body.language?.startsWith('zh') ? '请求过于频繁，请等待 2 分钟后再试。' : 'Too many requests, please wait 2 minutes.',
        messages: [
          { role: 'system', content: `You are an expert copywriter and text editor. Polish the text in a ${body.tone} tone. Only output the polished text. Output language should match the original text, leaning toward ${targetLanguage(body.language)} if ambiguous.` },
          { role: 'user', content: `Tone: ${body.tone}\n\nText to polish:\n${body.text}` },
        ],
      };
    case 'ai-translator':
      return {
        model: DEEPSEEK_TEXT_MODEL,
        rateMs: 2 * 60 * 1000,
        rateMessage: 'Rate limit exceeded. Please wait 2 minutes.',
        messages: [
          { role: 'system', content: `You are a professional translator. Translate into ${body.targetLang}, adapt tone to ${body.tone}, keep formatting, and only provide translated text.` },
          { role: 'user', content: `Please translate the following text to ${body.targetLang} with a ${body.tone} tone:\n\n${body.text}` },
        ],
      };
    case 'ai-prompt-generator':
      return {
        model: DEEPSEEK_TEXT_MODEL,
        messages: [
          { role: 'system', content: `You are an expert AI image prompt engineer. Create exactly 4 detailed prompts separated by "==========". Include English prompt and ${targetLanguage(body.language)} translation. Do not add extra text.` },
          { role: 'user', content: `Topic: ${body.topic}\nStyle: ${body.style}` },
        ],
      };
    case 'ai-video-script':
      return {
        model: DEEPSEEK_TEXT_MODEL,
        messages: [
          { role: 'system', content: `You are a viral short-video director and scriptwriter. Create a script for ${body.platform}, around ${body.duration}, in a ${body.tone} tone. Include hook, scenes, CTA, and BGM suggestions where appropriate. Output in ${targetLanguage(body.language)}.` },
          { role: 'user', content: `Topic/Core Message:\n${body.topic}` },
        ],
      };
    case 'ai-resume-optimizer': {
      const outputLanguage = body.targetLanguage === 'zh' ? 'Simplified Chinese' : 'English';
      const templateInstructions: Record<string, string> = {
        classic: 'Use a clean single-column resume structure with clear section headings.',
        compact: 'Use a concise one-page-style resume structure with shorter bullets and dense spacing.',
        modern: 'Use a polished modern resume structure with a strong summary, skills grouped by theme, and crisp section headings.',
      };
      const templateInstruction = templateInstructions[String(body.templateStyle || 'classic')] || templateInstructions.classic;

      return {
        model: DEEPSEEK_TEXT_MODEL,
        messages: [
          {
            role: 'system',
            content: [
              'You are a careful resume writer. Your analysis is internal. The user must only see the finished resume.',
              `Output language: ${outputLanguage}.`,
              `Role type: ${body.roleType || 'general'}.`,
              templateInstruction,
              'Return only a polished resume body in Markdown. Do not output analysis, advice, match score, keyword gaps, cover letter, checklist, or explanations.',
              'Use one H1 for the candidate name if present. Put contact details in one short line only if they appear in the input. Then use second-level headings for resume sections.',
              'Recommended sections: Professional Summary, Skills, Work Experience, Project Experience, Education, Certifications. Omit sections that have no source information.',
              'Do not add horizontal rules or divider lines between sections.',
              'For work, internship, and project entries, write the first line as "Organization or project | Role or responsibility | Date range", then place achievements in bullets below it.',
              'For education entries, keep school, major, degree, dates, and coursework in regular prose. Do not force education into the work-entry line pattern.',
              'Tailor wording to the target job description when provided, but keep the resume factual and ready to copy into Word, Notion, or a document editor.',
              'Do not invent companies, degrees, certifications, metrics, dates, titles, tools, or project results.',
              'If a useful metric is missing, improve the wording without fake numbers. Do not leave bracketed placeholders unless they already exist in the input.',
              'Use tight resume bullets with action verbs, scope, tools, and outcomes when the source text supports them.',
            ].join('\n'),
          },
          {
            role: 'user',
            content: [
              `Resume text:\n${body.resumeText || ''}`,
              `\nTarget job description:\n${body.jobDescription || ''}`,
            ].join('\n'),
          },
        ],
      };
    }
    case 'ai-hs-code-assistant': {
      const outputLanguage = body.outputLanguage === 'Simplified Chinese' || body.interfaceLanguage?.startsWith?.('zh')
        ? 'Simplified Chinese'
        : 'English';
      const officialLookupLabel = body.officialLookup?.label || 'official tariff lookup';
      const officialLookupUrl = body.officialLookup?.url || 'https://www.wcoomd.org/en/topics/nomenclature/overview/what-is-the-harmonized-system.aspx';

      return {
        model: DEEPSEEK_TEXT_MODEL,
        messages: [
          {
            role: 'system',
            content: [
              'You are a customs documentation assistant for cross-border sellers.',
              'You help prepare an AI-assisted product classification brief. You do not provide a final customs ruling.',
              `Output language: ${outputLanguage}.`,
              outputLanguage === 'Simplified Chinese'
                ? 'For Simplified Chinese output: customsName and invoiceDescription must be clean English customs wording only; classificationBrief, whyItMayFit, whyItMayNotFit, questionsToConfirm, brokerQuestions, missingInformation, and disclaimer must be Simplified Chinese. Do not mix Chinese and English inside one sentence unless it is a product term, HS heading, agency name, or official database name.'
                : 'For English output: write all text fields in English.',
              'Return JSON only. Do not wrap the JSON in Markdown fences. Do not add any preface.',
              'Never claim that a code is final, guaranteed, official, legally binding, or safe to use without verification.',
              'Give 1 to 2 HS candidate directions by default. Use a third candidate only when the product facts clearly support another realistic direction.',
              'Use code patterns such as "3924.xx" or "4202.xx" when exact target-market digits are uncertain.',
              'Keep each candidate explanation concise: one sentence for whyItMayFit, one sentence for whyItMayNotFit, and no more than 3 questionsToConfirm.',
              'Keep brokerQuestions and missingInformation practical. Each list should usually contain 3 to 5 items.',
              'If the input lacks key facts, lower confidence and list missingInformation instead of forcing a confident answer.',
              'For each candidate, explain why it may fit, why it may not fit, and questions to confirm.',
              'Consider material, intended use, product form, function, set composition, food contact, batteries, electronics, children use, medical use, animal or plant materials, and destination market.',
              'Do not calculate duties, VAT, import taxes, anti-dumping duties, or license requirements.',
              'Use this exact JSON shape:',
              '{"customsName":string,"invoiceDescription":string,"classificationBrief":string,"summary":{"material":string,"use":string,"market":string},"candidates":[{"codePattern":string,"confidence":"High"|"Medium"|"Low","whyItMayFit":string,"whyItMayNotFit":string,"questionsToConfirm":string[]}],"brokerQuestions":string[],"missingInformation":string[],"riskLevel":"Low"|"Medium"|"High","officialLookup":{"label":string,"url":string},"disclaimer":string}',
            ].join('\n'),
          },
          {
            role: 'user',
            content: [
              `Product name: ${body.productName || ''}`,
              `Main material: ${body.material || ''}`,
              `Product use: ${body.productUse || ''}`,
              `Destination market: ${body.targetMarket || ''}`,
              `Battery: ${body.battery || ''}`,
              `Electronics: ${body.electronics || ''}`,
              `Sold as set: ${body.setSold || ''}`,
              `Package contents: ${body.packageContents || ''}`,
              `Product form: ${body.productForm || ''}`,
              `User group: ${body.userGroup || ''}`,
              `Brand or model: ${body.brandModel || ''}`,
              `Unit weight: ${body.unitWeight || ''}`,
              `Risk flags: ${Array.isArray(body.riskFlags) ? body.riskFlags.join(', ') : ''}`,
              `Official lookup label: ${officialLookupLabel}`,
              `Official lookup URL: ${officialLookupUrl}`,
            ].join('\n'),
          },
        ],
      };
    }
    case 'ai-excel-formula':
      return {
        model: DEEPSEEK_TEXT_MODEL,
        messages: [
          { role: 'system', content: `You are an expert spreadsheet analyst. Generate ${body.formulaType === 'google-sheets' ? 'Google Sheets' : 'Microsoft Excel'} formulas, explain briefly, and output in ${targetLanguage(body.language)}.` },
          { role: 'user', content: `Requirement:\n${body.requirement}` },
        ],
      };
    case 'ai-regex':
      return {
        model: DEEPSEEK_TEXT_MODEL,
        messages: [
          { role: 'system', content: `You are a Senior Regex Architect. Regex flavor: ${(body.flavor || 'javascript').toUpperCase()}. Provide regex, breakdown, 3 matching and 3 non-matching cases. Output in ${targetLanguage(body.language)}.` },
          { role: 'user', content: `Requirement to match:\n${body.requirement}` },
        ],
      };
    default:
      return null;
  }
}

async function svgGenerator(body: any) {
  const startedAt = Date.now();
  const prompt = buildImagePrompt(body, 'svg');
  const imageResult = await requestZhipuImage(prompt, '1280x1280', body.imageBase64);
  const response = imageUrlToSvg(imageResult.imageUrl, body.prompt || 'Generated SVG graphic');

  return Response.json(
    {
      content: response,
      imageUrl: imageResult.imageUrl,
      elapsedMs: Date.now() - startedAt,
      model: imageResult.model,
      fallbackUsed: imageResult.fallbackUsed,
      category: getAiToolCategory('ai-svg-generator'),
      provider: 'zhipu-image',
    },
    {
      headers: {
        'Server-Timing': `svg;dur=${Date.now() - startedAt}`,
      },
    },
  );
}

function streamBufferedChat(
  model: string,
  messages: ChatMessage[],
  options: Record<string, unknown> = {},
  validateOutput?: (content: string) => string,
) {
  const encoder = new TextEncoder();
  const upstreamRequest = {
    model,
    messages,
    ...options,
    stream: false as const,
  };

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          if (process.env.NODE_ENV !== 'production') {
            controller.enqueue(
              encoder.encode(`event: ai-runtime-debug\ndata: ${JSON.stringify({ upstreamRequest })}\n\n`),
            );
          }

          const deepseek = getDeepseekClient();
          const completion = await deepseek.chat.completions.create(upstreamRequest);

          const rawContent = completion.choices[0]?.message?.content || '';
          const content = validateOutput ? validateOutput(rawContent) : rawContent;
          if (content) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
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

async function visionDescribe(body: any) {
  const zhipuApiKey = getZhipuApiKey();

  const prompt = body.language?.startsWith('zh')
    ? '请分析这张图片中的核心主体和构图。提取视觉概念并转化为英文生图提示词。只输出英文 Prompt，不要解释。'
    : 'Analyze the core subject and composition of this picture, then output an English image-generation prompt only.';

  const response = await axios.post(
    'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    {
      model: ZHIPU_VISION_MODEL,
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

function parseJsonObject(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI response was not valid JSON.');
    return JSON.parse(jsonMatch[0]);
  }
}

function hasEnglishNarrative(value: unknown): boolean {
  if (typeof value === 'string') {
    const checkedText = value
      .replace(/\b(Google Shopping|Amazon|TikTok Shop|Shopify|Meta Ads|IPTC|HS|Low|Medium|High|pass|warning|fail)\b/gi, '')
      .replace(/\S+\.(jpg|jpeg|png|webp)\b/gi, '')
      .trim();
    const latinWords = checkedText.match(/[A-Za-z]{3,}/g)?.length || 0;
    const chineseChars = checkedText.match(/[\u4e00-\u9fff]/g)?.length || 0;

    return checkedText.length >= 12 && latinWords >= 2 && chineseChars === 0;
  }

  if (Array.isArray(value)) return value.some((item) => hasEnglishNarrative(item));

  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some((item) => hasEnglishNarrative(item));
  }

  return false;
}

async function localizeProductAssetResult(result: any, zhipuApiKey: string) {
  const response = await axios.post(
    'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    {
      model: ZHIPU_VISION_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'Translate JSON string values into Simplified Chinese. Keep JSON keys unchanged. Keep enum values Low, Medium, High, pass, warning, and fail unchanged. Keep platform names, brand names, file names, and product model names unchanged. Return JSON only.',
        },
        {
          role: 'user',
          content: JSON.stringify(result),
        },
      ],
    },
    { headers: { Authorization: `Bearer ${zhipuApiKey}` } },
  );

  return parseJsonObject((response.data.choices[0]?.message?.content || '').trim());
}

async function productAssetChecker(body: any) {
  const zhipuApiKey = getZhipuApiKey();
  const images = Array.isArray(body.images) ? body.images.slice(0, 8) : [];
  if (images.length === 0) {
    return Response.json({ error: 'At least one product image is required.' }, { status: 400 });
  }

  const outputLanguage = body.outputLanguage === 'Simplified Chinese' || body.interfaceLanguage?.startsWith?.('zh')
    ? 'Simplified Chinese'
    : 'English';
  const imageFacts = images.map((image: any, index: number) => ({
    index: index + 1,
    name: image.name || `image-${index + 1}`,
    role: image.role || 'product image',
    width: image.width || null,
    height: image.height || null,
    sizeBytes: image.size || null,
    type: image.type || null,
  }));

  const prompt = [
    'You are a product asset compliance reviewer for cross-border sellers.',
    'Review uploaded product images for marketplace and advertising readiness. This is a risk screening, not a final platform decision.',
    `Output language: ${outputLanguage}.`,
    outputLanguage === 'Simplified Chinese'
      ? 'Critical language rule: keep JSON keys and enum values in English, but write every user-facing string value in Simplified Chinese. This includes verdict, assetSummary, imageFindings.issues, imageFindings.fixes, checks.label, checks.evidence, checks.fix, nextActions, and disclaimer. Keep platform names, file names, brand names, product model names, and policy terms such as Google Shopping, Amazon, TikTok Shop, Shopify, Meta Ads, IPTC, and HS in English.'
      : 'For English output, write all explanatory text in English.',
    'Return JSON only. Do not wrap the JSON in Markdown fences. Do not add any preface.',
    'Use platform-specific risk reasoning when the target platform is provided, but do not claim official approval or rejection.',
    'Check visual and text risks: low resolution, blurred product, cropping, product too small, missing full product view, placeholder/generic image, logo/icon instead of product, promotional overlays, price/free shipping/best/cheap text, watermark, border, barcode overlay, brand/manufacturer logo not inherent to product, AI-generated image metadata concern, bundle mismatch, product-title mismatch, variant mismatch, packaging or label text problems, untranslated packaging text, regulated claims, health/medical claims, children product cues, food-contact cues, dangerous goods cues, counterfeit or brand-authorization risk.',
    'For Google Shopping image checks, consider these current public rules: image should meet size/file limits, show the product accurately, avoid placeholder/generic images, avoid promotional overlays/watermarks/borders, and frame the product clearly.',
    'Keep the result concise. Prefer 3 to 6 high-signal findings over long commentary.',
    'Use this exact JSON shape:',
    '{"overallRisk":"Low"|"Medium"|"High","verdict":string,"assetSummary":string,"imageFindings":[{"imageIndex":number,"imageName":string,"role":string,"risk":"Low"|"Medium"|"High","issues":string[],"fixes":string[]}],"checks":[{"label":string,"status":"pass"|"warning"|"fail","evidence":string,"fix":string}],"nextActions":string[],"disclaimer":string}',
    '',
    `Product title: ${body.productTitle || ''}`,
    `Product description: ${body.productDescription || ''}`,
    `Target platform: ${body.targetPlatform || ''}`,
    `Target market: ${body.targetMarket || ''}`,
    `Image file facts: ${JSON.stringify(imageFacts)}`,
  ].join('\n');

  const content: any[] = [{ type: 'text', text: prompt }];
  images.forEach((image: any) => {
    if (image.imageBase64) {
      content.push({ type: 'image_url', image_url: { url: image.imageBase64 } });
    }
  });

  const response = await axios.post(
    'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    {
      model: ZHIPU_VISION_MODEL,
      messages: [
        {
          role: 'system',
          content: outputLanguage === 'Simplified Chinese'
            ? 'You return valid JSON only. All user-facing JSON string values must be Simplified Chinese unless they are platform names, file names, brand names, model names, or fixed enum values.'
            : 'You return valid JSON only. All user-facing JSON string values must be English.',
        },
        {
          role: 'user',
          content,
        },
      ],
    },
    { headers: { Authorization: `Bearer ${zhipuApiKey}` } },
  );

  const rawText = (response.data.choices[0]?.message?.content || '').trim();
  const parsedResult = parseJsonObject(rawText);
  let finalResult = parsedResult;

  if (outputLanguage === 'Simplified Chinese' && hasEnglishNarrative(parsedResult)) {
    try {
      finalResult = await localizeProductAssetResult(parsedResult, zhipuApiKey);
    } catch {
      finalResult = parsedResult;
    }
  }

  return Response.json({
    ...finalResult,
    model: ZHIPU_VISION_MODEL,
    provider: 'zhipu-vision',
  });
}

async function imageGenerator(body: any) {
  const startedAt = Date.now();

  let size = '1280x1280';
  if (body.ratio === '16:9') size = '1440x960';
  if (body.ratio === '9:16') size = '960x1440';

  const finalPrompt = buildImagePrompt(body, 'image');
  const imageResult = await requestZhipuImage(finalPrompt, size, body.imageBase64);

  return Response.json(
    {
      imageUrl: imageResult.imageUrl,
      prompt: finalPrompt,
      elapsedMs: Date.now() - startedAt,
      model: imageResult.model,
      fallbackUsed: imageResult.fallbackUsed,
      category: getAiToolCategory('ai-image-generator'),
      provider: 'zhipu-image',
    },
    {
      headers: {
        'Server-Timing': `image;dur=${Date.now() - startedAt}`,
      },
    },
  );
}

async function productImageGenerator(body: any) {
  const startedAt = Date.now();

  const requestedVariants = Number(body.variantCount || 1);
  const variantCount = Math.min(3, Math.max(1, Number.isFinite(requestedVariants) ? requestedVariants : 1));
  const size = productImageSize(String(body.ratio || '1:1'));
  const imageRequests = Array.from({ length: variantCount }, async (_, index) => {
    const prompt = buildProductImagePrompt(body, index);
    const imageResult = await requestZhipuImage(prompt, size, undefined, { disableWatermark: true });

    return {
      imageUrl: imageResult.imageUrl,
      prompt,
      model: imageResult.model,
      fallbackUsed: imageResult.fallbackUsed,
      watermarkDisabled: true,
      variant: index + 1,
    };
  });

  const images = await Promise.all(imageRequests);

  return Response.json(
    {
      images,
      elapsedMs: Date.now() - startedAt,
      size,
      category: getAiToolCategory('ai-product-image-generator'),
      provider: 'zhipu-image',
    },
    {
      headers: {
        'Server-Timing': `product-image;dur=${Date.now() - startedAt}`,
      },
    },
  );
}

type TraceMoeResult = {
  anilist?: number | {
    id?: number;
    title?: {
      native?: string;
      romaji?: string;
      english?: string;
    };
  };
  filename?: string;
  episode?: string | number | null;
  from?: number;
  to?: number;
  similarity?: number;
  video?: string;
  image?: string;
};

function firstText(values: unknown[]) {
  for (const value of values) {
    if (Array.isArray(value)) {
      const foundValue = firstText(value);
      if (foundValue) return foundValue;
    }

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
  }

  return '';
}

function traceMoeAnilistId(anilist: TraceMoeResult['anilist']) {
  if (typeof anilist === 'number') return anilist;
  return anilist?.id || null;
}

function traceMoeTitle(result: TraceMoeResult) {
  if (typeof result.anilist === 'object') {
    return firstText([
      result.anilist.title?.native,
      result.anilist.title?.romaji,
      result.anilist.title?.english,
    ]);
  }

  return firstText([result.filename, 'Unknown anime']);
}

function formatTraceTime(seconds?: number) {
  if (!Number.isFinite(seconds)) return '';
  const totalSeconds = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function normalizeTraceMoeResults(results: TraceMoeResult[]) {
  return results.map((result, resultIndex) => {
    const anilistId = traceMoeAnilistId(result.anilist);
    const similarity = Number(result.similarity || 0) <= 1 ? Number(result.similarity || 0) * 100 : Number(result.similarity || 0);
    const urls = [
      anilistId ? `https://anilist.co/anime/${anilistId}` : '',
      anilistId && Number.isFinite(result.from) ? `https://trace.moe/?anilist=${anilistId}&t=${Math.floor(result.from || 0)}` : '',
      result.video || '',
      result.image || '',
    ].filter((url) => /^https?:\/\//i.test(url));

    const episodeText = result.episode ? `Episode ${result.episode}` : '';
    const timeText = formatTraceTime(result.from);

    return {
      id: `trace-moe-${resultIndex}`,
      similarity,
      thumbnail: result.image || '',
      sourceName: 'Anime scene index',
      title: traceMoeTitle(result),
      author: firstText([episodeText && timeText ? `${episodeText} · ${timeText}` : episodeText, timeText, result.filename]),
      urls,
      indexName: 'Anime scene index',
    };
  });
}

async function animeScreenshotSource(formData: FormData) {
  const uploadedImage = formData.get('image');

  if (!(uploadedImage instanceof File)) {
    return Response.json({ success: false, message: 'Image is required.' }, { status: 400 });
  }

  const fileName = uploadedImage.name || 'anime-source-image.png';
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  if (!TRACE_MOE_SUPPORTED_EXTENSIONS.has(fileExtension)) {
    return Response.json({ success: false, message: 'Unsupported image format.' }, { status: 400 });
  }

  const imageBytes = Buffer.from(await uploadedImage.arrayBuffer());
  if (imageBytes.byteLength > TRACE_MOE_MAX_FILE_SIZE) {
    return Response.json({ success: false, message: 'Image file is too large.' }, { status: 413 });
  }

  const traceFormData = new FormData();
  traceFormData.append('image', new Blob([imageBytes], { type: uploadedImage.type || 'application/octet-stream' }), fileName);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TRACE_MOE_TIMEOUT_MS);

  try {
    const response = await fetch(`${TRACE_MOE_API_URL}?anilistInfo`, {
      method: 'POST',
      body: traceFormData,
      signal: controller.signal,
    });

    const responseData = await response.json().catch(() => ({}));
    if (!response.ok) {
      return Response.json(
        {
          success: false,
          message: responseData?.error || responseData?.message || 'trace.moe search failed.',
        },
        { status: response.status },
      );
    }

    return Response.json({
      success: true,
      results: normalizeTraceMoeResults(Array.isArray(responseData?.result) ? responseData.result : []),
      shortRemaining: responseData?.quota ? Math.max(0, Number(responseData.quota) - Number(responseData.quotaUsed || 0)) : undefined,
      longRemaining: responseData?.limit,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error?.name === 'AbortError' ? 'trace.moe search timed out.' : error.message || 'trace.moe search failed.',
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: Request) {
  const path = new URL(request.url).pathname.replace(/^\/api\/?/, '');
  const ip = clientIp(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const rateLimitKey = `${path}:${ip}:${userAgent}`;
  const category = getAiToolCategory(path);

  try {
    if (path === 'anime-screenshot-source') {
      const traceMoeRateLimit = rateLimit(rateLimitKey, 30 * 1000, 'Please wait before searching another image.');
      if (traceMoeRateLimit) return traceMoeRateLimit;
      return await animeScreenshotSource(await request.formData());
    }

    const body = await request.json().catch(() => ({}));
    if (path === 'shorten') return await shorten(body);

    const jsonRateLimit = rateLimit(rateLimitKey);
    if (jsonRateLimit && (category === 'image' || category === 'vision')) return jsonRateLimit;

    if (category === 'image') {
      markUsage(rateLimitKey);
      if (path === 'ai-svg-generator') return await svgGenerator(body);
      if (path === 'ai-image-generator') return await imageGenerator(body);
      if (path === 'ai-product-image-generator') return await productImageGenerator(body);
    }

    if (category === 'vision') {
      markUsage(rateLimitKey);
      if (path === 'ai-vision-describe') return await visionDescribe(body);
      if (path === 'ai-product-asset-checker') return await productAssetChecker(body);
    }

    const runtimeConfig = buildAiRuntimeStreamConfig(path, body, DEEPSEEK_TEXT_MODEL);
    if (runtimeConfig.handled) {
      if (!runtimeConfig.ok) {
        return Response.json(
          { success: false, error: runtimeConfig.message, errorCode: runtimeConfig.errorCode },
          { status: runtimeConfig.status },
        );
      }

      const limited = rateLimit(rateLimitKey, runtimeConfig.config.rateMs, runtimeConfig.config.rateMessage || 'Too many requests');
      if (limited) return limited;
      markUsage(rateLimitKey);
      return streamBufferedChat(
        runtimeConfig.config.model,
        runtimeConfig.config.messages,
        runtimeConfig.config.options,
        runtimeConfig.config.validateOutput,
      );
    }

    const config = streamConfig(path, body);
    if (!config) return Response.json({ error: 'Not found' }, { status: 404 });

    if (config.rateMs) {
      const limited = rateLimit(rateLimitKey, config.rateMs, config.rateMessage || 'Too many requests');
      if (limited) return limited;
      markUsage(rateLimitKey);
    }

    return streamChat(config.model, config.messages, config.options);
  } catch (error: any) {
    return Response.json({ error: error.response?.data?.error?.message || error.message || 'Error' }, { status: 500 });
  }
}
