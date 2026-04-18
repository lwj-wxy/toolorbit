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
  { id: 'text', name: '文本排版' },
  { id: 'generator', name: '生成器' },
  { id: 'commerce', name: '电商工具' },
  { id: 'pdf', name: 'PDF工具' },
  { id: 'image', name: '图片处理' },
  { id: 'compute', name: '计算转换' },
]

export const TOOLS: ToolItem[] = [
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '提供美化、压缩、验证等全方位 JSON 数据处理服务。',
    icon: 'Code2',
    categoryId: 'developer',
    path: '/tools/json-formatter',
  },
  {
    id: 'base64',
    name: 'Base64 编解码',
    description: '网页端快速编解码工具，完美支持 UTF-8 中文字符集。',
    icon: 'Binary',
    categoryId: 'developer',
    path: '/tools/base64',
  },
  {
    id: 'url-encoder',
    name: 'URL 编解码',
    description: '安全地编码网页链接，或将其解码为可读的标准格式。',
    icon: 'Link',
    categoryId: 'webmaster',
    path: '/tools/url-encoder',
  },
  {
    id: 'hash-generator',
    name: '哈希生成器',
    description: '快速生成安全的 MD5 等同类的 SHA-1、SHA-256、SHA-512 会话摘要信息。',
    icon: 'Hash',
    categoryId: 'developer',
    path: '/tools/hash-generator',
  },
  {
    id: 'uuid-generator',
    name: 'UUID 在线生成',
    description: '快速批量生成 RFC 4122 风格 UUID，支持去除横线并一键复制结果。',
    icon: 'Fingerprint',
    categoryId: 'developer',
    path: '/tools/uuid-generator',
  },
  {
    id: 'text-analyzer',
    name: '文本分析器',
    description: '在线统计字数、字符数、段落数并分析文本频率占比。',
    icon: 'Type',
    categoryId: 'text',
    path: '/tools/text-analyzer',
  },
  {
    id: 'qr-generator',
    name: '二维码生成器',
    description: '一键生成高清可定制的二维码，支持网址、文本或联系人信息。',
    icon: 'QrCode',
    categoryId: 'generator',
    path: '/tools/qr-generator',
  },
  {
    id: 'etsy-fee-calculator',
    name: 'Etsy 利润计算器',
    description: '精确计算 Etsy 的上架费、交易费及支付处理费，掌握真实利润。',
    icon: 'ShoppingCart',
    categoryId: 'commerce',
    path: '/tools/etsy-fee-calculator',
  },
  {
    id: 'stripe-fee-calculator',
    name: 'Stripe 手续费计算器',
    description: '计算 Stripe 收款产生的手续费用，快速预估实际到账金额。',
    icon: 'CreditCard',
    categoryId: 'commerce',
    path: '/tools/stripe-fee-calculator',
  },
  {
    id: 'listing-craft-ai',
    name: 'Listing Craft AI',
    description: '内置大模型，一键生成高转化率、带SEO结构的跨境商品 Listing。',
    icon: 'Sparkles',
    categoryId: 'commerce',
    path: '/tools/listing-craft-ai',
  },
  {
    id: 'pdf-merge',
    name: 'PDF合并',
    description: '免费、快速地将多个PDF文件合并为一个文件。',
    icon: 'Files',
    categoryId: 'pdf',
    path: '/tools/pdf-merge',
  },
  {
    id: 'pdf-split',
    name: 'PDF拆分',
    description: '轻松提取PDF页面，或将大型PDF拆分为多个小文件。',
    icon: 'FileText',
    categoryId: 'pdf',
    path: '/tools/pdf-split',
  },
  {
    id: 'pdf-to-image',
    name: 'PDF转图片',
    description: '将PDF文档的每一页高质量转换为 JPG 或 PNG 格式图片。',
    icon: 'FileImage',
    categoryId: 'pdf',
    path: '/tools/pdf-to-image',
  },
  {
    id: 'image-to-pdf',
    name: '图片转PDF',
    description: '上传JPG、PNG图片文件并快速打包合并成一个PDF文档。',
    icon: 'Image',
    categoryId: 'pdf',
    path: '/tools/image-to-pdf',
  },
  {
    id: 'image-compressor',
    name: '图片在线压缩',
    description: '在保持画质的前提下，大幅缩小图片体积，提升网页加载速度。',
    icon: 'ImageMinus',
    categoryId: 'image',
    path: '/tools/image-compressor',
  },
  {
    id: 'svg-to-png',
    name: 'SVG 转 PNG',
    description: '上传 SVG 或粘贴代码，在本地浏览器中快速导出高清 PNG 图片。',
    icon: 'FileImage',
    categoryId: 'image',
    path: '/tools/svg-to-png',
  },
  {
    id: 'timestamp-converter',
    name: '时间戳转换',
    description: 'Unix 时间戳与标准北京时间相互转换计算。',
    icon: 'Calculator',
    categoryId: 'compute',
    path: '/tools/timestamp-converter',
  },
  {
    id: 'image-converter',
    name: '图片格式转换',
    description: '在本地瞬间将图片互转为 JPG、PNG、WebP 等格式。',
    icon: 'RefreshCcw',
    categoryId: 'image',
    path: '/tools/image-converter',
  },
  {
    id: 'image-to-base64',
    name: '图片转 Base64',
    description: '将本地图片转换为 Base64 编码，可直接用于 HTML/CSS 减少 HTTP 请求。',
    icon: 'FileCode2',
    categoryId: 'image',
    path: '/tools/image-to-base64',
  },
  {
    id: 'image-cropper',
    name: '图片裁剪选区',
    description: '通过可视化选区自由裁剪您的图片，并精准提取缩略图。',
    icon: 'Crop',
    categoryId: 'image',
    path: '/tools/image-cropper',
  },
  {
    id: 'office-to-pdf',
    name: '文档转 PDF',
    description: '将 Word, PPT, Excel 转为高保真的 PDF 文档。',
    icon: 'FileBadge2',
    categoryId: 'pdf',
    path: '/tools/office-to-pdf',
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
