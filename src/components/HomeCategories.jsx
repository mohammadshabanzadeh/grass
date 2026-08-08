import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import SmartImage from './SmartImage.jsx'
import SectionHeading from './SectionHeading.jsx'
import { fetchCategories, fetchProducts } from '../lib/wp.js'

const faDigits = '۰۱۲۳۴۵۶۷۸۹'
const toFa = (n) => String(n).replace(/\d/g, (d) => faDigits[d])

const MAX = 6

export default function HomeCategories() {
  const [cats, setCats] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    Promise.allSettled([fetchCategories(), fetchProducts()]).then(([c, p]) => {
      if (!alive) return
      if (c.status === 'fulfilled') setCats(c.value)
      if (p.status === 'fulfilled') setProducts(p.value)
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  // دسته‌بندی‌های ووکامرس تصویر ندارند، پس برای هر دسته تصویرِ یکی از
  // محصولات همان دسته (یا زیرشاخه‌هایش) به‌عنوان نماینده استفاده می‌شود.
  const items = useMemo(() => {
    const descendants = (node) => {
      const out = [node.slug]
      ;(node.children || []).forEach((ch) => out.push(...descendants(ch)))
      return out
    }
    return cats.slice(0, MAX).map((c) => {
      const slugs = new Set(descendants(c))
      const rep = products.find((p) => (p.categorySlugs || []).some((s) => slugs.has(s)))
      return {
        ...c,
        img: rep?.img || null,
        subCount: (c.children || []).length,
      }
    })
  }, [cats, products])

  return (
    <section id="categories" className="relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-grass-400/20 blur-3xl" />

      <div className="container-x relative">
        <SectionHeading eyebrow="دسته‌بندی‌ها" title="چمن مصنوعی مناسب" highlight="هر فضا" />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-52 animate-pulse rounded-3xl bg-white/45" />
              ))
            : items.map((c, i) => (
                <motion.div
                  key={c.slug}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <Link
                    to={c.href}
                    className="group relative block h-52 overflow-hidden rounded-3xl border border-white/40 shadow-card"
                  >
                    <SmartImage
                      src={c.img}
                      alt={c.name}
                      gradient="linear-gradient(135deg,#16a34a 0%,#15803d 55%,#052e16 120%)"
                      className="absolute inset-0 h-full w-full"
                      imgClassName="transition duration-[600ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/35 to-transparent transition group-hover:from-slate-900/90" />

                    <div className="absolute inset-x-4 bottom-4 text-right text-white">
                      <h3 className="text-lg font-extrabold drop-shadow sm:text-xl">{c.name}</h3>
                      <p className="mt-1 text-xs text-white/80">
                        {toFa(c.count)} محصول
                        {c.subCount > 0 && ` • ${toFa(c.subCount)} زیرشاخه`}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-200 transition group-hover:gap-3">
                        مشاهده محصولات
                        <ArrowLeft size={15} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-brand-600 px-7 py-3.5 text-sm font-bold text-brand-600 transition hover:bg-brand-600 hover:text-white"
          >
            مشاهده همه دسته‌بندی‌ها
            <ArrowLeft size={18} className="transition group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
