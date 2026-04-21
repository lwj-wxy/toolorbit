<script setup lang="ts">
import PersonalityQuizEngine from '~/components/tools/personality/PersonalityQuizEngine.vue'
import { getPersonalityTestConfig } from '~/data/personality/tests'

const config = getPersonalityTestConfig('mbti-style-test')

if (!config) {
  throw createError({
    statusCode: 500,
    statusMessage: 'MBTI style test config missing',
  })
}
</script>

<template>
  <PersonalityQuizEngine :config="config" />
</template>
