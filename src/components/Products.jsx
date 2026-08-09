import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react'
import SmartImage from './SmartImage.jsx'
import SectionHeading from './SectionHeading.jsx'
import { products as fallbackProducts } from '../data.js'
import { fetchProducts, seededProducts } from '../lib/wp.js'

// چند کارت در هر طرفِ کارت مرکزی دیده شود
const SIDE = 2

export default function Products() {
  const [items, setItems] = useState(() => seededProducts() || fallbackProducts)
  const [loading, setLoading] = useState(() => !seededProducts())
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(0)
  // فاصله‌ی افقی کارت‌ها به عرض صفحه بستگی دارد؛ با تغییر اندازه به‌روز می‌شود
  const [gap, setGap] = useState(190)

  useEffect(() => {
    const onResize = () => setGap(window.innerWidth < 640 ? 130 : 190)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    let alive = true
    fetchProducts()
      .then((list) => {
        if (alive && list.length) setItems(list)
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const total = items.length

  const move = useCallback(
    (step) => {
      if (!total) return
      setDir(step)
      setActive((i) => (i + step + total) % total)
    },
    [total],
  )

  // پیمایش با کلیدهای جهت‌دار (در چیدمان راست‌به‌چپ معکوس است)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') move(1)
      else if (e.key === 'ArrowRight') move(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [move])

  /**
   * برای هر کارت، فاصله‌ی حلقه‌ای‌اش از کارت فعال را حساب می‌کنیم تا
   * بتوانیم عمق (چرخش، مقیاس و z) را بر اساس آن بسازیم. حلقه‌ای بودن باعث
   * می‌شود انتهای فهرست به ابتدای آن وصل شود و اسلایدر بی‌انتها حس شود.
   */
  const ring = useMemo(() => {
    if (!total) return []
    return items.map((p, i) => {
      let offset = i - active
      if (offset > total / 2) offset -= total
      if (offset < -total / 2) offset += total
      return { p, i, offset }
    })
  }, [items, active, total])

  const visible = ring.filter((r) => Math.abs(r.offset) <= SIDE)

  return (
    <section id="products" className="relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute right-[-6rem] top-10 h-72 w-72 rounded-full bg-grass-400/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-[-6rem] h-80 w-80 rounded-full bg-brand-400/25 blur-3xl" />

      <div className="container-x relative">
        <SectionHeading eyebrow="محصولات ما" title="انواع چمن مصنوعی با" highlight="کیفیت بالا" />

        {loading ? (
          <div className="mt-14 flex justify-center">
            <div className="h-[26rem] w-full max-w-sm animate-pulse rounded-3xl bg-white/45" />
          </div>
        ) : (
          <>
            {/* ===== صحنه‌ی سه‌بعدی ===== */}
            <div
              className="relative mt-14 flex h-[27rem] items-center justify-center sm:h-[29rem]"
              style={{ perspective: '1400px', perspectiveOrigin: '50% 45%' }}
            >
              {visible.map(({ p, i, offset }) => {
                const abs = Math.abs(offset)
                const isActive = offset === 0
                return (
                  <motion.div
                    key={p.id ?? p.title}
                    className="absolute w-[16rem] sm:w-[18rem]"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{
                      // در RTL هم محور X همان چپ/راست فیزیکی است
                      x: offset * gap,
                      scale: isActive ? 1 : 0.82 - (abs - 1) * 0.06,
                      rotateY: offset * -26,
                      z: isActive ? 0 : -160 * abs,
                      opacity: abs > SIDE ? 0 : 1 - abs * 0.22,
                      zIndex: 20 - abs,
                      filter: isActive ? 'blur(0px)' : `blur(${abs * 1.2}px)`,
                    }}
                    transition={{ type: 'spring', stiffness: 220, damping: 28, mass: 0.7 }}
                    onClick={() => !isActive && (setDir(offset > 0 ? 1 : -1), setActive(i))}
                  >
                    <article
                      className={`glass overflow-hidden rounded-3xl transition-shadow duration-300 ${
                        isActive ? 'shadow-soft' : 'cursor-pointer shadow-card'
                      }`}
                    >
                      <div className="relative">
                        <SmartImage
                          src={p.img}
                          alt={p.title}
                          gradient={p.gradient}
                          className="h-52 w-full sm:h-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 to-transparent" />
                      </div>

                      <div className="p-5 text-center">
                        <h3 className="truncate text-base font-extrabold text-slate-800 sm:text-lg">
                          {p.title}
                        </h3>
                        <p className="mx-auto mt-2 line-clamp-2 min-h-[3.5rem] max-w-[15rem] text-xs leading-7 text-slate-600 sm:text-sm">
                          {p.desc}
                        </p>

                        {/* لینک فقط برای کارت فعال فعال است تا کلیک‌های
                            کارت‌های کناری باعث جابه‌جایی شوند، نه رفتن به صفحه */}
                        {isActive ? (
                          <Link
                            to={p.slug ? `/product/${p.slug}` : '/products'}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-600/30 transition hover:bg-brand-700 sm:text-sm"
                          >
                            مشاهده محصول
                            <ArrowLeft size={15} />
                          </Link>
                        ) : (
                          <span className="mt-3 inline-block text-xs font-bold text-slate-400">
                            برای مشاهده کلیک کنید
                          </span>
                        )}
                      </div>
                    </article>
                  </motion.div>
                )
              })}

              {/* دکمه‌های پیمایش — داخل خودِ اسلایدر */}
              <button
                onClick={() => move(-1)}
                aria-label="قبلی"
                className="glass-menu absolute right-1 z-[40] flex h-12 w-12 items-center justify-center rounded-full text-brand-700 transition hover:bg-brand-600 hover:text-white sm:right-6"
              >
                <ChevronRight size={24} />
              </button>
              <button
                onClick={() => move(1)}
                aria-label="بعدی"
                className="glass-menu absolute left-1 z-[40] flex h-12 w-12 items-center justify-center rounded-full text-brand-700 transition hover:bg-brand-600 hover:text-white sm:left-6"
              >
                <ChevronLeft size={24} />
              </button>
            </div>

            {/* شماره‌ی محصول فعال + نقطه‌ها */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                {items.map((p, i) => (
                  <button
                    key={p.id ?? p.title}
                    onClick={() => {
                      setDir(i > active ? 1 : -1)
                      setActive(i)
                    }}
                    aria-label={`محصول ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === active ? 'w-7 bg-brand-600' : 'w-2 bg-slate-300 hover:bg-brand-300'
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: dir >= 0 ? 8 : -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm font-bold text-slate-500"
                >
                  {items[active]?.title}
                </motion.p>
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
