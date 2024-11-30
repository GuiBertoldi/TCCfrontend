import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/TCCfrontend",
  server: {
    proxy: {
      '/auth': 'https://54.82.234.106:8080',
    },
  },
})
