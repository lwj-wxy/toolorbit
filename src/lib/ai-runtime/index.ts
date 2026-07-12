export type AiRuntimeMessage = {
  role: 'system' | 'user';
  content: string;
};

export type AiRuntimeRateMessage = string | ((retryAfterSeconds: number) => string);

const accountRateMessage = (outputLanguage: string): ((retryAfterSeconds: number) => string) => (retryAfterSeconds) => {
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
  return outputLanguage === 'Simplified Chinese'
    ? `当前账号已触发请求限流，请等待 ${minutes} 分钟后重试。`
    : `Your account is currently rate-limited. Please wait ${minutes} minute${minutes === 1 ? '' : 's'} before trying again.`;
};

export type AiRuntimeStreamConfig = {
  model: string;
  messages: AiRuntimeMessage[];
  options?: Record<string, unknown>;
  rateMs?: number;
  rateMessage?: AiRuntimeRateMessage;
  validateOutput?: (content: string) => string;
};

export type AiRuntimeBuildResult =
  | { handled: false }
  | { handled: true; ok: true; config: AiRuntimeStreamConfig }
  | { handled: true; ok: false; status: number; errorCode: string; message: string };

type NormalizedLanguage = 'English' | 'Simplified Chinese' | 'Japanese' | 'German' | 'Spanish';

const MAX_FIELD_LENGTH = 3000;

const PLATFORM_OPTIONS = new Set(['Amazon', 'Shopify', 'Etsy', 'eBay']);
const LISTING_TONE_OPTIONS = new Set(['persuasive', 'professional', 'urgent']);
const YOUTUBE_TONE_OPTIONS = new Set(['engaging', 'educational', 'dramatic']);
const VIDEO_TONE_OPTIONS = new Set(['Educational', 'Entertaining', 'Storytelling', 'Sales-oriented', 'Inspirational', 'Humorous']);
const VIDEO_DURATION_OPTIONS = new Set(['60s', '3-5min', '5-10min']);
const VIDEO_PLATFORM_OPTIONS = new Set(['Douyin / TikTok', 'YouTube Shorts', 'Instagram Reels', 'Bilibili', 'Xiaohongshu', 'YouTube']);
const PROMPT_STYLE_OPTIONS = new Set(['Photorealistic', 'Anime', 'Cyberpunk', '3D Render', 'Oil Painting', 'Minimalist Logo', 'Watercolor', 'Pencil Sketch']);
const TEXT_POLISH_TONE_OPTIONS = new Set(['Professional', 'Casual & Friendly', 'Academic', 'Persuasive', 'Concise', 'Humorous']);
const TRANSLATOR_TONE_OPTIONS = new Set(['Native', 'Professional', 'Literary', 'Casual']);
const TRANSLATOR_LANGUAGE_OPTIONS = new Set([
  'English',
  'Simplified Chinese',
  'Traditional Chinese',
  'Japanese',
  'Korean',
  'French',
  'German',
  'Spanish',
  'Portuguese',
  'Russian',
]);
const SPREADSHEET_OPTIONS = new Set(['excel', 'google-sheets']);
const REGEX_FLAVOR_OPTIONS = new Set(['javascript', 'python', 'java', 'go', 'pcre', 'ruby']);
const XIAOHONGSHU_STYLE_OPTIONS = new Set(['种草测评', '干货教程', '情感共鸣', '好物合集', '探店打卡']);
const MARKET_PLATFORM_OPTIONS = new Set(['Etsy', 'Amazon', 'TikTok Shop', 'eBay']);
const MARKET_TIMEFRAME_OPTIONS = new Set(['1', '3', '7']);
const REPORT_PERIOD_OPTIONS = new Set(['weekly', 'daily', 'monthly']);
const REPORT_ROLE_OPTIONS = new Set(['general', 'engineering', 'product', 'operations', 'sales', 'design', 'marketing']);
const REPORT_STYLE_OPTIONS = new Set(['concise', 'detailed', 'impact']);

const REPORT_PERIOD_LABELS: Record<string, { en: string; zh: string }> = {
  weekly: { en: 'weekly report', zh: '周报' },
  daily: { en: 'daily report', zh: '日报' },
  monthly: { en: 'monthly report', zh: '月报' },
};

const REPORT_ROLE_LABELS: Record<string, string> = {
  general: 'general office worker',
  engineering: 'software engineer',
  product: 'product manager',
  operations: 'operations specialist',
  sales: 'sales representative',
  design: 'designer',
  marketing: 'marketing specialist',
};

const REPORT_STYLE_GUIDANCE: Record<string, string> = {
  concise: 'Concise style: short, action-first bullets with no filler.',
  detailed: 'Detailed style: add brief context, process, and collaboration so a reader who was not involved can follow.',
  impact: 'Impact style: lead with business value and outcomes, suitable for a manager. Emphasize impact, ownership, and results, but never inflate them with invented numbers.',
};

const normalizeWhitespace = (value: unknown) =>
  String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeLongText = (value: unknown) =>
  String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const limitText = (value: string, maxLength = MAX_FIELD_LENGTH) =>
  value.length > maxLength ? value.slice(0, maxLength).trim() : value;

const languageName = (value: unknown): NormalizedLanguage => {
  const normalizedValue = normalizeWhitespace(value).toLowerCase();
  if (normalizedValue.startsWith('zh') || normalizedValue.includes('chinese') || normalizedValue === '中文') {
    return 'Simplified Chinese';
  }
  if (normalizedValue.includes('japanese')) return 'Japanese';
  if (normalizedValue.includes('german')) return 'German';
  if (normalizedValue.includes('spanish')) return 'Spanish';
  return 'English';
};

