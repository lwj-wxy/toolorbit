<script setup lang="ts">
import type { Component } from 'vue'
import { getToolBySlug } from '~/data/tools'
import { loadToolComponent } from '~/utils/tool-registry'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const tool = computed(() => getToolBySlug(slug.value))
const toolComponent = shallowRef<Component | null>(null)
const loading = ref(true)
const loadError = ref('')

if (!tool.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Tool Not Found',
  })
}

useSeoMeta({
  title: `${tool.value.name} - ToolOrbit`,
  description: tool.value.description,
})

onMounted(async () => {
  loading.value = true
  loadError.value = ''
  try {
    toolComponent.value = await loadToolComponent(slug.value)
    if (!toolComponent.value) {
      loadError.value = '工具组件不存在或尚未注册。'
    }
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '工具加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <ClientOnly>
    <component :is="toolComponent" v-if="toolComponent && !loadError" />
    <div v-else-if="loading" class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-12 text-center">
      正在加载工具...
    </div>
    <div v-else class="bg-red-50 rounded-2xl shadow-sm border border-red-200 p-12 text-center text-red-700">
      工具加载失败：{{ loadError || '未知错误' }}
    </div>
    <template #fallback>
      <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-12 text-center">
        正在加载工具...
      </div>
    </template>
  </ClientOnly>
</template>
