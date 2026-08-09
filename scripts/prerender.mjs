/**
 * پیش‌رندر (Prerender)
 *
 * این سایت تک‌صفحه‌ای است و مرورگر محتوا را با جاوااسکریپت می‌سازد؛ یعنی
 * سورس صفحه فقط یک <div id="root"></div> خالی بود. گوگل جاوااسکریپت را
 * اجرا می‌کند، ولی این کار را با تأخیر و بودجه‌ی محدود انجام می‌دهد و
 * چون داده‌های این سایت از سروری می‌آید که ۲ تا ۱۱ ثانیه طول می‌کشد، خطر
 * واقعی این بود که گوگل صفحه‌ی خالی ثبت کند. خزنده‌های دیگر (پیش‌نمایش
 * تلگرام و واتساپ و…) اصلاً جاوااسکریپت اجرا نمی‌کنند.
 *
 * این اسکریپت هنگام بیلد:
 *   ۱) محتوای وردپرس را یک بار می‌گیرد،
 *   ۲) هر مسیر سایت را به HTML واقعی تبدیل می‌کند،
 *   ۳) داده را داخل همان HTML جاسازی می‌کند تا کاربر هم منتظر سرور نماند.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const DIST = path.join(ROOT, 'dist')
const WP = process.env.VITE_WP_BASE || 'https://api.farazchaman.ir/wp-json'

const log = (...a) => console.log('[prerender]', ...a)

/**
 * درخواست با مهلت زمانی و چند تلاش.
 * سرور وردپرس هم کند است و هم گاهی اتصال را قطع می‌کند؛ اگر این‌جا شکست
 * بخورد صفحات محصولات بدون محتوا ساخته می‌شوند، پس ارزش تلاش مجدد را دارد.
 */
