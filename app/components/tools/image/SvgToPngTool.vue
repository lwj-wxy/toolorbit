<script setup lang="ts">
import { CheckCircle2, Code2, Download, FileImage, Image as ImageIcon, RefreshCcw, Trash2, Upload } from 'lucide-vue-next'
import { convertSvgTextToPng, createSvgPreviewUrl, formatBytes, getSvgMetadata, readFileAsText, type SvgMetadata } from '~/lib/imageTools'

const svgText = ref('')
const sourceName = ref('vector-image')
const svgPreviewUrl = ref('')
const pngUrl = ref('')
const pngBlob = ref<Blob | null>(null)
const sourceMeta = ref<SvgMetadata | null>(null)
const outputWidth = ref('')
const outputHeight = ref('')
const isDragging = ref(false)
const isConverting = ref(false)
const error = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

function parsePositiveNumber(value: string) {
  if (!value.trim()) {
    return undefined
  }

  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : undefined
}

function revokeUrl(url: string) {
  if (url) {
    URL.revokeObjectURL(url)
  }
}

function resetOutput() {
  pngBlob.value = null
  revokeUrl(pngUrl.value)
  pngUrl.value = ''
  error.value = ''
}

function applySvgSource(text: string, nextSourceName?: string) {
  svgText.value = text
  sourceName.value = nextSourceName ?? sourceName.value
  resetOutput()

  const metadata = getSvgMetadata(text)
  if (!metadata) {
    return
  }

  outputWidth.value = metadata.width
    ? String(Math.round(metadata.width))
    : metadata.viewBoxWidth
      ? String(Math.round(metadata.viewBoxWidth))
      : ''
  outputHeight.value = metadata.height
    ? String(Math.round(metadata.height))
    : metadata.viewBoxHeight
      ? String(Math.round(metadata.viewBoxHeight))
      : ''
}