const parsePlatform = (body: any) => {
  const explicitPlatform = normalizeWhitespace(body.platform);
  if (PLATFORM_OPTIONS.has(explicitPlatform)) return explicitPlatform;

  const details = String(body.details ?? '');
  const platformMatch = details.match(/(?:^|\n)\s*Platform:\s*([^\n]+)/i);
  const parsedPlatform = normalizeWhitespace(platformMatch?.[1]);
  return PLATFORM_OPTIONS.has(parsedPlatform) ? parsedPlatform : 'Etsy';
};

const stripPlatformLine = (value: unknown) =>
  normalizeLongText(value)
    .split('\n')
    .filter((line) => !/^\s*Platform:\s*/i.test(line))
    .join('\n')
    .trim();

const invalidInput = (message: string): AiRuntimeBuildResult => ({
  handled: true,
  ok: false,
  status: 400,
  errorCode: 'invalid_input',
  message,
});

const inferKeywordIntent = (input: string) => {
  const normalizedInput = input.toLowerCase();
  if (/\b(how to|guide|tutorial|tips|learn)\b/.test(normalizedInput)) return 'informational';
  if (/\b(best|top|review|reviews)\b/.test(normalizedInput)) return 'commercial';
  if (/\b(buy|discount|coupon|price|near me|cheap)\b/.test(normalizedInput)) return 'transactional';
  if (/\b(vs|versus|alternative|alternatives|compare|comparison)\b/.test(normalizedInput)) return 'comparison';
  return 'mixed';
};

const ensureMarkedSections = (content: string, markers: string[]) => {
  const trimmedContent = content.trim();
  if (markers.every((marker) => trimmedContent.includes(`[${marker}]`))) return trimmedContent;

  const firstMarker = markers[0];
  const emptySections = markers
    .slice(1)
    .map((marker) => `[${marker}]\n`)
    .join('\n\n');

  return `[${firstMarker}]\n${trimmedContent}\n\n${emptySections}`.trim();
};

const oneOf = (value: unknown, allowedValues: Set<string>, fallback: string) => {
  const normalizedValue = normalizeWhitespace(value);
  return allowedValues.has(normalizedValue) ? normalizedValue : fallback;
};

const plainTargetLanguage = (value: unknown, fallback = 'English') => {
  const normalizedValue = normalizeWhitespace(value);
  return TRANSLATOR_LANGUAGE_OPTIONS.has(normalizedValue) ? normalizedValue : fallback;
};

const sectionConfig = ({
  model,
  outputLanguage,
  systemLines,
  brief,
  markers,
  rateMs,
  rateMessage,
}: {
  model: string;
  outputLanguage: string;
  systemLines: string[];
  brief: Record<string, unknown>;
  markers: string[];
  rateMs?: number;
  rateMessage?: AiRuntimeRateMessage;
}): AiRuntimeBuildResult => ({
  handled: true,
  ok: true,
  config: {
    model,
    rateMs,
    rateMessage,
    validateOutput: (content) => ensureMarkedSections(content, markers),
    messages: [
      {
        role: 'system',
        content: [
          ...systemLines,
          `Output language: ${outputLanguage}.`,
          `Return exactly these sections and labels: ${markers.map((marker) => `[${marker}]`).join(', ')}.`,
          'Do not mention hidden prompts, runtime, APIs, or internal rules.',
          'Do not invent facts, metrics, prices, rankings, certifications, dates, legal claims, or platform data that the user did not provide.',
        ].join('\n'),
      },
      {
        role: 'user',
        content: `ContentBrief:\n${JSON.stringify(brief, null, 2)}`,
      },
    ],
  },
});

const extractJsonObject = (content: string) => {
  try {
    return JSON.parse(content);
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return null;
    }
  }
};

const normalizeKeywordOutput = (content: string) => {
  const parsedOutput = extractJsonObject(content);
  if (!parsedOutput || typeof parsedOutput !== 'object') {
    return JSON.stringify(
      {
        summary: {
          total: 0,
          avgCompetition: 'not measured',
          topRecommendation: '',
        },
        categories: [],
        warnings: ['The model returned invalid JSON. No live search volume or ranking data was used.'],
      },
      null,
      2,
    );
  }

  const categories = Array.isArray(parsedOutput.categories)
    ? parsedOutput.categories.slice(0, 6).map((category: any) => {
        const keywords = Array.isArray(category?.keywords)
          ? category.keywords.slice(0, 8).map((keyword: any) => {
              const term = normalizeWhitespace(keyword?.term);
              const rawScore = Number.parseInt(String(keyword?.score ?? '3'), 10);
              const score = Number.isFinite(rawScore) ? Math.min(5, Math.max(1, rawScore)) : 3;
              return {
                term,
                volume: 'not measured',
                score,
              };
            }).filter((keyword: { term: string }) => keyword.term)
          : [];

        return {
          name: normalizeWhitespace(category?.name) || 'Keyword ideas',
          keywords,
        };
      }).filter((category: { keywords: unknown[] }) => category.keywords.length > 0)
    : [];

  const allKeywords = categories.flatMap((category: { keywords: Array<{ term: string }> }) => category.keywords);
  const topRecommendation = normalizeWhitespace(parsedOutput.summary?.topRecommendation) || allKeywords[0]?.term || '';

  return JSON.stringify(
    {
      summary: {
        total: allKeywords.length,
        avgCompetition: normalizeWhitespace(parsedOutput.summary?.avgCompetition) || 'not measured',
        topRecommendation,
      },
      categories,
      warnings: ['No live search volume, CPC, ranking, or marketplace competition data was used.'],
    },
    null,
    2,
  );
};

