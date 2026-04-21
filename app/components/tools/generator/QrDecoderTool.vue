<script setup lang="ts">
import { Copy, ScanLine, Upload } from 'lucide-vue-next'
import jsQR from 'jsqr'

const file = ref<File | null>(null)
const previewUrl = ref('')
const decodedText = ref('')
const error = ref('')
const copied = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

function clearState() {
  decodedText.value = ''
  error.value = ''
}

async function decodeFromFile(selectedFile: File) {
  if (!selectedFile.type.startsWith('image/')) {
    error.value = '请上传图片文件。'
    return
  }

  clearState()
  file.value = selectedFile
  previewUrl.value = URL.createObjectURL(selectedFile)

  const image = new Image()
  image.src = previewUrl.value

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error('图片加载失败'))
  })

  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    error.value = '无法读取图片数据。'
    return
  }

  ctx.drawImage(image, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const code = jsQR(imageData.data, imageData.width, imageData.height)

  if (!code) {
    error.value = '未识别到二维码，请换一张更清晰的图片。'
    return
  }

  decodedText.value = code.data
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (selectedFile) {
    void decodeFromFile(selectedFile)
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  const droppedFile = event.dataTransfer?.files?.[0]
  if (droppedFile) {
    void decodeFromFile(droppedFile)
  }
}

async function copyResult() {
  if (!decodedText.value) {
    return
  }

  await navigator.clipboard.writeText(decodedText.value)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1200)
}

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl border border-[#e2e8f0] p-6 lg:p-8 shadow-sm">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center">
          <ScanLine class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e293b]">二维码识别</h1>
          <p class="text-sm text-[#64748b] mt-1">上传二维码图片，快速解析文本/链接。</p>
        </div>
      </div>
    </div>

    <div
      :class="[
        'bg-white rounded-2xl border-2 border-dashed p-10 text-center shadow-sm transition-all cursor-pointer',
        isDragging ? 'border-[#2563eb] bg-blue-50/50' : 'border-[#cbd5e1] hover:border-[#94a3b8]',
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop="handleDrop"
      @click="fileInputRef?.click()"
    >
      <input ref="fileInputRef" class="hidden" type="file" accept="image/*" @change="handleFileChange">
      <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#2563eb]">
        <Upload class="w-7 h-7" />
      </div>
      <h2 class="text-lg font-bold text-[#1e293b]">拖拽或点击上传二维码图片</h2>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
        <h3 class="text-sm font-bold text-[#334155] mb-3">图片预览</h3>
        <div class="min-h-[260px] rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-center overflow-hidden">
          <img v-if="previewUrl" :src="previewUrl" class="max-h-[320px] object-contain" alt="QR preview">
          <span v-else class="text-sm text-[#94a3b8]">尚未上传图片</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-bold text-[#334155]">识别结果</h3>
          <button
            :disabled="!decodedText"
            class="text-xs px-3 py-1.5 rounded-md border border-[#cbd5e1] disabled:opacity-40"
            @click="copyResult"
          >
            <span class="inline-flex items-center gap-1"><Copy class="w-3.5 h-3.5" /> {{ copied ? '已复制' : '复制' }}</span>
          </button>
        </div>
        <textarea
          readonly
          :value="decodedText || error || ''"
          class="w-full h-[260px] rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3 text-sm text-[#334155] resize-none"
          placeholder="识别结果会显示在这里"
        />
      </div>
    </div>
  </div>
</template>
