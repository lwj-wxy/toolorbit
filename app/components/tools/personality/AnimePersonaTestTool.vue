<script setup lang="ts">
import PersonalityQuizEngine from '~/components/tools/personality/PersonalityQuizEngine.vue'
import { getPersonalityTestConfig } from '~/data/personality/tests'

const config = getPersonalityTestConfig('anime-persona-test')

if (!config) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Anime persona test config missing',
  })
}
</script>

<template>
  <PersonalityQuizEngine :config="config" />
</template>