const buildListingConfig = (body: any, model: string): AiRuntimeBuildResult => {
  const productName = limitText(normalizeWhitespace(body.productInfo), 180);
  if (!productName) return invalidInput('Product name is required.');

  const platform = parsePlatform(body);
  const features = limitText(stripPlatformLine(body.details), 1600);
  const keywords = limitText(normalizeWhitespace(body.keywords), 300);
  const tone = LISTING_TONE_OPTIONS.has(normalizeWhitespace(body.tone)) ? normalizeWhitespace(body.tone) : 'persuasive';
  const targetAudience = limitText(normalizeWhitespace(body.targetAudience), 180);
  const outputLanguage = languageName(body.language);

  const platformPolicy: Record<string, string[]> = {
    Amazon: [
      'Keep the title factual and readable. Do not stuff keywords.',
      'Avoid prohibited or risky claims: best, guaranteed, cure, medical, FDA, certified, free shipping, discount.',
      'Use bullet points inside [DESCRIPTION] only when the product facts support them.',
    ],
    Shopify: [
      'Write for an owned product page with clear benefits and plain product details.',
      'Do not invent brand story, warranty, shipping terms, reviews, discounts, or certifications.',
      'Include a concise SEO-friendly opening paragraph inside [DESCRIPTION].',
    ],
    Etsy: [
      'Use handmade, gift, material, occasion, and style language only when the user provided those facts.',
      'Do not invent personalization, handmade status, vintage status, shipping, or sale claims.',
      'Make [TAGS] suitable as short marketplace search phrases, not hashtags.',
    ],
    eBay: [
      'Keep the title clear and item-focused.',
      'Do not invent condition, compatibility, brand, model, shipping, or return terms.',
      'Keep [DESCRIPTION] suitable for a marketplace listing draft.',
    ],
  };

  const brief = {
    toolId: 'listing-generator',
    task: 'Generate ecommerce listing copy',
    productName,
    platform,
    features: features || 'No extra features provided. Use neutral wording and ask no questions.',
    keywords: keywords || 'No required keywords provided.',
    tone,
    targetAudience: targetAudience || 'General ecommerce buyers',
    outputLanguage,
    constraints: [
      'Return exactly four sections with these labels: [TITLE], [DESCRIPTION], [TAGS], [SOCIAL].',
      'Use only product facts from the brief. If a fact is missing, use neutral wording.',
      'Do not invent material, dimensions, certifications, awards, rankings, discounts, warranty, shipping, origin, compatibility, safety claims, or medical claims.',
      'Do not mention that you are an AI model.',
      ...(platformPolicy[platform] || []),
    ],
    outputFormat: '[TITLE]\n...\n\n[DESCRIPTION]\n...\n\n[TAGS]\n...\n\n[SOCIAL]\n...',
  };

  return {
    handled: true,
    ok: true,
    config: {
      model,
      rateMs: 10 * 60 * 1000,
      rateMessage: accountRateMessage(outputLanguage),
      validateOutput: (content) => ensureMarkedSections(content, ['TITLE', 'DESCRIPTION', 'TAGS', 'SOCIAL']),
      messages: [
        {
          role: 'system',
          content: [
            'You write ecommerce listing drafts from structured briefs.',
            'Your job is to produce useful copy without adding unsupported facts.',
            'Follow the output labels exactly so the frontend can split the result.',
            `Output language: ${outputLanguage}.`,
          ].join('\n'),
        },
        {
          role: 'user',
          content: `ContentBrief:\n${JSON.stringify(brief, null, 2)}`,
        },
      ],
    },
  };
};

const buildYoutubeConfig = (body: any, model: string): AiRuntimeBuildResult => {
  const topic = limitText(normalizeLongText(body.topic), 1200);
  if (!topic) return invalidInput('Video topic is required.');

  const tone = YOUTUBE_TONE_OPTIONS.has(normalizeWhitespace(body.tone)) ? normalizeWhitespace(body.tone) : 'engaging';
  const targetAudience = limitText(normalizeWhitespace(body.targetAudience), 160);
  const outputLanguage = languageName(body.language);

  const brief = {
    toolId: 'ai-youtube-generator',
    task: 'Generate YouTube packaging copy',
    topic,
    tone,
    targetAudience: targetAudience || 'General YouTube viewers',
    outputLanguage,
    constraints: [
      'Return exactly four sections with these labels: [TITLE], [DESCRIPTION], [TAGS], [THUMBNAIL_IDEAS].',
      'Create 5 title candidates in [TITLE].',
      'Do not invent sponsors, timestamps, links, results, statistics, giveaways, or credentials.',
      'Avoid misleading clickbait and all-caps titles.',
      'Make tags comma-separated and directly related to the topic.',
      'Keep thumbnail ideas visual and practical. Do not suggest fake screenshots or false before-after claims.',
    ],
    outputFormat: '[TITLE]\n1. ...\n\n[DESCRIPTION]\n...\n\n[TAGS]\n...\n\n[THUMBNAIL_IDEAS]\n...',
  };

  return {
    handled: true,
    ok: true,
    config: {
      model,
      validateOutput: (content) => ensureMarkedSections(content, ['TITLE', 'DESCRIPTION', 'TAGS', 'THUMBNAIL_IDEAS']),
      messages: [
        {
          role: 'system',
          content: [
            'You are a YouTube packaging editor.',
            'Use the brief to create titles, a description, tags, and thumbnail directions.',
            'Follow the output labels exactly so the frontend can split the result.',
            `Output language: ${outputLanguage}.`,
          ].join('\n'),
        },
        {
          role: 'user',
          content: `ContentBrief:\n${JSON.stringify(brief, null, 2)}`,
        },
      ],
    },
  };
};

