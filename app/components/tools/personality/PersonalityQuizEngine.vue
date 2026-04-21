<script setup lang="ts">
import type { PersonalityResult, PersonalityTestConfig } from '~/data/personality/tests'

const props = defineProps<{
  config: PersonalityTestConfig
}>()

const started = ref(false)
const currentIndex = ref(0)
const answers = ref<Array<number | null>>([])
const result = ref<PersonalityResult | null>(null)

const totalQuestions = computed(() => props.config.questions.length)
const currentQuestion = computed(() => props.config.questions[currentIndex.value])
const answeredCount = computed(() => answers.value.filter((answer) => answer !== null).length)
const progress = computed(() => {
  if (totalQuestions.value === 0) {
    return 0
  }
  return Math.round((answeredCount.value / totalQuestions.value) * 100)
})
const canSubmit = computed(() => answeredCount.value === totalQuestions.value)

const likertOptions = [
  { value: 1, label: '非常不同意' },
  { value: 2, label: '不同意' },
  { value: 3, label: '中立' },
  { value: 4, label: '同意' },
  { value: 5, label: '非常同意' },
]

const currentOptions = computed(() => {
  const question = currentQuestion.value
  if (!question) {
    return [] as Array<{ value: number; label: string }>
  }

  if (question.options && question.options.length === 2) {
    return question.options.map((option, index) => ({
      value: index,
      label: option,
    }))
  }

  return props.config.scaleOptions ?? likertOptions
})

const optionColumnsClass = computed(() => {
  if (currentOptions.value.length <= 2) {
    return 'grid grid-cols-1 md:grid-cols-2 gap-3'
  }
  if (currentOptions.value.length <= 5) {
    return 'grid grid-cols-1 md:grid-cols-5 gap-3'
  }
  return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'
})

function startTest() {
  started.value = true
  currentIndex.value = 0
  answers.value = Array.from({ length: totalQuestions.value }, () => null)
  result.value = null
}

function selectAnswer(score: number) {
  answers.value[currentIndex.value] = score
}

function nextQuestion() {
  if (currentIndex.value < totalQuestions.value - 1) {
    currentIndex.value += 1
  }
}

function prevQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
  }
}

function submit() {
  if (!canSubmit.value) {
    return
  }
  result.value = props.config.calculateResult(answers.value)
}

