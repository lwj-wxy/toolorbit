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
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

onBeforeUnmount(() => {
  clearAll()
})
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-6">
    <div class="flex items-center gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm lg:p-8">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563eb]">
        <FileImage class="h-6 w-6" />
      </div>
      <div class="min-w-0">
        <h1 class="text-2xl font-bold text-[#1e293b]">图片转 PDF 工具</h1>
        <p class="mt-1 text-sm text-[#64748b] md:text-base">
          将多张图片无损合并为一个 PDF 文件，保留清晰预览、排序与导出流程，适合快速整理文档或图片合集。
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_360px] lg:gap-8">
      <div class="space-y-6">
        <div class="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm lg:p-7">
          <div class="mb-6 flex flex-col gap-4 border-b border-[#eef2f7] pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 class="text-lg font-bold text-[#1e293b]">上传与排序</h2>
              <p class="mt-1 text-sm text-[#64748b]">
                主工作区集中在左侧，导入、预览和排序都在同一视觉路径里完成，空状态也不会显得松散。
              </p>
            </div>

            <div class="flex flex-wrap gap-2 text-xs font-semibold text-[#475569]">
              <span class="rounded-full border border-[#dbeafe] bg-blue-50 px-3 py-1.5 text-[#2563eb]">支持批量导入</span>
              <span class="rounded-full border border-[#e2e8f0] bg-[#f8fafc] px-3 py-1.5">导出前可调整顺序</span>
              <span class="rounded-full border border-[#dcfce7] bg-green-50 px-3 py-1.5 text-green-700">浏览器本地处理</span>
            </div>
          </div>

          <div
            :class="[
              'mb-6 flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all lg:min-h-[360px]',
              isDragging ? 'border-[#2563eb] bg-blue-50/50' : 'border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50',
            ]"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop="handleDrop"
            @click="fileInputRef?.click()"
          >
            <input ref="fileInputRef" type="file" accept="image/*" multiple class="hidden" @change="handleFileChange">
            <div class="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#2563eb] shadow-sm">
              <Upload class="h-8 w-8" />
            </div>
            <h3 class="mb-2 text-xl font-bold text-[#1e293b]">拖拽或点击选择多张图片</h3>
            <p class="max-w-xl text-sm leading-7 text-[#64748b] md:text-base">
              支持一次导入多张图片，上传后可按页面顺序整理，再导出为一个 PDF 文件。
            </p>
            <div class="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-[#64748b]">
              <span class="rounded-full border border-[#e2e8f0] bg-white px-3 py-1.5">JPG / PNG / WebP</span>
              <span class="rounded-full border border-[#e2e8f0] bg-white px-3 py-1.5">拖拽或点击导入</span>
              <span class="rounded-full border border-[#e2e8f0] bg-white px-3 py-1.5">导出前可上下排序</span>
            </div>
          </div>

          <div v-if="images.length > 0" class="space-y-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 class="flex items-center gap-2 font-bold text-[#1e293b]">
                <CheckCircle2 class="h-5 w-5 text-green-500" />
                已选图片 ({{ images.length }} 张)
              </h3>
              <button
                class="rounded-lg px-3 py-1.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                @click="clearAll"
              >
                全部清空
              </button>
            </div>

            <div class="custom-scrollbar max-h-[500px] space-y-3 overflow-y-auto pr-2">
              <div
                v-for="(image, index) in images"
                :key="image.id"
                class="group flex items-center gap-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3 transition-all hover:border-blue-200 hover:shadow-sm"
              >
                <div class="cursor-move text-slate-400">
                  <GripVertical class="h-5 w-5" />
                </div>

                <div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#e2e8f0] bg-white">
                  <img :src="image.url" alt="thumbnail" class="h-full w-full object-cover">
                </div>

                <div class="min-w-0 flex-1">
                  <p class="mb-1 truncate text-sm font-bold text-[#1e293b]">{{ image.file.name }}</p>
                  <p class="text-xs text-[#64748b]">{{ (image.file.size / 1024).toFixed(1) }} KB</p>
                </div>

                <div class="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                  <button
                    :disabled="index === 0"
                    class="rounded p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
                    title="上移"
                    @click="moveUp(index)"
                  >
                    <ArrowUp class="h-4 w-4" />
                  </button>
                  <button
                    :disabled="index === images.length - 1"
                    class="rounded p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
                    title="下移"
                    @click="moveDown(index)"
                  >
                    <ArrowDown class="h-4 w-4" />
                  </button>
                  <button
                    class="ml-1 rounded p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                    title="删除"
                    @click="removeImage(image.id)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="grid gap-3 md:grid-cols-3">
            <div class="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
              <div class="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-[#2563eb]">1</div>
              <h3 class="font-bold text-[#1e293b]">批量导入</h3>
              <p class="mt-2 text-sm leading-6 text-[#64748b]">一次选择多张图片，适合整理截图、扫描件或海报合集。</p>
            </div>
            <div class="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
              <div class="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-[#2563eb]">2</div>
              <h3 class="font-bold text-[#1e293b]">调整顺序</h3>
              <p class="mt-2 text-sm leading-6 text-[#64748b]">上传后可上下移动图片，让导出的 PDF 页面顺序更符合阅读流程。</p>
            </div>
            <div class="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
              <div class="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-[#2563eb]">3</div>
              <h3 class="font-bold text-[#1e293b]">本地导出</h3>
              <p class="mt-2 text-sm leading-6 text-[#64748b]">所有处理都在浏览器中完成，不上传服务器，隐私和速度都更稳妥。</p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:sticky lg:top-24">
        <div class="space-y-6 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="font-bold text-[#1e293b]">输出设置</h3>
              <p class="mt-1 text-sm leading-6 text-[#64748b]">
                参数集中在右侧辅助栏，保持主区专注于导入和排序。
              </p>
            </div>
            <div class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563eb]">
              {{ images.length }} 张
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-3 text-center">
              <div class="text-lg font-bold text-[#1e293b]">{{ images.length }}</div>
              <div class="mt-1 text-[11px] font-medium text-[#64748b]">已选图片</div>
            </div>
            <div class="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-3 text-center">
              <div class="text-lg font-bold text-[#1e293b]">{{ pageFormat === 'a4' ? 'A4' : '自适应' }}</div>
              <div class="mt-1 text-[11px] font-medium text-[#64748b]">页面尺寸</div>
            </div>
            <div class="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-3 text-center">
              <div class="text-lg font-bold text-[#1e293b]">本地</div>
              <div class="mt-1 text-[11px] font-medium text-[#64748b]">处理方式</div>
            </div>
          </div>

          <div class="space-y-5">
            <div>
              <label class="mb-3 block text-sm font-bold text-[#64748b]">页面尺寸</label>
              <div class="space-y-3">
                <label
                  :class="[
                    'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
                    pageFormat === 'a4'
                      ? 'border-blue-200 bg-blue-50/40 ring-1 ring-blue-100'
                      : 'border-[#e2e8f0] hover:border-blue-200 hover:bg-blue-50/30',
                  ]"
                >
                  <input v-model="pageFormat" type="radio" value="a4" class="mt-0.5 accent-[#2563eb]">
                  <div>
                    <div class="text-sm font-bold text-[#1e293b] md:text-base">A4 纸张</div>
                    <div class="mt-1 text-[12px] leading-6 text-[#64748b]">
                      自动缩放图片并居中排版，适合文档打印或标准输出。
                    </div>
                  </div>
                </label>
                <label
                  :class="[
                    'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
                    pageFormat === 'fit'
                      ? 'border-blue-200 bg-blue-50/40 ring-1 ring-blue-100'
                      : 'border-[#e2e8f0] hover:border-blue-200 hover:bg-blue-50/30',
                  ]"
                >
                  <input v-model="pageFormat" type="radio" value="fit" class="mt-0.5 accent-[#2563eb]">
                  <div>
                    <div class="text-sm font-bold text-[#1e293b] md:text-base">适应图片</div>
                    <div class="mt-1 text-[12px] leading-6 text-[#64748b]">
                      每页尺寸随图片变化，更适合海报或整图导出。
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="border-t border-[#e2e8f0] pt-6">
            <button
              :disabled="isGenerating || images.length === 0"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-3.5 text-[15px] font-bold text-white shadow-sm transition-all hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:bg-slate-300"
              @click="generatePDF"
            >
              <template v-if="isGenerating">正在生成 PDF...</template>
              <template v-else>
                <Download class="h-5 w-5" />
                导出 PDF 文件
              </template>
            </button>
          </div>

          <div class="flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4">
            <CheckCircle2 class="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
            <p class="text-sm font-medium leading-relaxed text-green-800">
              纯本地处理：图片不会上传到服务器，排序、合并和导出都发生在当前浏览器中。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
