<script setup lang="ts">
import { ArrowDownUp, Check, Copy } from 'lucide-vue-next'

const input = ref('')
const output = ref('')
const mode = ref<'encode' | 'decode'>('encode')
const error = ref<string | null>(null)
const copied = ref(false)

function processText(text: string, currentMode: 'encode' | 'decode') {
  input.value = text

  if (!text.trim()) {
    output.value = ''
    error.value = null
    return
  }

  try {
    if (currentMode === 'encode') {
      const utf8Bytes = new TextEncoder().encode(text)
      const binaryString = Array.from(utf8Bytes)
        .map((value) => String.fromCharCode(value))
        .join('')
      output.value = btoa(binaryString)
    } else {
      const binaryString = atob(text)
      const bytes = new Uint8Array(binaryString.length)
      for (let index = 0; index < binaryString.length; index += 1) {
        bytes[index] = binaryString.charCodeAt(index)
      }
      output.value = new TextDecoder().decode(bytes)
    }
    error.value = null
  } catch (processError) {
    error.value = processError instanceof Error ? processError.message : 'Invalid format'
    output.value = ''
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
  if (!output.value) {
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
          Base64 {{ mode === 'encode' ? '编码器' : '解码器' }}
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          在 Base64 格式和文本之间转换，完全支持 UTF-8 编码。
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
          title="Swap input mode"
          @click="toggleMode"
        >
          <ArrowDownUp :size="16" /> 互换
        </button>
      </div>

      <div class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ mode === 'encode' ? '文本输入' : 'Base64 输入' }}
          </label>
          <textarea
            :value="input"
            spellcheck="false"
            class="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 font-mono resize-none bg-white min-h-[200px] break-all custom-scrollbar"
            :placeholder="mode === 'encode' ? '输入要编码的文本...' : '提取 Base64 字符串来解码...'"
            @input="processText(($event.target as HTMLTextAreaElement).value, mode)"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">
              {{ mode === 'encode' ? 'Base64 输出' : '文本输出' }}
            </label>
            <button
              :disabled="!output"
              class="inline-flex items-center gap-1 text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-md font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              @click="copyToClipboard"
            >
              <Check v-if="copied" :size="14" class="text-green-500" />
              <Copy v-else :size="14" />
              {{ copied ? '已复制' : '复制结果' }}
            </button>
          </div>

          <div class="relative">
            <textarea
              readonly
              :value="error ? '' : output"
              :class="[
                'block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 font-mono resize-none bg-gray-50 min-h-[200px] break-all custom-scrollbar',
                error ? 'ring-red-300' : 'ring-gray-300',
              ]"
              placeholder="Result will appear here..."
              spellcheck="false"
            />
            <div
              v-if="error"
              class="absolute inset-0 bg-red-50/90 flex items-center justify-center rounded-lg border border-red-200"
            >
              <p class="text-red-600 font-medium">{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
