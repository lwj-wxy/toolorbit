import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-04-18',
  srcDir: 'app/',
  css: ['~/assets/styles/tailwind.css', '~/assets/styles/main.scss'],
  devtools: { enabled: false },
  modules: [],
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },
})
