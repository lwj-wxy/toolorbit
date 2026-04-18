<script setup lang="ts">
import {
  Binary,
  Calculator,
  Code2,
  CreditCard,
  Crop,
  FileBadge2,
  FileCode2,
  FileImage,
  FileText,
  Files,
  Fingerprint,
  Hash,
  Image,
  ImageMinus,
  Link,
  QrCode,
  RefreshCcw,
  ShoppingCart,
  Sparkles,
  Type,
} from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number
    strokeWidth?: number
  }>(),
  {
    size: 20,
    strokeWidth: 2,
  },
)

const iconMap = {
  Binary,
  Calculator,
  Code2,
  CreditCard,
  Crop,
  FileBadge2,
  FileCode2,
  FileImage,
  FileText,
  Files,
  Fingerprint,
  Hash,
  Image,
  ImageMinus,
  Link,
  QrCode,
  RefreshCcw,
  ShoppingCart,
  Sparkles,
  Type,
}

const iconComponent = computed(() => iconMap[props.name as keyof typeof iconMap] ?? FileText)
</script>

<template>
  <component :is="iconComponent" :size="size" :stroke-width="strokeWidth" />
</template>
