import type { Component } from 'vue'

const TOOL_COMPONENT_LOADERS: Record<string, () => Promise<{ default: Component }>> = {
  'json-formatter': () => import('~/components/tools/developer/JsonFormatterTool.vue'),
  base64: () => import('~/components/tools/developer/Base64Tool.vue'),
  'hash-generator': () => import('~/components/tools/developer/HashGeneratorTool.vue'),
  'uuid-generator': () => import('~/components/tools/developer/UuidGeneratorTool.vue'),
  'url-encoder': () => import('~/components/tools/webmaster/UrlEncoderTool.vue'),
  'text-analyzer': () => import('~/components/tools/text/TextAnalyzerTool.vue'),
  'text-cleaner': () => import('~/components/tools/text/TextCleanerTool.vue'),
  'qr-generator': () => import('~/components/tools/generator/QrGeneratorTool.vue'),
  'qr-decoder': () => import('~/components/tools/generator/QrDecoderTool.vue'),
  'barcode-generator': () => import('~/components/tools/generator/BarcodeGeneratorTool.vue'),
  'unicode-converter': () => import('~/components/tools/developer/UnicodeConverterTool.vue'),
  'etsy-fee-calculator': () => import('~/components/tools/commerce/EtsyFeeTool.vue'),
  'stripe-fee-calculator': () => import('~/components/tools/commerce/StripeFeeTool.vue'),
  'listing-craft-ai': () => import('~/components/tools/commerce/ListingCraftTool.vue'),
  'pdf-merge': () => import('~/components/tools/pdf/PdfMergeTool.vue'),
  'pdf-split': () => import('~/components/tools/pdf/PdfSplitTool.vue'),
  'pdf-to-image': () => import('~/components/tools/pdf/PdfToImageTool.vue'),
  'image-to-pdf': () => import('~/components/tools/pdf/ImageToPdfTool.vue'),
  'image-compressor': () => import('~/components/tools/image/ImageCompressorTool.vue'),
  'image-converter': () => import('~/components/tools/image/ImageConverterTool.vue'),
  'image-to-base64': () => import('~/components/tools/image/ImageToBase64Tool.vue'),
  'image-cropper': () => import('~/components/tools/image/ImageCropperTool.vue'),
  'svg-to-png': () => import('~/components/tools/image/SvgToPngTool.vue'),
  'timestamp-converter': () => import('~/components/tools/compute/TimestampConverterTool.vue'),
  'base-converter': () => import('~/components/tools/compute/BaseConverterTool.vue'),
  'mbti-style-test': () => import('~/components/tools/personality/MbtiStyleTestTool.vue'),
  'anime-persona-test': () => import('~/components/tools/personality/AnimePersonaTestTool.vue'),
  'big-five-test': () => import('~/components/tools/personality/BigFiveTestTool.vue'),
}

export async function loadToolComponent(slug: string) {
  const loader = TOOL_COMPONENT_LOADERS[slug]
  if (!loader) {
    return null
  }

  const module = await loader()
  return module.default
}
