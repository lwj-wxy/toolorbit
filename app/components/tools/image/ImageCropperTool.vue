<script setup lang="ts">
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { CheckCircle2, Columns, Crop as CropIcon, Download, Image as ImageIcon, Maximize, MousePointer2, Settings2, Trash2, Upload } from 'lucide-vue-next'

const imgSrc = ref('')
const file = ref<File | null>(null)
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const aspect = ref<number | undefined>(undefined)
const actualWidth = ref(0)
const actualHeight = ref(0)
const cropWidth = ref(0)
const cropHeight = ref(0)

let cropper: Cropper | null = null

function destroyCropper() {
  cropper?.destroy()
  cropper = null
}

function revokeUrl(url: string) {
  if (url) {
    URL.revokeObjectURL(url)
  }
}

function updateCropSize() {
  if (!cropper) {
    cropWidth.value = 0
    cropHeight.value = 0
    return
  }

  const data = cropper.getData(true)
  cropWidth.value = Math.max(0, Math.round(data.width))
  cropHeight.value = Math.max(0, Math.round(data.height))
}

async function initCropper() {
  await nextTick()
  if (!imageRef.value) {
    return
  }

  destroyCropper()
  cropper = new Cropper(imageRef.value, {
    viewMode: 1,
    dragMode: 'move',
    autoCropArea: 0.9,
    responsive: true,
    background: false,
    aspectRatio: aspect.value || NaN,
    ready() {
      const data = cropper?.getImageData()
      actualWidth.value = Math.round(data?.naturalWidth || 0)
      actualHeight.value = Math.round(data?.naturalHeight || 0)
      updateCropSize()
    },
    crop() {
      updateCropSize()
    },
  })
}

