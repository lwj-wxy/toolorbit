<script setup lang="ts">
import { ArrowRight, CheckCircle2, Download, Image as ImageIcon, Settings, Trash2, Upload, Zap } from 'lucide-vue-next'

const file = ref<File | null>(null)
const originalUrl = ref('')
const compressedUrl = ref('')
const compressedBlob = ref<Blob | null>(null)
const quality = ref(80)
const targetFormat = ref('image/jpeg')
const isCompressing = ref(false)
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

let recompressTimer: ReturnType<typeof setTimeout> | null = null

function formatSize(bytes: number) {
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

function revokeUrl(url: string) {
  if (url) {
    URL.revokeObjectURL(url)
  }
}

function resetCompressedOutput() {
  revokeUrl(compressedUrl.value)
  compressedUrl.value = ''
  compressedBlob.value = null
}

function triggerCompression(sourceUrl: string, nextQuality: number, nextFormat: string) {
  isCompressing.value = true

  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.onload = () => {
    const canvas = document.createElement('canvas')
    const maxWidth = 3840
    const maxHeight = 2160
    let width = image.width
    let height = image.height

    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width)
      width = maxWidth
    }

    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height)
      height = maxHeight
    }

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) {
      isCompressing.value = false
      return
    }

    if (nextFormat === 'image/jpeg') {
      context.fillStyle = '#FFFFFF'
      context.fillRect(0, 0, width, height)
    }

    context.drawImage(image, 0, 0, width, height)

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resetCompressedOutput()
          compressedBlob.value = blob
          compressedUrl.value = URL.createObjectURL(blob)
        }
        isCompressing.value = false
      },
      nextFormat,
      nextQuality / 100,
    )
  }
  image.onerror = () => {
    isCompressing.value = false
  }
  image.src = sourceUrl
}

