import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// در بیلد (GitHub Pages) مسیر base نام مخزن است، در حالت توسعه ریشه.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/grass/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
}))