const buildKeywordConfig = (body: any, model: string): AiRuntimeBuildResult => {
  const seedKeyword = limitText(normalizeWhitespace(body.productName), 180);
  if (!seedKeyword) return invalidInput('Seed product keyword is required.');

  const outputLanguage = languageName(body.language);
  const inferredIntent = inferKeywordIntent(seedKeyword);

  const brief = {
    toolId: 'keyword-analyzer',
    task: 'Group ecommerce listing keyword ideas',
    seedKeyword,
    inferredIntent,
    outputLanguage,
    constraints: [
      'Return valid JSON only. Do not wrap it in Markdown.',
      'Do not claim live search volume, real sales data, keyword difficulty, CPC, or platform ranking data.',
      'Use volume labels such as "idea", "broad", "specific", or "long-tail" instead of numeric search volume.',
      'Score means copy-fit score from 1 to 5, not search volume or keyword difficulty.',
      'Create 4 to 6 categories. Each category should contain 5 to 8 keyword ideas.',
      'Include practical ecommerce terms for Etsy, Amazon, and Shopify listing copy when relevant.',
    ],
    outputShape: {
      summary: {
        total: 'number of generated keyword ideas',
        avgCompetition: 'qualitative label only',
        topRecommendation: 'one keyword idea from the output',
      },
      categories: [
        {
          name: 'category name',
          keywords: [{ term: 'keyword phrase', volume: 'qualitative label', score: '1-5' }],
        },
      ],
      warnings: ['No live search volume or ranking data used.'],
    },
  };

  return {
    handled: true,
    ok: true,
    config: {
      model,
      validateOutput: normalizeKeywordOutput,
      messages: [
        {
          role: 'system',
          content: [
            'You are an ecommerce keyword planning assistant.',
            'You generate structured keyword ideas from a seed product term.',
            'You do not have live marketplace data. Do not invent numeric volume, CPC, ranking, or competition metrics.',
            `Output language for text fields: ${outputLanguage}.`,
          ].join('\n'),
        },
        {
          role: 'user',
          content: `ContentBrief:\n${JSON.stringify(brief, null, 2)}`,
        },
      ],
    },
  };
};

const buildPromptGeneratorConfig = (body: any, model: string): AiRuntimeBuildResult => {
  const topic = limitText(normalizeLongText(body.topic), 1200);
  if (!topic) return invalidInput('Image idea is required.');

  const style = oneOf(body.style, PROMPT_STYLE_OPTIONS, 'Photorealistic');
  const outputLanguage = languageName(body.language);
  const markers = ['PROMPTS', 'USAGE_NOTES'];

  return sectionConfig({
    model,
    outputLanguage,
    markers,
    systemLines: [
      'You are an image prompt editor for Midjourney, Stable Diffusion, and similar text-to-image tools.',
      'Create 3 copy-ready English prompts from the user brief. Put all prompts in [PROMPTS].',
      'Each prompt must stay grounded in the provided subject, style, scene, lighting, material, and use case.',
      'Add short practical notes in [USAGE_NOTES], including review reminders for copyright, brands, likeness, and commercial use.',
    ],
    brief: {
      toolId: 'ai-prompt-generator',
      task: 'Draft image prompts',
      topic,
      style,
      outputLanguage,
    },
  });
};

const buildVideoScriptConfig = (body: any, model: string): AiRuntimeBuildResult => {
  const topic = limitText(normalizeLongText(body.topic), 1600);
  if (!topic) return invalidInput('Video topic is required.');

  const duration = oneOf(body.duration, VIDEO_DURATION_OPTIONS, '60s');
  const platform = oneOf(body.platform, VIDEO_PLATFORM_OPTIONS, 'Douyin / TikTok');
  const tone = oneOf(body.tone, VIDEO_TONE_OPTIONS, 'Educational');
  const outputLanguage = languageName(body.language);

  return sectionConfig({
    model,
    outputLanguage,
    markers: ['HOOK', 'SCRIPT', 'CAPTIONS', 'CTA'],
    systemLines: [
      'You are a short-video script editor.',
      'Create a shootable draft with a clear opening hook, scene-by-scene structure, voiceover or spoken lines, subtitle cues, and a closing call to action.',
      'Adapt pacing to the selected platform and duration without making false claims about products, results, sponsors, or statistics.',
    ],
    brief: {
      toolId: 'ai-video-script',
      task: 'Draft short-video script',
      topic,
      duration,
      platform,
      tone,
      outputLanguage,
    },
  });
};

const buildTextPolisherConfig = (body: any, model: string): AiRuntimeBuildResult => {
  const sourceText = limitText(normalizeLongText(body.text), 3000);
  if (!sourceText) return invalidInput('Text is required.');

  const tone = oneOf(String(body.tone || '').split('/')[0], TEXT_POLISH_TONE_OPTIONS, 'Professional');
  const outputLanguage = languageName(body.language);

  return sectionConfig({
    model,
    outputLanguage,
    markers: ['POLISHED_TEXT', 'CHECK_NOTES'],
    rateMs: 2 * 60 * 1000,
    rateMessage: accountRateMessage(outputLanguage),
    systemLines: [
      'You are a careful text editor.',
      'Rewrite the source text for clarity, smoother flow, and the selected tone.',
      'Keep the original meaning, facts, numbers, names, links, and technical terms unless the source itself changes them.',
      'Use [CHECK_NOTES] only for brief reminders about facts or sensitive contexts that need human review.',
    ],
    brief: {
      toolId: 'ai-text-polisher',
      task: 'Polish text',
      tone,
      sourceText,
      outputLanguage,
    },
  });
};

const buildTranslatorConfig = (body: any, model: string): AiRuntimeBuildResult => {
  const sourceText = limitText(normalizeLongText(body.text), 3000);
  if (!sourceText) return invalidInput('Source text is required.');

  const targetLanguage = plainTargetLanguage(body.targetLang, 'English');
  const tone = oneOf(String(body.tone || '').split('/')[0], TRANSLATOR_TONE_OPTIONS, 'Native');

  return sectionConfig({
    model,
    outputLanguage: targetLanguage,
    markers: ['TRANSLATION', 'REVIEW_NOTES'],
    rateMs: 2 * 60 * 1000,
    rateMessage: accountRateMessage(targetLanguage),
    systemLines: [
      'You are a professional translator.',
      'Translate with context and tone instead of word-by-word substitution.',
      'Preserve formatting, names, numbers, URLs, product names, and technical terms when appropriate.',
      'Use [REVIEW_NOTES] only for short checks such as terminology, regional phrasing, or sensitive content.',
    ],
    brief: {
      toolId: 'ai-translator',
      task: 'Translate text',
      targetLanguage,
      tone,
      sourceText,
    },
  });
};

