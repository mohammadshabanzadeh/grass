import { useEffect, useMemo, useRef, useState } from 'react'
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
  X,
} from 'lucide-react'
import ProductCard from './ProductCard.jsx'
import SkeletonCards from './Skeleton.jsx'
import { allProducts, categories as staticCats, sortOptions } from '../data.js'
import { fetchProducts, fetchCategories, fetchProductAttributes } from '../lib/wp.js'
import { buildAttrGroups, buildCatExpansion, filterProducts } from '../lib/productFilters.js'

const faDigits = '۰۱۲۳۴۵۶۷۸۹'
const toFa = (n) => String(n).replace(/\d/g, (d) => faDigits[d])

const HEIGHT_MIN = 10
const HEIGHT_MAX = 50

// دو ردیفِ کاملِ گرید دسکتاپ (چهار ستون)
const PER_PAGE = 8

// نسخه‌ی جایگزین (آفلاین) بر پایه‌ی داده‌های ثابت.
// ویژگی‌ها همان شکلِ ووکامرس را می‌گیرند تا فیلترها با هر دو منبع
// یکسان کار کنند.
const FALLBACK = allProducts.map((p) => ({
  id: p.id,
  title: p.title,
  img: p.img,
  gradient: p.gradient,
  icon: p.icon,
  desc: p.desc,
  link: null,
  catSlugs: [p.category].filter(Boolean),
  height: p.height,
  attributes: [
    p.fiber && { name: 'نوع الیاف', values: [p.fiber] },
    p.density && { name: 'تراکم', values: [p.density] },
  ].filter(Boolean),
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
  // انتخاب‌های ویژگی‌ها: { 'نوع الیاف': ['فیبریله'], ... }
  const [attrSel, setAttrSel] = useState({})
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
            attributes: p.attributes || [],
          })),
        )
        setLive(true)
      }
      if (catRes.status === 'fulfilled' && catRes.value.length) {
        setCatTree(catRes.value)
      }
      setLoading(false)

      // ویژگی‌ها «بعد از» رسیدن محصولات گرفته می‌شوند، نه هم‌زمان: سرور
      // وردپرس کند است و درخواست‌های موازی همدیگر را عقب می‌اندازند. این
      // درخواست نمایش محصولات را مسدود نمی‌کند و فیلترهایش به‌محض رسیدن
      // اضافه می‌شوند.
      fetchProductAttributes()
        .then((map) => {
          if (!alive || !map.size) return
          setProducts((prev) =>
            prev.map((p) => {
              const extra = map.get(p.id)
              if (!extra) return p
              return { ...p, attributes: extra.attributes, srcSet: extra.srcSet }
            }),
          )
        })
        .catch(() => {})
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
    setAttrSel({})
  }

  const toggleAttr = (name, value) =>
    setAttrSel((prev) => {
      const cur = prev[name] || []
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]
      const out = { ...prev, [name]: next }
      if (!next.length) delete out[name]
      return out
    })

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
  const expandedCats = useMemo(() => buildCatExpansion(catTree), [catTree])

  // گروه‌های فیلتر (رنگ، جنس، اندازه و …) از ویژگی‌های واقعی محصولات در
  // ووکامرس ساخته می‌شوند؛ اگر ویژگی‌ای تعریف نشده باشد گروهی هم ساخته
  // نمی‌شود تا فیلترِ بی‌اثر نمایش داده نشود.
  const attrGroups = useMemo(() => buildAttrGroups(products), [products])

  const anyHeight = products.some((p) => typeof p.height === 'number')

  const filtered = useMemo(
    () =>
      filterProducts(products, {
        cats,
        catExpansion: expandedCats,
        attrSel,
        height: { active: anyHeight, min: minH, max: maxH },
      }),
    [products, cats, expandedCats, attrSel, minH, maxH, anyHeight],
  )

  // دو ردیف در هر صفحه (گرید دسکتاپ چهار ستون دارد)، بقیه در صفحات بعدی
  const gridRef = useRef(null)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const pageItems = useMemo(
    () => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filtered, page],
  )

  // با تغییر فیلترها ممکن است صفحه‌ی فعلی دیگر وجود نداشته باشد
  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [page, totalPages])

  const goToPage = (n) => {
    setPage(Math.min(Math.max(1, n), totalPages))
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const leftPct = ((minH - HEIGHT_MIN) / (HEIGHT_MAX - HEIGHT_MIN)) * 100
  const rightPct = ((maxH - HEIGHT_MIN) / (HEIGHT_MAX - HEIGHT_MIN)) * 100

  const activeCount =
    cats.length +
    Object.values(attrSel).reduce((n, v) => n + v.length, 0) +
    (anyHeight && (minH !== HEIGHT_MIN || maxH !== HEIGHT_MAX) ? 1 : 0)

  // روی موبایل به‌جای پنل عمودی، نوار افقیِ فیلترها نمایش داده می‌شود و هر
  // کدام گزینه‌هایش را در یک پاپ‌اور پایین صفحه باز می‌کند.
  const [sheet, setSheet] = useState(null)
  const mobileGroups = useMemo(
    () => [
      { key: 'cats', title: 'دسته بندی', type: 'cats', count: cats.length },
      ...attrGroups.map((g) => ({
        key: `attr:${g.name}`,
        title: g.name,
        type: 'attr',
        name: g.name,
        values: g.values,
        count: (attrSel[g.name] || []).length,
      })),
      ...(anyHeight
        ? [
            {
              key: 'height',
              title: 'ارتفاع',
              type: 'height',
              count: minH !== HEIGHT_MIN || maxH !== HEIGHT_MAX ? 1 : 0,
            },
          ]
        : []),
    ],
    [attrGroups, attrSel, cats.length, anyHeight, minH, maxH],
  )
  const activeSheet = mobileGroups.find((g) => g.key === sheet) || null

  // پاپ‌اور باز = صفحه پشت آن اسکرول نشود
  useEffect(() => {
    document.body.style.overflow = activeSheet ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeSheet])

  // هنگام بسته‌شدن، AnimatePresence همان خروجی رندر قبلی را نگه می‌دارد، پس
  // نمی‌توان با prop خنثی‌اش کرد. مستقیم روی گره‌های DOM pointer-events را
  // خاموش می‌کنیم تا اگر انیمیشن خروج کامل نشود، این لایه‌ها کلیک‌های صفحه
  // را نگیرند.
  const sheetRefs = useRef([])
  useEffect(() => {
    sheetRefs.current.forEach((el) => {
      if (el) el.style.pointerEvents = activeSheet ? 'auto' : 'none'
    })
  }, [activeSheet])

  return (
    <section className="container-x py-16 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* ===== سایدبار فیلتر (راست) ===== */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="glass hidden h-fit rounded-3xl p-4 sm:p-6 lg:sticky lg:top-24 lg:block"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/30">
              <SlidersHorizontal size={18} />
            </span>
            <h2 className="text-lg font-extrabold text-slate-800">فیلتر محصولات</h2>
          </div>

          <div id="product-filters">
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

          {/* ارتفاع چمن — فقط وقتی محصولی ارتفاع دارد */}
          {anyHeight && (
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
          )}

          {/* ویژگی‌های محصول — مستقیماً از ویژگی‌های ووکامرس ساخته می‌شوند */}
          {attrGroups.map((g, i) => (
            <FilterBlock key={g.name} title={g.name} last={i === attrGroups.length - 1}>
              <div className="flex flex-wrap gap-2 pt-1">
                {g.values.map((v) => {
                  const active = (attrSel[g.name] || []).includes(v)
                  return (
                    <button
                      key={v}
                      onClick={() => toggleAttr(g.name, v)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                          : 'glass text-slate-600 hover:text-brand-600'
                      }`}
                    >
                      {v}
                    </button>
                  )
                })}
              </div>
            </FilterBlock>
          ))}

          <button
            onClick={resetFilters}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50/70 py-3 text-sm font-bold text-brand-600 transition hover:bg-brand-100"
          >
            <RotateCcw size={16} />
            پاک کردن فیلترها
          </button>
          </div>
        </motion.aside>

        {/* ===== موبایل: نوار افقی فیلترها ===== */}
        <div className="lg:hidden">
          <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            <span className="flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2.5 text-xs font-bold text-white">
              <SlidersHorizontal size={15} />
              فیلترها
              {activeCount > 0 && (
                <span className="rounded-full bg-white/25 px-1.5 text-[11px]">
                  {toFa(activeCount)}
                </span>
              )}
            </span>

            {mobileGroups.map((g) => (
              <button
                key={g.key}
                onClick={() => setSheet(g.key)}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                  g.count > 0
                    ? 'bg-brand-600/10 text-brand-700 ring-1 ring-brand-300'
                    : 'glass text-slate-600'
                }`}
              >
                {g.title}
                {g.count > 0 && (
                  <span className="rounded-full bg-brand-600 px-1.5 text-[11px] text-white">
                    {toFa(g.count)}
                  </span>
                )}
                <ChevronDown size={14} className="opacity-60" />
              </button>
            ))}

            {activeCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-brand-200 bg-brand-50/80 px-3.5 py-2.5 text-xs font-bold text-brand-600"
              >
                <RotateCcw size={14} />
                پاک کردن
              </button>
            )}
          </div>

          {/* پاپ‌اور انتخاب گزینه‌ها */}
          <AnimatePresence>
            {activeSheet && (
              <>
                <motion.div
                  ref={(el) => (sheetRefs.current[0] = el)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSheet(null)}
                  className="fixed inset-0 z-[90] bg-slate-900/40 backdrop-blur-sm"
                />
                <motion.div
                  ref={(el) => (sheetRefs.current[1] = el)}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
                  className="glass-menu fixed inset-x-0 bottom-0 z-[91] max-h-[70vh] overflow-y-auto rounded-t-3xl p-5 pb-8"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <button
                      onClick={() => setSheet(null)}
                      aria-label="بستن"
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-white/70"
                    >
                      <X size={18} />
                    </button>
                    <h3 className="text-base font-extrabold text-slate-800">
                      {activeSheet.title}
                    </h3>
                  </div>

                  {activeSheet.type === 'cats' ? (
                    <ul className="space-y-3">
                      <li>
                        <CheckRow
                          label="همه دسته بندی ها"
                          checked={cats.length === 0}
                          onClick={() => setCats([])}
                        />
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
                  ) : activeSheet.type === 'height' ? (
                    <div className="px-1 pt-2" dir="ltr">
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
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {activeSheet.values.map((v) => {
                        const active = (attrSel[activeSheet.name] || []).includes(v)
                        return (
                          <button
                            key={v}
                            onClick={() => toggleAttr(activeSheet.name, v)}
                            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                              active
                                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                                : 'glass text-slate-600'
                            }`}
                          >
                            {v}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  <button
                    onClick={() => setSheet(null)}
                    className="mt-6 w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white"
                  >
                    نمایش {toFa(filtered.length)} محصول
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* ===== ناحیه محصولات (چپ) ===== */}
        <div ref={gridRef}>
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
                {pageItems.map((p, i) => (
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

          {/* صفحه بندی — فقط وقتی بیش از یک صفحه وجود دارد */}
          {!loading && totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              <PageBtn disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
                <ChevronLeft size={16} />
                بعدی
              </PageBtn>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => goToPage(n)}
                  aria-current={page === n ? 'page' : undefined}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition ${
                    page === n
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'glass text-slate-600 hover:text-brand-600'
                  }`}
                >
                  {toFa(n)}
                </button>
              ))}

              <PageBtn disabled={page <= 1} onClick={() => goToPage(page - 1)}>
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

function PageBtn({ children, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="glass flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition enabled:hover:text-brand-600 disabled:opacity-40"
    >
      {children}
    </button>
  )
}
