<script setup lang="ts">
import { Download, QrCode } from 'lucide-vue-next'
import JsBarcode from 'jsbarcode'

const content = ref('TOOLORBIT-2026')
const format = ref<'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC' | 'ITF14'>('CODE128')
const error = ref('')
const svgRef = ref<SVGSVGElement | null>(null)

function renderBarcode() {
  if (!svgRef.value) {
    return
  }

  error.value = ''

  try {
    JsBarcode(svgRef.value, content.value.trim(), {
      format: format.value,
      lineColor: '#0f172a',
      width: 2,
      height: 80,
      displayValue: true,
      margin: 12,
      background: '#ffffff',
    })
  } catch (e) {
    error.value = e instanceof Error ? e.message : '条形码生成失败'
  }
}

function downloadSvg() {
  if (!svgRef.value) {
    return
  }

  const svgContent = svgRef.value.outerHTML
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `barcode-${Date.now()}.svg`
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  renderBarcode()
})

watch([content, format], () => {
  renderBarcode()
})
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl border border-[#e2e8f0] p-6 lg:p-8 shadow-sm">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center">
          <QrCode class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e293b]">条形码生成器</h1>
          <p class="text-sm text-[#64748b] mt-1">支持 CODE128 / CODE39 / EAN / UPC，本地实时生成。</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm space-y-4">
        <label class="block text-sm font-bold text-[#334155]">条码内容</label>
        <input
          v-model="content"
          type="text"
          class="w-full rounded-lg border border-[#cbd5e1] px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="请输入条码内容"
        >

        <label class="block text-sm font-bold text-[#334155]">条码格式</label>
        <select
          v-model="format"
          class="w-full rounded-lg border border-[#cbd5e1] px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="CODE128">CODE128</option>
          <option value="CODE39">CODE39</option>
          <option value="EAN13">EAN13</option>
          <option value="EAN8">EAN8</option>
          <option value="UPC">UPC</option>
          <option value="ITF14">ITF14</option>
        </select>

        <button
          class="w-full rounded-xl bg-[#2563eb] text-white py-3 font-bold hover:bg-[#1d4ed8] transition-colors"
          @click="downloadSvg"
        >
          <span class="inline-flex items-center gap-2"><Download class="w-4 h-4" /> 下载 SVG</span>
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
        <div class="h-full min-h-[280px] rounded-xl bg-[#f8fafc] border border-[#e2e8f0] p-4 flex items-center justify-center">
          <svg ref="svgRef" />
        </div>
        <p v-if="error" class="text-sm text-red-600 mt-3">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
