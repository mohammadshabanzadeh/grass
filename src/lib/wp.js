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
