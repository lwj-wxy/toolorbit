<script setup lang="ts">
import { ArrowDownUp, Check, Copy } from 'lucide-vue-next'

const input = ref('')
const output = ref('')
const mode = ref<'encode' | 'decode'>('encode')
const copied = ref(false)

function processText(text: string, currentMode: 'encode' | 'decode') {
  input.value = text

  if (!text.trim()) {
    output.value = ''
    return
  }

  try {
    output.value = currentMode === 'encode' ? encodeURIComponent(text) : decodeURIComponent(text)
  } catch {
    output.value = 'Invalid format'
  }
}

function setModeAndProcess(nextMode: 'encode' | 'decode') {
  mode.value = nextMode
  processText(input.value, nextMode)
}

function toggleMode() {
  const nextMode = mode.value === 'encode' ? 'decode' : 'encode'
  mode.value = nextMode
  processText(input.value, nextMode)
}

async function copyToClipboard() {
  if (!output.value || output.value === 'Invalid format') {
    return
  }

  await navigator.clipboard.writeText(output.value)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          URL {{ mode === 'encode' ? '编码器' : '解码器' }}
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          安全地编码您的网址参数或将其解码为可读的标准格式。
        </p>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div class="flex bg-gray-200 rounded-lg p-1">
          <button
            :class="mode === 'encode' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'"
            class="px-4 py-1.5 text-sm font-medium rounded-md transition-colors"
            @click="setModeAndProcess('encode')"
          >
            编码 (Encode)
          </button>
          <button
            :class="mode === 'decode' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'"
            class="px-4 py-1.5 text-sm font-medium rounded-md transition-colors"
            @click="setModeAndProcess('decode')"
          >
            解码 (Decode)
          </button>
        </div>

        <button
          class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors font-medium"
          @click="toggleMode"
        >
          <ArrowDownUp :size="16" /> 互换
        </button>
      </div>

      <div class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
          <textarea
            :value="input"
            class="block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm font-mono resize-none bg-white min-h-[150px]"
            :placeholder="mode === 'encode' ? 'https://example.com/search?q=hello world' : 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world'"
            @input="processText(($event.target as HTMLTextAreaElement).value, mode)"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">输出结果</label>
            <button
              :disabled="!output || output === 'Invalid format'"
              class="inline-flex items-center gap-1 text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-md font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              @click="copyToClipboard"
            >
              <Check v-if="copied" :size="14" class="text-green-500" />
              <Copy v-else :size="14" />
              {{ copied ? '已复制' : '复制结果' }}
            </button>
          </div>

          <textarea
            readonly
            :value="output"
            class="block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm font-mono resize-none bg-gray-50 min-h-[150px] ring-gray-300"
          />
        </div>
      </div>
    </div>
  </div>
</template>
