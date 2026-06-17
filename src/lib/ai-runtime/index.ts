export type AiRuntimeMessage = {
  role: 'system' | 'user';
  content: string;
};

export type AiRuntimeStreamConfig = {
  model: string;
  messages: AiRuntimeMessage[];
  options?: Record<string, unknown>;
  rateMs?: number;
  rateMessage?: string;
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
      rateMs: 24 * 60 * 60 * 1000,
      rateMessage: outputLanguage === 'Simplified Chinese' ? '请求过于频繁，请稍后再试。' : 'Too many requests. Please try again later.',
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

export const buildAiRuntimeStreamConfig = (path: string, body: any, model: string): AiRuntimeBuildResult => {
  switch (path) {
    case 'listing-craft':
      return buildListingConfig(body, model);
    case 'youtube-generator':
      return buildYoutubeConfig(body, model);
    case 'keywords':
      return buildKeywordConfig(body, model);
    default:
      return { handled: false };
  }
};
