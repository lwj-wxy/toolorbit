<script setup lang="ts">
import type { ToolCategoryId } from '~/data/tools'
import { TOOLS, TOOL_CATEGORIES } from '~/data/tools'

const route = useRoute()

const categoryFilter = computed(() => String(route.query.category ?? '').trim())
const searchQuery = computed(() => String(route.query.search ?? '').trim().toLowerCase())

const filteredTools = computed(() => {
  let result = TOOLS

  if (categoryFilter.value) {
    const category = TOOL_CATEGORIES.find((item) => item.name === categoryFilter.value)
    if (category) {
      result = result.filter((tool) => tool.categoryId === category.id)
    }
  }

  if (searchQuery.value) {
    result = result.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchQuery.value) ||
        tool.description.toLowerCase().includes(searchQuery.value),
    )
  }

  return result
})

function getCategoryStyles(categoryId: ToolCategoryId) {
  switch (categoryId) {
    case 'developer':
      return { bg: 'bg-[#f0f9ff]', icon: 'text-[#0ea5e9]', tagBg: 'bg-[#dcfce7]', tagText: 'text-[#166534]', tag: 'DEV' }
    case 'webmaster':
      return { bg: 'bg-[#f3e8ff]', icon: 'text-[#a855f7]', tagBg: 'bg-[#f3e8ff]', tagText: 'text-[#6b21a8]', tag: 'NET' }
    case 'text':
      return { bg: 'bg-[#eff6ff]', icon: 'text-[#3b82f6]', tagBg: 'bg-[#dbeafe]', tagText: 'text-[#1e40af]', tag: 'TXT' }
    case 'generator':
      return { bg: 'bg-[#fff7ed]', icon: 'text-[#f97316]', tagBg: 'bg-[#fef9c3]', tagText: 'text-[#854d0e]', tag: 'GEN' }
    case 'commerce':
      return { bg: 'bg-[#f0fdf4]', icon: 'text-[#22c55e]', tagBg: 'bg-[#f1f5f9]', tagText: 'text-[#475569]', tag: 'ECOMMERCE' }
    default:
      return { bg: 'bg-[#f0fdf4]', icon: 'text-[#22c55e]', tagBg: 'bg-[#f1f5f9]', tagText: 'text-[#475569]', tag: 'OTHER' }
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-baseline justify-between mb-[24px]">
      <h2 class="text-[20px] font-bold text-[#1e293b]">
        {{ categoryFilter || '热门推荐' }}
      </h2>
      <span class="text-[13px] text-[#94a3b8] ml-3 hidden sm:inline">
        {{
          categoryFilter
            ? `为您精选的 ${categoryFilter} 集合`
            : 'ToolOrbit 每日精选最常用的效率工具'
        }}
      </span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
      <NuxtLink
        v-for="tool in filteredTools"
        :key="tool.id"
        :to="tool.path"
        class="bg-white border border-[#e2e8f0] rounded-[12px] p-[20px] transition-all duration-200 cursor-pointer flex flex-col gap-[12px] hover:-translate-y-[2px] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:border-[#cbd5e1] group"
      >
        <div
          class="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center"
          :class="[getCategoryStyles(tool.categoryId).bg, getCategoryStyles(tool.categoryId).icon]"
        >
          <ToolIcon :name="tool.icon" :size="22" :stroke-width="2" />
        </div>

        <div class="flex flex-col">
          <h3
            class="text-[15px] font-semibold text-[#334155] mb-[4px] group-hover:text-[#2563eb] transition-colors"
          >
            {{ tool.name }}
          </h3>
          <p class="text-[12px] text-[#64748b] leading-[1.4] line-clamp-2">
            {{ tool.description }}
          </p>
        </div>

        <div class="mt-auto pt-2">
          <span
            class="inline-block px-[8px] py-[2px] rounded-[4px] text-[10px] uppercase font-bold"
            :class="[getCategoryStyles(tool.categoryId).tagBg, getCategoryStyles(tool.categoryId).tagText]"
          >
            {{ getCategoryStyles(tool.categoryId).tag }}
          </span>
        </div>
      </NuxtLink>
    </div>

    <div v-if="filteredTools.length === 0" class="text-center py-12">
      <h3 class="mt-2 text-sm font-semibold text-[#1e293b]">没有找到相关工具</h3>
      <p class="mt-1 text-sm text-[#64748b]">
        我们未能找到与您搜索匹配的工具，请尝试其他关键词。
      </p>
    </div>
  </div>
</template>
