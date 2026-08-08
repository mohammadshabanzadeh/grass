import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'
import ProductCard from './ProductCard.jsx'
import { products as fallbackProducts } from '../data.js'
import { fetchProducts } from '../lib/wp.js'

export default function Products() {
  const trackRef = useRef(null)
  const [items, setItems] = useState(fallbackProducts)
  const [loading, setLoading] = useState(true)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    let alive = true
    fetchProducts()
      .then((list) => {
        if (alive && list.length) setItems(list) // همه‌ی محصولات، نه فقط چهارتا
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  // در چیدمان راست‌به‌چپ، scrollLeft منفی است؛ برای همین از قدر مطلق
  // استفاده می‌کنیم تا تشخیص ابتدا/انتهای اسلایدر درست کار کند.
  const updateEdges = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const pos = Math.abs(el.scrollLeft)
    setAtStart(pos <= 4)
    setAtEnd(pos >= max - 4)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateEdges()
    el.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      el.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
  }, [updateEdges, items])

  const scrollByCards = (dir) => {
    const el = trackRef.current
    if (!el) return
    // dir=1 یعنی «بعدی» که در RTL به سمت چپ (مقدار منفی) حرکت می‌کند
    el.scrollBy({ left: dir * el.clientWidth * 0.85 * -1, behavior: 'smooth' })
  }

  return (
    <section id="products" className="relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute right-[-6rem] top-10 h-72 w-72 rounded-full bg-grass-400/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-[-6rem] h-80 w-80 rounded-full bg-brand-400/25 blur-3xl" />

      <div className="container-x relative">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="محصولات ما" title="انواع چمن مصنوعی با" highlight="کیفیت بالا" />

          {/* دکمه‌های اسلایدر (دسکتاپ) */}
          <div className="mb-2 hidden shrink-0 gap-2 lg:flex">
            <button
              onClick={() => scrollByCards(-1)}
              disabled={atStart}
              aria-label="قبلی"
              className="glass flex h-11 w-11 items-center justify-center rounded-full text-brand-600 transition enabled:hover:bg-brand-600 enabled:hover:text-white disabled:opacity-40"
            >
              <ChevronRight size={22} />
            </button>
            <button
              onClick={() => scrollByCards(1)}
              disabled={atEnd}
              aria-label="بعدی"
              className="glass flex h-11 w-11 items-center justify-center rounded-full text-brand-600 transition enabled:hover:bg-brand-600 enabled:hover:text-white disabled:opacity-40"
            >
              <ChevronLeft size={22} />
            </button>
          </div>
        </div>

        <div className="relative mt-12">
          <div
            ref={trackRef}
            className="hide-scrollbar -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-3 pt-2"
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[78%] shrink-0 animate-pulse rounded-3xl bg-white/45 sm:w-[46%] lg:w-[31%] xl:w-[23.5%]"
                    style={{ height: 340 }}
                  />
                ))
              : items.map((p, i) => (
                  <div
                    key={p.id ?? p.title}
                    className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[23.5%]"
                  >
                    <ProductCard p={p} index={i} linkText="مشاهده محصول" />
                  </div>
                ))}
          </div>
        </div>

        {!loading && (
          <p className="mt-6 text-center text-xs text-slate-500 lg:hidden">
            برای دیدن محصولات بیشتر، انگشت خود را روی کارت‌ها بکشید
          </p>
        )}
      </div>
    </section>
  )
}
