export type ToolCategoryId =
  | 'developer'
  | 'webmaster'
  | 'text'
  | 'generator'
  | 'commerce'
  | 'pdf'
  | 'image'
  | 'compute'

export interface ToolCategory {
  id: ToolCategoryId
  name: string
}

export interface ToolItem {
  id: string
  name: string
  description: string
  icon: string
  categoryId: ToolCategoryId
  path: string
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  { id: 'developer', name: '开发者工具' },
  { id: 'webmaster', name: '站长工具' },
  { id: 'text', name: '文本工具' },
  { id: 'generator', name: '生成器' },
  { id: 'commerce', name: '电商工具' },
  { id: 'pdf', name: 'PDF 工具' },
  { id: 'image', name: '图片处理' },
  { id: 'compute', name: '计算转换' },
]

export const TOOLS: ToolItem[] = [
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '提供 JSON 美化、压缩和校验。',
    icon: 'Code2',
    categoryId: 'developer',
    path: '/tools/json-formatter',
  },
  {
    id: 'base64',
    name: 'Base64 编解码',
    description: '支持 UTF-8 文本的 Base64 编码和解码。',
    icon: 'Binary',
    categoryId: 'developer',
    path: '/tools/base64',
  },
  {
    id: 'hash-generator',
    name: '哈希生成器',
    description: '快速生成 MD5、SHA-1、SHA-256、SHA-512。',
    icon: 'Hash',
    categoryId: 'developer',
    path: '/tools/hash-generator',
  },
  {
    id: 'uuid-generator',
    name: 'UUID 在线生成',
    description: '批量生成 RFC 4122 标准 UUID。',
    icon: 'Fingerprint',
    categoryId: 'developer',
    path: '/tools/uuid-generator',
  },
  {
    id: 'unicode-converter',
    name: 'Unicode 转换',
    description: '中文与 Unicode 转义互转。',
    icon: 'Code2',
    categoryId: 'developer',
    path: '/tools/unicode-converter',
  },
  {
    id: 'url-encoder',
    name: 'URL 编解码',
    description: '将 URL 安全编码或解码为可读格式。',
    icon: 'Link',
    categoryId: 'webmaster',
    path: '/tools/url-encoder',
  },
  {
    id: 'text-analyzer',
    name: '文本分析器',
    description: '统计字数、字符数、段落数和词频。',
    icon: 'Type',
    categoryId: 'text',
    path: '/tools/text-analyzer',
  },
  {
    id: 'text-cleaner',
    name: '字符串清洗',
    description: '去空格、去换行、去制表符和标点。',
    icon: 'Type',
    categoryId: 'text',
    path: '/tools/text-cleaner',
  },
  {
    id: 'qr-generator',
    name: '二维码生成器',
    description: '一键生成可下载二维码。',
    icon: 'QrCode',
    categoryId: 'generator',
    path: '/tools/qr-generator',
  },
  {
    id: 'qr-decoder',
    name: '二维码识别',
    description: '上传二维码图片并解析内容。',
    icon: 'QrCode',
    categoryId: 'generator',
    path: '/tools/qr-decoder',
  },
  {
    id: 'barcode-generator',
    name: '条形码生成',
    description: '支持 CODE128、CODE39、EAN、UPC 生成。',
    icon: 'QrCode',
    categoryId: 'generator',
    path: '/tools/barcode-generator',
  },
  {
    id: 'etsy-fee-calculator',
    name: 'Etsy 利润计算器',
    description: '计算 Etsy 平台费用和预估利润。',
    icon: 'ShoppingCart',
    categoryId: 'commerce',
    path: '/tools/etsy-fee-calculator',
  },
  {
    id: 'stripe-fee-calculator',
    name: 'Stripe 手续费计算器',
    description: '计算 Stripe 收款手续费和净收入。',
    icon: 'CreditCard',
    categoryId: 'commerce',
    path: '/tools/stripe-fee-calculator',
  },
  {
    id: 'listing-craft-ai',
    name: 'Listing Craft AI',
    description: '内置大模型，一键生成跨境电商 Listing。',
    icon: 'Sparkles',
    categoryId: 'commerce',
    path: '/tools/listing-craft-ai',
  },
  {
    id: 'pdf-merge',
    name: 'PDF 合并',
    description: '将多个 PDF 合并为一个文件。',
    icon: 'Files',
    categoryId: 'pdf',
    path: '/tools/pdf-merge',
  },
  {
    id: 'pdf-split',
    name: 'PDF 拆分',
    description: '整本 PDF 拆分为单页并打包 ZIP。',
    icon: 'FileText',
    categoryId: 'pdf',
    path: '/tools/pdf-split',
  },
  {
    id: 'pdf-to-image',
    name: 'PDF 转图片',
    description: '将 PDF 每页转换为 JPG/PNG 图片。',
    icon: 'FileImage',
    categoryId: 'pdf',
    path: '/tools/pdf-to-image',
  },
  {
    id: 'image-to-pdf',
    name: '图片转 PDF',
    description: '上传多张图片并合并导出为 PDF。',
    icon: 'Image',
    categoryId: 'pdf',
    path: '/tools/image-to-pdf',
  },
  {
    id: 'image-compressor',
    name: '图片在线压缩',
    description: '在保证质量同时减小图片体积。',
    icon: 'ImageMinus',
    categoryId: 'image',
    path: '/tools/image-compressor',
  },
  {
    id: 'image-converter',
    name: '图片格式转换',
    description: '本地转换 JPG、PNG、WebP 等格式。',
    icon: 'RefreshCcw',
    categoryId: 'image',
    path: '/tools/image-converter',
  },
  {
    id: 'image-to-base64',
    name: '图片转 Base64',
    description: '将本地图片转换为 Base64 字符串。',
    icon: 'FileCode2',
    categoryId: 'image',
    path: '/tools/image-to-base64',
  },
  {
    id: 'image-cropper',
    name: '图片裁剪工具',
    description: '可视化裁剪图片并导出。',
    icon: 'Crop',
    categoryId: 'image',
    path: '/tools/image-cropper',
  },
  {
    id: 'svg-to-png',
    name: 'SVG 转 PNG',
    description: '将 SVG 矢量图导出为 PNG。',
    icon: 'FileImage',
    categoryId: 'image',
    path: '/tools/svg-to-png',
  },
  {
    id: 'timestamp-converter',
    name: '时间戳转换',
    description: 'Unix 时间戳与标准时间互转。',
    icon: 'Calculator',
    categoryId: 'compute',
    path: '/tools/timestamp-converter',
  },
  {
    id: 'base-converter',
    name: '进制转换',
    description: '支持 2~36 进制互转（大整数）。',
    icon: 'Calculator',
    categoryId: 'compute',
    path: '/tools/base-converter',
  },
]

export function getCategoryByName(name: string | null) {
  return TOOL_CATEGORIES.find((category) => category.name === name)
}

export function getToolBySlug(slug: string) {
  return TOOLS.find((tool) => tool.id === slug)
}

export function getToolsByCategoryName(name: string) {
  const category = getCategoryByName(name)
  if (!category) {
    return []
  }

  return TOOLS.filter((tool) => tool.categoryId === category.id)
}
