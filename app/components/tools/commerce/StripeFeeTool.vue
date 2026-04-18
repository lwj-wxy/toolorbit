<script setup lang="ts">
const amount = ref<number | ''>('')

const value = computed(() => Number(amount.value) || 0)
const feePercent = 0.029
const fixedFee = 0.3
const totalFee = computed(() => (value.value > 0 ? value.value * feePercent + fixedFee : 0))
const payout = computed(() => (value.value > 0 ? value.value - totalFee.value : 0))
const amountToInvoice = computed(() =>
  value.value > 0 ? (value.value + fixedFee) / (1 - feePercent) : 0,
)
const reverseFee = computed(() => amountToInvoice.value - value.value)
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-[24px] font-bold text-[#1e293b]">
          Stripe 手续费计算器
        </h2>
        <p class="mt-1 text-sm text-[#94a3b8]">
          采用 Stripe 默认费率标准（2.9% + 30¢），一键计算收付款项及到账情况。
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
        <label class="block text-sm font-medium text-[#334155] mb-2">交易金额 (USD)</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">$</div>
          <input
            v-model="amount"
            type="number"
            class="block w-full rounded-md border-0 py-3 pl-10 pr-3 text-[18px] text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 font-bold"
            placeholder="0.00"
          />
        </div>
      </div>

      <div class="space-y-4">
        <div class="bg-[#f8fafc] rounded-xl shadow-sm border border-[#e2e8f0] p-5">
          <h3 class="text-[14px] font-bold text-[#64748b] uppercase tracking-wider mb-3">如果客户支付 ${{ value.toFixed(2) }}</h3>
          <div class="flex justify-between items-end mb-2">
            <span class="text-sm text-[#334155]">Stripe 扣除手续费</span>
            <span class="text-red-500 font-medium">-${{ totalFee.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-end pt-3 border-t border-[#e2e8f0]">
            <span class="text-sm font-bold text-[#1e293b]">您实际到账金额</span>
            <span class="text-[24px] font-bold text-green-600">${{ payout.toFixed(2) }}</span>
          </div>
        </div>

        <div class="bg-[#f0f9ff] rounded-xl shadow-sm border border-[#bae6fd] p-5">
          <h3 class="text-[14px] font-bold text-[#0369a1] uppercase tracking-wider mb-3">如果想要实收 ${{ value.toFixed(2) }}</h3>
          <div class="flex justify-between items-end mb-2">
            <span class="text-sm text-[#0c4a6e]">需让客户承担的手续费</span>
            <span class="text-[#0c4a6e] font-medium">+${{ reverseFee.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-end pt-3 border-t border-[#bae6fd]">
            <span class="text-sm font-bold text-[#0c4a6e]">您需要给客户的账单金额</span>
            <span class="text-[20px] font-bold text-[#0284c7]">${{ amountToInvoice.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