function loadAndCompressFile(selectedFile: File, nextQuality: number, nextFormat: string) {
  file.value = selectedFile

  revokeUrl(originalUrl.value)
  originalUrl.value = URL.createObjectURL(selectedFile)

  let format = nextFormat
  if (selectedFile.type === 'image/png') {
    format = 'image/webp'
    targetFormat.value = 'image/webp'
  } else {
    format = 'image/jpeg'
    targetFormat.value = 'image/jpeg'
  }

  triggerCompression(originalUrl.value, nextQuality, format)
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (selectedFile) {
    loadAndCompressFile(selectedFile, quality.value, targetFormat.value)
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false

  const droppedFile = event.dataTransfer?.files?.[0]
  if (!droppedFile) {
    return
  }

  if (!droppedFile.type.startsWith('image/')) {
    window.alert('请上传图片文件。')
    return
  }

  loadAndCompressFile(droppedFile, quality.value, targetFormat.value)
}

function clearFile() {
  file.value = null
  revokeUrl(originalUrl.value)
  originalUrl.value = ''
  resetCompressedOutput()
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function downloadCompressed() {
  if (!compressedUrl.value || !file.value) {
    return
  }

  const link = document.createElement('a')
  link.href = compressedUrl.value
  const fileName = file.value.name.replace(/\.[^/.]+$/, '')
  const extension =
    targetFormat.value === 'image/jpeg'
      ? 'jpg'
      : targetFormat.value === 'image/webp'
        ? 'webp'
        : 'png'
  link.download = `${fileName}-compressed.${extension}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

watch([quality, targetFormat], () => {
  if (!originalUrl.value) {
    return
  }

  if (recompressTimer) {
    clearTimeout(recompressTimer)
  }

  recompressTimer = setTimeout(() => {
    triggerCompression(originalUrl.value, quality.value, targetFormat.value)
  }, 300)
})

onBeforeUnmount(() => {
  if (recompressTimer) {
    clearTimeout(recompressTimer)
  }
  revokeUrl(originalUrl.value)
  resetCompressedOutput()
})

const originalSize = computed(() => file.value?.size ?? 0)
const compressedSize = computed(() => compressedBlob.value?.size ?? 0)
const savedPercent = computed(() => {
  if (!originalSize.value || !compressedSize.value) {
    return '0.0'
  }

  return Math.max(
    0,
    ((originalSize.value - compressedSize.value) / originalSize.value) * 100,
  ).toFixed(1)
})
const isBigger = computed(() => compressedSize.value > originalSize.value)
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
          <ImageIcon class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e293b]">图片在线压缩</h1>
          <p class="text-[#64748b] mt-1 text-sm md:text-base">
            在本地浏览器中快速压缩图片体积，保护隐私不上传服务器，同时尽量保持现有画质。
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="!file"
      :class="[
        'bg-white rounded-2xl border-2 border-dashed transition-all p-12 text-center flex flex-col items-center justify-center min-h-[400px] cursor-pointer',
        isDragging ? 'border-[#2563eb] bg-blue-50/50' : 'border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50',
      ]"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="fileInputRef?.click()"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg, image/png, image/webp"
        class="hidden"
        @change="handleFileChange"
      >
      <div class="w-20 h-20 bg-blue-50 text-[#2563eb] rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Upload class="w-10 h-10" />
      </div>
      <h3 class="text-xl font-bold text-[#1e293b] mb-2">点击选择图片或拖拽图片到此</h3>
      <p class="text-[#64748b] mb-6">支持 JPG、PNG、WebP 格式，建议文件大小不超过 20MB</p>
      <button class="bg-[#2563eb] text-white px-8 py-3 rounded-full font-bold shadow-sm hover:bg-[#1d4ed8] transition-colors">
        选择本地图片
      </button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
          <div class="flex items-center justify-between mb-6 border-b border-[#e2e8f0] pb-4">
            <h3 class="text-lg font-bold text-[#1e293b] flex items-center gap-2">
              <CheckCircle2 class="w-5 h-5 text-green-500" />
              预览与对比
            </h3>
            <button
              class="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              @click="clearFile"
            >
              <Trash2 class="w-4 h-4" />重新选择
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            <div class="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-[#e2e8f0] rounded-full items-center justify-center z-10 shadow-sm text-slate-400">
              <ArrowRight class="w-5 h-5" />
            </div>

            <div class="flex flex-col">
              <div class="aspect-square bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative flex items-center justify-center mb-3">
                <img :src="originalUrl" alt="Original" class="w-full h-full object-contain">
                <div class="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm font-medium">
                  原始图片
                </div>
              </div>
              <div class="flex justify-between items-center px-1">
                <span class="text-[#64748b] text-sm">大小</span>
                <span class="font-bold text-[#1e293b]">{{ formatSize(originalSize) }}</span>
              </div>
            </div>

            <div class="flex flex-col">
              <div class="aspect-square bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative flex items-center justify-center mb-3">
                <div
                  v-if="isCompressing"
                  class="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                >
                  <Zap class="w-8 h-8 text-blue-500 animate-pulse mb-2" />
                  <span class="font-bold text-blue-600 text-sm">正在压缩...</span>
                </div>
                <img v-if="compressedUrl" :src="compressedUrl" alt="Compressed" class="w-full h-full object-contain">
                <div class="absolute top-2 left-2 bg-blue-600/90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm font-medium shadow-sm">
                  压缩后
                </div>
              </div>
              <div class="flex flex-col gap-1 px-1">
                <div class="flex justify-between items-center">
                  <span class="text-[#64748b] text-sm">大小</span>
                  <span :class="isBigger ? 'text-red-500' : 'text-green-600'" class="font-bold">
                    {{ formatSize(compressedSize) }}
                  </span>
                </div>
                <div v-if="!isCompressing && !isBigger" class="flex justify-between items-center">
                  <span class="text-[#64748b] text-sm">节省体积</span>
                  <span class="font-bold text-[#2563eb]">-{{ savedPercent }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 relative overflow-hidden">
          <div class="flex items-center gap-2 mb-6">
            <Settings class="w-5 h-5 text-[#2563eb]" />
            <h3 class="font-bold text-[#1e293b]">压缩设置</h3>
          </div>

          <div class="space-y-6">
            <div>
              <div class="flex justify-between items-end mb-3">
                <label class="text-sm font-bold text-[#64748b]">压缩强度 (Quality)</label>
                <span class="font-bold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded-md text-sm">{{ quality }}%</span>
              </div>
              <input
                v-model="quality"
                type="range"
                min="1"
                max="100"
                class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
              >
              <div class="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                <span>更小体积</span>
                <span>更高画质</span>
              </div>
            </div>

            <div>
              <label class="text-sm font-bold text-[#64748b] mb-3 block">输出格式</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  :class="targetFormat === 'image/jpeg' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-[#e2e8f0] text-slate-600 hover:border-slate-300'"
                  class="py-2 rounded-lg font-bold text-sm transition-all border"
                  @click="targetFormat = 'image/jpeg'"
                >
                  JPEG
                </button>
                <button
                  :class="targetFormat === 'image/webp' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-[#e2e8f0] text-slate-600 hover:border-slate-300'"
                  class="py-2 rounded-lg font-bold text-sm transition-all border"
                  @click="targetFormat = 'image/webp'"
                >
                  WebP
                </button>
              </div>
              <p class="text-[12px] text-slate-400 mt-2 leading-relaxed">
                WebP 通常比 JPEG 更省体积，同时更适合处理原本为 PNG 的透明图片。
              </p>
            </div>
          </div>

          <div class="border-t border-[#e2e8f0] mt-6 pt-6">
            <button
              :disabled="isCompressing || !compressedUrl"
              class="w-full bg-[#2563eb] text-white hover:bg-[#1d4ed8] disabled:bg-slate-300 disabled:cursor-not-allowed py-3.5 rounded-xl font-bold shadow-sm transition-all flex justify-center items-center gap-2 text-[15px]"
              @click="downloadCompressed"
            >
              <Download class="w-5 h-5" />
              保存压缩后的图片
            </button>
          </div>
        </div>

        <div class="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 class="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <p class="text-sm text-green-800 leading-relaxed font-medium">
            纯本地计算：图片只在当前浏览器中处理，不会上传到任何服务器，尽量兼顾隐私和速度。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
