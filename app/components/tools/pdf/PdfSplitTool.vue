<script setup lang="ts">
import { Download, FileText, Scissors, Upload } from 'lucide-vue-next'
import { PDFDocument } from 'pdf-lib'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

const file = ref<File | null>(null)
const pageCount = ref(0)
const isProcessing = ref(false)
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

function clearFile() {
  file.value = null
  pageCount.value = 0
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

async function processFile(selectedFile: File) {
  if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
    window.alert('请上传有效的 PDF 文件。')
    return
  }

  try {
    const bytes = await selectedFile.arrayBuffer()
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
    file.value = selectedFile
    pageCount.value = pdf.getPageCount()
  } catch (error) {
    console.error(error)
    window.alert('读取 PDF 失败，请确认文件未损坏。')
    clearFile()
  }
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (selectedFile) {
    void processFile(selectedFile)
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  const droppedFile = event.dataTransfer?.files?.[0]
  if (droppedFile) {
    void processFile(droppedFile)
  }
}

async function splitAllPages() {
  if (!file.value) {
    return
  }

  const bytes = await file.value.arrayBuffer()
  const sourcePdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
  const total = sourcePdf.getPageCount()
  const zip = new JSZip()
  const baseName = file.value.name.replace(/\.pdf$/i, '')

  for (let index = 0; index < total; index += 1) {
    const outputPdf = await PDFDocument.create()
    const [page] = await outputPdf.copyPages(sourcePdf, [index])
    outputPdf.addPage(page)
    const outputBytes = await outputPdf.save()
    zip.file(`${baseName}-page-${index + 1}.pdf`, outputBytes)
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' })
  saveAs(zipBlob, `${baseName}-split.zip`)
}

async function handleSplit() {
  if (!file.value) {
    return
  }

  isProcessing.value = true
  try {
    await splitAllPages()
  } catch (error) {
    console.error(error)
    window.alert('拆分失败，请稍后重试。')
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div class="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm lg:p-8">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#2563eb]">
          <Scissors class="h-6 w-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e293b]">PDF 拆分</h1>
          <p class="mt-1 text-sm text-[#64748b] md:text-base">整本拆分为单页，并自动打包为 ZIP。</p>
        </div>
      </div>
    </div>

    <div
      v-if="!file"
      :class="[
        'rounded-2xl border-2 border-dashed bg-white p-10 text-center shadow-sm transition-all cursor-pointer',
        isDragging ? 'border-[#2563eb] bg-blue-50/50' : 'border-[#cbd5e1] hover:border-[#94a3b8]',
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop="handleDrop"
      @click="fileInputRef?.click()"
    >
      <input ref="fileInputRef" type="file" class="hidden" accept="application/pdf,.pdf" @change="handleFileChange">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#2563eb]">
        <Upload class="h-8 w-8" />
      </div>
      <h2 class="text-lg font-bold text-[#1e293b]">拖拽或点击上传 PDF 文件</h2>
      <p class="mt-2 text-sm text-[#64748b]">文件只在本地浏览器处理，不上传服务器。</p>
    </div>

    <div v-else class="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-6">
      <div class="flex items-center justify-between gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
        <div class="min-w-0 flex items-center gap-3">
          <FileText class="h-6 w-6 text-rose-500" />
          <div class="min-w-0">
            <p class="truncate text-sm font-bold text-[#1e293b]">{{ file.name }}</p>
            <p class="text-xs text-[#64748b]">共 {{ pageCount }} 页</p>
          </div>
        </div>
        <button class="rounded-lg px-3 py-1.5 text-sm font-bold text-red-500 hover:bg-red-50" @click="clearFile">重选</button>
      </div>

      <button
        :disabled="isProcessing"
        class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-3 text-white font-bold disabled:bg-slate-300"
        @click="handleSplit"
      >
        <Download class="h-5 w-5" />
        {{ isProcessing ? '处理中...' : '下载拆分页 ZIP' }}
      </button>
    </div>
  </div>
</template>
