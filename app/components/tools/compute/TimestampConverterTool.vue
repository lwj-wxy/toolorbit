<script setup lang="ts">
import { ArrowDown, ArrowRight, Calculator, Check, Clock, Copy, RefreshCw } from 'lucide-vue-next'

const now = ref(new Date())
const isLive = ref(true)
const tsInput = ref(Math.floor(Date.now() / 1000).toString())
const tsUnit = ref<'s' | 'ms'>('s')
const tsResult = ref('')
const dateInput = ref(formatDate(new Date()))
const dateResultS = ref('')
const dateResultMs = ref('')
const copiedField = ref<string | null>(null)

let timer: number | null = null

watch(isLive, (value) => {
  if (timer) {
    window.clearInterval(timer)
    timer = null
  }

  if (value) {
    timer = window.setInterval(() => {
      now.value = new Date()
    }, 1000)
  }
}, { immediate: true })

onMounted(() => {
  handleTsConvert(tsInput.value, tsUnit.value)
  handleDateConvert(dateInput.value)
})

onBeforeUnmount(() => {
  if (timer) {
    window.clearInterval(timer)
  }
})

function formatDate(date: Date) {
  if (Number.isNaN(date.getTime())) {
    return '无效日期格式'
  }

  const pad = (value: number) => value.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function handleTsConvert(value: string, unit: 's' | 'ms') {
  tsInput.value = value
  tsUnit.value = unit

  if (!value.trim()) {
    tsResult.value = ''
    return
  }

  const numericValue = Number.parseInt(value, 10)
  if (Number.isNaN(numericValue)) {
    tsResult.value = '无效的时间戳'
    return
  }

  const date = new Date(unit === 's' ? numericValue * 1000 : numericValue)
  tsResult.value = formatDate(date)
}

function handleDateConvert(value: string) {
  dateInput.value = value

  if (!value.trim()) {
    dateResultS.value = ''
    dateResultMs.value = ''
    return
  }

  const date = new Date(value.replace(/-/g, '/'))
  if (Number.isNaN(date.getTime())) {
    dateResultS.value = '无效日期'
    dateResultMs.value = '无效日期'
    return
  }

  dateResultMs.value = date.getTime().toString()
  dateResultS.value = Math.floor(date.getTime() / 1000).toString()
}

async function copyToClipboard(text: string, fieldId: string) {
  if (!text || text.includes('无效')) {
    return
  }

  await navigator.clipboard.writeText(text)
  copiedField.value = fieldId
  window.setTimeout(() => {
    copiedField.value = null
  }, 2000)
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 pb-6">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center">
          <Calculator class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e293b]">时间戳转换</h1>
          <p class="text-[#64748b] mt-1">
            Unix 时间戳与标准时间（本地/北京时间）在线相互转换工具。
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 relative">
      <button
        class="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold transition-all bg-white shadow-sm hover:shadow-md"
        @click="isLive = !isLive"
      >
        <RefreshCw
          class="w-3.5 h-3.5"
          :class="isLive ? 'animate-spin text-blue-500' : 'text-amber-500'"
          style="animation-duration: 2s"
        />
        <span :class="isLive ? 'text-blue-600' : 'text-amber-600'">{{ isLive ? '停止刷新' : '恢复刷新' }}</span>
      </button>

      <div class="flex items-center justify-center pt-2 pb-4">
        <div class="flex flex-col items-center">
          <span class="text-[#64748b] text-[13px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
            <Clock class="w-4 h-4" />
            当前时间 (Current Time)
          </span>
          <div class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f172a] tabular-nums tracking-tight">
            {{ formatDate(now) }}
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-8 border-t border-[#e2e8f0] pt-6 font-mono">
        <div class="flex items-center gap-2">
          <span class="text-[#64748b] text-sm">时间戳(秒):</span>
          <code class="text-[#2563eb] text-lg font-bold px-3 py-1 bg-blue-50 rounded-lg">
            {{ Math.floor(now.getTime() / 1000) }}
          </code>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[#64748b] text-sm">时间戳(毫秒):</span>
          <code class="text-[#2563eb] text-lg font-bold px-3 py-1 bg-blue-50 rounded-lg">
            {{ now.getTime() }}
          </code>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <ArrowRight class="w-4 h-4 text-[#2563eb]" />
          </div>
          <h2 class="text-xl font-bold text-[#1e293b]">时间戳 转换 标准时间</h2>
        </div>

        <div class="space-y-6 flex-1 flex flex-col">
          <div class="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
            <label class="block text-[13px] font-bold text-[#64748b] uppercase tracking-wider mb-2">输入时间戳</label>
            <div class="flex shadow-sm overflow-hidden rounded-lg">
              <input
                :value="tsInput"
                type="text"
                placeholder="请输入 Unix 时间戳..."
                class="flex-1 bg-white border border-[#e2e8f0] px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-lg min-w-0"
                @input="handleTsConvert(($event.target as HTMLInputElement).value, tsUnit)"
              />
              <select
                v-model="tsUnit"
                class="bg-[#f1f5f9] border border-y-[#e2e8f0] border-r-[#e2e8f0] border-l-0 px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold text-slate-700 cursor-pointer min-w-[100px]"
                @change="handleTsConvert(tsInput, tsUnit)"
              >
                <option value="s">秒(s)</option>
                <option value="ms">毫秒(ms)</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-center">
            <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-[#e2e8f0]">
              <ArrowDown class="w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div class="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
            <div class="flex items-center justify-between mb-2">
              <label class="block text-[13px] font-bold text-[#64748b] uppercase tracking-wider">标准时间格式</label>
              <button
                class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-2 py-1 rounded"
                @click="handleTsConvert(Math.floor(Date.now() / 1000).toString(), 's')"
              >
                填入当前时间戳
              </button>
            </div>
            <div class="relative group shadow-sm">
              <input
                readonly
                :value="tsResult"
                type="text"
                class="w-full bg-white border border-[#e2e8f0] rounded-lg pl-4 pr-12 py-3 outline-none text-[#0f172a] font-mono text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <button
                class="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all border border-[#e2e8f0] group-hover:border-blue-200"
                title="复制结果"
                @click="copyToClipboard(tsResult, 'ts_res')"
              >
                <Check v-if="copiedField === 'ts_res'" class="w-4 h-4 text-green-500" />
                <Copy v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="mt-auto pt-4">
            <p class="text-[13px] text-[#64748b]">10位为秒(s)级别 / 13位为毫秒(ms)级别</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <ArrowRight class="w-4 h-4 text-[#2563eb]" />
          </div>
          <h2 class="text-xl font-bold text-[#1e293b]">标准时间 转换 时间戳</h2>
        </div>

        <div class="space-y-6 flex-1 flex flex-col">
          <div class="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
            <label class="block text-[13px] font-bold text-[#64748b] uppercase tracking-wider mb-2">输入时间 (YYYY-MM-DD HH:mm:ss)</label>
            <input
              :value="dateInput"
              type="text"
              placeholder="2026-04-18 12:00:00"
              class="w-full bg-white border border-[#e2e8f0] rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono text-lg shadow-sm"
              @input="handleDateConvert(($event.target as HTMLInputElement).value)"
            />
          </div>

          <div class="flex items-center justify-center">
            <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-[#e2e8f0]">
              <ArrowDown class="w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div class="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] space-y-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[13px] font-bold text-[#64748b] uppercase tracking-wider">转换结果</span>
              <button
                class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-2 py-1 rounded"
                @click="handleDateConvert(formatDate(new Date()))"
              >
                填入当前时间
              </button>
            </div>

            <div>
              <label class="block text-xs font-medium text-[#94a3b8] mb-1">时间戳 (秒 s)</label>
              <div class="relative group shadow-sm">
                <input
                  readonly
                  :value="dateResultS"
                  type="text"
                  class="w-full bg-white border border-[#e2e8f0] rounded-lg pl-4 pr-12 py-2.5 outline-none text-[#0f172a] font-mono text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all border border-[#e2e8f0] group-hover:border-blue-200"
                  title="复制结果"
                  @click="copyToClipboard(dateResultS, 'dt_res_s')"
                >
                  <Check v-if="copiedField === 'dt_res_s'" class="w-4 h-4 text-green-500" />
                  <Copy v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-[#94a3b8] mb-1">时间戳 (毫秒 ms)</label>
              <div class="relative group shadow-sm">
                <input
                  readonly
                  :value="dateResultMs"
                  type="text"
                  class="w-full bg-white border border-[#e2e8f0] rounded-lg pl-4 pr-12 py-2.5 outline-none text-[#0f172a] font-mono text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all border border-[#e2e8f0] group-hover:border-blue-200"
                  title="复制结果"
                  @click="copyToClipboard(dateResultMs, 'dt_res_ms')"
                >
                  <Check v-if="copiedField === 'dt_res_ms'" class="w-4 h-4 text-green-500" />
                  <Copy v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
      <h3 class="text-blue-800 font-semibold mb-3">使用说明</h3>
      <ul class="text-sm text-blue-700/80 space-y-2 list-disc pl-4">
        <li>10位的时间戳代表的是秒（s），13位的时间戳代表的是毫秒（ms）。</li>
        <li>当前转换基于您所处环境的本地时区（通常中国大陆为北京时间 UTC+8）。</li>
        <li>
          输入时间字符串时，推荐使用 <code>YYYY-MM-DD HH:mm:ss</code> 格式，例如
          <code>2024-05-20 13:14:00</code>，系统也兼容类似斜杠 <code>/</code> 格式。
        </li>
      </ul>
    </div>
  </div>
</template>
