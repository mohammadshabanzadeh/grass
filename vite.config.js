import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const WP_TARGET = 'https://api.farazchaman.ir/wp-json'

// روی Vercel سایت از ریشه سرو می‌شود، پس base = '/'
export default defineConfig({
  base: '/',
  plugins: [react()],
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