const buildExcelFormulaConfig = (body: any, model: string): AiRuntimeBuildResult => {
  const requirement = limitText(normalizeLongText(body.requirement), 1600);
  if (!requirement) return invalidInput('Spreadsheet requirement is required.');

  const formulaType = oneOf(body.formulaType, SPREADSHEET_OPTIONS, 'excel');
  const outputLanguage = languageName(body.language);

  return sectionConfig({
    model,
    outputLanguage,
    markers: ['FORMULA', 'EXPLANATION', 'NOTES'],
    systemLines: [
      'You are a spreadsheet formula assistant.',
      'Generate a formula for Microsoft Excel or Google Sheets according to the selected spreadsheet type.',
      'Explain cell ranges, function choices, separators, and compatibility limits. Do not claim you tested the formula.',
      'For finance, tax, compliance, or statistical calculations, remind the user to verify the result.',
    ],
    brief: {
      toolId: 'ai-excel-formula',
      task: 'Generate spreadsheet formula',
      spreadsheetType: formulaType === 'google-sheets' ? 'Google Sheets' : 'Microsoft Excel',
      requirement,
      outputLanguage,
    },
  });
};

const buildRegexConfig = (body: any, model: string): AiRuntimeBuildResult => {
  const requirement = limitText(normalizeLongText(body.requirement), 1600);
  if (!requirement) return invalidInput('Regex requirement is required.');

  const flavor = oneOf(body.flavor, REGEX_FLAVOR_OPTIONS, 'javascript');
  const outputLanguage = languageName(body.language);

  return sectionConfig({
    model,
    outputLanguage,
    markers: ['REGEX', 'EXPLANATION', 'TEST_CASES'],
    systemLines: [
      'You are a regex assistant.',
      'Generate a regular expression for the selected flavor and explain key parts.',
      'Include positive and negative test examples. Warn about runtime differences, escaping, multiline text, and Unicode when relevant.',
      'Do not claim the pattern is production-safe until the user tests it with real data.',
    ],
    brief: {
      toolId: 'ai-regex',
      task: 'Generate regex',
      flavor,
      requirement,
      outputLanguage,
    },
  });
};

const buildXiaohongshuConfig = (body: any, model: string): AiRuntimeBuildResult => {
  const topic = limitText(normalizeLongText(body.topic), 1200);
  if (!topic) return invalidInput('Topic is required.');

  const keywords = limitText(normalizeWhitespace(body.keywords), 300);
  const style = oneOf(body.style, XIAOHONGSHU_STYLE_OPTIONS, '种草测评');
  const outputLanguage = languageName(body.language || 'Chinese');

  return sectionConfig({
    model,
    outputLanguage,
    markers: ['TITLES', 'BODY', 'HASHTAGS', 'REVIEW_NOTES'],
    systemLines: [
      'You are a Xiaohongshu post editor.',
      'Draft post titles, body copy, hashtags, and a short engagement prompt based on the user brief.',
      'Keep the wording grounded in the provided topic and keywords. Do not invent personal experience, price, efficacy, discounts, medical claims, or brand endorsements.',
      'Use [REVIEW_NOTES] for short checks about product facts, ad disclosure, pricing, and platform community rules.',
    ],
    brief: {
      toolId: 'ai-xiaohongshu',
      task: 'Draft Xiaohongshu post copy',
      topic,
      keywords: keywords || 'No required keywords provided.',
      style,
      outputLanguage,
    },
  });
};

const buildCompetitorConfig = (body: any, model: string): AiRuntimeBuildResult => {
  const productName = limitText(normalizeLongText(body.productName), 1200);
  const competitorInfo = limitText(normalizeLongText(body.competitorInfo), 1800);
  if (!productName || !competitorInfo) return invalidInput('Both product description and competitor details are required.');

  const outputLanguage = languageName(body.language);

  return sectionConfig({
    model,
    outputLanguage,
    markers: ['COMPARISON', 'OPPORTUNITIES', 'NEXT_STEPS'],
    systemLines: [
      'You are an ecommerce competitor analysis assistant.',
      'Compare only the two texts the user provided. Do not infer live sales, rankings, review counts, official platform data, or real market share.',
      'Focus on positioning, benefits, copy gaps, offer gaps, risks, and practical next steps.',
    ],
    brief: {
      toolId: 'competitor-tracker',
      task: 'Compare product and competitor listing notes',
      myProduct: productName,
      competitorInfo,
      outputLanguage,
    },
  });
};

const buildMarketInsightsConfig = (body: any, model: string): AiRuntimeBuildResult => {
  const platform = oneOf(body.platform, MARKET_PLATFORM_OPTIONS, 'Etsy');
  const timeframe = oneOf(body.timeframe, MARKET_TIMEFRAME_OPTIONS, '7');
  const productDirection = limitText(normalizeLongText(body.productDirection || body.category || body.idea), 800);
  const outputLanguage = languageName(body.language);

  return sectionConfig({
    model,
    outputLanguage,
    markers: ['MARKET_NOTES', 'OPPORTUNITIES', 'VALIDATION'],
    systemLines: [
      'You are an ecommerce market research note taker.',
      'Create a research draft from the user brief. This tool does not have live marketplace data.',
      'Do not invent live search volume, sales, growth rates, rankings, official platform trends, or current dates as evidence.',
      'Frame output as hypotheses and validation steps for search, ad tools, analytics, competitor listings, and real orders.',
    ],
    brief: {
      toolId: 'market-insights',
      task: 'Draft ecommerce market research notes',
      platform,
      timeframeDays: timeframe,
      productDirection: productDirection || 'General category exploration',
      outputLanguage,
    },
  });
};

