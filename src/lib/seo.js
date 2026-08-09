import { useEffect } from 'react'

const SITE = 'فراز چمن'
const DEFAULT_DESC =
  'فراز چمن - فروش و نصب تخصصی چمن مصنوعی با بهترین کیفیت و خدمات پس از فروش در سراسر کشور'

/** تگ <meta> را می‌سازد یا به‌روز می‌کند و برای پاک‌سازی علامت می‌زند. */
function setMeta(attr, key, value) {
  if (!value) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    el.setAttribute('data-seo', '1') // فقط تگ‌های ساخته‌شده توسط ما پاک می‌شوند
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function setLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"][data-seo]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    el.setAttribute('data-seo', '1')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** داده‌ی ساخت‌یافته (schema.org) برای موتورهای جست‌وجو */
function setSchema(json) {
  document.head.querySelectorAll('script[data-seo-schema]').forEach((n) => n.remove())
  if (!json) return
  const s = document.createElement('script')
  s.type = 'application/ld+json'
  s.setAttribute('data-seo-schema', '1')
  s.textContent = JSON.stringify(json)
  document.head.appendChild(s)
}

/**
 * عنوان و متاتگ‌های هر صفحه را تنظیم می‌کند.
 *
 * این سایت جدا از وردپرس رندر می‌شود، پس متاهایی که رنک‌مث روی صفحات
 * وردپرس می‌سازد این‌جا وجود ندارند و باید از همان داده‌ای که از API
 * می‌گیریم ساخته شوند.
 */
export function useSeo({ title, description, image, type = 'website', schema } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE}` : `${SITE} | فروش و نصب چمن مصنوعی`
    const desc = description || DEFAULT_DESC
    const url = window.location.origin + window.location.pathname
    const img = image || window.location.origin + '/logo.png'

    document.title = fullTitle

    setMeta('name', 'description', desc)
    setLink('canonical', url)

    setMeta('property', 'og:site_name', SITE)
    setMeta('property', 'og:locale', 'fa_IR')
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', img)

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', desc)
    setMeta('name', 'twitter:image', img)

    setSchema(schema)
  }, [title, description, image, type, schema])
}

/** داده‌ی ساخت‌یافته‌ی سازمان — برای صفحه‌ی اصلی */
export function organizationSchema() {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE,
    url: origin,
    logo: origin + '/logo.png',
    description: DEFAULT_DESC,
    telephone: '+989123365430',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'کرج',
      addressCountry: 'IR',
      streetAddress: 'بلوار یادگار امام شمال - نبش بلال ۷ - مجتمع نور هشتم',
    },
  }
}

/** داده‌ی ساخت‌یافته‌ی محصول */
export function productSchema(p) {
  if (!p) return null
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    description: p.desc,
    image: p.images?.length ? p.images : p.img ? [p.img] : undefined,
    sku: p.sku || undefined,
    brand: { '@type': 'Brand', name: SITE },
    url: origin + '/product/' + p.slug,
    category: p.categoryNames?.[0],
  }
}
