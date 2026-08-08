import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  RotateCcw,
  Check,
  SearchX,
  Loader2,
} from 'lucide-react'
import ProductCard from './ProductCard.jsx'
import SkeletonCards from './Skeleton.jsx'
import {
  allProducts,
  categories as staticCats,
  fiberTypes,
  densities,
  swatchColors,
  sortOptions,
} from '../data.js'
import { fetchProducts, fetchCategories } from '../lib/wp.js'

const faDigits = '۰۱۲۳۴۵۶۷۸۹'
const toFa = (n) => String(n).replace(/\d/g, (d) => faDigits[d])

const HEIGHT_MIN = 10
const HEIGHT_MAX = 50

// نسخه‌ی جایگزین (آفلاین) بر پایه‌ی داده‌های ثابت
const FALLBACK = allProducts.map((p) => ({
  id: p.id,
  title: p.title,
  img: p.img,
  gradient: p.gradient,
  icon: p.icon,
  desc: p.desc,
  link: null,
  catSlugs: [p.category].filter(Boolean),
  fiber: p.fiber,
  color: p.color,
  density: p.density,
  height: p.height,
}))

// دسته‌بندی‌های جایگزین، با همان شکل درختیِ داده‌ی وردپرس
const FALLBACK_CATS = staticCats
  .filter((c) => c.key !== 'all')
  .map((c) => ({ id: c.key, name: c.label, slug: c.key, count: 0, children: [] }))

