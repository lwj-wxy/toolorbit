import { GoogleGenAI } from '@google/genai'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody<{ productInfo?: string }>(event)
  const productInfo = String(body?.productInfo ?? '').trim()

  if (!config.geminiApiKey) {
    setResponseStatus(event, 500)
    return {
      success: false,
      error: 'API key should be set when using the Gemini API.',
    }
  }

  if (!productInfo) {
    setResponseStatus(event, 400)
    return {
      success: false,
      error: '请输入产品基础信息。',
    }
  }

  try {
    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey })
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `作为一位资深的跨境电商运营（如Etsy、Amazon），请根据以下产品信息，生成一个高转化率的商品Listing。\n产品信息：${productInfo}\n\n请严格返回以下4部分结构，并使用Markdown格式：\n1. 吸引人的标题（Title）\n2. 高频搜索关键词（Tags/Keywords）\n3. 详细且带有感情色彩的商品描述（Description）\n4. 五大卖点（Bullet Points，清晰分点）`,
    })

    return {
      success: true,
      text: response.text,
    }
  } catch (error) {
    setResponseStatus(event, 500)
    return {
      success: false,
      error: error instanceof Error ? error.message : '生成失败，请稍后重试。',
    }
  }
})
