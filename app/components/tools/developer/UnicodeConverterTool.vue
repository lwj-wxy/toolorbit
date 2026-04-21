<script setup lang="ts">
import { ArrowLeftRight, Copy } from 'lucide-vue-next'

const input = ref('')
const output = ref('')
const copied = ref(false)
const mode = ref<'encode' | 'decode'>('encode')

function encodeUnicode(value: string) {
  return Array.from(value)
    .map((char) => {
      const code = char.codePointAt(0)
      if (code === undefined) {
        return char
      }
      if (code <= 0xffff) {
        return `\\u${code.toString(16).padStart(4, '0')}`
      }
      return `\\u{${code.toString(16)}}`
    })
    .join('')
}

function decodeUnicode(value: string) {
  return value
    .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
}

function runConvert() {
  output.value = mode.value === 'encode' ? encodeUnicode(input.value) : decodeUnicode(input.value)
}

async function copyResult() {
  if (!output.value) {
    return
  }
  await navigator.clipboard.writeText(output.value)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1200)
}

watch([input, mode], runConvert, { immediate: true })
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl border border-[#e2e8f0] p-6 lg:p-8 shadow-sm">
      <h1 class="text-2xl font-bold text-[#1e293b]">Unicode 与中文转换</h1>
      <p class="text-sm text-[#64748b] mt-1">支持中文转 Unicode 转义，或 Unicode 反转中文。</p>
    </div>

    <div class="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm space-y-4">
      <div class="flex items-center gap-4">
        <label class="inline-flex items-center gap-2 text-sm font-medium">
          <input v-model="mode" type="radio" value="encode" class="accent-[#2563eb]"> 中文 -> Unicode
        </label>
        <label class="inline-flex items-center gap-2 text-sm font-medium">
          <input v-model="mode" type="radio" value="decode" class="accent-[#2563eb]"> Unicode -> 中文
        </label>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-bold text-[#334155] mb-2">输入</label>
          <textarea v-model="input" class="w-full h-[260px] rounded-xl border border-[#e2e8f0] p-3 text-sm resize-none" />
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-bold text-[#334155]">输出</label>
            <button class="text-xs px-3 py-1.5 rounded-md border border-[#cbd5e1]" @click="copyResult">
              <span class="inline-flex items-center gap-1"><Copy class="w-3.5 h-3.5" /> {{ copied ? '已复制' : '复制' }}</span>
            </button>
          </div>
          <textarea readonly :value="output" class="w-full h-[260px] rounded-xl border border-[#e2e8f0] p-3 text-sm bg-[#f8fafc] resize-none" />
        </div>
      </div>

      <div class="text-xs text-[#64748b] inline-flex items-center gap-2">
        <ArrowLeftRight class="w-3.5 h-3.5" /> 实时转换，输入即输出。
      </div>
    </div>
  </div>
</template>
