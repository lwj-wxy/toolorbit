<script setup lang="ts">
import QRCode from 'qrcode'
import { Download } from 'lucide-vue-next'

const value = ref('https://toolorbit.site')
const fgColor = ref('#000000')
const bgColor = ref('#ffffff')
const level = ref<'L' | 'M' | 'Q' | 'H'>('H')
const qrDataUrl = ref('')

async function renderQrCode() {
  qrDataUrl.value = await QRCode.toDataURL(value.value || 'https://toolorbit.site', {
    width: 220,
    margin: 0,
    color: {
      dark: fgColor.value,
      light: bgColor.value,
    },
    errorCorrectionLevel: level.value,
  })
}

watch([value, fgColor, bgColor, level], () => {
  void renderQrCode()
}, { immediate: true })

function handleDownload() {
  if (!qrDataUrl.value) {
    return
  }

  const downloadLink = document.createElement('a')
  downloadLink.href = qrDataUrl.value
  downloadLink.download = 'qrcode.png'
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          二维码生成器
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          一键创建高质量、可定制颜色的二维码及纠错率。
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">生成内容（网址、文本、手机号...）</label>
            <textarea
              v-model="value"
              class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm resize-none"
              rows="4"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">二维码颜色</label>
              <div class="flex items-center gap-3">
                <input
                  v-model="fgColor"
                  type="color"
                  class="h-8 w-12 rounded cursor-pointer p-0 border-0"
                />
                <span class="text-sm font-mono text-gray-500 uppercase">{{ fgColor }}</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">背景颜色</label>
              <div class="flex items-center gap-3">
                <input
                  v-model="bgColor"
                  type="color"
                  class="h-8 w-12 rounded cursor-pointer p-0 border-0"
                />
                <span class="text-sm font-mono text-gray-500 uppercase">{{ bgColor }}</span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">容错率设置</label>
            <select
              v-model="level"
              class="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
            >
              <option value="L">低 (7%) - 适用于简单文本</option>
              <option value="M">中 (15%)</option>
              <option value="Q">中高 (25%)</option>
              <option value="H">高 (30%) - 适用于带Logo的二维码</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center">
        <div
          class="p-4 rounded-xl shadow-sm border border-gray-100 mb-6 bg-white transition-all transform hover:scale-105"
          :style="{ backgroundColor: bgColor }"
        >
          <img
            v-if="qrDataUrl"
            :src="qrDataUrl"
            alt="二维码"
            width="220"
            height="220"
          />
        </div>

        <button
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          @click="handleDownload"
        >
          <Download :size="18" /> 导出为 PNG
        </button>
      </div>
    </div>
  </div>
</template>
