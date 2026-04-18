<script setup lang="ts">
import { CheckCircle2, Copy, Download, Image as ImageIcon, RefreshCcw, Sparkles, Trash2, Upload } from 'lucide-vue-next'
import { createSvgPreviewUrl, formatBytes, traceBitmapToSvg, type BitmapTraceResult } from '~/lib/imageTools'

const TRACE_RESOLUTION_OPTIONS = [64, 96, 128, 160]
const COLOR_LEVEL_OPTIONS = [
  { value: 2, label: '精简（约 8 色）' },
  { value: 3, label: '平衡（约 27 色）' },
  { value: 4, label: '细节（约 64 色）' },
]

const file = ref<File | null>(null)
const originalUrl = ref('')
const svgUrl = ref('')
const svgText = ref('')
const traceResult = ref<BitmapTraceResult | null>(null)
const traceResolution = ref(128)
const colorLevels = ref(3)
const isDragging = ref(false)
const isTracing = ref(false)
const error = ref('')
const copied = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

let traceJobId = 0
let traceTimer: ReturnType<typeof setTimeout> | null = null

function revokeUrl(url: string) {
  if (url) {
    URL.revokeObjectURL(url)
  }
}

function loadFile(selectedFile: File) {
  const isPng = selectedFile.type === 'image/png' || selectedFile.name.toLowerCase().endsWith('.png')
  if (!isPng) {
    error.value = '请上传 PNG 图片。'
    return
  }

  file.value = selectedFile
  revokeUrl(originalUrl.value)
  revokeUrl(svgUrl.value)
  originalUrl.value = URL.createObjectURL(selectedFile)
  svgUrl.value = ''
  svgText.value = ''
  traceResult.value = null
  error.value = ''
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (selectedFile) {
    loadFile(selectedFile)
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  const selectedFile = event.dataTransfer?.files?.[0]
  if (selectedFile) {
    loadFile(selectedFile)
  }
}

async function runTrace(source: string) {
  traceJobId += 1
  const currentJobId = traceJobId
  isTracing.value = true
  error.value = ''

  try {
    const result = await traceBitmapToSvg(source, {
      maxDimension: traceResolution.value,
      colorLevels: colorLevels.value,
    })

    if (currentJobId !== traceJobId) {
      return
    }

    revokeUrl(svgUrl.value)
    traceResult.value = result
    svgText.value = result.svgText
    svgUrl.value = createSvgPreviewUrl(result.svgText)
  } catch (traceError) {
    if (currentJobId !== traceJobId) {
      return
    }

    error.value = traceError instanceof Error ? traceError.message : 'PNG 转 SVG 失败。'
  } finally {
    if (currentJobId === traceJobId) {
      isTracing.value = false
    }
  }
}

function handleDownload() {
  if (!svgText.value || !file.value) {
    return
  }

  const blob = new Blob([svgText.value], { type: 'image/svg+xml;charset=utf-8' })
  const downloadUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = `${file.value.name.replace(/\.png$/i, '') || 'vectorized-image'}.svg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(downloadUrl)
}

async function handleCopy() {
  if (!svgText.value) {
    return
  }

  try {
    await navigator.clipboard.writeText(svgText.value)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch {
    error.value = '复制 SVG 代码失败，请手动复制文本内容。'
  }
}

function handleClear() {
  file.value = null
  revokeUrl(originalUrl.value)
  revokeUrl(svgUrl.value)
  originalUrl.value = ''
  svgUrl.value = ''
  svgText.value = ''
  traceResult.value = null
  error.value = ''
  copied.value = false
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

watch([originalUrl, traceResolution, colorLevels], ([url]) => {
  if (!url) {
    return
  }

  if (traceTimer) {
    clearTimeout(traceTimer)
  }

  traceTimer = setTimeout(() => {
    void runTrace(url)
  }, 180)
})

onBeforeUnmount(() => {
  if (traceTimer) {
    clearTimeout(traceTimer)
  }
  revokeUrl(originalUrl.value)
  revokeUrl(svgUrl.value)
})
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <Sparkles class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-[#1e293b]">PNG 转 SVG</h1>
            <p class="text-[#64748b] mt-1 text-sm md:text-base">
              将 PNG 图片在本地做色块向量化，适合 Logo、图标、贴纸和扁平插画的快速描摹。
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <NuxtLink to="/tools/svg-to-png" class="px-3 py-2 rounded-lg text-sm font-bold text-[#2563eb] bg-blue-50 hover:bg-blue-100 transition-colors">
            试试 SVG 转 PNG
          </NuxtLink>
          <NuxtLink to="/tools/image-compressor" class="px-3 py-2 rounded-lg text-sm font-bold text-[#475569] bg-slate-100 hover:bg-slate-200 transition-colors">
            先压缩 PNG
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6">
      <div class="space-y-6">
        <div
          v-if="!file"
          :class="[
            'bg-white rounded-2xl border-2 border-dashed transition-all p-12 text-center flex flex-col items-center justify-center min-h-[360px] cursor-pointer',
            isDragging ? 'border-[#2563eb] bg-blue-50/60' : 'border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50',
          ]"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop="handleDrop"
          @click="fileInputRef?.click()"
        >
          <input ref="fileInputRef" type="file" accept="image/png,.png" class="hidden" @change="handleFileChange">
          <div class="w-20 h-20 bg-blue-50 text-[#2563eb] rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Upload class="w-10 h-10" />
          </div>
          <h2 class="text-xl font-bold text-[#1e293b] mb-2">上传 PNG 图片开始描摹</h2>
          <p class="text-[#64748b] mb-6">
            更适合图标、Logo 和低复杂度图形，整个过程保持在浏览器本地完成。
          </p>
          <button class="bg-[#2563eb] text-white px-8 py-3 rounded-full font-bold shadow-sm hover:bg-[#1d4ed8] transition-colors">
            选择 PNG 图片
          </button>
        </div>

        <div v-else class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 space-y-6">
          <div class="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
            <div>
              <h2 class="text-lg font-bold text-[#1e293b]">描摹设置</h2>
              <p class="text-sm text-[#64748b] mt-1">参数越高，细节越多，导出的 SVG 也会更大。</p>
            </div>
            <button
              class="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              @click="handleClear"
            >
              <Trash2 class="w-4 h-4" />重新选择
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-[#475569] mb-2">描摹分辨率</label>
              <select
                v-model="traceResolution"
                class="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 bg-white"
              >
                <option v-for="option in TRACE_RESOLUTION_OPTIONS" :key="option" :value="option">
                  {{ option }}px 网格
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-[#475569] mb-2">颜色层级</label>
              <select
                v-model="colorLevels"
                class="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 bg-white"
              >
                <option v-for="option in COLOR_LEVEL_OPTIONS" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
              <div class="text-xs text-[#64748b] mb-1">源文件</div>
              <div class="font-bold text-[#1e293b] truncate">{{ file.name }}</div>
            </div>
            <div class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
              <div class="text-xs text-[#64748b] mb-1">原图尺寸</div>
              <div class="font-bold text-[#1e293b]">
                {{ traceResult ? `${traceResult.originalWidth} × ${traceResult.originalHeight}` : '--' }}
              </div>
            </div>
            <div class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
              <div class="text-xs text-[#64748b] mb-1">PNG 大小</div>
              <div class="font-bold text-[#1e293b]">{{ formatBytes(file.size) }}</div>
            </div>
            <div class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
              <div class="text-xs text-[#64748b] mb-1">描摹网格</div>
              <div class="font-bold text-[#1e293b]">
                {{ traceResult ? `${traceResult.traceWidth} × ${traceResult.traceHeight}` : '--' }}
              </div>
            </div>
          </div>

          <div v-if="error" class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {{ error }}
          </div>

          <div class="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p class="text-sm text-amber-800 leading-relaxed">
              这是色块向量化效果，不是 AI 描线，更适合图标、Logo、贴纸和扁平图形。照片类素材会得到较强的海报化效果。
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-lg font-bold text-[#1e293b]">预览对比</h2>
            <div
              v-if="svgText && !isTracing"
              class="text-green-600 font-medium flex items-center gap-1.5 text-sm bg-green-50 px-3 py-1.5 rounded-lg border border-green-100"
            >
              <CheckCircle2 class="w-4 h-4" />
              SVG 已生成
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="text-sm font-bold text-[#475569] mb-2">PNG 原图</div>
              <div class="aspect-square rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] overflow-hidden flex items-center justify-center">
                <img v-if="originalUrl" :src="originalUrl" alt="PNG Source" class="w-full h-full object-contain p-4">
                <div v-else class="text-center text-sm text-[#94a3b8] px-6">上传 PNG 后显示预览</div>
              </div>
            </div>

            <div>
              <div class="text-sm font-bold text-[#475569] mb-2">SVG 结果</div>
              <div class="aspect-square rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] overflow-hidden flex items-center justify-center relative">
                <div
                  v-if="isTracing"
                  class="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10"
                >
                  <RefreshCcw class="w-7 h-7 text-[#2563eb] animate-spin mb-2" />
                  <span class="text-sm font-bold text-[#2563eb]">正在生成 SVG...</span>
                </div>

                <img v-if="svgUrl" :src="svgUrl" alt="SVG Result" class="w-full h-full object-contain p-4">
                <div v-else class="text-center text-sm text-[#94a3b8] px-6">生成后显示矢量预览</div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <div class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
              <div class="text-xs text-[#64748b] mb-1">主色数量</div>
              <div class="font-bold text-[#1e293b]">{{ traceResult?.colorCount ?? '--' }}</div>
            </div>
            <div class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
              <div class="text-xs text-[#64748b] mb-1">矢量片段</div>
              <div class="font-bold text-[#1e293b]">{{ traceResult?.segmentCount ?? '--' }}</div>
            </div>
            <div class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
              <div class="text-xs text-[#64748b] mb-1">输出类型</div>
              <div class="font-bold text-[#1e293b]">SVG 色块描摹</div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 mt-5">
            <button
              :disabled="!svgText"
              class="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
              @click="handleDownload"
            >
              <Download class="w-5 h-5" />
              下载 SVG
            </button>
            <button
              :disabled="!svgText"
              class="bg-slate-100 hover:bg-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-[#334155] px-5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
              @click="handleCopy"
            >
              <Copy class="w-4 h-4" />
              {{ copied ? '已复制 SVG 代码' : '复制 SVG 代码' }}
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
          <div class="flex items-center gap-2 mb-3">
            <ImageIcon class="w-5 h-5 text-[#2563eb]" />
            <h2 class="text-lg font-bold text-[#1e293b]">SVG 代码</h2>
          </div>
          <textarea
            readonly
            :value="svgText"
            placeholder="生成后的 SVG 代码会显示在这里，方便直接复制到前端项目或设计工具中。"
            class="w-full min-h-[220px] rounded-2xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-4 text-[13px] text-[#1e293b] outline-none"
          />
        </div>
      </div>
    </div>

    <div class="bg-[#f8fafc] rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
      <div class="prose max-w-none text-[14px] leading-loose text-[#475569]">
        <p class="mb-4">
          PNG 转 SVG 适合把位图图标、贴纸和 Logo 快速重整为更容易缩放和排版的矢量资源。参数越高，细节越丰富，但文件也会相应变大。
        </p>
      </div>
    </div>
  </div>
</template>
