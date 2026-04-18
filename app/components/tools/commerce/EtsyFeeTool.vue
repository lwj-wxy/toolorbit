<script setup lang="ts">
const salePrice = ref<number | ''>('')
const shippingCharge = ref<number | ''>('')
const itemCost = ref<number | ''>('')

const price = computed(() => Number(salePrice.value) || 0)
const shipping = computed(() => Number(shippingCharge.value) || 0)
const cost = computed(() => Number(itemCost.value) || 0)
const totalRevenue = computed(() => price.value + shipping.value)
const listingFee = 0.2
const transactionFee = computed(() => totalRevenue.value * 0.065)
const paymentProcFee = computed(() => totalRevenue.value * 0.03 + 0.25)
const totalFees = computed(() => listingFee + transactionFee.value + paymentProcFee.value)
const profit = computed(() => totalRevenue.value - totalFees.value - cost.value)
const margin = computed(() =>
  totalRevenue.value > 0 ? (profit.value / totalRevenue.value) * 100 : 0,
)
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-[24px] font-bold text-[#1e293b]">
          Etsy 利润与手续费计算器
        </h2>
        <p class="mt-1 text-sm text-[#94a3b8]">
          输入您的商品售价、运费和制造成本，实时计算实际到账金额。
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6 space-y-5">
        <div>
          <label class="block text-sm font-medium text-[#334155] mb-2">商品售价 (USD)</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">$</div>
            <input
              v-model="salePrice"
              type="number"
              class="block w-full rounded-md border-0 py-2.5 pl-9 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-[#334155] mb-2">向买家收取的运费 (USD)</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">$</div>
            <input
              v-model="shippingCharge"
              type="number"
              class="block w-full rounded-md border-0 py-2.5 pl-9 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-[#334155] mb-2">商品成本 + 实际运费 (USD)</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">$</div>
            <input
              v-model="itemCost"
              type="number"
              class="block w-full rounded-md border-0 py-2.5 pl-9 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div class="bg-[#f8fafc] rounded-xl shadow-sm border border-[#e2e8f0] p-6">
        <h3 class="text-[16px] font-bold text-[#1e293b] mb-4 border-b border-[#e2e8f0] pb-2">费用详情计算</h3>

        <dl class="space-y-3 text-sm">
          <div class="flex justify-between">
            <dt class="text-[#64748b]">总收入 (售价 + 运费)</dt>
            <dd class="font-semibold text-[#1e293b]">${{ totalRevenue.toFixed(2) }}</dd>
          </div>

          <div class="pt-2 border-t border-dashed border-[#cbd5e1]" />

          <div class="flex justify-between">
            <dt class="text-[#64748b]">Etsy 上架费</dt>
            <dd class="text-red-500">-${{ listingFee.toFixed(2) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-[#64748b]">交易手续费 (6.5%)</dt>
            <dd class="text-red-500">-${{ transactionFee.toFixed(2) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-[#64748b]">支付处理费 (3% + $0.25)</dt>
            <dd class="text-red-500">-${{ paymentProcFee.toFixed(2) }}</dd>
          </div>

          <div class="pt-2 border-t border-dashed border-[#cbd5e1]" />

          <div class="flex justify-between items-center bg-white p-3 rounded border border-[#e2e8f0]">
            <dt class="font-bold text-[#1e293b]">净利润</dt>
            <dd :class="profit >= 0 ? 'text-green-600' : 'text-red-600'" class="text-[20px] font-bold">
              ${{ profit.toFixed(2) }}
            </dd>
          </div>

          <div class="flex justify-between items-center bg-white p-3 rounded border border-[#e2e8f0]">
            <dt class="font-bold text-[#1e293b]">利润率</dt>
            <dd :class="margin >= 0 ? 'text-green-600' : 'text-red-600'" class="text-[16px] font-bold">
              {{ margin.toFixed(2) }}%
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
