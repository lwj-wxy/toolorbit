<script setup lang="ts">
import { CheckCircle2, Download, FileImage, FileText, Layers, Trash2, Upload } from 'lucide-vue-next'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import * as pdfjsLib from 'pdfjs-dist'

interface PageImage {
  pageNumber: number
  dataUrl: string
}

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

const file = ref<File | null>(null)
const images = ref<PageImage[]>([])
const isProcessing = ref(false)
const progress = ref({ current: 0, total: 0 })
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (selectedFile) {
    void processPdfFile(selectedFile)
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  const droppedFile = event.dataTransfer?.files?.[0]
  if (!droppedFile) {
    return
  }

  if (droppedFile.type !== 'application/pdf') {
    window.alert('请上传有效的 PDF 文件。')
    return
  }

  void processPdfFile(droppedFile)
}

async function processPdfFile(pdfFile: File) {
  file.value = pdfFile
  isProcessing.value = true
  images.value = []
  progress.value = { current: 0, total: 0 }

  try {
    const arrayBuffer = await pdfFile.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    progress.value = { current: 0, total: pdf.numPages }
    const nextImages: PageImage[] = []

    for (let index = 1; index <= pdf.numPages; index += 1) {
      const page = await pdf.getPage(index)
      const viewport = page.getViewport({ scale: 2 })
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (!context) {
        continue
      }

      canvas.width = viewport.width
      canvas.height = viewport.height

      await page.render({
        canvas,
        canvasContext: context,
        viewport,
      }).promise

      nextImages.push({
        pageNumber: index,
        dataUrl: canvas.toDataURL('image/jpeg', 0.95),
      })

      progress.value = { current: index, total: pdf.numPages }
    }

    images.value = nextImages
  } catch (error) {
    console.error(error)
    window.alert('解析 PDF 失败，请确认文件未加密且没有损坏。')
    clearFile()
  } finally {
    isProcessing.value = false
  }
}

function clearFile() {
  file.value = null
  images.value = []
  progress.value = { current: 0, total: 0 }
  isProcessing.value = false
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

async function downloadAllAsZip() {
  if (!images.value.length || !file.value) {
    return
  }

  const zip = new JSZip()
  const folderName = file.value.name.replace(/\.[^/.]+$/, '')
  const folder = zip.folder(folderName)
  if (!folder) {
    return
  }

  images.value.forEach((image) => {
    folder.file(`page-${image.pageNumber}.jpg`, image.dataUrl.split(',')[1], { base64: true })
  })

  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, `${folderName}-images.zip`)
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
          <Layers class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e293b]">PDF 转图片</h1>
          <p class="text-[#64748b] mt-1 text-sm md:text-base">
            在浏览器本地解析 PDF，并将每一页导出为高清 JPEG 图片，支持打包下载。
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="!file"
      :class="[
        'bg-white rounded-2xl border-2 border-dashed transition-all p-12 text-center flex flex-col items-center justify-center min-h-[400px] cursor-pointer shadow-sm',
        isDragging ? 'border-[#2563eb] bg-blue-50/50' : 'border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50',
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop="handleDrop"
      @click="fileInputRef?.click()"
    >
      <input ref="fileInputRef" type="file" accept="application/pdf" class="hidden" @change="handleFileChange">
      <div class="w-20 h-20 bg-blue-50 text-[#2563eb] rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Upload class="w-10 h-10" />
      </div>
      <h3 class="text-xl font-bold text-[#1e293b] mb-2">点击选择 PDF 文件或拖拽至此</h3>
      <p class="text-[#64748b] mb-6">纯本地离线解析，快速导出页面预览图，不修改现有页面视觉风格</p>
      <button class="bg-[#2563eb] text-white px-8 py-3 rounded-full font-bold shadow-sm hover:bg-[#1d4ed8] transition-colors">
        选择 PDF 文件...
      </button>
    </div>

    <div v-else class="space-y-6">
      <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <FileText class="w-8 h-8 text-rose-500" />
          <div>
            <h3 class="font-bold text-[#1e293b]">{{ file.name }}</h3>
            <p class="text-sm text-[#64748b]">
              {{ (file.size / 1024 / 1024).toFixed(2) }} MB
              <span v-if="progress.total > 0"> · 共 {{ progress.total }} 页</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <button
            v-if="!isProcessing && images.length > 0"
            class="flex-1 sm:flex-none bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
            @click="downloadAllAsZip"
          >
            <Download class="w-4 h-4" /> 打包下载 ZIP
          </button>
          <button
            class="flex-1 sm:flex-none bg-white border border-[#cbd5e1] hover:border-red-300 hover:bg-red-50 text-slate-700 hover:text-red-600 px-5 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
            @click="clearFile"
          >
            <Trash2 class="w-4 h-4" /> 清除
          </button>
        </div>
      </div>

      <div
        v-if="isProcessing"
        class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-12 flex flex-col items-center justify-center min-h-[300px]"
      >
        <div class="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
        <h3 class="text-lg font-bold text-[#1e293b] mb-2">正在解析 PDF...</h3>
        <p class="text-[#64748b]">已解析 {{ progress.current }} / {{ progress.total }} 页</p>
        <div class="w-full max-w-md bg-slate-100 rounded-full h-2.5 mt-6 overflow-hidden">
          <div
            class="bg-[#2563eb] h-2.5 rounded-full transition-all duration-300"
            :style="{ width: `${(progress.current / Math.max(progress.total, 1)) * 100}%` }"
          />
        </div>
      </div>

      <div v-if="!isProcessing && images.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="image in images"
          :key="image.pageNumber"
          class="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden group"
        >
          <div class="bg-slate-100 aspect-[1/1.4] relative flex items-center justify-center p-2 border-b border-[#e2e8f0]">
            <img :src="image.dataUrl" :alt="`Page ${image.pageNumber}`" class="max-w-full max-h-full object-contain shadow-sm border border-slate-200">
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <a
                :href="image.dataUrl"
                :download="`page-${image.pageNumber}.jpg`"
                class="bg-white text-[#0f172a] px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all"
              >
                <Download class="w-4 h-4" /> 单张下载
              </a>
            </div>
          </div>
          <div class="p-3 text-center">
            <span class="text-sm font-bold text-[#64748b]">第 {{ image.pageNumber }} 页</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!file" class="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mt-8">
      <CheckCircle2 class="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
      <p class="text-sm text-blue-800 leading-relaxed font-medium">
        PDF 内容只在当前浏览器中解析，不会上传服务器，适合账单、发票、合同等需要隐私保护的场景。
      </p>
    </div>
  </div>
</template>
