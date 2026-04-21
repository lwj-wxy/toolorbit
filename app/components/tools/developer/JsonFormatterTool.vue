<script setup lang="ts">
import { Check, Copy } from "lucide-vue-next";

const input = ref("");
const output = ref("");
const error = ref<string | null>(null);
const copied = ref(false);

function parsePossiblyEscapedJson(raw: string) {
  let parsed: unknown = JSON.parse(raw);

  for (let depth = 0; depth < 2 && typeof parsed === "string"; depth += 1) {
    const candidate = parsed.trim();
    if (!candidate) {
      break;
    }
    parsed = JSON.parse(candidate);
  }

  return parsed;
}

function formatJson(spaces: number) {
  try {
    if (!input.value.trim()) {
      output.value = "";
      error.value = null;
      return;
    }

    const parsed = parsePossiblyEscapedJson(input.value);
    output.value = JSON.stringify(parsed, null, spaces);
    error.value = null;
  } catch (formatError) {
    error.value = formatError instanceof Error ? formatError.message : "Invalid JSON";
  }
}

async function copyToClipboard() {
  if (!output.value) {
    return;
  }

  await navigator.clipboard.writeText(output.value);
  copied.value = true;
  window.setTimeout(() => {
    copied.value = false;
  }, 2000);
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">JSON 格式化</h2>
        <p class="mt-1 text-sm text-gray-500">格式化、验证及美化您的 JSON 数据。</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="flex flex-col space-y-3">
        <div class="flex items-center justify-between">
          <label class="block text-sm font-medium leading-6 text-gray-900"> 输入 JSON </label>
          <div class="space-x-2">
            <button class="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors" @click="formatJson(2)">
              格式化 (2空格)
            </button>
            <button class="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors" @click="formatJson(4)">
              格式化 (4空格)
            </button>
          </div>
        </div>
        <div class="flex-1 relative">
          <textarea
            v-model="input"
            class="block w-full h-[500px] rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono resize-none bg-white"
            placeholder='{"示例": "在此粘贴您的 JSON..."}' />
        </div>
      </div>

      <div class="flex flex-col space-y-3">
        <div class="flex items-center justify-between">
          <label class="block text-sm font-medium leading-6 text-gray-900"> 输出结果 </label>
          <button
            :disabled="!output"
            class="inline-flex items-center gap-1 text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-md font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="copyToClipboard">
            <Check v-if="copied" :size="14" class="text-green-500" />
            <Copy v-else :size="14" />
            {{ copied ? "已复制" : "复制结果" }}
          </button>
        </div>
        <div class="flex-1 relative">
          <textarea
            readonly
            :value="output"
            :class="[
              'block w-full h-[500px] rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono resize-none bg-gray-50',
              error ? 'ring-red-300 text-red-900 bg-red-50 focus:ring-red-500' : 'ring-gray-300',
            ]" />
          <div v-if="error" class="absolute inset-x-0 bottom-0 p-4 bg-red-50 text-red-700 text-sm font-medium border-t border-red-200 rounded-b-lg">Error: {{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