const sanitizeWorldCupPredictionOutput = (content: string) =>
  content
    .replace(/[\u2010-\u2015\u2212\uff0d]/g, '-')
    .replace(/国际友谊赛|友谊赛|热身赛|资格赛/g, '2026 世界杯')
    .replace(/(?:俱乐部)?联赛(?:比赛|对阵|赛事|语境|场景)/g, '2026 世界杯比赛')
    .replace(/两组均需抢分|两队均需抢分|双方均需抢分/g, '具体积分形势未验证，本次按 2026 小组赛通用出线压力做有界推演')
    .replace(/小组积分、出线规则及教练临场决策(?:（[^）]*）)?未被纳入本次推断。?/g, '具体小组积分、轮换消息和临场阵容未验证；本次已按 2026 赛制和通用出线动机做有界推演。')
    .replace(/出线规则(?:及[^，。]*)?未被纳入本次推断。?/g, '具体积分形势未验证；2026 出线规则已作为推演框架纳入。')
    .replace(/・?仅凭队名预测，确切小组、实时积分、剩余赛程、阵容、伤停、红黄牌、定位球、临场调度等均未核实，结果可能显著偏移。\s*/g, '・主要变数：红牌、点球、定位球和临场阵容会显著改变赛果。\n')
    .replace(/・?美国虽为东道主之一，但本场是否在美进行、有无真实环境适应优势未确认，该因素可能影响发挥。\s*/g, '')
    .replace(/・?2026 赛制本身已纳入考虑，但无具体台面信息，动力判断为通用情况，实际赛前需重新评估。?/g, '・2026 赛制已纳入推演；具体分组、赛程和首发更新后，概率需要重新校准。')
    .replace(/按中性场地、东道主优势假设/g, '具体比赛城市未验证；美国作为联合东道主之一，可能存在环境适应优势')
    .replace(/中性场地/g, '具体比赛城市未验证')
    .replace(/主场氛围|主场优势/g, '环境适应优势')
    .replace(/主场攻势/g, '进攻压迫')
    .replace(/主场作战/g, '比赛环境适应')
    .replace(/客场作战/g, '异地比赛适应')
    .replace(/东道主往往首轮抢攻/g, '东道主通常有争胜压力和环境适应优势，但具体轮次未验证')
    .replace(/首轮/g, '具体轮次未验证的比赛')
    .replace(/\binternational friendly\b/gi, '2026 FIFA World Cup match')
    .replace(/\bfriendly\b/gi, '2026 FIFA World Cup match')
    .replace(/\bexhibition\b/gi, '2026 FIFA World Cup match')
    .replace(/\bqualifier\b/gi, '2026 FIFA World Cup')
    .replace(/\bleague match\b/gi, '2026 FIFA World Cup match');

const WORLD_CUP_MATCH_PREDICTOR_METHOD = [
  'Use worldcup-match-predictor.md as the reasoning basis, adapted to this backend where the user only sends two teams.',
  'Run the prediction in this order: baseline, tournament motivation adjustment, then market/odds check only when odds are supplied.',
  'Baseline: estimate the starting win-draw-loss split from national-team strength tier, recent international form patterns, attack/defense balance, likely tactical fit, host/travel context, and head-to-head only when known. Do not use odds in the baseline.',
  'Motivation adjustment: apply the 2026 World Cup group rule that each group sends the top two teams plus the eight best third-place teams. Account for win-to-qualify, draw-is-enough, possible rotation after qualification, next-match fallback, and goal-difference pressure.',
  'Keep motivation adjustments bounded. A normal single factor moves a result by 5 to 15 percentage points; the total shift should usually stay within 15 to 20 percentage points from the baseline.',
  'If the likely stage is unclear, treat the matchup as a hypothetical 2026 World Cup group-stage match and say the exact group/table was not verified. Do not switch the competition.',
  'When only team names are supplied, do not assert a concrete table situation. Do not say both teams must take points, draw is enough, win secures qualification, a team already qualified, a team will rotate, or a next opponent creates fallback unless the user supplied that context.',
  'For motivation with missing table data, write that the 2026 format creates general group-stage point pressure, but the exact group, points, remaining schedule, and rotation risk were not verified.',
  'Do not assume home venue, away venue, neutral venue, opening match, first round, or group round number unless the user supplied it. For the USA, mention only possible co-host environment familiarity, not a confirmed home-field setup.',
  'Knockout branch: if the user explicitly says knockout, round of 32, quarterfinal, semifinal, or final, use 90-minute win-draw-loss, then mention extra time or penalties as a separate uncertainty. Skip group-table motivation in that case.',
  'Odds check: if odds are supplied, convert them to implied probabilities, normalize the overround when possible, and use them as a cross-check. Do not let odds become the starting point.',
  'Scoreline method: start from common international-tournament scorelines, especially 1-0, 1-1, 2-1, 0-0, and 2-0. Shift toward 0-0/1-0/1-1 for low-block or draw-friendly setups; shift toward 2-1/2-2/3-1 when both teams must win.',
  'Calibration rule: give probability ranges and likely scorelines, not certainty. Red cards, penalties, set pieces, late lineups, stale data, and group-table changes can overturn the estimate.',
];

