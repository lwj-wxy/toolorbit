<script setup lang="ts">
const text = ref('')

const stats = computed(() => {
  const chars = text.value.length
  const charsNoSpaces = text.value.replace(/\s/g, '').length
  const words = text.value.trim() ? text.value.trim().split(/\s+/).length : 0
  const sentences = text.value.trim() ? text.value.split(/[.!?]+/).filter(Boolean).length : 0
  const paragraphs = text.value.trim() ? text.value.split(/\n\s*\n/).filter(Boolean).length : 0
  const lines = text.value.trim() ? text.value.split('\n').length : 0

  return [
    { name: '字数/词数', value: words },
    { name: '字符数', value: chars },
    { name: '字符数 (不含空格)', value: charsNoSpaces },
    { name: '句子数', value: sentences },
    { name: '段落数', value: paragraphs },
    { name: '行数', value: lines },
  ]
})

const letterFrequency = computed(() => {
  if (!text.value) {
    return []
  }

  const counts: Record<string, number> = {}
  const lowerText = text.value.toLowerCase().replace(/[^a-z]/g, '')

  for (const character of lowerText) {
    counts[character] = (counts[character] || 0) + 1
  }

  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 10)
})
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          文本分析器
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          实时的字数、字符、段落统计以及字母频率分析。
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <textarea
          v-model="text"
          class="block w-full h-[500px] rounded-xl border-0 py-4 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-relaxed resize-none bg-white"
          placeholder="在此输入或粘贴文本开始实时分析..."
        />
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 tracking-tight">标准统计</h3>
          <dl class="space-y-4">
            <div
              v-for="stat in stats"
              :key="stat.name"
              class="flex flex-wrap items-center justify-between"
            >
              <dt class="text-sm font-medium text-gray-500">{{ stat.name }}</dt>
              <dd class="text-md font-bold text-gray-900">{{ stat.value.toLocaleString() }}</dd>
            </div>
          </dl>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 tracking-tight">字母频率 (前 10 名)</h3>
          <div v-if="letterFrequency.length > 0" class="space-y-3">
            <div
              v-for="[letter, count] in letterFrequency"
              :key="letter"
              class="flex items-center text-sm"
            >
              <span class="w-4 font-mono font-bold text-gray-700 capitalize">{{ letter }}</span>
              <div class="flex-1 ml-3 mr-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  class="bg-indigo-500 h-full rounded-full"
                  :style="{
                    width: `${Math.round((count / Number(letterFrequency[0]?.[1] || 1)) * 100)}%`,
                  }"
                />
              </div>
              <span class="w-8 text-right font-medium text-gray-600">{{ count }}</span>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500 italic">未发现字母字符。</p>
        </div>
      </div>
    </div>
  </div>
</template>
