<script setup lang="ts">
import { Copy } from 'lucide-vue-next'

const input = ref('')
const output = ref('')
const copied = ref(false)

const options = reactive({
  trimLine: true,
  removeTabs: true,
  removeLineBreaks: false,
  collapseSpaces: true,
  removeAllSpaces: false,
  removePunctuation: false,
})

function cleanText() {
  let value = input.value

  if (options.trimLine) {
    value = value
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
  }

  if (options.removeTabs) {
    value = value.replace(/\t/g, '')
  }

  if (options.removeLineBreaks) {
    value = value.replace(/\r?\n/g, '')
  }

  if (options.removeAllSpaces) {
    value = value.replace(/\s+/g, '')
  } else if (options.collapseSpaces) {
    value = value.replace(/[ \u3000]{2,}/g, ' ')
  }

  if (options.removePunctuation) {
    value = value.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~，。！？、；：“”‘’（）《》【】—…·]/g, '')
  }

  output.value = value
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

watch(
  [input, () => options.trimLine, () => options.removeTabs, () => options.removeLineBreaks, () => options.collapseSpaces, () => options.removeAllSpaces, () => options.removePunctuation],
  cleanText,
  { immediate: true },
)
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl border border-[#e2e8f0] p-6 lg:p-8 shadow-sm">
      <h1 class="text-2xl font-bold text-[#1e293b]">字符串清洗</h1>
      <p class="text-sm text-[#64748b] mt-1">去空格、去换行、去制表符、去中英文标点，实时清洗结果。</p>
    </div>

    <div class="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm space-y-4">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        <label class="inline-flex items-center gap-2"><input v-model="options.trimLine" type="checkbox" class="accent-[#2563eb]"> 行首尾去空格</label>
        <label class="inline-flex items-center gap-2"><input v-model="options.removeTabs" type="checkbox" class="accent-[#2563eb]"> 去制表符</label>
        <label class="inline-flex items-center gap-2"><input v-model="options.removeLineBreaks" type="checkbox" class="accent-[#2563eb]"> 去换行</label>
        <label class="inline-flex items-center gap-2"><input v-model="options.collapseSpaces" type="checkbox" class="accent-[#2563eb]"> 连续空格压缩</label>
        <label class="inline-flex items-center gap-2"><input v-model="options.removeAllSpaces" type="checkbox" class="accent-[#2563eb]"> 去所有空白</label>
        <label class="inline-flex items-center gap-2"><input v-model="options.removePunctuation" type="checkbox" class="accent-[#2563eb]"> 去中英文标点</label>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label class="text-sm font-bold text-[#334155] mb-2 block">原始文本</label>
          <textarea v-model="input" class="w-full h-[280px] rounded-xl border border-[#e2e8f0] p-3 text-sm resize-none" />
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-bold text-[#334155]">清洗结果</label>
            <button class="text-xs px-3 py-1.5 rounded-md border border-[#cbd5e1]" @click="copyResult">
              <span class="inline-flex items-center gap-1"><Copy class="w-3.5 h-3.5" /> {{ copied ? '已复制' : '复制' }}</span>
            </button>
          </div>
          <textarea readonly :value="output" class="w-full h-[280px] rounded-xl border border-[#e2e8f0] p-3 text-sm bg-[#f8fafc] resize-none" />
        </div>
      </div>
    </div>
  </div>
</template>