function restart() {
  started.value = false
  currentIndex.value = 0
  answers.value = []
  result.value = null
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement | null
  if (!target) {
    return
  }
  target.src = 'https://placehold.co/800x450/e2e8f0/334155?text=%E8%A7%92%E8%89%B2%E5%B0%81%E9%9D%A2'
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl border border-[#e2e8f0] p-6 lg:p-8 shadow-sm">
      <h1 class="text-2xl font-bold text-[#1e293b]">{{ config.title }}</h1>
      <p class="text-sm text-[#64748b] mt-1">{{ config.subtitle }} · {{ config.questionDuration }}</p>
      <p class="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-4">{{ config.disclaimer }}</p>
    </div>

    <div v-if="!started" class="bg-white rounded-2xl border border-[#e2e8f0] p-8 shadow-sm text-center">
      <p class="text-[#475569] mb-6">共 {{ totalQuestions }} 题。按直觉作答，通常更接近你的稳定偏好。</p>
      <button class="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-8 py-3 rounded-xl font-bold transition-colors" @click="startTest">
        开始测试
      </button>
    </div>

    <div v-else-if="!result" class="bg-white rounded-2xl border border-[#e2e8f0] p-6 lg:p-8 shadow-sm space-y-6">
      <div>
        <div class="flex items-center justify-between text-sm text-[#64748b] mb-2">
          <span>第 {{ currentIndex + 1 }} / {{ totalQuestions }} 题</span>
          <span>完成度 {{ progress }}%</span>
        </div>
        <div class="w-full h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
          <div class="h-2 bg-[#2563eb] rounded-full transition-all" :style="{ width: `${progress}%` }" />
        </div>
      </div>

      <div class="rounded-2xl border border-[#e2e8f0] p-6 bg-[#f8fafc]">
        <p class="text-lg font-bold text-[#1e293b] leading-relaxed">{{ currentQuestion?.text }}</p>
      </div>

      <div :class="optionColumnsClass">
        <button
          v-for="option in currentOptions"
          :key="option.value"
          :class="[
            'rounded-lg border px-3 py-3 text-sm font-medium text-left transition-colors',
            answers[currentIndex] === option.value
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-[#e2e8f0] bg-white hover:border-blue-200',
          ]"
          @click="selectAnswer(option.value)"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="flex items-center justify-between gap-3">
        <button
          class="px-4 py-2.5 rounded-lg border border-[#cbd5e1] text-[#334155] hover:bg-slate-50 disabled:opacity-40"
          :disabled="currentIndex === 0"
          @click="prevQuestion"
        >
          上一题
        </button>

        <div class="flex items-center gap-3">
          <button
            v-if="currentIndex < totalQuestions - 1"
            class="px-4 py-2.5 rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] disabled:opacity-40"
            :disabled="answers[currentIndex] === null"
            @click="nextQuestion"
          >
            下一题
          </button>
          <button
            v-else
            class="px-5 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40"
            :disabled="!canSubmit"
            @click="submit"
          >
            查看结果
          </button>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-2xl border border-[#e2e8f0] p-6 lg:p-8 shadow-sm space-y-6">
      <div class="rounded-xl bg-[#f8fafc] border border-[#e2e8f0] p-5">
        <h2 class="text-xl font-bold text-[#1e293b]">{{ result.title }}</h2>
        <p class="text-sm text-[#64748b] mt-2">{{ result.summary }}</p>
      </div>

      <div
        v-if="result.primaryCharacter"
        class="rounded-xl border border-[#e2e8f0] overflow-hidden bg-[#f8fafc]"
      >
        <div class="w-full h-64 md:h-80 bg-[#e2e8f0] flex items-center justify-center">
          <img
            :src="result.primaryCharacter.imageUrl"
            :alt="result.primaryCharacter.name"
            class="max-w-full max-h-full object-contain"
            loading="lazy"
            referrerpolicy="no-referrer"
            @error="handleImageError"
          >
        </div>
        <div class="p-5">
          <p class="text-xs text-[#64748b]">最匹配角色</p>
          <h3 class="text-2xl font-bold text-[#0f172a] mt-1">
            {{ result.primaryCharacter.name }}
            <span class="text-sm font-medium text-[#64748b]">· {{ result.primaryCharacter.from }}</span>
          </h3>
          <p class="text-sm text-[#334155] mt-2">{{ result.primaryCharacter.description }}</p>
          <p class="text-sm text-[#2563eb] font-semibold mt-3">匹配度 {{ result.primaryCharacter.matchScore }}%</p>
        </div>
      </div>

      <div v-if="result.topCharacters && result.topCharacters.length > 1" class="rounded-xl border border-[#e2e8f0] p-5">
        <h4 class="text-sm font-bold text-[#334155] mb-3">其他高匹配角色</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="character in result.topCharacters.slice(1)"
            :key="`${character.name}-${character.from}`"
            class="rounded-lg border border-[#e2e8f0] bg-white p-3 flex gap-3"
          >
            <img
              :src="character.imageUrl"
              :alt="character.name"
              class="w-16 h-16 rounded-md object-contain bg-[#e2e8f0] shrink-0 p-1"
              loading="lazy"
              referrerpolicy="no-referrer"
              @error="handleImageError"
            >
            <div class="min-w-0">
              <p class="text-sm font-semibold text-[#0f172a] truncate">{{ character.name }}</p>
              <p class="text-xs text-[#64748b] truncate">{{ character.from }}</p>
              <p class="text-xs text-[#2563eb] mt-1">匹配度 {{ character.matchScore }}%</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="config.showDimensions !== false" class="space-y-4">
        <div
          v-for="dimension in result.dimensions"
          :key="dimension.key"
          class="rounded-xl border border-[#e2e8f0] p-4"
        >
          <div class="flex items-center justify-between text-sm mb-2">
            <span class="font-bold text-[#334155]">{{ dimension.label }}</span>
            <span class="text-[#64748b]">{{ dimension.percent }}%</span>
          </div>
          <div class="w-full h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
            <div class="h-2 rounded-full bg-[#2563eb]" :style="{ width: `${dimension.percent}%` }" />
          </div>
          <p class="mt-2 text-xs text-[#64748b]">当前倾向：{{ dimension.dominant }}</p>
        </div>
      </div>

      <div class="flex justify-end">
        <button class="px-4 py-2.5 rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8]" @click="restart">
          重新测试
        </button>
      </div>
    </div>
  </div>
</template>
