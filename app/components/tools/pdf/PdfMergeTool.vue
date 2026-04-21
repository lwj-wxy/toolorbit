<script setup lang="ts">
import { ArrowDown, ArrowUp, Download, Files, Trash2, Upload } from 'lucide-vue-next'
import { PDFDocument } from 'pdf-lib'
import { saveAs } from 'file-saver'

interface LoadedPdf {
  id: string
  file: File
}

const pdfFiles = ref<LoadedPdf[]>([])
const isMerging = ref(false)
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

function isPdfFile(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

function addFiles(files: File[]) {
  const nextFiles = files
    .filter(isPdfFile)
    .map((file) => ({
      id: crypto.randomUUID(),
      file,
    }))

  if (!nextFiles.length) {
    window.alert('请上传 PDF 文件。')
    return
  }

  pdfFiles.value = [...pdfFiles.value, ...nextFiles]
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFiles = target.files ? Array.from(target.files) : []
  if (selectedFiles.length) {
    addFiles(selectedFiles)
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  const droppedFiles = event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : []
  if (droppedFiles.length) {
    addFiles(droppedFiles)
  }
}

function clearAll() {
  pdfFiles.value = []
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function removeFile(id: string) {
  pdfFiles.value = pdfFiles.value.filter((item) => item.id !== id)
}

function moveUp(index: number) {
  if (index <= 0) {
    return
  }
  const next = [...pdfFiles.value]
  ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
  pdfFiles.value = next
}

function moveDown(index: number) {
  if (index >= pdfFiles.value.length - 1) {
    return
  }
  const next = [...pdfFiles.value]
  ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
  pdfFiles.value = next
}

async function mergePdfs() {
  if (pdfFiles.value.length < 2) {
    window.alert('请至少上传 2 个 PDF 文件。')
    return
  }

  isMerging.value = true

  try {
    const mergedPdf = await PDFDocument.create()

    for (const currentFile of pdfFiles.value) {
      const bytes = await currentFile.file.arrayBuffer()
      const sourcePdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
      const indices = sourcePdf.getPageIndices()
      const pages = await mergedPdf.copyPages(sourcePdf, indices)
      pages.forEach((page) => mergedPdf.addPage(page))
    }

    const mergedBytes = await mergedPdf.save()
    const blob = new Blob([mergedBytes], { type: 'application/pdf' })
    saveAs(blob, `merged-${Date.now()}.pdf`)
  } catch (error) {
    console.error(error)
    window.alert('合并失败，请确认 PDF 文件未损坏或受加密限制。')
  } finally {
    isMerging.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div class="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm lg:p-8">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#2563eb]">
          <Files class="h-6 w-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e293b]">PDF 合并</h1>
          <p class="mt-1 text-sm text-[#64748b] md:text-base">浏览器本地合并多个 PDF，不上传服务器。</p>
        </div>
      </div>
    </div>

    <div
      :class="[
        'rounded-2xl border-2 border-dashed bg-white p-10 text-center shadow-sm transition-all cursor-pointer',
        isDragging ? 'border-[#2563eb] bg-blue-50/50' : 'border-[#cbd5e1] hover:border-[#94a3b8]',
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop="handleDrop"
      @click="fileInputRef?.click()"
    >
      <input ref="fileInputRef" type="file" class="hidden" accept="application/pdf,.pdf" multiple @change="handleFileChange">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#2563eb]">
        <Upload class="h-8 w-8" />
      </div>
      <h2 class="text-lg font-bold text-[#1e293b]">拖拽或点击上传 PDF 文件</h2>
      <p class="mt-2 text-sm text-[#64748b]">支持多文件上传，支持手动调整合并顺序。</p>
    </div>

    <div class="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold text-[#1e293b]">待合并文件 ({{ pdfFiles.length }})</h3>
        <button class="rounded-lg px-3 py-1.5 text-sm font-bold text-red-500 hover:bg-red-50" @click="clearAll">
          清空
        </button>
      </div>

      <div v-if="pdfFiles.length" class="space-y-3">
        <div
          v-for="(item, index) in pdfFiles"
          :key="item.id"
          class="flex items-center gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3"
        >
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-bold text-[#1e293b]">{{ item.file.name }}</p>
            <p class="text-xs text-[#64748b]">{{ (item.file.size / 1024 / 1024).toFixed(2) }} MB</p>
          </div>
          <div class="flex items-center gap-1">
            <button :disabled="index === 0" class="rounded p-1.5 text-slate-500 hover:bg-blue-50 disabled:opacity-30" @click="moveUp(index)">
              <ArrowUp class="h-4 w-4" />
            </button>
            <button
              :disabled="index === pdfFiles.length - 1"
              class="rounded p-1.5 text-slate-500 hover:bg-blue-50 disabled:opacity-30"
              @click="moveDown(index)"
            >
              <ArrowDown class="h-4 w-4" />
            </button>
            <button class="rounded p-1.5 text-red-500 hover:bg-red-50" @click="removeFile(item.id)">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-[#64748b]">请先上传 PDF 文件。</p>

      <button
        :disabled="isMerging || pdfFiles.length < 2"
        class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-3 text-white font-bold disabled:bg-slate-300"
        @click="mergePdfs"
      >
        <Download class="h-5 w-5" />
        {{ isMerging ? '合并中...' : '下载合并后的 PDF' }}
      </button>
    </div>
  </div>
</template>
