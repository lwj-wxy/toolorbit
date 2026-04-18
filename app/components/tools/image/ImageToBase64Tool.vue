<script setup lang="ts">
import { ArrowRightLeft, CheckCircle2, Copy, FileCode2, Image as ImageIcon, Trash2, Upload } from 'lucide-vue-next'

const file = ref<File | null>(null)
const previewUrl = ref('')
const base64String = ref('')
const copiedRaw = ref(false)
const copiedDataUrl = ref(false)
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

function processFile(selectedFile: File) {
  file.value = selectedFile
  revokeUrl(previewUrl.value)
  previewUrl.value = URL.createObjectURL(selectedFile)

  const reader = new FileReader()
  reader.onload = (event) => {
    if (typeof event.target?.result === 'string') {
      base64String.value = event.target.result
    }
  }
  reader.readAsDataURL(selectedFile)
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (selectedFile) {
    processFile(selectedFile)
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

  processFile(droppedFile)
}

function clearFile() {
  file.value = null
  revokeUrl(previewUrl.value)
  previewUrl.value = ''
  base64String.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const pureBase64 = computed(() => base64String.value.split(',')[1] || '')

async function copyToClipboard(text: string, type: 'raw' | 'dataurl') {
  if (!text) {
    return
  }

  await navigator.clipboard.writeText(text)
  if (type === 'raw') {
    copiedRaw.value = true
    window.setTimeout(() => {
      copiedRaw.value = false
    }, 2000)
    return
  }

  copiedDataUrl.value = true
  window.setTimeout(() => {
    copiedDataUrl.value = false
  }, 2000)
}

onBeforeUnmount(() => {
  revokeUrl(previewUrl.value)
})
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
          <FileCode2 class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e293b]">图片转 Base64 编码工具</h1>
          <p class="text-[#64748b] mt-1 text-sm md:text-base">
            将图片文件转换为 Base64 字符串或完整 Data URL，适合内联小图标与接口传参场景。
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
        <p class="text-[#64748b] mb-6">或者将图片文件拖拽到此处，建议用于小于 2MB 的资源</p>
        <button class="bg-white border border-[#cbd5e1] text-[#0f172a] px-6 py-2.5 rounded-lg font-bold shadow-sm hover:border-[#94a3b8] hover:bg-slate-50 transition-colors flex items-center gap-2">
          <Upload class="w-4 h-4" />
          选择图片文件...
        </button>
      </div>

      <div v-else class="flex flex-col gap-6">
        <div class="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
          <h3 class="text-lg font-bold text-[#1e293b] flex items-center gap-2">
            <ImageIcon class="w-5 h-5 text-blue-500" />
            资源详情与转换结果
          </h3>
          <button
            class="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            @click="clearFile"
          >
            <Trash2 class="w-4 h-4" />重新选择
          </button>
        </div>

        <div
          v-if="file.size > 2 * 1024 * 1024"
          class="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm mb-4"
        >
          <span class="font-bold">提示：</span> 当前图片体积为 {{ formatSize(file.size) }}，生成的 Base64 文本会非常长，更推荐只用于小图标或短数据场景。
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          <div class="w-full lg:w-[300px] shrink-0">
            <h4 class="text-sm font-bold text-[#64748b] mb-3 uppercase tracking-wider">选择的图片</h4>
            <div class="flex flex-col">
              <div class="aspect-square bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjRUVFIi8+CjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIHg9IjQiIHk9IjQiIGZpbGw9IiNFRUUiLz4KPC9zdmc+')] rounded-xl border border-[#e2e8f0] overflow-hidden flex items-center justify-center mb-3">
                <img :src="previewUrl" alt="Preview" class="w-full h-full object-contain">
              </div>
              <div class="bg-[#f8fafc] rounded-lg p-3 border border-[#e2e8f0] space-y-1.5 text-[13px]">
                <div class="flex justify-between items-center">
                  <span class="text-slate-500">文件名</span>
                  <span class="font-bold text-slate-700 truncate w-[140px] text-right">{{ file.name }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-500">图片格式</span>
                  <span class="font-bold text-slate-700">{{ file.type }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-500">原始体积</span>
                  <span class="font-bold text-slate-700">{{ formatSize(file.size) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-1 space-y-5">
            <div>
              <div class="flex justify-between items-center mb-2">
                <h4 class="text-sm font-bold text-[#64748b] uppercase tracking-wider">完整 Data URL（含前缀）</h4>
                <button
                  class="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
                  @click="copyToClipboard(base64String, 'dataurl')"
                >
                  <CheckCircle2 v-if="copiedDataUrl" class="w-3.5 h-3.5 text-green-500" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  {{ copiedDataUrl ? '已复制，可直接用于 src' : '复制用于 <img>' }}
                </button>
              </div>
              <textarea
                readonly
                :value="base64String"
                class="w-full h-[140px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 font-mono text-[12px] text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none break-all shadow-inner custom-scrollbar"
              />
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <h4 class="text-sm font-bold text-[#64748b] uppercase tracking-wider">纯 Base64 文本（无前缀）</h4>
                <button
                  class="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
                  @click="copyToClipboard(pureBase64, 'raw')"
                >
                  <CheckCircle2 v-if="copiedRaw" class="w-3.5 h-3.5 text-green-500" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  {{ copiedRaw ? '已复制' : '复制用于纯文本 API' }}
                </button>
              </div>
              <textarea
                readonly
                :value="pureBase64"
                class="w-full h-[140px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 font-mono text-[12px] text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none break-all shadow-inner custom-scrollbar"
              />
            </div>
          </div>
        </div>

        <div class="mt-8 bg-amber-50 rounded-xl p-4 text-center border border-amber-100 flex items-center justify-center gap-2">
          <span class="text-amber-800 text-sm">相关推荐：</span>
          <NuxtLink to="/tools/base64" class="text-amber-600 hover:text-amber-700 font-bold underline flex items-center gap-1 text-sm">
            Base64 编码与解码工具<ArrowRightLeft class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="bg-[#f8fafc] rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 mt-6">
      <div class="prose max-w-none text-[14px] leading-loose text-[#475569]">
        <p class="mb-4">
          图片转 Base64 适合内联小图标、邮件模板资源或某些仅接受文本传输的接口场景。转换过程完全在本地浏览器完成。
        </p>
      </div>
    </div>
  </div>
</template>