export default function ProductsCatalog() {
  const [products, setProducts] = useState(FALLBACK)
  const [catTree, setCatTree] = useState(FALLBACK_CATS)
  const [live, setLive] = useState(false)
  const [loading, setLoading] = useState(true)

  // دسته از خودِ مسیر خوانده می‌شود، بدون پارامتر در آدرس:
  // /products/decorative-artificial-grass/residential/patio → «گلخانه»
  // آخرین بخشِ مسیر همان دسته‌ی انتخاب‌شده است.
  const params = useParams()
  const catParam = (params['*'] || '')
    .split('/')
    .filter(Boolean)
    .pop()

  const [cats, setCats] = useState(catParam ? [catParam] : [])
  const [minH, setMinH] = useState(HEIGHT_MIN)
  const [maxH, setMaxH] = useState(HEIGHT_MAX)
  const [fibers, setFibers] = useState([])
  const [colors, setColors] = useState([])
  const [dens, setDens] = useState([])
  const [view, setView] = useState('grid')
  const [sort, setSort] = useState(sortOptions[0])
  const [sortOpen, setSortOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [catOpen, setCatOpen] = useState(true)

  // رفتن از یک دسته به دسته‌ی دیگر از زیرمنو، مسیر را عوض نمی‌کند و کامپوننت
  // دوباره ساخته نمی‌شود؛ پس تغییر پارامتر آدرس باید صریح همگام شود.
  useEffect(() => {
    setCats(catParam ? [catParam] : [])
  }, [catParam])

  useEffect(() => {
    let alive = true
    // هر دو مستقل هستند: اگر خواندن دسته‌بندی‌ها شکست بخورد محصولات
    // همچنان نمایش داده می‌شوند و برعکس.
    Promise.allSettled([fetchProducts(), fetchCategories()]).then(([prodRes, catRes]) => {
      if (!alive) return
      if (prodRes.status === 'fulfilled' && prodRes.value.length) {
        setProducts(
          prodRes.value.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug, // برای لینک به صفحه‌ی اختصاصی محصول لازم است
            img: p.img,
            desc: p.desc,
            link: p.link,
            catSlugs: p.categorySlugs,
          })),
        )
        setLive(true)
      }
      if (catRes.status === 'fulfilled' && catRes.value.length) {
        setCatTree(catRes.value)
      }
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  const toggle = (setter, list, value) =>
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const resetFilters = () => {
    setCats([])
    setMinH(HEIGHT_MIN)
    setMaxH(HEIGHT_MAX)
    setFibers([])
    setColors([])
    setDens([])
  }

  // درخت را برای نمایش به فهرستی مسطح با عمق تبدیل می‌کنیم تا هر تعداد
  // سطح (والد/فرزند/نوه) درست تودرتو نشان داده شود.
  const catRows = useMemo(() => {
    const rows = []
    const walk = (nodes, depth) =>
      nodes.forEach((n) => {
        rows.push({ slug: n.slug, name: n.name, count: n.count, depth })
        walk(n.children || [], depth + 1)
      })
    walk(catTree, 0)
    return rows
  }, [catTree])

  // انتخاب یک دسته باید همه‌ی زیرشاخه‌هایش (در هر عمقی) را هم شامل شود.
  // در ووکامرس محصولات همیشه اسلاگ والد را ندارند — مثلاً تنها محصولِ
  // «منزل» فقط اسلاگ نوه‌اش «گلخانه» را دارد — پس بدون این گسترش، فیلترِ
  // والد صفر نتیجه می‌داد در حالی که وردپرس برایش تعداد نشان می‌دهد.
  const expandedCats = useMemo(() => {
    const map = {}
    const walk = (node) => {
      const slugs = [node.slug]
      ;(node.children || []).forEach((child) => {
        walk(child)
        slugs.push(...(map[child.slug] || [child.slug]))
      })
      map[node.slug] = slugs
      return slugs
    }
    catTree.forEach(walk)
    return map
  }, [catTree])

  const anyFiber = products.some((p) => p.fiber)
  const anyColor = products.some((p) => p.color)
  const anyDensity = products.some((p) => p.density)
  const anyHeight = products.some((p) => typeof p.height === 'number')

  const filtered = useMemo(() => {
    const wanted = new Set(cats.flatMap((s) => expandedCats[s] || [s]))
    return products.filter((p) => {
      const catOk = cats.length === 0 || (p.catSlugs || []).some((s) => wanted.has(s))
      const fiberOk = !anyFiber || fibers.length === 0 || fibers.includes(p.fiber)
      const colorOk = !anyColor || colors.length === 0 || colors.includes(p.color)
      const densOk = !anyDensity || dens.length === 0 || dens.includes(p.density)
      const hOk = !anyHeight || (p.height >= minH && p.height <= maxH)
      return catOk && fiberOk && colorOk && densOk && hOk
    })
  }, [
    products,
    cats,
    expandedCats,
    fibers,
    colors,
    dens,
    minH,
    maxH,
    anyFiber,
    anyColor,
    anyDensity,
    anyHeight,
  ])

  const leftPct = ((minH - HEIGHT_MIN) / (HEIGHT_MAX - HEIGHT_MIN)) * 100
  const rightPct = ((maxH - HEIGHT_MIN) / (HEIGHT_MAX - HEIGHT_MIN)) * 100

  // روی موبایل پنل فیلتر جمع است و با دکمه باز می‌شود؛ روی دسکتاپ همیشه باز است.
  const [filtersOpen, setFiltersOpen] = useState(false)
  const activeCount =
    cats.length +
    fibers.length +
    colors.length +
    dens.length +
    (minH !== HEIGHT_MIN || maxH !== HEIGHT_MAX ? 1 : 0)

  return (
    <section className="container-x py-16 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* ===== سایدبار فیلتر (راست) ===== */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="glass h-fit rounded-3xl p-4 sm:p-6 lg:sticky lg:top-24"
        >
          {/* موبایل: دکمه‌ی باز/بسته کردن پنل فیلتر */}
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            aria-controls="product-filters"
            className="flex w-full items-center justify-between gap-2 lg:hidden"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/30">
                <SlidersHorizontal size={18} />
              </span>
              {activeCount > 0 && (
                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700">
                  {toFa(activeCount)}
                </span>
              )}
            </span>
            <span className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-800">فیلتر محصولات</h3>
              <ChevronDown
                size={18}
                className={`text-slate-500 transition ${filtersOpen ? 'rotate-180' : ''}`}
              />
            </span>
          </button>

          {/* دسکتاپ: فقط عنوان — فیلترها همیشه بازند */}
          <div className="mb-2 hidden items-center justify-between lg:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/30">
              <SlidersHorizontal size={18} />
            </span>
            <h3 className="text-lg font-extrabold text-slate-800">فیلتر محصولات</h3>
          </div>

          <div id="product-filters" className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
          {/* دسته بندی */}
          <FilterBlock title="دسته بندی" collapsible open={catOpen} onToggle={() => setCatOpen((v) => !v)}>
            <ul className="max-h-80 space-y-3 overflow-auto pt-1">
              <li>
                <CheckRow label="همه دسته بندی ها" checked={cats.length === 0} onClick={() => setCats([])} />
              </li>
              {catRows.map((c) => (
                <li
                  key={c.slug}
                  style={{ paddingInlineStart: c.depth ? c.depth * 14 : undefined }}
                  className={c.depth ? 'border-r border-white/60' : undefined}
                >
                  <CheckRow
                    label={c.name}
                    count={c.count}
                    small={c.depth > 0}
                    checked={cats.includes(c.slug)}
                    onClick={() => toggle(setCats, cats, c.slug)}
                  />
                </li>
              ))}
            </ul>
          </FilterBlock>

          {/* ارتفاع چمن */}
          <FilterBlock title="ارتفاع چمن (میلی متر)">
            <div className="px-1 pt-4" dir="ltr">
              <div className="dual-range">
                <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-200" />
                <div
                  className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-600"
                  style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
                />
                <input
                  type="range"
                  min={HEIGHT_MIN}
                  max={HEIGHT_MAX}
                  value={minH}
                  onChange={(e) => setMinH(Math.min(Number(e.target.value), maxH - 5))}
                />
                <input
                  type="range"
                  min={HEIGHT_MIN}
                  max={HEIGHT_MAX}
                  value={maxH}
                  onChange={(e) => setMaxH(Math.max(Number(e.target.value), minH + 5))}
                />
              </div>
              <div className="mt-3 flex justify-between text-xs font-semibold text-slate-600">
                <span>{toFa(minH)}</span>
                <span>{toFa(maxH)}</span>
              </div>
            </div>
          </FilterBlock>

          {/* نوع الیاف */}
          <FilterBlock title="نوع الیاف">
            <ul className="space-y-3 pt-1">
              {fiberTypes.map((f) => (
                <li key={f}>
                  <CheckRow label={f} checked={fibers.includes(f)} onClick={() => toggle(setFibers, fibers, f)} />
                </li>
              ))}
            </ul>
          </FilterBlock>

          {/* رنگ */}
          <FilterBlock title="رنگ">
            <div className="flex gap-3 pt-1">
              {swatchColors.map((c) => {
                const active = colors.includes(c.hex)
                return (
                  <button
                    key={c.hex}
                    onClick={() => toggle(setColors, colors, c.hex)}
                    aria-label={c.name}
                    className={`relative h-9 w-9 rounded-full ring-offset-2 transition hover:scale-110 ${
                      active ? 'ring-2 ring-brand-600' : 'ring-1 ring-white/60'
                    }`}
                    style={{ background: c.hex }}
                  >
                    {active && (
                      <span className="absolute inset-0 flex items-center justify-center text-white">
                        <Check size={15} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </FilterBlock>

          {/* تراکم */}
          <FilterBlock title="تراکم" last>
            <div className="flex flex-wrap gap-2 pt-1">
              {densities.map((d) => {
                const active = dens.includes(d)
                return (
                  <button
                    key={d}
                    onClick={() => toggle(setDens, dens, d)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                        : 'glass text-slate-600 hover:text-brand-600'
                    }`}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
          </FilterBlock>

          <button
            onClick={resetFilters}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50/70 py-3 text-sm font-bold text-brand-600 transition hover:bg-brand-100"
          >
            <RotateCcw size={16} />
            پاک کردن فیلترها
          </button>
          </div>
        </motion.aside>

        {/* ===== ناحیه محصولات (چپ) ===== */}
        <div>
          {/* تولبار */}
          <div className="glass mb-8 flex flex-col items-center gap-4 rounded-2xl px-5 py-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setSortOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white"
                >
                  <ChevronDown size={16} className={`transition ${sortOpen ? 'rotate-180' : ''}`} />
                  مرتب سازی: {sort}
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="glass-strong absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-xl p-1.5"
                    >
                      {sortOptions.map((o) => (
                        <li key={o}>
                          <button
                            onClick={() => {
                              setSort(o)
                              setSortOpen(false)
                            }}
                            className={`w-full rounded-lg px-3 py-2 text-right text-sm transition hover:bg-white/60 ${
                              o === sort ? 'font-bold text-brand-600' : 'text-slate-600'
                            }`}
                          >
                            {o}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-1.5">
                <ToggleBtn active={view === 'grid'} onClick={() => setView('grid')}>
                  <LayoutGrid size={18} />
                </ToggleBtn>
                <ToggleBtn active={view === 'list'} onClick={() => setView('list')}>
                  <List size={18} />
                </ToggleBtn>
              </div>
            </div>

            {/* تا وقتی داده‌ی واقعی نرسیده، شمارشِ داده‌ی جایگزین گمراه‌کننده است */}
            <p className="flex items-center gap-1.5 text-sm text-slate-600">
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin text-brand-500" />
                  در حال دریافت محصولات…
                </>
              ) : (
                <>
                  نمایش <span className="font-bold text-slate-800">{toFa(filtered.length)}</span> از{' '}
                  <span className="font-bold text-slate-800">{toFa(products.length)}</span> محصول
                </>
              )}
            </p>
          </div>

          {/* گرید محصولات */}
          {loading ? (
            <SkeletonCards
              count={8}
              view={view}
              imageClass="h-44"
              gridClass="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
            />
          ) : filtered.length > 0 ? (
            <motion.div
              layout
              className={
                view === 'grid'
                  ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4'
                  : 'flex flex-col gap-5'
              }
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} p={p} index={i} showFav linkText="مشاهده جزئیات" view={view} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass flex flex-col items-center justify-center gap-3 rounded-3xl py-20 text-center"
            >
              <SearchX size={40} className="text-brand-500" />
              <p className="text-lg font-bold text-slate-700">محصولی با این فیلترها یافت نشد</p>
              <button
                onClick={resetFilters}
                className="mt-1 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
              >
                پاک کردن فیلترها
              </button>
            </motion.div>
          )}

          {/* صفحه بندی */}
          {filtered.length > 0 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <PageBtn onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft size={16} />
                بعدی
              </PageBtn>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition ${
                    page === n
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'glass text-slate-600 hover:text-brand-600'
                  }`}
                >
                  {toFa(n)}
                </button>
              ))}
              <PageBtn onClick={() => setPage((p) => Math.min(3, p + 1))}>
                قبلی
                <ChevronRight size={16} />
              </PageBtn>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function FilterBlock({ title, children, collapsible = false, open = true, onToggle, last = false }) {
  return (
    <div className={`py-5 ${last ? '' : 'border-b border-white/50'}`}>
      <button
        onClick={onToggle}
        disabled={!collapsible}
        className="flex w-full items-center justify-between text-sm font-extrabold text-slate-800"
      >
        {collapsible ? (
          <ChevronDown size={16} className={`transition ${open ? '' : '-rotate-90'}`} />
        ) : (
          <span className="w-4" />
        )}
        <span>{title}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CheckRow({ label, checked, onClick, count, small = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 text-right transition hover:text-brand-600 ${
        small ? 'text-[13px] text-slate-500' : 'text-sm text-slate-600'
      }`}
    >
      <span>
        {label}
        {count > 0 && <span className="mr-1.5 text-xs text-slate-400">({toFa(count)})</span>}
      </span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
          checked ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white/60'
        }`}
      >
        {checked && <Check size={13} strokeWidth={3} />}
      </span>
    </button>
  )
}

function ToggleBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
        active ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : 'bg-white/70 text-slate-500 hover:text-brand-600'
      }`}
    >
      {children}
    </button>
  )
}

function PageBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="glass flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:text-brand-600"
    >
      {children}
    </button>
  )
}