async function loadSvgFile(file: File) {
  const isSvgFile = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')
  if (!isSvgFile) {
    error.value = '请上传 SVG 文件。'
    return
  }

  try {
    const text = await readFileAsText(file)
    if (!getSvgMetadata(text)) {
      throw new Error('这个文件不是有效的 SVG。')
    }

    applySvgSource(text, file.name.replace(/\.svg$/i, ''))
  } catch (loadError) {
    error.value = loadError instanceof Error ? loadError.message : 'SVG 文件读取失败。'
  }
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (selectedFile) {
    void loadSvgFile(selectedFile)
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  const selectedFile = event.dataTransfer?.files?.[0]
  if (selectedFile) {
    void loadSvgFile(selectedFile)
  }
}

async function handleConvert() {
  if (!svgText.value.trim()) {
    error.value = '请先上传 SVG 文件或粘贴 SVG 代码。'
    return
  }

  const width = parsePositiveNumber(outputWidth.value)
  const height = parsePositiveNumber(outputHeight.value)

  if (outputWidth.value.trim() && !width) {
    error.value = '输出宽度请输入大于 0 的数字。'
    return
  }

  if (outputHeight.value.trim() && !height) {
    error.value = '输出高度请输入大于 0 的数字。'
    return
  }

  isConverting.value = true
  error.value = ''

  try {
    const result = await convertSvgTextToPng(svgText.value, { width, height })
    revokeUrl(pngUrl.value)
    pngBlob.value = result.blob
    pngUrl.value = URL.createObjectURL(result.blob)
    outputWidth.value = String(result.width)
    outputHeight.value = String(result.height)
  } catch (convertError) {
    error.value = convertError instanceof Error ? convertError.message : 'SVG 转 PNG 失败。'
  } finally {
    isConverting.value = false
  }
}

function handleDownload() {
  if (!pngUrl.value) {
    return
  }

  const link = document.createElement('a')
  link.href = pngUrl.value
  link.download = `${sourceName.value || 'vector-image'}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function handleClear() {
  svgText.value = ''
  revokeUrl(svgPreviewUrl.value)
  svgPreviewUrl.value = ''
  revokeUrl(pngUrl.value)
  pngUrl.value = ''
  pngBlob.value = null
  sourceMeta.value = null
  outputWidth.value = ''
  outputHeight.value = ''
  error.value = ''
  sourceName.value = 'vector-image'
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

watch(svgText, (value) => {
  revokeUrl(svgPreviewUrl.value)
  svgPreviewUrl.value = ''
  sourceMeta.value = null

  if (!value.trim()) {
    return
  }

  const metadata = getSvgMetadata(value)
  sourceMeta.value = metadata
  if (metadata) {
    svgPreviewUrl.value = createSvgPreviewUrl(value)
  }
})

onBeforeUnmount(() => {
  revokeUrl(svgPreviewUrl.value)
  revokeUrl(pngUrl.value)
})
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <FileImage class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-[#1e293b]">SVG 转 PNG</h1>
            <p class="text-[#64748b] mt-1 text-sm md:text-base">
              支持上传 SVG 文件或直接粘贴代码，在浏览器本地完成渲染、缩放和导出。
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <NuxtLink to="/tools/png-to-svg" class="px-3 py-2 rounded-lg text-sm font-bold text-[#2563eb] bg-blue-50 hover:bg-blue-100 transition-colors">
            试试 PNG 转 SVG
          </NuxtLink>
          <NuxtLink to="/tools/image-converter" class="px-3 py-2 rounded-lg text-sm font-bold text-[#475569] bg-slate-100 hover:bg-slate-200 transition-colors">
            通用图片转换
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
      <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 space-y-6">
        <div
          :class="[
            'rounded-2xl border-2 border-dashed transition-all p-8 text-center flex flex-col items-center justify-center min-h-[220px] cursor-pointer',
            isDragging ? 'border-[#2563eb] bg-blue-50/60' : 'border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50',
          ]"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop="handleDrop"
          @click="fileInputRef?.click()"
        >
          <input ref="fileInputRef" type="file" accept=".svg,image/svg+xml" class="hidden" @change="handleFileChange">
          <div class="w-16 h-16 bg-blue-50 text-[#2563eb] rounded-full flex items-center justify-center mb-5 shadow-sm">
            <Upload class="w-8 h-8" />
          </div>
          <h2 class="text-xl font-bold text-[#1e293b] mb-2">拖拽 SVG 文件到这里</h2>
          <p class="text-[#64748b] mb-5">或点击选择本地 SVG 文件，自动载入源码并生成预览</p>
          <button class="bg-white border border-[#cbd5e1] text-[#0f172a] px-5 py-2.5 rounded-lg font-bold shadow-sm hover:border-[#94a3b8] hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Upload class="w-4 h-4" />
            选择 SVG 文件
          </button>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-[15px] font-bold text-[#1e293b] flex items-center gap-2">
              <Code2 class="w-4 h-4 text-[#2563eb]" />
              SVG 代码
            </label>
            <span
              v-if="sourceMeta"
              class="text-xs font-medium text-[#64748b] bg-slate-100 px-2.5 py-1 rounded-md"
            >
              原始尺寸 {{ Math.round(sourceMeta.width ?? sourceMeta.viewBoxWidth ?? 0) }} ×
              {{ Math.round(sourceMeta.height ?? sourceMeta.viewBoxHeight ?? 0) }}
            </span>
          </div>
          <textarea
            v-model="svgText"
            placeholder="<svg>...</svg>"
            class="w-full min-h-[240px] rounded-2xl border border-[#cbd5e1] bg-white px-4 py-4 text-[14px] text-[#1e293b] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
            @input="resetOutput"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-[#475569] mb-2">输出宽度（可选）</label>
            <input
              v-model="outputWidth"
              type="number"
              min="1"
              placeholder="例如 1024"
              class="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
            >
          </div>
          <div>
            <label class="block text-sm font-bold text-[#475569] mb-2">输出高度（可选）</label>
            <input
              v-model="outputHeight"
              type="number"
              min="1"
              placeholder="例如 1024"
              class="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
            >
          </div>
        </div>

        <div v-if="error" class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {{ error }}
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            :disabled="isConverting"
            class="bg-[#10b981] hover:bg-[#059669] disabled:bg-emerald-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_2px_10px_rgba(16,185,129,0.2)] flex items-center gap-2"
            @click="handleConvert"
          >
            <template v-if="isConverting">
              <RefreshCcw class="w-5 h-5 animate-spin" />
              正在转换...
            </template>
            <template v-else>
              <ImageIcon class="w-5 h-5" />
              转换为 PNG
            </template>
          </button>

          <button
            class="bg-slate-100 hover:bg-slate-200 text-[#334155] px-5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
            @click="handleClear"
          >
            <Trash2 class="w-4 h-4" />
            清空内容
          </button>

          <button
            v-if="pngUrl"
            class="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_2px_10px_rgba(37,99,235,0.2)] flex items-center gap-2"
            @click="handleDownload"
          >
            <Download class="w-5 h-5" />
            下载 PNG
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-lg font-bold text-[#1e293b]">预览与结果</h2>
            <div
              v-if="pngBlob"
              class="text-green-600 font-medium flex items-center gap-1.5 text-sm bg-green-50 px-3 py-1.5 rounded-lg border border-green-100"
            >
              <CheckCircle2 class="w-4 h-4" />
              转换成功
            </div>
          </div>

          <div class="space-y-5">
            <div>
              <div class="text-sm font-bold text-[#475569] mb-2">SVG 预览</div>
              <div class="aspect-[4/3] rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] overflow-hidden flex items-center justify-center">
                <img v-if="svgPreviewUrl" :src="svgPreviewUrl" alt="SVG Preview" class="w-full h-full object-contain p-4">
                <div v-else class="text-center text-sm text-[#94a3b8] px-6">
                  上传 SVG 文件或粘贴代码后，这里会显示矢量预览。
                </div>
              </div>
            </div>

            <div>
              <div class="text-sm font-bold text-[#475569] mb-2">PNG 输出</div>
              <div class="aspect-[4/3] rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] overflow-hidden flex items-center justify-center">
                <img v-if="pngUrl" :src="pngUrl" alt="PNG Result" class="w-full h-full object-contain p-4">
                <div v-else class="text-center text-sm text-[#94a3b8] px-6">
                  点击“转换为 PNG”后，这里会显示导出的位图结果。
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
            <div class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
              <div class="text-xs text-[#64748b] mb-1">输出尺寸</div>
              <div class="font-bold text-[#1e293b]">{{ outputWidth || '--' }} × {{ outputHeight || '--' }}</div>
            </div>
            <div class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
              <div class="text-xs text-[#64748b] mb-1">PNG 大小</div>
              <div class="font-bold text-[#1e293b]">{{ pngBlob ? formatBytes(pngBlob.size) : '--' }}</div>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3">
          <h3 class="text-[15px] font-bold text-[#1e3a8a]">使用提示</h3>
          <p class="text-sm text-[#1d4ed8] leading-relaxed">
            宽高任意留空时，会自动按 SVG 原始比例补齐。整个转换过程都在浏览器本地完成，不会上传服务器。
          </p>
        </div>
      </div>
    </div>

    <div class="bg-[#f8fafc] rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
      <div class="prose max-w-none text-[14px] leading-loose text-[#475569]">
        <p class="mb-4">
          SVG 转 PNG 适合把 Logo、插画和图标等矢量资源导出为位图，便于在社媒封面、电商主图或旧平台素材中直接使用。
        </p>
      </div>
    </div>
  </div>
</template>
