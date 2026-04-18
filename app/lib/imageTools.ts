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

export interface BitmapTraceOptions {
  maxDimension: number
  colorLevels: number
  alphaThreshold?: number
}

export interface BitmapTraceResult {
  svgText: string
  traceWidth: number
  traceHeight: number
  segmentCount: number
  colorCount: number
  originalWidth: number
  originalHeight: number
}

interface VectorSegment {
  x: number
  y: number
  width: number
  height: number
  fill: string
  opacity: number
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

export async function traceBitmapToSvg(
  sourceUrl: string,
  options: BitmapTraceOptions,
): Promise<BitmapTraceResult> {
  const image = await loadImage(sourceUrl)
  const originalWidth = image.naturalWidth || image.width
  const originalHeight = image.naturalHeight || image.height
  const { width: traceWidth, height: traceHeight } = scaleToFit(
    originalWidth,
    originalHeight,
    options.maxDimension,
  )

  const canvas = document.createElement('canvas')
  canvas.width = traceWidth
  canvas.height = traceHeight

  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) {
    throw new Error('当前浏览器不支持 Canvas，无法完成描摹。')
  }

  context.imageSmoothingEnabled = true
  context.drawImage(image, 0, 0, traceWidth, traceHeight)

  const { segments, colorCount } = rasterToSegments(
    context.getImageData(0, 0, traceWidth, traceHeight).data,
    traceWidth,
    traceHeight,
    options.colorLevels,
    options.alphaThreshold ?? 12,
  )

  const svgText = buildSegmentSvg(
    segments,
    traceWidth,
    traceHeight,
    originalWidth,
    originalHeight,
  )

  return {
    svgText,
    traceWidth,
    traceHeight,
    segmentCount: segments.length,
    colorCount,
    originalWidth,
    originalHeight,
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

function scaleToFit(width: number, height: number, maxDimension: number) {
  if (width <= 0 || height <= 0) {
    return { width: 1, height: 1 }
  }

  const ratio = Math.min(1, maxDimension / Math.max(width, height))

  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  }
}

function rasterToSegments(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  colorLevels: number,
  alphaThreshold: number,
) {
  const segments: VectorSegment[] = []
  const colorKeys = new Set<string>()
  let activeRuns = new Map<string, VectorSegment>()

  for (let y = 0; y < height; y += 1) {
    const rowRuns: VectorSegment[] = []
    let x = 0

    while (x < width) {
      const pixel = quantizePixel(data, (y * width + x) * 4, colorLevels, alphaThreshold)
      if (!pixel) {
        x += 1
        continue
      }

      let runWidth = 1

      while (x + runWidth < width) {
        const nextPixel = quantizePixel(
          data,
          (y * width + x + runWidth) * 4,
          colorLevels,
          alphaThreshold,
        )

        if (!nextPixel || nextPixel.key !== pixel.key) {
          break
        }

        runWidth += 1
      }

      colorKeys.add(pixel.fill)
      rowRuns.push({
        x,
        y,
        width: runWidth,
        height: 1,
        fill: pixel.fill,
        opacity: pixel.opacity,
      })
      x += runWidth
    }

    const nextRuns = new Map<string, VectorSegment>()

    for (const run of rowRuns) {
      const runKey = `${run.x}:${run.width}:${run.fill}:${run.opacity}`
      const previousRun = activeRuns.get(runKey)

      if (previousRun && previousRun.y + previousRun.height === y) {
        previousRun.height += 1
        nextRuns.set(runKey, previousRun)
        continue
      }

      segments.push(run)
      nextRuns.set(runKey, run)
    }

    activeRuns = nextRuns
  }

  return {
    segments,
    colorCount: colorKeys.size,
  }
}

function quantizePixel(
  data: Uint8ClampedArray,
  offset: number,
  colorLevels: number,
  alphaThreshold: number,
) {
  const alpha = data[offset + 3]
  if (alpha < alphaThreshold) {
    return null
  }

  const red = quantizeChannel(data[offset], colorLevels)
  const green = quantizeChannel(data[offset + 1], colorLevels)
  const blue = quantizeChannel(data[offset + 2], colorLevels)
  const opacity = quantizeAlpha(alpha)
  const fill = rgbToHex(red, green, blue)

  return {
    fill,
    opacity,
    key: `${fill}|${opacity}`,
  }
}

function quantizeChannel(channel: number, colorLevels: number): number {
  if (colorLevels <= 1) {
    return channel
  }

  const step = 255 / (colorLevels - 1)
  return Math.max(0, Math.min(255, Math.round(channel / step) * step))
}

function quantizeAlpha(alpha: number): number {
  if (alpha >= 248) {
    return 1
  }

  return Math.max(0.25, Math.round((alpha / 255) * 4) / 4)
}

function rgbToHex(red: number, green: number, blue: number): string {
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`
}

function toHex(value: number): string {
  return value.toString(16).padStart(2, '0')
}

function buildSegmentSvg(
  segments: VectorSegment[],
  traceWidth: number,
  traceHeight: number,
  originalWidth: number,
  originalHeight: number,
) {
  const groupedPaths = new Map<string, { fill: string; opacity: number; commands: string[] }>()

  for (const segment of segments) {
    const groupKey = `${segment.fill}|${segment.opacity}`
    const currentGroup = groupedPaths.get(groupKey) ?? {
      fill: segment.fill,
      opacity: segment.opacity,
      commands: [],
    }

    currentGroup.commands.push(
      `M${segment.x} ${segment.y}h${segment.width}v${segment.height}H${segment.x}Z`,
    )
    groupedPaths.set(groupKey, currentGroup)
  }

  const pathMarkup = Array.from(groupedPaths.values())
    .map((group) => {
      const opacityAttribute =
        group.opacity < 1 ? ` fill-opacity="${group.opacity.toFixed(2)}"` : ''
      return `<path fill="${group.fill}"${opacityAttribute} d="${group.commands.join('')}" />`
    })
    .join('')

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${originalWidth}" height="${originalHeight}" viewBox="0 0 ${traceWidth} ${traceHeight}" shape-rendering="crispEdges">`,
    pathMarkup,
    '</svg>',
  ].join('')
}
