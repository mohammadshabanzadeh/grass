// ارتباط با وردپرس/ووکامرس از طریق پروکسی same-origin (/wpapi)
// در توسعه توسط Vite و در پروداکشن توسط Vercel به api.farazchaman.ir پروکسی می‌شود.

const WP = '/wpapi'

function stripHtml(html = '') {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * سرور وردپرس گاهی کند است و گاهی اصلاً پاسخ نمی‌دهد؛ یک خطای گذرا نباید
 * به کاربر پیام خطا نشان دهد. هر درخواست با مهلت زمانی و چند بار تلاش
 * مجدد (با فاصله‌ی فزاینده) انجام می‌شود.
 */
async function apiFetch(path, { retries = 1, timeout = 20000 } = {}) {
  let lastError
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    try {
      const res = await fetch(WP + path, { signal: controller.signal })
      if (!res.ok && res.status !== 404) throw new Error(`HTTP ${res.status}`)
      return res
    } catch (err) {
      lastError = err
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 600 * (attempt + 1)))
      }
    } finally {
      clearTimeout(timer)
    }
  }
  throw lastError
}

/**
 * چند کامپوننت به یک داده نیاز دارند (مثلاً نوار منو و صفحه‌ی محصولات هر دو
 * دسته‌بندی می‌خواهند). با نگه‌داشتن همان Promise، به‌جای چند درخواستِ
 * تکراری روی سروری که کند است، فقط یک بار از شبکه گرفته می‌شود.
 */
const cache = new Map()
const once = (key, fn) => {
  if (!cache.has(key)) {
    cache.set(
      key,
      fn().catch((err) => {
        cache.delete(key) // خطا را کش نکن تا دفعه‌ی بعد دوباره تلاش شود
        throw err
      }),
    )
  }
  return cache.get(key)
}

/**
 * کش نشست (sessionStorage): سرور وردپرس چند ثانیه طول می‌کشد، پس در
 * بازدیدهای بعدی همان داده فوراً از حافظه‌ی مرورگر خوانده می‌شود و
 * هم‌زمان در پس‌زمینه تازه می‌شود (stale-while-revalidate).
 */
const SS_KEY = 'fc:catalog:v1'
const SS_TTL = 10 * 60 * 1000 // ۱۰ دقیقه

function readSession() {
  try {
    const raw = sessionStorage.getItem(SS_KEY)
    if (!raw) return null
    const { at, data } = JSON.parse(raw)
    if (!at || Date.now() - at > SS_TTL) return null
    return data
  } catch {
    return null
  }
}

function writeSession(data) {
  try {
    sessionStorage.setItem(SS_KEY, JSON.stringify({ at: Date.now(), data }))
  } catch {
    // حجم پر یا حالت خصوصی مرورگر — کش نداشتن مشکلی ایجاد نمی‌کند
  }
}

/** یک محصول ووکامرس را به شکل مورد نیاز کارت‌ها و صفحه‌ی محصول درمی‌آورد. */
function mapProduct(p) {
  return {
    id: p.id,
    title: p.name,
    slug: p.slug,
    link: p.permalink,
    sku: p.sku || '',
    img: p.images?.[0]?.src || null,
    images: (p.images || []).map((im) => im.src).filter(Boolean),
    descHtml: p.description || '',
    shortHtml: p.short_description || '',
    desc:
      stripHtml(p.short_description) ||
      stripHtml(p.description).slice(0, 90) ||
      (p.categories?.[0]?.name ?? 'چمن مصنوعی'),
    inStock: p.is_in_stock !== false,
    prices: p.prices || null,
    attributes: (p.attributes || []).map((a) => ({
      name: a.name,
      values: (a.terms || []).map((t) => t.name),
    })),
    categories: (p.categories || []).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      parent: c.parent ?? 0,
    })),
    categoryNames: (p.categories || []).map((c) => c.name),
    categorySlugs: (p.categories || []).map((c) => c.slug),
  }
}

const PRODUCT_FIELDS =
  'id,name,slug,permalink,sku,short_description,description,images,categories,attributes,prices,is_in_stock'

