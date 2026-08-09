/**
 * سرور ساکن ساده — رفتار یک هاست معمولی (آپاچی/nginx) را تقلید می‌کند:
 * اول فایل واقعی، بعد پوشه/index.html، و در نهایت index.html ریشه.
 * فقط برای آزمودن خروجی بیلد است، نه استفاده در پروداکشن.
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const PORT = Number(process.env.PORT || 4180)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0])
    const candidates = [
      path.join(ROOT, urlPath),
      path.join(ROOT, urlPath, 'index.html'),
      path.join(ROOT, 'index.html'),
    ]
    for (const file of candidates) {
      if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' })
        res.end(fs.readFileSync(file))
        return
      }
    }
    res.writeHead(404)
    res.end('not found')
  })
  .listen(PORT, () => console.log(`static server on http://localhost:${PORT}`))
