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
 * دسته‌بندی‌های محصولات را از ووکامرس می‌خواند و به‌صورت درختی
 * (والد + زیرشاخه‌ها) برمی‌گرداند تا فیلتر سایت همان ساختار وردپرس را
 * نشان دهد. دسته‌های بدون محصول کنار گذاشته می‌شوند تا فیلتر بی‌اثر نسازند.
 */
export async function fetchCategories() {
  const res = await apiFetch(
    `/wc/store/v1/products/categories?per_page=100&_fields=id,name,slug,parent,count`,
  )
  const flat = await res.json()

  // درخت با هر عمقی ساخته می‌شود؛ دسته‌بندی‌های این سایت سه سطح دارند
  // (مثلاً تزئینی ← منزل ← گلخانه) و ساختِ دوسطحی نوه‌ها را جا می‌انداخت.
  const build = (parentId) =>
    flat
      .filter((c) => c.parent === parentId && c.count > 0)
      .sort((a, b) => b.count - a.count)
      .map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        count: c.count,
        children: build(c.id),
      }))

  return build(0)
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
    const res = await apiFetch('/faraz/v1/menu', { retries: 1, timeout: 6000 })
    if (!res.ok) return null
    const items = await res.json()
    return Array.isArray(items) && items.length ? items : null
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