/** محصولات، دسته‌بندی‌ها و فهرست را از سه مسیر جدا می‌گیرد (حالت پشتیبان). */
async function loadSeparately() {
  // بدون تلاش مجدد: این مسیر فقط وقتی اجرا می‌شود که catalog از کار افتاده
  // باشد؛ تلاش دوباره روی سرورِ از قبل کند، اوضاع را بدتر می‌کند.
  const opts = { retries: 0 }
  const [prod, cats, menu] = await Promise.all([
    apiFetch(`/wc/store/v1/products?per_page=100&_fields=${PRODUCT_FIELDS}`, opts).then((r) =>
      r.json(),
    ),
    apiFetch(`/wc/store/v1/products/categories?per_page=100&_fields=id,name,slug,parent,count`, opts)
      .then((r) => r.json())
      .catch(() => []),
    apiFetch('/faraz/v1/site-menu', opts)
      .then((r) => r.json())
      .catch(() => []),
  ])
  return { products: prod, categories: cats, menu }
}

/**
 * همه‌ی داده‌های سایت با «یک» درخواست.
 *
 * سرور وردپرس کند است (اندازه‌گیری‌شده ۲ تا ۱۱ ثانیه برای هر درخواست)، پس
 * سه درخواست جدا برای فهرست، دسته‌بندی و محصولات یعنی صبر کردن تا کندترینِ
 * آن‌ها. مسیر faraz/v1/catalog هر سه را یک‌جا و به‌طور پایدار در ~۲.۵ ثانیه
 * برمی‌گرداند. نتیجه در sessionStorage می‌ماند تا بارگذاری‌های بعدی فوری
 * باشند و داده در پس‌زمینه تازه شود.
 */
export function fetchCatalog() {
  return once('catalog', async () => {
    const cached = readSession()
    if (cached) {
      // تازه‌سازی در پس‌زمینه؛ نتیجه‌اش برای بارگذاری بعدی استفاده می‌شود
      loadCatalogFresh().catch(() => {})
      return cached
    }
    return loadCatalogFresh()
  })
}

async function loadCatalogFresh() {
  let data
  try {
    const res = await apiFetch('/faraz/v1/catalog', { retries: 1 })
    const json = await res.json()
    if (!json || !Array.isArray(json.products)) throw new Error('bad catalog shape')
    data = {
      products: json.products,
      categories: json.categories || [],
      menu: json.menu || [],
    }
  } catch {
    data = await loadSeparately()
  }
  writeSession(data)
  return data
}

/** محصولات را به شکل مورد نیاز کارت‌ها نگاشت می‌کند. */
export function fetchProducts() {
  return once('products', async () => {
    const { products } = await fetchCatalog()
    return products.map(mapProduct)
  })
}

/**
 * ویژگی‌های محصولات (رنگ، جنس، اندازه) را جداگانه می‌گیرد.
 * مسیر catalog ویژگی‌ها را برنمی‌گرداند، پس فقط صفحه‌ی محصولات — که به
 * فیلترها نیاز دارد — این درخواست را می‌زند و بقیه‌ی صفحات هزینه‌اش را
 * نمی‌دهند. اگر شکست بخورد، فقط فیلترهای ویژگی نمایش داده نمی‌شوند.
 */
export function fetchProductAttributes() {
  return once('attributes', async () => {
    // تصاویر را هم در همین درخواست می‌گیریم: مسیر catalog فقط آدرس تصویر
    // کامل (۸۰۰ پیکسل) را می‌دهد، ولی ووکامرس نسخه‌های ۳۰۰ و ۶۰۰ پیکسلی هم
    // دارد و کارت‌ها در ~۳۰۰ پیکسل نمایش داده می‌شوند. چون این درخواست
    // به‌هرحال زده می‌شود، srcset مجانی به دست می‌آید.
    // بدون تلاش مجدد: اختیاری است و نباید به سرورِ کند فشار بیاورد.
    const res = await apiFetch(`/wc/store/v1/products?per_page=100&_fields=id,attributes,images`, {
      retries: 0,
    })
    const rows = await res.json()
    const map = new Map()
    rows.forEach((p) =>
      map.set(p.id, {
        attributes: (p.attributes || []).map((a) => ({
          name: a.name,
          values: (a.terms || []).map((t) => t.name),
        })),
        srcSet: trimSrcSet(p.images?.[0]?.srcset),
      }),
    )
    return map
  })
}

