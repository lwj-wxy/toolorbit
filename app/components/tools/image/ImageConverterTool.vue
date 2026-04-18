<script setup lang="ts">
import { CheckCircle2, Download, Image as ImageIcon, RefreshCcw, Trash2, Upload } from 'lucide-vue-next'

const file = ref<File | null>(null)
const originalUrl = ref('')
const targetFormat = ref('image/jpeg')
const isConverting = ref(false)
const hasConverted = ref(false)
const convertedUrl = ref('')
const convertedBlob = ref<Blob | null>(null)
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

function formatSize(bytes: number) {
  if (bytes === 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 2)} ${units[index]}`
}

function revokeUrl(url: string) {
  if (url) {
    URL.revokeObjectURL(url)
  }
}

function loadOriginalFile(selectedFile: File) {
  file.value = selectedFile
  revokeUrl(originalUrl.value)
  revokeUrl(convertedUrl.value)
  originalUrl.value = URL.createObjectURL(selectedFile)
  convertedUrl.value = ''
  convertedBlob.value = null
  hasConverted.value = false

  if (selectedFile.type === 'image/jpeg') {
    targetFormat.value = 'image/png'
  } else {
    targetFormat.value = 'image/jpeg'
  }
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (selectedFile) {
    loadOriginalFile(selectedFile)
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  const droppedFile = event.dataTransfer?.files?.[0]
  if (!droppedFile) {
    return
  }

  if (!droppedFile.type.startsWith('image/')) {
    window.alert('请上传有效的图片文件。')
    return
  }

  loadOriginalFile(droppedFile)
}

function convertImage() {
  if (!originalUrl.value || !file.value) {
    return
  }

  isConverting.value = true
  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d')
    if (!context) {
      isConverting.value = false
      return
    }

    if (targetFormat.value === 'image/jpeg') {
      context.fillStyle = '#FFFFFF'
      context.fillRect(0, 0, canvas.width, canvas.height)
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(
      (blob) => {
        if (blob) {
          revokeUrl(convertedUrl.value)
          convertedBlob.value = blob
          convertedUrl.value = URL.createObjectURL(blob)
          hasConverted.value = true
        }
        isConverting.value = false
      },
      targetFormat.value,
      0.92,
    )
  }
  image.onerror = () => {
    isConverting.value = false
  }
  image.src = originalUrl.value
}

function clearFile() {
  file.value = null
  revokeUrl(originalUrl.value)
  revokeUrl(convertedUrl.value)
  originalUrl.value = ''
  convertedUrl.value = ''
  convertedBlob.value = null
  hasConverted.value = false
  isConverting.value = false
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function downloadImage() {
  if (!convertedUrl.value || !file.value) {
    return
  }

  const link = document.createElement('a')
  link.href = convertedUrl.value
  const extension =
    targetFormat.value === 'image/jpeg'
      ? 'jpg'
      : targetFormat.value === 'image/webp'
        ? 'webp'
        : 'png'
  link.download = `${file.value.name.replace(/\.[^/.]+$/, '')}-converted.${extension}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onBeforeUnmount(() => {
  revokeUrl(originalUrl.value)
  revokeUrl(convertedUrl.value)
})
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
          <RefreshCcw class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e293b]">图片格式在线转换工具</h1>
          <p class="text-[#64748b] mt-1 text-sm md:text-base">
            在本地安全地互转 JPEG、PNG、WebP 等常见图片格式，不改动当前页面风格。
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-10">
      <div
        v-if="!file"
        :class="[
          'rounded-2xl border-2 border-dashed transition-all p-12 text-center flex flex-col items-center justify-center min-h-[360px] cursor-pointer',
          isDragging ? 'border-[#2563eb] bg-blue-50/50' : 'border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50',
        ]"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop="handleDrop"
        @click="fileInputRef?.click()"
      >
        <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleFileChange">
        <div class="w-16 h-16 bg-blue-50 text-[#2563eb] rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Upload class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-bold text-[#1e293b] mb-2">点击选择图片文件</h3>
        <p class="text-[#64748b] mb-6">或者将图片文件拖拽到此区域</p>
        <button class="bg-white border border-[#cbd5e1] text-[#0f172a] px-6 py-2.5 rounded-lg font-bold shadow-sm hover:border-[#94a3b8] hover:bg-slate-50 transition-colors flex items-center gap-2">
          <Upload class="w-4 h-4" />
          选择图片文件...
        </button>
      </div>

      <div v-else class="flex flex-col gap-8">
        <div class="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
          <h3 class="text-lg font-bold text-[#1e293b] flex items-center gap-2">
            <ImageIcon class="w-5 h-5 text-blue-500" />
            已上传文件：{{ file.name }}
          </h3>
          <button
            class="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            @click="clearFile"
          >
            <Trash2 class="w-4 h-4" />清除/重新上传
          </button>
        </div>

        <div class="flex flex-col md:flex-row gap-8 lg:gap-12">
          <div class="w-full md:w-[320px] shrink-0">
            <div class="flex flex-col relative group">
              <div class="aspect-square bg-[#f8fafc] rounded-xl border border-[#e2e8f0] overflow-hidden flex items-center justify-center mb-3">
                <img :src="hasConverted ? convertedUrl : originalUrl" alt="Preview" class="w-full h-full object-contain p-2">
              </div>
              <div class="flex justify-between items-center px-1 text-sm">
                <span class="text-[#64748b] font-medium">文件大小</span>
                <span class="font-bold text-[#0f172a]">
                  {{ hasConverted && convertedBlob ? formatSize(convertedBlob.size) : formatSize(file.size) }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex-1 space-y-8 py-2">
            <div>
              <label class="block text-[14px] font-bold text-[#1e293b] mb-3">目标格式：</label>
              <select
                v-model="targetFormat"
                class="w-full sm:w-[240px] bg-white border border-[#cbd5e1] px-4 py-3 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-slate-700 cursor-pointer shadow-sm"
                @change="hasConverted = false"
              >
                <option value="image/jpeg">JPEG (.jpg)</option>
                <option value="image/png">PNG (.png)</option>
                <option value="image/webp">WEBP (.webp)</option>
              </select>
            </div>

            <div class="pt-2">
              <button
                v-if="!hasConverted"
                :disabled="isConverting"
                class="bg-[#10b981] hover:bg-[#059669] disabled:bg-emerald-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold transition-all shadow-[0_2px_10px_rgba(16,185,129,0.2)] flex items-center gap-2"
                @click="convertImage"
              >
                <template v-if="isConverting">
                  <RefreshCcw class="w-5 h-5 animate-spin" />
                  正在转换...
                </template>
                <template v-else>
                  转换
                </template>
              </button>

              <div v-else class="flex items-center gap-4">
                <button
                  class="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-[0_2px_10px_rgba(37,99,235,0.2)] flex items-center gap-2"
                  @click="downloadImage"
                >
                  <Download class="w-5 h-5" /> 下载转换结果
                </button>
                <div class="text-green-600 font-medium flex items-center gap-1.5 text-sm bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                  <CheckCircle2 class="w-4 h-4" /> 转换成功
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-[#f8fafc] rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 mt-6">
      <div class="prose max-w-none text-[14px] leading-loose text-[#475569]">
        <p class="mb-4">
          这个图片格式转换工具适合在 JPG、PNG、WebP 之间快速互转，方便电商素材、网页资源和内容发布场景直接复用。
        </p>
        <p class="text-red-500 font-bold mb-6 bg-red-50/50 p-4 rounded-xl border border-red-100/50">
          所有转换都在浏览器本地完成，不会把图片内容上传到服务器。透明背景在转成 JPEG 时会自动补白。
        </p>
      </div>
    </div>
  </div>
</template>