function processFile(selectedFile: File) {
  file.value = selectedFile
  aspect.value = undefined
  revokeUrl(imgSrc.value)
  imgSrc.value = URL.createObjectURL(selectedFile)
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

function handleAspectClick(nextAspect: number | undefined) {
  aspect.value = nextAspect
  if (!cropper) {
    return
  }

  cropper.setAspectRatio(nextAspect || NaN)
  cropper.reset()
  cropper.crop()
  updateCropSize()
}

function downloadCroppedImage() {
  if (!cropper || !file.value) {
    return
  }

  const canvas = cropper.getCroppedCanvas({
    fillColor: '#FFFFFF',
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
  })

  canvas.toBlob((blob) => {
    if (!blob) {
      return
    }

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${file.value?.name.replace(/\.[^/.]+$/, '')}-cropped.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 'image/jpeg', 0.95)
}

function clearFile() {
  revokeUrl(imgSrc.value)
  imgSrc.value = ''
  file.value = null
  cropWidth.value = 0
  cropHeight.value = 0
  actualWidth.value = 0
  actualHeight.value = 0
  destroyCropper()
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

watch(imgSrc, async (value) => {
  if (!value) {
    return
  }

  await initCropper()
})

onBeforeUnmount(() => {
  destroyCropper()
  revokeUrl(imgSrc.value)
})
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
          <CropIcon class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e293b]">图片裁剪与缩略图生成</h1>
          <p class="text-[#64748b] mt-1 text-sm md:text-base">
            通过可视化选区自由裁剪图片，并输出裁剪后的高清结果，保留你现在的页面视觉风格。
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
          <div
            v-if="!imgSrc"
            :class="[
              'rounded-2xl border-2 border-dashed transition-all p-12 text-center flex flex-col items-center justify-center min-h-[400px] cursor-pointer',
              isDragging ? 'border-[#2563eb] bg-blue-50/50' : 'border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50',
            ]"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop="handleDrop"
            @click="fileInputRef?.click()"
          >
            <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleFileChange">
            <div class="w-20 h-20 bg-blue-50 text-[#2563eb] rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Upload class="w-10 h-10" />
            </div>
            <h3 class="text-xl font-bold text-[#1e293b] mb-2">点击选择或拖入要裁剪的图片</h3>
            <p class="text-[#64748b] mb-6">支持自由选区与固定比例裁切，整个过程在本地浏览器内完成</p>
            <button class="bg-[#2563eb] text-white px-8 py-3 rounded-full font-bold shadow-sm hover:bg-[#1d4ed8] transition-colors">
              选择本地图片
            </button>
          </div>

          <div v-else class="space-y-4">
            <div class="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
              <h3 class="text-lg font-bold text-[#1e293b] flex items-center gap-2 truncate">
                <ImageIcon class="w-5 h-5 text-blue-500" />
                正在编辑：{{ file?.name }}
              </h3>
              <button
                class="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                @click="clearFile"
              >
                <Trash2 class="w-4 h-4" />重新选择
              </button>
            </div>

            <div class="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-4 flex justify-center items-center overflow-x-auto min-h-[420px]">
              <img ref="imageRef" :src="imgSrc" alt="Crop me" class="max-w-full max-h-[600px] object-contain">
            </div>

            <div class="flex justify-between items-center text-sm text-[#64748b] px-2 font-medium">
              <div class="flex items-center gap-2">
                <MousePointer2 class="w-4 h-4" /> 拖拽图片和裁剪框即可调整区域
              </div>
              <div>原图尺寸：{{ actualWidth }} × {{ actualHeight }} px</div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
          <div class="flex items-center gap-2 mb-6">
            <Settings2 class="w-5 h-5 text-[#2563eb]" />
            <h3 class="font-bold text-[#1e293b]">裁剪参数控制</h3>
          </div>

          <div class="space-y-6">
            <div>
              <label class="text-sm font-bold text-[#64748b] mb-3 block">宽高比例限制</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  :disabled="!imgSrc"
                  :class="!aspect ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-[#e2e8f0] text-slate-600 hover:border-slate-300'"
                  class="py-2 rounded-lg font-bold text-sm transition-all border disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="handleAspectClick(undefined)"
                >
                  自由拖拽
                </button>
                <button
                  :disabled="!imgSrc"
                  :class="aspect === 1 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-[#e2e8f0] text-slate-600 hover:border-slate-300'"
                  class="py-2 rounded-lg font-bold text-sm transition-all border disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="handleAspectClick(1)"
                >
                  1:1
                </button>
                <button
                  :disabled="!imgSrc"
                  :class="aspect === 16 / 9 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-[#e2e8f0] text-slate-600 hover:border-slate-300'"
                  class="py-2 rounded-lg font-bold text-sm transition-all border disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="handleAspectClick(16 / 9)"
                >
                  16:9
                </button>
                <button
                  :disabled="!imgSrc"
                  :class="aspect === 4 / 3 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-[#e2e8f0] text-slate-600 hover:border-slate-300'"
                  class="py-2 rounded-lg font-bold text-sm transition-all border disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="handleAspectClick(4 / 3)"
                >
                  4:3
                </button>
                <button
                  :disabled="!imgSrc"
                  :class="aspect === 9 / 16 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-[#e2e8f0] text-slate-600 hover:border-slate-300'"
                  class="py-2 col-span-2 rounded-lg font-bold text-sm transition-all border disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="handleAspectClick(9 / 16)"
                >
                  9:16
                </button>
              </div>
            </div>

            <div class="bg-[#f8fafc] border border-[#e2e8f0] p-4 rounded-xl">
              <label class="text-sm font-bold text-[#64748b] mb-3 flex items-center gap-1">
                <Columns class="w-4 h-4" /> 最终输出画面尺寸
              </label>
              <div class="flex items-center gap-4 text-center">
                <div class="flex-1 bg-white border border-[#cbd5e1] rounded-lg p-2 shadow-sm relative">
                  <span class="block text-[#0f172a] font-mono font-bold text-xl tracking-tight">{{ cropWidth }}</span>
                  <span class="text-[11px] text-[#64748b] uppercase font-bold tracking-wider">宽度 (px)</span>
                </div>
                <div class="text-slate-300">
                  <Maximize class="w-5 h-5 mx-auto" />
                </div>
                <div class="flex-1 bg-white border border-[#cbd5e1] rounded-lg p-2 shadow-sm relative">
                  <span class="block text-[#0f172a] font-mono font-bold text-xl tracking-tight">{{ cropHeight }}</span>
                  <span class="text-[11px] text-[#64748b] uppercase font-bold tracking-wider">高度 (px)</span>
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-[#e2e8f0] mt-6 pt-6">
            <button
              :disabled="!imgSrc || !cropWidth || !cropHeight"
              class="w-full bg-[#2563eb] text-white hover:bg-[#1d4ed8] disabled:bg-slate-300 disabled:cursor-not-allowed py-3.5 rounded-xl font-bold shadow-sm transition-all flex justify-center items-center gap-2 text-[15px]"
              @click="downloadCroppedImage"
            >
              <Download class="w-5 h-5" />
              下载裁剪后的结果
            </button>
          </div>
        </div>

        <div class="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 class="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <p class="text-sm text-green-800 leading-relaxed font-medium">
            纯本地裁剪输出：不会把图片上传到服务器，操作和结果都只留在当前浏览器里。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
