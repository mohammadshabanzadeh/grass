import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, Home } from 'lucide-react'
import { fetchCategories, fetchProducts, fetchProjects } from '../lib/wp.js'

// برچسب مسیرهای ثابت سایت
const STATIC_LABELS = {
  products: 'محصولات',
  product: 'محصولات',
  projects: 'پروژه‌ها',
  services: 'خدمات',
  about: 'درباره ما',
  contact: 'تماس با ما',
}

const decode = (s = '') => {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

/**
 * مسیر صفحه‌ی فعلی را به دانه‌های بردکرامب تبدیل می‌کند و هم‌زمان
 * اسکیمای BreadcrumbList را برای گوگل تولید می‌کند.
 *
 * نام دسته‌بندی‌ها، محصول و پروژه از وردپرس خوانده می‌شود (داده‌ها کش
 * شده‌اند، پس درخواست تازه‌ای زده نمی‌شود)؛ تا رسیدن داده، همان اسلاگ
 * نمایش داده می‌شود و بعد با نام واقعی جایگزین می‌گردد.
 */
export default function Breadcrumbs() {
  const location = useLocation()
  const [names, setNames] = useState({}) // slug/id → نام واقعی

  const segments = location.pathname.split('/').filter(Boolean)

  useEffect(() => {
    if (!segments.length) return
    let alive = true
    Promise.allSettled([fetchCategories(), fetchProducts(), fetchProjects()]).then(
      ([cats, prods, projs]) => {
        if (!alive) return
        const map = {}
        if (cats.status === 'fulfilled') {
          const walk = (nodes) =>
            nodes.forEach((c) => {
              map[c.slug] = c.name
              walk(c.children || [])
            })
          walk(cats.value)
        }
        if (prods.status === 'fulfilled') {
          prods.value.forEach((p) => {
            map[p.slug] = p.title
            map[decode(p.slug)] = p.title
          })
        }
        if (projs.status === 'fulfilled') {
          projs.value.forEach((p) => (map[String(p.id)] = p.title))
        }
        setNames(map)
      },
    )
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  if (!segments.length) return null // صفحه‌ی اصلی بردکرامب ندارد

  const crumbs = [{ label: 'خانه', to: '/' }]
  let acc = ''
  segments.forEach((raw, i) => {
    const seg = decode(raw)
    acc += '/' + raw
    const isFirst = i === 0
    const label = isFirst ? STATIC_LABELS[seg] || seg : names[seg] || names[decode(seg)] || seg
    // «/product/<slug>» خودش صفحه‌ی فهرست ندارد؛ به فهرست محصولات وصل می‌شود
    const to = isFirst && seg === 'product' ? '/products' : acc
    crumbs.push({ label, to })
  })

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: origin + c.to,
    })),
  }

  return (
    <nav aria-label="مسیر صفحه" className="container-x pt-24 sm:pt-28">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-slate-500">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1
          return (
            <li key={c.to + i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronLeft size={14} className="shrink-0 text-slate-400" />}
              {last ? (
                <span aria-current="page" className="font-bold text-slate-700">
                  {c.label}
                </span>
              ) : (
                <Link
                  to={c.to}
                  className="flex items-center gap-1 transition hover:text-brand-700"
                >
                  {i === 0 && <Home size={14} />}
                  {c.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>

      {/* اسکیمای بردکرامب برای موتورهای جست‌وجو */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </nav>
  )
}
