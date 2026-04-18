<script setup lang="ts">
import { Settings2 } from 'lucide-vue-next'

defineProps<{
  title: string
}>()
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden flex flex-col items-center justify-center p-16 text-center min-h-[500px]"
  >
    <div
      class="w-20 h-20 bg-blue-50 text-[#2563eb] rounded-2xl flex items-center justify-center mb-6"
    >
      <Settings2 class="w-10 h-10 animate-spin-slow" />
    </div>
    <h2 class="text-2xl font-extrabold text-[#1e293b] mb-4">{{ title }}</h2>
    <p class="text-[#64748b] max-w-md leading-relaxed">
      这个工具正在火速开发中。如果您需要此功能，请持续关注我们的后续更新。
    </p>
  </div>
</template>