async function get(url, { timeout = 40000, retries = 3 } = {}) {
  let lastErr
  for (let i = 0; i <= retries; i++) {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), timeout)
    try {
      const res = await fetch(url, { signal: ctrl.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (e) {
      lastErr = e
      if (i < retries) {
        log(`  retry ${i + 1}/${retries} — ${e.message}`)
        await new Promise((r) => setTimeout(r, 2000 * (i + 1)))
      }
    } finally {
      clearTimeout(t)
    }
  }
  throw lastErr
}

async function loadWpData() {
  const out = { catalog: null, projects: null }
  try {
    out.catalog = await get(`${WP}/faraz/v1/catalog`)
    log(
      `catalog: ${out.catalog.products?.length ?? 0} products, ` +
        `${out.catalog.categories?.length ?? 0} categories, ${out.catalog.menu?.length ?? 0} menu items`,
    )
  } catch (e) {
    log('catalog failed —', e.message, '(pages will still prerender, without product data)')
  }
  try {
    out.projects = await get(
      `${WP}/wp/v2/project?per_page=100&_embed=wp:featuredmedia&_fields=id,slug,title,meta,_links,_embedded`,
    )
    log(`projects: ${out.projects.length}`)
  } catch (e) {
    log('projects failed —', e.message)
  }

  // ویژگی‌ها و نسخه‌های کوچک‌تر تصویر فقط از Store API ووکامرس می‌آیند، و آن
  // مسیر برخلاف faraz/v1 هدر CORS نمی‌فرستد؛ یعنی مرورگر روی دامنه‌ی سایت
  // نمی‌تواند آن را بخواند. این‌جا (سمت سرور، بدون محدودیت CORS) گرفته و
  // داخل همان داده‌ی جاسازی‌شده قرار می‌گیرد.
  try {
    const rows = await get(`${WP}/wc/store/v1/products?per_page=100&_fields=id,attributes,images`)
    out.productMeta = rows.map((p) => ({
      id: p.id,
      attributes: (p.attributes || []).map((a) => ({
        name: a.name,
        values: (a.terms || []).map((t) => t.name),
      })),
      srcset: p.images?.[0]?.srcset || null,
    }))
    const withAttrs = out.productMeta.filter((p) => p.attributes.length).length
    log(`product meta: ${out.productMeta.length} rows (${withAttrs} with attributes)`)
  } catch (e) {
    log('product meta failed —', e.message)
  }

  return out
}

/** مسیرهایی که باید به فایل HTML تبدیل شوند. */
function routesFor(data) {
  const routes = ['/', '/products', '/projects', '/services', '/about', '/contact']

  // صفحه‌ی هر محصول
  for (const p of data.catalog?.products || []) {
    if (p.slug) routes.push('/product/' + p.slug)
  }
  // صفحه‌ی هر پروژه
  for (const p of data.projects || []) {
    routes.push('/projects/' + p.id)
  }
  // صفحه‌ی هر دسته‌بندی (با مسیر تودرتوی کامل)
  const cats = data.catalog?.categories || []
  const walk = (parentId, trail) => {
    for (const c of cats.filter((x) => Number(x.parent) === parentId && Number(x.count) > 0)) {
      const p = [...trail, c.slug]
      routes.push('/products/' + p.join('/'))
      walk(Number(c.id), p)
    }
  }
  walk(0, [])

  return [...new Set(routes)]
}

const SITE = 'فراز چمن'
const DEFAULT_DESC =
  'فراز چمن - فروش و نصب تخصصی چمن مصنوعی با بهترین کیفیت و خدمات پس از فروش در سراسر کشور'

const strip = (s = '') =>
  s
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/** عنوان و توضیح هر مسیر — هم‌راستا با همان چیزی که useSeo در مرورگر می‌سازد. */
function metaFor(data) {
  const m = {
    '/': {
      desc: 'فراز چمن، مرجع تخصصی اجرای چمن مصنوعی در ایران؛ زمین فوتبال با استاندارد فیفا، روف گاردن، محوطه‌سازی و فضای بازی کودکان',
    },
    '/products': { title: 'محصولات', desc: 'انواع چمن مصنوعی ورزشی، تزئینی، رنگی و فضای سبز با کیفیت بالا — فراز چمن' },
    '/projects': { title: 'پروژه‌ها', desc: 'نمونه‌کارهای اجرا شده‌ی چمن مصنوعی؛ زمین ورزشی، روف گاردن، محوطه ویلا و فضای بازی کودکان' },
    '/services': { title: 'خدمات', desc: 'خدمات تخصصی چمن مصنوعی: فروش، طراحی، زیرسازی، نصب حرفه‌ای، نگهداری و ضمانت' },
    '/about': { title: 'درباره ما', desc: 'فراز چمن؛ سال‌ها تجربه در فروش و نصب چمن مصنوعی با متریال باکیفیت و تیم متخصص' },
    '/contact': { title: 'تماس با ما', desc: 'برای مشاوره رایگان، استعلام قیمت و بازدید پروژه با کارشناسان فراز چمن در تماس باشید' },
  }

  for (const p of data.catalog?.products || []) {
    if (!p.slug) continue
    m['/product/' + p.slug] = {
      title: p.name,
      desc: strip(p.short_description) || strip(p.description).slice(0, 150) || p.name,
      image: p.images?.[0]?.src,
      type: 'product',
    }
  }

  for (const p of data.projects || []) {
    m['/projects/' + p.id] = {
      title: strip(p.title?.rendered || ''),
      desc: strip(p.excerpt?.rendered || '') || strip(p.title?.rendered || ''),
      image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      type: 'article',
    }
  }

  const cats = data.catalog?.categories || []
  const walk = (parentId, trail) => {
    for (const c of cats.filter((x) => Number(x.parent) === parentId && Number(x.count) > 0)) {
      const path = [...trail, c.slug]
      m['/products/' + path.join('/')] = {
        title: c.name,
        desc: `${c.name} — ${c.count} محصول در فراز چمن، با کیفیت بالا و نصب تخصصی`,
      }
      walk(Number(c.id), path)
    }
  }
  walk(0, [])

  return m
}

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** عنوان/توضیح/OG را داخل قالب HTML می‌نشاند. */
function applyMeta(template, meta, route) {
  const title = meta.title ? `${meta.title} | ${SITE}` : `${SITE} | فروش و نصب چمن مصنوعی`
  const desc = meta.desc || DEFAULT_DESC
  const type = meta.type || 'website'

  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${esc(desc)}" />`,
    )

  const og = [
    `<meta property="og:site_name" content="${esc(SITE)}" />`,
    `<meta property="og:locale" content="fa_IR" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    meta.image ? `<meta property="og:image" content="${esc(meta.image)}" />` : '',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<link rel="canonical" data-prerender href="${esc(route)}" />`,
  ]
    .filter(Boolean)
    .join('\n    ')

  return html.replace('</head>', `  ${og}\n  </head>`)
}

async function main() {
  const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
  // روی ویندوز، import پویا فقط با آدرس file:// کار می‌کند
  const { render } = await import(pathToFileURL(path.join(ROOT, 'dist-ssr/entry-server.js')).href)

  const data = await loadWpData()
  globalThis.__WP_DATA__ = data

  const dataScript =
    `<script>window.__WP_DATA__=${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

  const routes = routesFor(data)
  const meta = metaFor(data)
  log(`rendering ${routes.length} routes…`)

  let written = 0
  for (const route of routes) {
    let html
    try {
      html = render(route)
    } catch (e) {
      log(`  ✗ ${route} — ${e.message}`)
      continue
    }

    // عنوان و توضیحات هر صفحه باید در همان HTML ثابت باشد؛ اگر فقط با
    // جاوااسکریپت ست شود، خزنده‌ای که اسکریپت اجرا نمی‌کند عنوان پیش‌فرض
    // را می‌بیند و همه‌ی صفحات یک عنوان پیدا می‌کنند.
    const m = meta[route] || {}
    const page = applyMeta(template, m, route)
      .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
      .replace('</body>', `${dataScript}\n  </body>`)

    const outDir = route === '/' ? DIST : path.join(DIST, route)
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'index.html'), page)
    written++
  }

  log(`done — ${written}/${routes.length} pages written`)
}

main().catch((e) => {
  console.error('[prerender] failed:', e)
  process.exit(1)
})
