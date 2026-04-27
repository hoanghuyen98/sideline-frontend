import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path';

import vue from '@vitejs/plugin-vue'

import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  // console.log(process.env)
  // console.log(process.env.npm_lifecycle_event)
  // console.log(process.env.VITE_BASE_URL)

  // const ROOT_URL = process.env.VITE_BASE_URL

  return defineConfig({
    root: '', // frontend's dir contain index.html
    // base: process.env.npm_lifecycle_event === 'build' ? `${ROOT_URL}` : '',
    // base: process.env.npm_lifecycle_event === 'build' ? '/static/dist/' : '/', // reference path to source in index.html
    base: './',
    build: {
      outDir: 'dist/', // export dir
      assetsDir: '',
      manifest: true,
      emptyOutDir: true,
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag === 'emoji-picker'
          }
        }
      }),
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      open: false,
      watch: {
        usePolling: true
      },
    },
  })
})