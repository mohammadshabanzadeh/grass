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
async function apiFetch(path, { retries = 2, timeout = 10000 } = {}) {
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

/** محصولات ووکامرس را می‌خواند و به شکل مورد نیاز کارت‌ها نگاشت می‌کند. */
export async function fetchProducts() {
  const res = await apiFetch(
    `/wc/store/v1/products?per_page=100&_fields=id,name,slug,permalink,short_description,description,images,categories`,
  )
  const data = await res.json()
  return data.map((p) => ({
    id: p.id,
    title: p.name,
    slug: p.slug,
    link: p.permalink,
    img: p.images?.[0]?.src || null,
    desc:
      stripHtml(p.short_description) ||
      stripHtml(p.description).slice(0, 90) ||
      (p.categories?.[0]?.name ?? 'چمن مصنوعی'),
    categoryNames: (p.categories || []).map((c) => c.name),
    categorySlugs: (p.categories || []).map((c) => c.slug),
  }))
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
export async function fetchCategories() {
  let flat
  try {
    const res = await apiFetch('/faraz/v1/product-categories', { retries: 1 })
    flat = await res.json()
  } catch {
    const res = await apiFetch(
      `/wc/store/v1/products/categories?per_page=100&_fields=id,name,slug,parent,count`,
    )
    flat = await res.json()
  }
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
}

/**
 * فهرست بالای سایت را از وردپرس می‌خواند.
 * مسیرهای پیش‌فرض وردپرس برای فهرست‌ها (wp/v2/menus) بدون ورود کاربر
 * پاسخ ۴۰۱ می‌دهند، پس این تابع به مسیر عمومیِ افزونه‌ی «فراز چمن» وصل
 * می‌شود. اگر افزونه نصب نباشد null برمی‌گرداند تا فهرست ثابت سایت
 * دست‌نخورده بماند.
 */
export async function fetchMenu() {
  try {
    // مهلت کوتاه اینجا خطرناک است: اگر منقضی شود کاربر فهرست ثابتِ متفاوتی
    // می‌بیند. سرور وردپرس گاهی چند ثانیه طول می‌کشد، پس مهلت پیش‌فرض
    // (۱۰ ثانیه با دو تلاش مجدد) را نگه می‌داریم.
    const res = await apiFetch('/faraz/v1/site-menu')
    if (!res.ok) return null
    const flat = await res.json()
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
export async function fetchProjects() {
  const res = await apiFetch(
    `/wp/v2/project?per_page=100&_embed=wp:featuredmedia&_fields=id,slug,title,meta,_links,_embedded`,
  )
  const data = await res.json()
  return data.map(mapProject)
}

/** یک پروژه‌ی مشخص را با شناسه‌ی عددی آن از وردپرس می‌خواند. */
export async function fetchProjectById(id) {
  const res = await apiFetch(`/wp/v2/project/${encodeURIComponent(id)}?_embed=wp:featuredmedia`)
  if (res.status === 404) return null
  return mapProject(await res.json())
}