/**
 * از srcset وردپرس فقط کوچک‌ترین و بزرگ‌ترین نسخه را نگه می‌دارد.
 * اندازه‌های میانیِ وردپرس بهینه نیستند — اندازه‌گیری روی همین سایت نشان داد
 * نسخه‌ی ۶۰۰ پیکسلی دقیقاً هم‌حجم نسخه‌ی کامل است و نسخه‌ی ۷۶۸ پیکسلی حتی
 * بزرگ‌تر (۶۲ در برابر ۴۷ کیلوبایت). نگه‌داشتن آن‌ها می‌توانست حجم را روی
 * موبایل بیشتر کند، پس فقط نسخه‌ی کوچک (که واقعاً سبک‌تر است) و نسخه‌ی کامل
 * می‌مانند تا انتخاب مرورگر هیچ‌وقت بدتر از حالت فعلی نشود.
 */
function trimSrcSet(srcset) {
  if (!srcset) return undefined
  const entries = srcset
    .split(',')
    .map((s) => s.trim())
    .map((s) => {
      const m = s.match(/^(\S+)\s+(\d+)w$/)
      return m ? { url: m[1], w: Number(m[2]) } : null
    })
    .filter(Boolean)
    .sort((a, b) => a.w - b.w)

  if (entries.length < 2) return undefined
  const smallest = entries[0]
  const largest = entries[entries.length - 1]
  return `${smallest.url} ${smallest.w}w, ${largest.url} ${largest.w}w`
}

