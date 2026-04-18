<script setup lang="ts">
import { ArrowDown, ArrowUp, CheckCircle2, Download, FileImage, GripVertical, Trash2, Upload } from 'lucide-vue-next'
import { jsPDF } from 'jspdf'

interface LoadedImage {
  id: string
  file: File
  url: string
}

const images = ref<LoadedImage[]>([])
const isGenerating = ref(false)
const pageFormat = ref<'a4' | 'fit'>('a4')
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

function revokeImageUrl(image: LoadedImage) {
  URL.revokeObjectURL(image.url)
}

function addFiles(files: File[]) {
  const validImages = files.filter((file) => file.type.startsWith('image/'))
  const newImages = validImages.map((currentFile) => ({
    id: Math.random().toString(36).slice(2, 9),
    file: currentFile,
    url: URL.createObjectURL(currentFile),
  }))
  images.value = [...images.value, ...newImages]
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
  addFiles(droppedFiles)
}

function removeImage(id: string) {
  const image = images.value.find((item) => item.id === id)
  if (image) {
    revokeImageUrl(image)
  }
  images.value = images.value.filter((item) => item.id !== id)
}

function moveUp(index: number) {
  if (index === 0) {
    return
  }

  const nextImages = [...images.value]
  ;[nextImages[index - 1], nextImages[index]] = [nextImages[index], nextImages[index - 1]]
  images.value = nextImages
}

function moveDown(index: number) {
  if (index >= images.value.length - 1) {
    return
  }

  const nextImages = [...images.value]
  ;[nextImages[index + 1], nextImages[index]] = [nextImages[index], nextImages[index + 1]]
  images.value = nextImages
}

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('图片加载失败'))
    image.src = source
  })
}

async function generatePDF() {
  if (!images.value.length) {
    return
  }

  isGenerating.value = true

  try {
    let pdf: jsPDF | null = null

    for (const currentImage of images.value) {
      const image = await loadImage(currentImage.url)
      const widthInMm = image.width * 0.264583
      const heightInMm = image.height * 0.264583
      const orientation = widthInMm > heightInMm ? 'landscape' : 'portrait'

      if (!pdf) {
        pdf = new jsPDF({
          orientation,
          unit: 'mm',
          format: pageFormat.value === 'a4' ? 'a4' : [widthInMm, heightInMm],
        })
      } else if (pageFormat.value === 'a4') {
        pdf.addPage('a4', 'portrait')
      } else {
        pdf.addPage([widthInMm, heightInMm], orientation)
      }

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      let finalWidth = pageWidth
      let finalHeight = pageHeight
      let offsetX = 0
      let offsetY = 0

      if (pageFormat.value === 'a4') {
        const imageRatio = image.width / image.height
        const pageRatio = pageWidth / pageHeight

        if (imageRatio > pageRatio) {
          finalWidth = pageWidth
          finalHeight = pageWidth / imageRatio
          offsetY = (pageHeight - finalHeight) / 2
        } else {
          finalHeight = pageHeight
          finalWidth = pageHeight * imageRatio
          offsetX = (pageWidth - finalWidth) / 2
        }
      }

      const format =
        currentImage.file.type === 'image/png'
          ? 'PNG'
          : currentImage.file.type === 'image/webp'
            ? 'WEBP'
            : 'JPEG'

      pdf.addImage(image, format, offsetX, offsetY, finalWidth, finalHeight)
    }

    pdf?.save('merged-images.pdf')
  } catch (error) {
    console.error(error)
    window.alert('生成 PDF 失败，请检查图片格式后重试。')
  } finally {
    isGenerating.value = false
  }
}

function clearAll() {
  images.value.forEach(revokeImageUrl)
  images.value = []
}

