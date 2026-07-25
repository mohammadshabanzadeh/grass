import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const WP_TARGET = 'https://api.farazchaman.ir/wp-json'

// روی Vercel سایت از ریشه سرو می‌شود، پس base = '/'
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    // جدا کردن کتابخانه‌ها از کد سایت تا مرورگر بتواند آن‌ها را
    // کش کند و با هر تغییر در سایت دوباره دانلودشان نکند.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: false,
    // پروکسی توسعه: /wpapi -> وردپرس (برای دور زدن CORS)
    proxy: {
      '/wpapi': {
        target: WP_TARGET,
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/wpapi/, ''),
      },
    },
  },
})
