import { useRef } from 'react'
import { ChevronRight, MoreVertical } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'
import ProductCard from './ProductCard.jsx'
import { products } from '../data.js'

export default function Products() {
  const trackRef = useRef(null)

  const scrollBy = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <section id="products" className="relative overflow-hidden py-20 sm:py-24">
      {/* حباب‌های محو برای جلوه‌ی شیشه‌ای */}
      <div className="pointer-events-none absolute right-[-6rem] top-10 h-72 w-72 rounded-full bg-grass-400/25 blur-3xl" />
      <div className="pointer-events-none absolute left-[-6rem] bottom-0 h-80 w-80 rounded-full bg-brand-400/25 blur-3xl" />

      <div className="container-x relative">
        <SectionHeading eyebrow="محصولات ما" title="انواع چمن مصنوعی با" highlight="کیفیت بالا" />

        <div className="relative mt-14">
          {/* دکمه‌های اسلایدر */}
          <div className="pointer-events-none absolute -right-2 top-1/2 z-20 hidden -translate-y-1/2 sm:-right-5 lg:block">
            <button
              onClick={() => scrollBy(1)}
              className="glass pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full text-brand-600 transition hover:bg-brand-600 hover:text-white"
              aria-label="قبلی"
            >
              <ChevronRight size={22} />
            </button>
            <div className="glass pointer-events-auto mt-3 flex h-11 w-11 items-center justify-center rounded-full text-slate-500">
              <MoreVertical size={20} />
            </div>
          </div>

          <div ref={trackRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} linkText="مشاهده محصول" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
