export interface SvgMetadata {
  width: number | null
  height: number | null
  viewBoxWidth: number | null
  viewBoxHeight: number | null
  aspectRatio: number
}

export interface SvgToPngResult {
  blob: Blob
  width: number
  height: number
}

const SVG_MIME_TYPE = 'image/svg+xml;charset=utf-8'

export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  )

  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 2)} ${units[index]}`
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('读取文件失败，请重试。'))
    reader.readAsText(file, 'utf-8')
  })
}

export function createSvgPreviewUrl(svgText: string): string {
  return URL.createObjectURL(new Blob([svgText], { type: SVG_MIME_TYPE }))
}

export function getSvgMetadata(svgText: string): SvgMetadata | null {
  const documentNode = new DOMParser().parseFromString(svgText, 'image/svg+xml')
  if (documentNode.querySelector('parsererror')) {
    return null
  }

  const svgElement = documentNode.documentElement
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    return null
  }

  const width = parseNumericSvgSize(svgElement.getAttribute('width'))
  const height = parseNumericSvgSize(svgElement.getAttribute('height'))
  const viewBoxValues = svgElement
    .getAttribute('viewBox')
    ?.trim()
    .split(/[\s,]+/)
    .map((value) => Number(value))

  const viewBoxWidth =
    viewBoxValues?.length === 4 && Number.isFinite(viewBoxValues[2]) && viewBoxValues[2] > 0
      ? viewBoxValues[2]
      : null
  const viewBoxHeight =
    viewBoxValues?.length === 4 && Number.isFinite(viewBoxValues[3]) && viewBoxValues[3] > 0
      ? viewBoxValues[3]
      : null

  const fallbackWidth = width ?? viewBoxWidth ?? 1
  const fallbackHeight = height ?? viewBoxHeight ?? 1
  const aspectRatio = fallbackWidth > 0 && fallbackHeight > 0 ? fallbackWidth / fallbackHeight : 1

  return {
    width,
    height,
    viewBoxWidth,
    viewBoxHeight,
    aspectRatio: Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 1,
  }
}

export async function convertSvgTextToPng(
  svgText: string,
  options: { width?: number; height?: number } = {},
): Promise<SvgToPngResult> {
  const metadata = getSvgMetadata(svgText)
  if (!metadata) {
    throw new Error('请输入有效的 SVG 代码或上传 SVG 文件。')
  }

  const svgUrl = createSvgPreviewUrl(svgText)

  try {
    const image = await loadImage(svgUrl)
    const { width, height } = resolveSvgOutputSize(metadata, image, options)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('当前浏览器不支持 Canvas，无法完成转换。')
    }

    context.clearRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)

    const blob = await canvasToBlob(canvas, 'image/png')
    return { blob, width, height }
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

function parseNumericSvgSize(value: string | null): number | null {
  if (!value) {
    return null
  }

  const normalized = value.trim().replace(/px$/i, '')
  const parsedValue = Number(normalized)
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null
}

function resolveSvgOutputSize(
  metadata: SvgMetadata,
  image: HTMLImageElement,
  options: { width?: number; height?: number },
) {
  const intrinsicWidth = image.naturalWidth || metadata.width || metadata.viewBoxWidth || 512
  const intrinsicHeight = image.naturalHeight || metadata.height || metadata.viewBoxHeight || 512
  const aspectRatio = metadata.aspectRatio || intrinsicWidth / intrinsicHeight || 1

  let width = options.width ?? null
  let height = options.height ?? null

  if (width && !height) {
    height = Math.round(width / aspectRatio)
  }

  if (height && !width) {
    width = Math.round(height * aspectRatio)
  }

  if (!width && !height) {
    width = intrinsicWidth
    height = intrinsicHeight
  }

  return {
    width: Math.max(1, Math.round(width ?? intrinsicWidth)),
    height: Math.max(1, Math.round(height ?? intrinsicHeight)),
  }
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('图片加载失败，请检查文件内容后重试。'))
    image.src = source
  })
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('生成文件失败，请重试。'))
        return
      }

      resolve(blob)
    }, mimeType, quality)
  })
}