/** درصدکدگذاری را باز می‌کند تا اسلاگ فارسی و کدشده یکسان مقایسه شوند. */
function decodeSlug(s = '') {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

/**
 * یک محصول مشخص را با اسلاگ آن برمی‌گرداند.
 *
 * از فهرست محصولات (که کش شده) پیدا می‌شود، نه با پارامتر slug در API:
 * اسلاگ محصولات فارسیِ وردپرس به‌صورت درصدکدگذاری‌شده ذخیره می‌شود
 * («%da%86%d9%85%d9%86-…») و فیلتر slug ووکامرس با هیچ‌کدام از حالت‌های
 * کدگذاری آن را پیدا نمی‌کند. ضمناً مسیرِ آدرس را مرورگر رمزگشایی می‌کند،
 * پس دو طرف مقایسه را رمزگشایی می‌کنیم تا هر دو شکل درست تطبیق داده شوند.
 */
export async function fetchProductBySlug(slug) {
  const target = decodeSlug(slug)
  const list = await fetchProducts()
  return list.find((p) => decodeSlug(p.slug) === target) || null
}

/**
 * فهرست تخت وردپرس (هر آیتم با id و parent) را به درخت تبدیل می‌کند.
 * عمق محدود نیست؛ دسته‌بندی‌های این سایت سه سطح دارند
 * (مثلاً تزئینی ← منزل ← گلخانه).
 */
function buildTree(flat, { keep = () => true, sort, mapNode } = {}) {
  const build = (parentId, trail) => {
    const rows = flat.filter((c) => Number(c.parent) === parentId && keep(c))
    if (sort) rows.sort(sort)
    return rows.map((c) => {
      const path = [...trail, c.slug]
      return {
        ...mapNode(c),
        // مسیر کامل از ریشه تا این گره — برای ساختن آدرس تمیز
        path,
        href: '/products/' + path.join('/'),
        children: build(Number(c.id), path),
      }
    })
  }
  return build(0, [])
}

/**
 * دسته‌بندی‌های محصولات را درختی برمی‌گرداند.
 * مسیر اختصاصی سایت (faraz/v1) هم سریع‌تر است و هم کل درخت را می‌دهد؛
 * اگر در دسترس نبود به Store API ووکامرس برمی‌گردیم.
 * دسته‌های بدون محصول کنار گذاشته می‌شوند تا لینک و فیلترِ بی‌نتیجه نسازند.
 */
export function fetchCategories() {
  return once('categories', async () => {
    const { categories: flat } = await fetchCatalog()
    if (!Array.isArray(flat)) return []

    return buildTree(flat, {
      keep: (c) => Number(c.count) > 0,
      sort: (a, b) => Number(b.count) - Number(a.count),
      mapNode: (c) => ({
        id: Number(c.id),
        name: c.name,
        slug: c.slug,
        count: Number(c.count) || 0,
      }),
    })
  })
}

/**
 * فهرست بالای سایت را از وردپرس می‌خواند.
 * مسیرهای پیش‌فرض وردپرس برای فهرست‌ها (wp/v2/menus) بدون ورود کاربر
 * پاسخ ۴۰۱ می‌دهند، پس این تابع به مسیر عمومیِ افزونه‌ی «فراز چمن» وصل
 * می‌شود. اگر افزونه نصب نباشد null برمی‌گرداند تا فهرست ثابت سایت
 * دست‌نخورده بماند.
 */
export function fetchMenu() {
  return once('menu', async () => {
    try {
      const { menu: flat } = await fetchCatalog()
      if (!Array.isArray(flat) || !flat.length) return null

      // پاسخ تخت است (id/parent)؛ به درخت با هر عمقی تبدیلش می‌کنیم تا
      // زیرمنوها و زیرِ زیرمنوها هم نمایش داده شوند.
      const build = (parentId) =>
        flat
          .filter((m) => Number(m.parent) === parentId)
          .sort((a, b) => Number(a.order) - Number(b.order))
          .map((m) => ({
            id: Number(m.id),
            label: m.label,
            to: m.url || '/',
            children: build(Number(m.id)),
          }))

      const tree = build(0)
      return tree.length ? tree : null
    } catch {
      return null
    }
  })
}

/** یک پست پروژه‌ی وردپرس را به شکل مورد نیاز کارت‌ها/صفحه‌ی اختصاصی نگاشت می‌کند. */
function mapProject(post) {
  const meta = post.meta || {}
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title?.rendered || ''),
    excerpt: stripHtml(post.excerpt?.rendered || ''),
    content: post.content?.rendered || '',
    img: media?.source_url || null,
    gallery: Array.isArray(meta.project_gallery) ? meta.project_gallery : [],
    city: meta.project_city || '',
    cityKey: meta.project_city_key || '',
    category: meta.project_category || '',
    usage: meta.project_usage || '',
    badge: meta.project_badge || '',
    area: Number(meta.project_area) || 0,
  }
}

/**
 * همه‌ی پروژه‌های منتشرشده را از وردپرس می‌خواند (نوع پست «project»).
 * فهرست فقط به عنوان، تصویر و مشخصات نیاز دارد؛ متن کامل پروژه با _fields
 * کنار گذاشته می‌شود چون تنها در صفحه‌ی اختصاصی استفاده می‌شود و بیشترِ
 * حجم و کندی پاسخ از همان می‌آمد (۳۹ کیلوبایت → ۷ کیلوبایت).
 */
export function fetchProjects() {
  return once('projects', async () => {
    const res = await apiFetch(
      `/wp/v2/project?per_page=100&_embed=wp:featuredmedia&_fields=id,slug,title,meta,_links,_embedded`,
    )
    const data = await res.json()
    return data.map(mapProject)
  })
}

/** یک پروژه‌ی مشخص را با شناسه‌ی عددی آن از وردپرس می‌خواند. */
export async function fetchProjectById(id) {
  const res = await apiFetch(`/wp/v2/project/${encodeURIComponent(id)}?_embed=wp:featuredmedia`)
  if (res.status === 404) return null
  return mapProject(await res.json())
}
