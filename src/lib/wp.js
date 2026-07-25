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

/** محصولات ووکامرس را می‌خواند و به شکل مورد نیاز کارت‌ها نگاشت می‌کند. */
export async function fetchProducts() {
  const res = await fetch(
    `${WP}/wc/store/v1/products?per_page=100&_fields=id,name,slug,permalink,short_description,description,images,categories`,
  )
  if (!res.ok) throw new Error(`WooCommerce products failed: ${res.status}`)
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

/** دسته‌بندی‌های اصلی محصولات (سطح بالا) را می‌خواند. */
export async function fetchCategories() {
  const res = await fetch(
    `${WP}/wc/store/v1/products/categories?per_page=100&_fields=id,name,slug,parent,count`,
  )
  if (!res.ok) throw new Error(`WooCommerce categories failed: ${res.status}`)
  return res.json()
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

/** همه‌ی پروژه‌های منتشرشده را از وردپرس می‌خواند (نوع پست «project»). */
export async function fetchProjects() {
  const res = await fetch(`${WP}/wp/v2/project?per_page=100&_embed=wp:featuredmedia`)
  if (!res.ok) throw new Error(`Projects fetch failed: ${res.status}`)
  const data = await res.json()
  return data.map(mapProject)
}

/** یک پروژه‌ی مشخص را با شناسه‌ی عددی آن از وردپرس می‌خواند. */
export async function fetchProjectById(id) {
  const res = await fetch(`${WP}/wp/v2/project/${encodeURIComponent(id)}?_embed=wp:featuredmedia`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Project fetch failed: ${res.status}`)
  return mapProject(await res.json())
}
