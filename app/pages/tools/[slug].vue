<script setup lang="ts">
import type { Component } from 'vue'
import { getToolBySlug } from '~/data/tools'
import { loadToolComponent } from '~/utils/tool-registry'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const tool = computed(() => getToolBySlug(slug.value))
const toolComponent = shallowRef<Component | null>(null)

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
  toolComponent.value = await loadToolComponent(slug.value)
})
</script>

<template>
  <ClientOnly>
    <component :is="toolComponent" v-if="toolComponent" />
    <div v-else class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-12 text-center">
      正在加载工具...
    </div>
  </ClientOnly>
</template>