const buildWorldCupMatchPredictorConfig = (body: any, model: string): AiRuntimeBuildResult => {
  const teamA = limitText(normalizeWhitespace(body.teamA), 110);
  const teamB = limitText(normalizeWhitespace(body.teamB), 110);
  const fallbackMatch = limitText(normalizeWhitespace(body.match), 220);
  const match = teamA && teamB ? `${teamA} vs ${teamB}` : fallbackMatch;
  if (!match) return invalidInput('Both teams are required.');
  const worldCupMatchContext = body.worldCupMatchContext && typeof body.worldCupMatchContext === 'object'
    ? body.worldCupMatchContext
    : null;

  const outputLanguage = body.language
    ? languageName(body.language)
    : /[\u4e00-\u9fff]/.test(`${teamA}${teamB}${fallbackMatch}`)
      ? 'Simplified Chinese'
      : 'English';
  const markers = ['MATCH', 'RESULT', 'SCORES', 'REASON', 'RISK_NOTES'];

  const runtimeConfig = sectionConfig({
    model,
    outputLanguage,
    markers,
    systemLines: [
      'You are a 2026 FIFA World Cup match prediction analyst.',
      'This tool is only for 2026 FIFA World Cup predictions. Always frame the matchup as a 2026 FIFA World Cup match.',
      'Never reclassify the matchup as an international friendly, exhibition, club match, qualifier, league match, or generic neutral-site game.',
      'Do not describe the match context as a friendly, exhibition, qualifier, club match, or league match.',
      'Base the prediction on the internal skill method named worldcup-match-predictor.md.',
      ...WORLD_CUP_MATCH_PREDICTOR_METHOD,
      'The user only provides two teams. Do not ask for standings, odds, injuries, kickoff time, lineups, or tournament context.',
      worldCupMatchContext
        ? 'The backend supplied live World Cup match context from a public scoreboard. Use that context first for group, schedule, venue, team records, current group table, and remaining schedule.'
        : 'The backend has no live search result for this request. Do not claim that you checked live standings, injuries, odds, rankings, or fixtures unless the user supplied them.',
      worldCupMatchContext
        ? 'Do not write that the group, table, schedule, venue, or records were not checked when they are present in worldCupMatchContext. You may say injuries, lineups, and odds were not supplied if missing.'
        : 'If live context is missing, say the exact group table and schedule were not verified, but keep the result useful.',
      'Make a concise 2026 World Cup pre-match estimate from the method above, using qualitative assumptions only where live data is missing.',
      'If the two teams are not known to be in the same scheduled fixture, treat it as a hypothetical 2026 World Cup matchup rather than changing the competition.',
      'Never write that 2026 qualification rules were not included. They are included as the framework; only the exact table, schedule, lineups, and odds may be unverified.',
      'Avoid unsupported Chinese claims such as "两队均需抢分", "必须拿分", "赢即出线", "已提前出线", "下一场对手", "有退路", or "轮换" unless the user supplied that match context.',
      'Avoid unsupported venue or round claims such as "主场", "客场", "中性场地", "首轮", or "揭幕战" unless the user supplied that context.',
      'In [SCORES], use only ASCII hyphen scores such as "2-1". Do not use en dash, nonbreaking hyphen, full-width hyphen, colon, or other dash characters in scores.',
      'Avoid club-career claims such as "五大联赛效力" unless the user supplied them. Use general national-team strength instead.',
      'In [MATCH], start by naming the context as "2026 FIFA World Cup" or "2026 世界杯".',
      'Return win, draw, and loss probability ranges. Give the most likely result, a second option, and 2 or 3 likely scorelines.',
      'In [REASON], show the method in short user-facing labels: basic strength, tournament motivation, market check if supplied, and match shape.',
      'Keep [REASON] readable for ordinary users. Avoid overexplaining formulas, but make clear that the answer is not a generic guess.',
      'Do not claim live verification, current odds, injuries, rankings, standings, start time, or final score.',
      'Do not present the prediction as betting advice, a guarantee, or a certain result.',
    ],
    brief: {
      toolId: 'worldcup-match-predictor',
      task: 'Predict a 2026 FIFA World Cup match result and likely scorelines from two team names',
      competition: '2026 FIFA World Cup',
      teamA: teamA || 'Parsed from match text',
      teamB: teamB || 'Parsed from match text',
      match,
      outputLanguage,
      methodBasis: 'worldcup-match-predictor.md',
      worldCupMatchContext,
      methodSteps: [
        'Build a no-odds baseline from national-team strength, form shape, attack/defense style, host/travel context, and known matchup tendencies.',
        'Apply bounded 2026 World Cup motivation adjustments from group qualification math, rotation risk, next-match fallback, and goal-difference pressure.',
        'Use odds only as a cross-check when the user supplies them. Do not invent odds.',
        'Choose scorelines from international-tournament priors, then adjust by match shape.',
      ],
      dataBoundary: [
        worldCupMatchContext
          ? 'A public scoreboard context was supplied by the backend. Use its match, group, venue, records, group standings, and remaining schedule as factual context.'
          : 'Only team names were supplied and no live match context was found.',
        'Do not invent live odds, injury news, kickoff time, or lineup decisions if they are not in worldCupMatchContext.',
        'Do not invent venue, home/away status, neutral-site status, opening match, or round number beyond what worldCupMatchContext supplies.',
        worldCupMatchContext
          ? 'Use current group standings and remaining schedule from worldCupMatchContext for the motivation step.'
          : 'Use the 2026 qualification format as a general framework, but state that the exact table and match context were not verified.',
      ],
      requiredReasoningShape: [
        'Match: restate the teams under the 2026 FIFA World Cup context. If worldCupMatchContext exists, include the actual group, kickoff/status, and venue when available. Do not mention friendlies or other competitions.',
        'Result: name the most likely result and probability ranges for team A win, draw, and team B win.',
        'Scores: return 3 to 5 lines. Each line must use this exact format: score | probabilityNumber | short note. Example: 2-1 | 32 | narrow favorite win. Use only the number, no percent sign, in the middle field.',
        'Reason: give concise bullets for basic strength, group-table motivation, market check if supplied, and match shape. If worldCupMatchContext exists, use current records, group table, and remaining schedule in the motivation bullet.',
        'Risk: write only 2 short bullets. Mention match-changing events such as red cards, penalties, set pieces, and lineup changes. If worldCupMatchContext exists, do not say group table or schedule were unverified.',
      ],
    },
  });

  if (!runtimeConfig.handled || !runtimeConfig.ok) return runtimeConfig;

  return {
    handled: true,
    ok: true,
    config: {
      ...runtimeConfig.config,
      options: {
        ...runtimeConfig.config.options,
        temperature: 0.2,
      },
      validateOutput: (content) => sanitizeWorldCupPredictionOutput(ensureMarkedSections(content, markers)),
    },
  };
};