onBeforeUnmount(() => {
  clearAll()
})
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
          <FileImage class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e293b]">图片转 PDF 工具</h1>
          <p class="text-[#64748b] mt-1 text-sm md:text-base">
            将多张图片无损合并为一个 PDF 文件，按现有视觉风格保留操作区与列表区布局。
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
          <div
            :class="[
              'rounded-xl border-2 border-dashed transition-all p-8 text-center flex flex-col items-center justify-center cursor-pointer mb-6',
              isDragging ? 'border-[#2563eb] bg-blue-50/50' : 'border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50',
            ]"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop="handleDrop"
            @click="fileInputRef?.click()"
          >
            <input ref="fileInputRef" type="file" accept="image/*" multiple class="hidden" @change="handleFileChange">
            <Upload class="w-8 h-8 text-[#2563eb] mb-3" />
            <h3 class="text-lg font-bold text-[#1e293b] mb-1">拖拽或点击选择多张图片</h3>
            <p class="text-sm text-[#64748b]">支持批量选择，可调整排序后导出 PDF</p>
          </div>

          <div v-if="images.length > 0" class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-[#1e293b] flex items-center gap-2">
                <CheckCircle2 class="w-5 h-5 text-green-500" />
                已选图片 ({{ images.length }} 张)
              </h3>
              <button
                class="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                @click="clearAll"
              >
                全部清空
              </button>
            </div>

            <div class="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <div
                v-for="(image, index) in images"
                :key="image.id"
                class="flex items-center gap-4 bg-[#f8fafc] border border-[#e2e8f0] p-3 rounded-xl transition-all hover:border-blue-200 hover:shadow-sm group"
              >
                <div class="cursor-move text-slate-400">
                  <GripVertical class="w-5 h-5" />
                </div>

                <div class="w-16 h-16 rounded-lg overflow-hidden border border-[#e2e8f0] shrink-0 bg-white">
                  <img :src="image.url" alt="thumbnail" class="w-full h-full object-cover">
                </div>

                <div class="flex-1 min-w-0">
                  <p class="font-bold text-[#1e293b] truncate text-sm mb-1">{{ image.file.name }}</p>
                  <p class="text-xs text-[#64748b]">{{ (image.file.size / 1024).toFixed(1) }} KB</p>
                </div>

                <div class="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    :disabled="index === 0"
                    class="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="上移"
                    @click="moveUp(index)"
                  >
                    <ArrowUp class="w-4 h-4" />
                  </button>
                  <button
                    :disabled="index === images.length - 1"
                    class="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="下移"
                    @click="moveDown(index)"
                  >
                    <ArrowDown class="w-4 h-4" />
                  </button>
                  <button
                    class="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded ml-1"
                    title="删除"
                    @click="removeImage(image.id)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
          <h3 class="font-bold text-[#1e293b] mb-4">输出设置</h3>
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-bold text-[#64748b] mb-3">页面尺寸</label>
              <div class="space-y-3">
                <label class="flex items-start gap-3 cursor-pointer p-3 border border-[#e2e8f0] rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                  <input v-model="pageFormat" type="radio" value="a4" class="mt-0.5 accent-[#2563eb]">
                  <div>
                    <div class="font-bold text-[#1e293b] text-sm md:text-base">A4 纸张</div>
                    <div class="text-[12px] text-[#64748b] mt-1">自动缩放图片并居中排版，适合文档打印或标准输出。</div>
                  </div>
                </label>
                <label class="flex items-start gap-3 cursor-pointer p-3 border border-[#e2e8f0] rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                  <input v-model="pageFormat" type="radio" value="fit" class="mt-0.5 accent-[#2563eb]">
                  <div>
                    <div class="font-bold text-[#1e293b] text-sm md:text-base">适应图片</div>
                    <div class="text-[12px] text-[#64748b] mt-1">每页尺寸随图片变化，更适合海报或整图导出。</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="border-t border-[#e2e8f0] mt-6 pt-6">
            <button
              :disabled="isGenerating || images.length === 0"
              class="w-full bg-[#2563eb] text-white hover:bg-[#1d4ed8] disabled:bg-slate-300 disabled:cursor-not-allowed py-3.5 rounded-xl font-bold shadow-sm transition-all flex justify-center items-center gap-2 text-[15px]"
              @click="generatePDF"
            >
              <template v-if="isGenerating">正在生成 PDF...</template>
              <template v-else>
                <Download class="w-5 h-5" />
                导出 PDF 文件
              </template>
            </button>
          </div>
        </div>

        <div class="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 class="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <p class="text-sm text-green-800 leading-relaxed font-medium">
            纯本地处理：图片不会上传到服务器，排序、合并和导出都发生在当前浏览器中。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
