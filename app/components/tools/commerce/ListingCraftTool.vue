<script setup lang="ts">
import { Check, Copy, Loader2, Sparkles } from 'lucide-vue-next'
import { marked } from 'marked'

const input = ref('')
const result = ref('')
const loading = ref(false)
const error = ref('')
const copied = ref(false)

const resultHtml = computed(() => (result.value ? marked.parse(result.value) : ''))

async function handleGenerate() {
  if (!input.value.trim()) {
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await $fetch<{ success: boolean; text?: string; error?: string }>('/api/listing-craft', {
      method: 'POST',
      body: {
        productInfo: input.value,
      },
    })

    if (!response.success) {
      throw new Error(response.error)
    }

    result.value = response.text || ''
  } catch (requestError) {
    error.value = requestError instanceof Error ? requestError.message : '生成失败，请稍后重发'
  } finally {
    loading.value = false
  }
}

async function copyToClipboard() {
  if (!result.value) {
    return
  }

  await navigator.clipboard.writeText(result.value)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-[24px] font-bold text-[#1e293b] flex items-center gap-2">
          <Sparkles class="text-blue-600" /> Listing Craft AI
        </h2>
        <p class="mt-1 text-sm text-[#94a3b8]">
          输入商品的主要特征及卖点，通过 Nuxt 服务端 AI 为您生成高转化率的电商 Listing 文案。
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="space-y-4 flex flex-col">
        <div class="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-5 flex flex-col flex-1">
          <label class="block text-sm font-bold text-[#334155] mb-3">产品基础信息入录</label>
          <textarea
            v-model="input"
            placeholder="在这里输入产品名、核心材质、受众特点等... 越详细越好。&#10;例如：高雅实木雕花复古咖啡桌，适合放置在卧室和客厅，原木色，耐用环保..."
            class="w-full flex-1 rounded-lg border border-[#e2e8f0] p-4 text-[14px] leading-relaxed resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4 min-h-[300px]"
          />
          <button
            :disabled="loading || !input.trim()"
            class="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
            @click="handleGenerate"
          >
            <Loader2 v-if="loading" class="animate-spin" />
            <Sparkles v-else :size="18" />
            {{ loading ? 'AI 正为您创作中...' : '一键生成 Listing 方案' }}
          </button>
        </div>
      </div>

      <div class="bg-[#f8fafc] rounded-xl shadow-sm border border-[#e2e8f0] flex flex-col overflow-hidden h-[600px] relative">
        <div class="bg-white border-b border-[#e2e8f0] p-4 flex justify-between items-center">
          <h3 class="font-bold text-[#1e293b]">生成的 AI 方案</h3>
          <button
            v-if="result"
            class="inline-flex items-center gap-1 text-xs text-[#64748b] bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md font-medium transition-colors"
            @click="copyToClipboard"
          >
            <Check v-if="copied" :size="14" class="text-green-600" />
            <Copy v-else :size="14" />
            {{ copied ? '已复制' : '复制文案' }}
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-1">
          <div v-if="error" class="text-red-500 p-4 bg-red-50 rounded-lg">{{ error }}</div>
          <div v-else-if="!result && !loading" class="text-[#94a3b8] text-center mt-20">
            生成的文案会显示在这里
          </div>
          <div
            v-else-if="result"
            class="markdown-body prose prose-sm max-w-none text-[#334155]"
            v-html="resultHtml"
          />
        </div>
      </div>
    </div>
  </div>
</template>
