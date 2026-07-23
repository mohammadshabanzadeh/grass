import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// روی Vercel سایت از ریشه سرو می‌شود، پس base = '/'
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
})