const buildResumeOptimizerConfig = (body: any, model: string): AiRuntimeBuildResult => {
  const resumeText = limitText(normalizeLongText(body.resumeText), 5000);
  if (!resumeText) return invalidInput('Resume text is required.');

  const jobDescription = limitText(normalizeLongText(body.jobDescription), 2400);
  const outputLanguage = body.targetLanguage === 'zh' ? 'Simplified Chinese' : 'English';
  const templateStyle = normalizeWhitespace(body.templateStyle) || 'classic';
  const roleType = normalizeWhitespace(body.roleType) || 'general';

  return {
    handled: true,
    ok: true,
    config: {
      model,
      messages: [
        {
          role: 'system',
          content: [
            'You are a careful resume editor.',
            `Output language: ${outputLanguage}.`,
            `Role type: ${roleType}.`,
            `Layout preference: ${templateStyle}.`,
            'Return only a polished resume body in Markdown.',
            'Do not output analysis, match score, cover letter, checklist, or hidden reasoning.',
            'Use only the candidate facts in the resume text. Do not invent companies, degrees, dates, titles, skills, certificates, metrics, tools, or achievements.',
            'If the target job description is provided, align wording and section order to it while keeping every claim factual.',
            'Omit sections that have no source information.',
          ].join('\n'),
        },
        {
          role: 'user',
          content: `ContentBrief:\n${JSON.stringify(
            {
              toolId: 'ai-resume-optimizer',
              task: 'Rewrite resume',
              resumeText,
              jobDescription: jobDescription || 'No target job description provided.',
              roleType,
              templateStyle,
              outputLanguage,
            },
            null,
            2,
          )}`,
        },
      ],
    },
  };
};

const buildWeeklyReportConfig = (body: any, model: string): AiRuntimeBuildResult => {
  const workLog = limitText(normalizeLongText(body.workLog), 4000);
  if (!workLog) return invalidInput('Work log is required.');

  const period = oneOf(body.period, REPORT_PERIOD_OPTIONS, 'weekly');
  const role = oneOf(body.role, REPORT_ROLE_OPTIONS, 'general');
  const style = oneOf(body.style, REPORT_STYLE_OPTIONS, 'concise');
  const outputLanguage = languageName(body.language);
  const periodLabel = outputLanguage === 'Simplified Chinese' ? REPORT_PERIOD_LABELS[period].zh : REPORT_PERIOD_LABELS[period].en;

  return sectionConfig({
    model,
    outputLanguage,
    markers: ['SUMMARY', 'ACHIEVEMENTS', 'DETAILS', 'ISSUES', 'NEXTWEEK'],
    rateMs: 2 * 60 * 1000,
    rateMessage: accountRateMessage(outputLanguage),
    systemLines: [
      `You are a workplace reporting assistant. Turn a rough work log into a structured, professional ${periodLabel}.`,
      `Write from the perspective of a ${REPORT_ROLE_LABELS[role]} and use natural terminology for that role.`,
      REPORT_STYLE_GUIDANCE[style],
      'Organize messy or fragmented notes by project or theme. Use short bullet points that start with an action verb.',
      'Only use facts from the work log. Never invent numbers, metrics, percentages, KPIs, dates, names, or outcomes the user did not provide. When no metric is available, describe the result qualitatively instead of fabricating data.',
      'Put a one to two sentence executive overview in [SUMMARY].',
      'Put quantified or high-impact results in [ACHIEVEMENTS]. If nothing stands out, summarize the most valuable work without exaggeration.',
      'Put the organized task breakdown, grouped by project or theme, in [DETAILS].',
      'Put blockers, risks, or things needing help in [ISSUES]. If the log shows none, give one short reasonable note instead of inventing problems.',
      'Put the plan for the next period in [NEXTWEEK], inferred from unfinished items and natural follow-ups in the log.',
      'Do not add a greeting, sign-off, or any meta commentary about being an AI.',
    ],
    brief: {
      toolId: 'weekly-report-generator',
      task: `Generate a structured ${periodLabel}`,
      period,
      role: REPORT_ROLE_LABELS[role],
      style,
      workLog,
      outputLanguage,
    },
  });
};

export const buildAiRuntimeStreamConfig = (path: string, body: any, model: string): AiRuntimeBuildResult => {
  switch (path) {
    case 'listing-craft':
      return buildListingConfig(body, model);
    case 'youtube-generator':
      return buildYoutubeConfig(body, model);
    case 'keywords':
      return buildKeywordConfig(body, model);
    case 'ai-prompt-generator':
      return buildPromptGeneratorConfig(body, model);
    case 'ai-video-script':
      return buildVideoScriptConfig(body, model);
    case 'ai-polisher':
      return buildTextPolisherConfig(body, model);
    case 'ai-translator':
      return buildTranslatorConfig(body, model);
    case 'ai-excel-formula':
      return buildExcelFormulaConfig(body, model);
    case 'ai-regex':
      return buildRegexConfig(body, model);
    case 'xiaohongshu':
      return buildXiaohongshuConfig(body, model);
    case 'competitor':
      return buildCompetitorConfig(body, model);
    case 'market-research':
      return buildMarketInsightsConfig(body, model);
    case 'worldcup-match-predictor':
      return buildWorldCupMatchPredictorConfig(body, model);
    case 'ai-resume-optimizer':
      return buildResumeOptimizerConfig(body, model);
    case 'weekly-report-generator':
      return buildWeeklyReportConfig(body, model);
    default:
      return { handled: false };
  }
};
