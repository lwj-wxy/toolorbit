<script setup lang="ts">
import { AlertCircle, CheckCircle2, CloudCog, Download, FileSpreadsheet, FileText, Presentation, Upload } from 'lucide-vue-next'

const file = ref<File | null>(null)
const isUploading = ref(false)
const isProcessing = ref(false)
const isFinished = ref(false)
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

function getExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() || ''
}

function processFileSelection(selectedFile: File) {
  const validExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']
  if (!validExtensions.includes(getExtension(selectedFile.name))) {
    window.alert('请上传有效的 Word、Excel 或 PowerPoint 文件。')
    return
  }

  file.value = selectedFile
  isFinished.value = false
}

function getFormatName(fileName: string) {
  const extension = getExtension(fileName)
  if (['doc', 'docx'].includes(extension)) {
    return 'Word 文档'
  }
  if (['xls', 'xlsx'].includes(extension)) {
    return 'Excel 表格'
  }
  if (['ppt', 'pptx'].includes(extension)) {
    return 'PowerPoint 演示文稿'
  }
  return 'Office 文档'
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (selectedFile) {
    processFileSelection(selectedFile)
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  const droppedFile = event.dataTransfer?.files?.[0]
  if (droppedFile) {
    processFileSelection(droppedFile)
  }
}

function clearFile() {
  file.value = null
  isUploading.value = false
  isProcessing.value = false
  isFinished.value = false
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function simulateConversion() {
  if (!file.value) {
    return
  }

  isUploading.value = true
  window.setTimeout(() => {
    isUploading.value = false
    isProcessing.value = true

    window.setTimeout(() => {
      isProcessing.value = false
      isFinished.value = true
    }, 3000)
  }, 1500)
}

function handleDownload() {
  window.alert('当前版本先保留为前端演示界面。真实的 Office 转 PDF 需要接入服务端转换接口。')
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
          <CloudCog class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e293b]">Office 文档转 PDF</h1>
          <p class="text-[#64748b] mt-1 text-sm md:text-base">
            将 Word、Excel、PPT 一键转换为 PDF，界面先保留现有样式，后续可接入服务端转换能力。
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-10">
      <div
        v-if="!file"
        :class="[
          'rounded-2xl border-2 border-dashed transition-all p-12 text-center flex flex-col items-center justify-center min-h-[360px] cursor-pointer',
          isDragging ? 'border-indigo-600 bg-indigo-50/50' : 'border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50',
        ]"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop="handleDrop"
        @click="fileInputRef?.click()"
      >
        <input ref="fileInputRef" type="file" accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx" class="hidden" @change="handleFileChange">

        <div class="flex gap-4 mb-6">
          <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <FileText class="w-7 h-7" />
          </div>
          <div class="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shadow-sm -mt-2">
            <FileSpreadsheet class="w-7 h-7" />
          </div>
          <div class="w-14 h-14 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shadow-sm">
            <Presentation class="w-7 h-7" />
          </div>
        </div>

        <h3 class="text-xl font-bold text-[#1e293b] mb-2">点击选择或拖入 Office 文件</h3>
        <p class="text-[#64748b] mb-6">支持 .docx、.xlsx、.pptx 等格式</p>
        <button class="bg-white border border-[#cbd5e1] text-[#0f172a] px-6 py-2.5 rounded-lg font-bold shadow-sm hover:border-[#94a3b8] transition-colors flex items-center gap-2">
          <Upload class="w-4 h-4" />
          选择文档开始转换
        </button>
      </div>

      <div v-else class="flex flex-col items-center justify-center min-h-[360px] max-w-lg mx-auto w-full">
        <div v-if="!isFinished && !isUploading && !isProcessing" class="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-6 flex flex-col items-center text-center">
          <div class="mb-4">
            <FileText v-if="['doc', 'docx'].includes(getExtension(file.name))" class="w-10 h-10 text-blue-600" />
            <FileSpreadsheet v-else-if="['xls', 'xlsx'].includes(getExtension(file.name))" class="w-10 h-10 text-green-600" />
            <Presentation v-else-if="['ppt', 'pptx'].includes(getExtension(file.name))" class="w-10 h-10 text-orange-500" />
            <FileText v-else class="w-10 h-10 text-slate-500" />
          </div>
          <h3 class="text-lg font-bold text-[#1e293b] mb-1 truncate w-full max-w-[300px]" :title="file.name">
            {{ file.name }}
          </h3>
          <p class="text-[#64748b] text-sm mb-6">
            {{ getFormatName(file.name) }} · {{ (file.size / 1024 / 1024).toFixed(2) }} MB
          </p>

          <div class="flex w-full gap-3">
            <button
              class="flex-1 bg-white border border-[#cbd5e1] hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold transition-colors"
              @click="clearFile"
            >
              取消重选
            </button>
            <button
              class="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all shadow-sm"
              @click="simulateConversion"
            >
              开始云端转换
            </button>
          </div>
        </div>

        <div v-if="isUploading || isProcessing" class="w-full flex flex-col items-center text-center space-y-4">
          <div class="relative w-24 h-24 flex items-center justify-center">
            <svg class="animate-spin text-indigo-600 w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <FileText v-if="['doc', 'docx'].includes(getExtension(file!.name))" class="w-10 h-10 text-blue-600" />
              <FileSpreadsheet v-else-if="['xls', 'xlsx'].includes(getExtension(file!.name))" class="w-10 h-10 text-green-600" />
              <Presentation v-else-if="['ppt', 'pptx'].includes(getExtension(file!.name))" class="w-10 h-10 text-orange-500" />
              <FileText v-else class="w-10 h-10 text-slate-500" />
            </div>
          </div>
          <div class="space-y-1 mt-4">
            <h3 class="text-xl font-bold text-[#1e293b]">
              {{ isUploading ? '正在安全上传...' : '服务端排版解析中...' }}
            </h3>
            <p class="text-[#64748b] text-sm">
              {{ isUploading ? '文件正在进入转换队列' : '正在调用后端 Office 引擎生成 PDF' }}
            </p>
          </div>
        </div>

        <div v-if="isFinished" class="w-full bg-emerald-50 border border-emerald-100 rounded-2xl p-8 flex flex-col items-center text-center mt-4">
          <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-emerald-800 mb-2">转换完成</h3>
          <p class="text-emerald-600 text-sm mb-8">当前保留为界面演示版本，后续可直接接到 Fastify 服务端。</p>

          <div class="flex w-full gap-3">
            <button
              class="flex-1 bg-white border border-emerald-200 hover:border-emerald-300 text-emerald-700 py-3.5 rounded-xl font-bold transition-colors"
              @click="clearFile"
            >
              转换其他文件
            </button>
            <button
              class="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_4px_14px_rgba(5,150,105,0.2)] flex items-center justify-center gap-2"
              @click="handleDownload"
            >
              <Download class="w-5 h-5" />
              下载 PDF 文件
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-slate-50 rounded-2xl p-6 border border-[#e2e8f0] text-[14px]">
      <div class="flex items-start gap-3">
        <AlertCircle class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div class="space-y-2 text-[#475569] leading-relaxed">
          <p>
            <strong class="text-slate-800">关于 Office 在线转换：</strong><br>
            与图片压缩、PDF 转图片不同，Office 文档的版式解析依赖服务端能力，前端无法完整复刻 Word、Excel、PPT 的排版引擎。
          </p>
          <p>
            这个页面先保留现有交互和样式，后续只需要把按钮接到 Node.js + Fastify 后端即可完成真实转换。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
