<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next'

const input = ref('')
const hashes = ref<Record<string, string>>({
  'SHA-1': '',
  'SHA-256': '',
  'SHA-384': '',
  'SHA-512': '',
})
const copiedHash = ref<string | null>(null)

async function generateHashes(text: string) {
  if (!text) {
    hashes.value = {
      'SHA-1': '',
      'SHA-256': '',
      'SHA-384': '',
      'SHA-512': '',
    }
    return
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']
  const nextHashes: Record<string, string> = {}

  for (const algorithm of algorithms) {
    const hashBuffer = await crypto.subtle.digest(algorithm, data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    nextHashes[algorithm] = hashArray
      .map((value) => value.toString(16).padStart(2, '0'))
      .join('')
  }

  hashes.value = nextHashes
}

watch(input, (value) => {
  void generateHashes(value)
}, { immediate: true })

async function copyToClipboard(text: string, algorithm: string) {
  await navigator.clipboard.writeText(text)
  copiedHash.value = algorithm
  window.setTimeout(() => {
    copiedHash.value = null
  }, 2000)
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          哈希生成器
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          使用 Web Crypto API 快速生成安全的加密哈希值。
        </p>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6 space-y-8">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
        <textarea
          v-model="input"
          class="block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm font-mono resize-none bg-white min-h-[120px]"
          placeholder="输入或粘贴文本来生成哈希值..."
        />
      </div>

      <div class="space-y-4">
        <h3 class="text-sm font-medium text-gray-900 border-b pb-2">生成的哈希值</h3>
        <div v-for="([algorithm, hash]) in Object.entries(hashes)" :key="algorithm" class="group relative">
          <label class="block text-xs font-semibold text-gray-500 mb-1">{{ algorithm }}</label>
          <div class="flex shadow-sm rounded-md">
            <input
              type="text"
              readonly
              :value="hash"
              class="block w-full rounded-none rounded-l-md border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 bg-gray-50 sm:text-sm font-mono placeholder:text-gray-400"
              placeholder="Hash output..."
            />
            <button
              :disabled="!hash"
              class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors bg-white"
              @click="copyToClipboard(hash, algorithm)"
            >
              <Check v-if="copiedHash === algorithm" :size="16" class="text-green-500" />
              <Copy v-else :size="16" class="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
