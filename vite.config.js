import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base نسبی تا هم روی Vercel (ریشه) و هم GitHub Pages (زیرمسیر) کار کند.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
}))
