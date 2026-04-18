<script setup lang="ts">
import { Download, FileImage, RefreshCcw, Trash2, Upload } from 'lucide-vue-next'
import { convertSvgTextToPng, createSvgPreviewUrl, formatBytes, getSvgMetadata, readFileAsText, type SvgMetadata } from '~/lib/imageTools'

const svgText = ref('')
const sourceName = ref('vector-image')
const svgPreviewUrl = ref('')
const pngUrl = ref('')
const pngBlob = ref<Blob | null>(null)
const sourceMeta = ref<SvgMetadata | null>(null)
const outputWidth = ref<string | number>('')
const outputHeight = ref<string | number>('')
const isDragging = ref(false)
const isConverting = ref(false)
const error = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)
const hasSource = computed(() => Boolean(sourceMeta.value && normalizeText(svgText.value)))

function normalizeText(value: unknown) {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (value === null || value === undefined) {
    return ''
  }

  return String(value).trim()
}

function parsePositiveNumber(value: unknown) {
  const normalized = normalizeText(value)
  if (!normalized) {
    return undefined
  }

  const parsedValue = Number(normalized)
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
  const metadata = getSvgMetadata(text)
  if (!metadata) {
    throw new Error('这个文件不是有效的 SVG。')
  }

  svgText.value = text
  sourceName.value = nextSourceName ?? sourceName.value
  sourceMeta.value = metadata
  resetOutput()
  revokeUrl(svgPreviewUrl.value)
  svgPreviewUrl.value = createSvgPreviewUrl(text)

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
  if (!normalizeText(svgText.value)) {
    error.value = '请先上传 SVG 文件。'
    return
  }

  const width = parsePositiveNumber(outputWidth.value)
  const height = parsePositiveNumber(outputHeight.value)

  if (normalizeText(outputWidth.value) && !width) {
    error.value = '输出宽度请输入大于 0 的数字。'
    return
  }

  if (normalizeText(outputHeight.value) && !height) {
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

onBeforeUnmount(() => {
  revokeUrl(svgPreviewUrl.value)
  revokeUrl(pngUrl.value)
})
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <FileImage class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-[#1e293b]">SVG 转 PNG</h1>
            <p class="text-[#64748b] mt-1 text-sm md:text-base">
              上传 SVG 文件，设置导出尺寸后，一键转换为 PNG。
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <NuxtLink to="/tools/image-converter" class="px-3 py-2 rounded-lg text-sm font-bold text-[#2563eb] bg-blue-50 hover:bg-blue-100 transition-colors">
            通用图片转换
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 space-y-6">
      <div
        :class="[
          'rounded-2xl border-2 border-dashed transition-all p-10 text-center flex flex-col items-center justify-center min-h-[240px] cursor-pointer',
          isDragging ? 'border-[#2563eb] bg-blue-50/60' : 'border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50',
        ]"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop="handleDrop"
        @click="fileInputRef?.click()"
      >
        <input ref="fileInputRef" type="file" accept=".svg,image/svg+xml" class="hidden" @change="handleFileChange">
        <div v-if="hasSource" class="w-28 h-28 rounded-2xl border border-[#dbe6f3] bg-white shadow-sm overflow-hidden flex items-center justify-center mb-5 p-3">
          <img v-if="svgPreviewUrl" :src="svgPreviewUrl" alt="SVG Preview" class="max-w-full max-h-full object-contain">
          <FileImage v-else class="w-10 h-10 text-[#2563eb]" />
        </div>
        <div v-else class="w-16 h-16 bg-blue-50 text-[#2563eb] rounded-full flex items-center justify-center mb-5 shadow-sm">
          <Upload class="w-8 h-8" />
        </div>
        <h2 class="text-xl font-bold text-[#1e293b] mb-2">
          {{ hasSource ? 'SVG 文件已上传' : '拖拽 SVG 文件到这里' }}
        </h2>
        <p v-if="hasSource" class="text-[#1e293b] font-bold mb-2">{{ sourceName }}.svg</p>
        <p class="text-[#64748b] mb-5">
          <template v-if="hasSource">
            原始尺寸
            {{ Math.round(sourceMeta?.width ?? sourceMeta?.viewBoxWidth ?? 0) }} ×
            {{ Math.round(sourceMeta?.height ?? sourceMeta?.viewBoxHeight ?? 0) }}，点击可重新选择文件
          </template>
          <template v-else>
            或点击选择本地 SVG 文件，上传后即可直接转换
          </template>
        </p>
        <button class="bg-white border border-[#cbd5e1] text-[#0f172a] px-5 py-2.5 rounded-lg font-bold shadow-sm hover:border-[#94a3b8] hover:bg-slate-50 transition-colors flex items-center gap-2">
          <Upload class="w-4 h-4" />
          {{ hasSource ? '重新选择 SVG 文件' : '选择 SVG 文件' }}
        </button>
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
            <FileImage class="w-5 h-5" />
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

        <div
          v-if="pngBlob"
          class="text-green-600 font-medium flex items-center gap-1.5 text-sm bg-green-50 px-3 py-2 rounded-lg border border-green-100"
        >
          <CheckCircle2 class="w-4 h-4" />
          转换成功
        </div>
      </div>

      <div v-if="pngBlob" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
          <div class="text-xs text-[#64748b] mb-1">输出尺寸</div>
          <div class="font-bold text-[#1e293b]">{{ outputWidth || '--' }} × {{ outputHeight || '--' }}</div>
        </div>
        <div class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
          <div class="text-xs text-[#64748b] mb-1">PNG 大小</div>
          <div class="font-bold text-[#1e293b]">{{ formatBytes(pngBlob.size) }}</div>
        </div>
      </div>
    </div>

    <div class="bg-[#f8fafc] rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
      <div class="prose max-w-none text-[14px] leading-loose text-[#475569]">
        <p class="mb-0">
          直接上传 SVG 文件即可使用。宽高任意留空时，会自动按 SVG 原始比例补齐。
        </p>
      </div>
    </div>
  </div>
</template>
