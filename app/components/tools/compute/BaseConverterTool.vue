<script setup lang="ts">
const input = ref('')
const output = ref('')
const fromBase = ref(10)
const toBase = ref(2)
const error = ref('')

function parseBigIntByBase(value: string, base: number) {
  const symbols = '0123456789abcdefghijklmnopqrstuvwxyz'
  const cleaned = value.trim().toLowerCase()
  if (!cleaned) {
    throw new Error('请输入要转换的数值。')
  }

  const isNegative = cleaned.startsWith('-')
  const body = isNegative ? cleaned.slice(1) : cleaned
  if (!body) {
    throw new Error('输入格式无效。')
  }

  let result = 0n
  const baseBig = BigInt(base)
  for (const char of body) {
    const digit = symbols.indexOf(char)
    if (digit < 0 || digit >= base) {
      throw new Error(`字符 "${char}" 不属于 ${base} 进制。`)
    }
    result = result * baseBig + BigInt(digit)
  }

  return isNegative ? -result : result
}

function convert() {
  try {
    error.value = ''
    if (!input.value.trim()) {
      output.value = ''
      return
    }

    if (fromBase.value < 2 || fromBase.value > 36 || toBase.value < 2 || toBase.value > 36) {
      throw new Error('进制范围必须在 2 到 36。')
    }

    const parsed = parseBigIntByBase(input.value, fromBase.value)
    output.value = parsed.toString(toBase.value)
  } catch (e) {
    output.value = ''
    error.value = e instanceof Error ? e.message : '转换失败'
  }
}

watch([input, fromBase, toBase], convert, { immediate: true })
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl border border-[#e2e8f0] p-6 lg:p-8 shadow-sm">
      <h1 class="text-2xl font-bold text-[#1e293b]">进制转换</h1>
      <p class="text-sm text-[#64748b] mt-1">支持 2~36 进制互转，支持大整数。</p>
    </div>

    <div class="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-bold text-[#334155] mb-2 block">原进制</label>
          <input v-model.number="fromBase" type="number" min="2" max="36" class="w-full rounded-lg border border-[#cbd5e1] px-3 py-2.5 text-sm">
        </div>
        <div>
          <label class="text-sm font-bold text-[#334155] mb-2 block">目标进制</label>
          <input v-model.number="toBase" type="number" min="2" max="36" class="w-full rounded-lg border border-[#cbd5e1] px-3 py-2.5 text-sm">
        </div>
      </div>

      <div>
        <label class="text-sm font-bold text-[#334155] mb-2 block">输入值</label>
        <textarea v-model="input" class="w-full h-[160px] rounded-xl border border-[#e2e8f0] p-3 text-sm font-mono resize-none" />
      </div>

      <div>
        <label class="text-sm font-bold text-[#334155] mb-2 block">转换结果</label>
        <textarea readonly :value="output || error" class="w-full h-[160px] rounded-xl border border-[#e2e8f0] p-3 text-sm font-mono bg-[#f8fafc] resize-none" />
      </div>
    </div>
  </div>
</template>
