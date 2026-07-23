import { useMemo, useState } from 'react'
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
} from 'lucide-react'
import ProjectCard from './ProjectCard.jsx'
import {
  allProjects,
  projectCategories,
  usageTypes,
  cities,
  projectSortOptions,
} from '../data.js'

const faDigits = '۰۱۲۳۴۵۶۷۸۹'
const toFa = (n) => String(n).replace(/\d/g, (d) => faDigits[d])

const AREA_MIN = 0
const AREA_MAX = 5000

export default function ProjectsCatalog() {
  const [cats, setCats] = useState([])
  const [usages, setUsages] = useState([])
  const [city, setCity] = useState('همه شهرها')
  const [minA, setMinA] = useState(AREA_MIN)
  const [maxA, setMaxA] = useState(AREA_MAX)
  const [view, setView] = useState('grid')
  const [sort, setSort] = useState(projectSortOptions[0])
  const [sortOpen, setSortOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [page, setPage] = useState(1)

  const toggle = (setter, list, value) =>
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const resetFilters = () => {
    setCats([])
    setUsages([])
    setCity('همه شهرها')
    setMinA(AREA_MIN)
    setMaxA(AREA_MAX)
  }

  const filtered = useMemo(() => {
    return allProjects.filter((p) => {
      const catOk = cats.length === 0 || cats.includes(p.category)
      const usageOk = usages.length === 0 || usages.includes(p.usage)
      const cityOk = city === 'همه شهرها' || p.cityKey === city
      const areaOk = p.area >= minA && p.area <= maxA
      return catOk && usageOk && cityOk && areaOk
    })
  }, [cats, usages, city, minA, maxA])

  const leftPct = ((minA - AREA_MIN) / (AREA_MAX - AREA_MIN)) * 100
  const rightPct = ((maxA - AREA_MIN) / (AREA_MAX - AREA_MIN)) * 100

  return (
    <section className="container-x py-16 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* ===== سایدبار فیلتر (راست) ===== */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="glass h-fit rounded-3xl p-6 lg:sticky lg:top-24"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/30">
              <SlidersHorizontal size={18} />
            </span>
            <h3 className="text-lg font-extrabold text-slate-800">فیلتر پروژه ها</h3>
          </div>

          {/* دسته بندی پروژه */}
          <FilterBlock title="دسته بندی پروژه">
            <ul className="space-y-3 pt-1">
              {projectCategories.map((c) => {
                const checked = c.key === 'all' ? cats.length === 0 : cats.includes(c.key)
                return (
                  <li key={c.key}>
                    <CheckRow
                      label={c.label}
                      checked={checked}
                      onClick={() =>
                        c.key === 'all' ? setCats([]) : toggle(setCats, cats, c.key)
                      }
                    />
                  </li>
                )
              })}
            </ul>
          </FilterBlock>

          {/* نوع کاربری */}
          <FilterBlock title="نوع کاربری">
            <ul className="space-y-3 pt-1">
              {usageTypes.map((u) => {
                const checked = u.key === 'all' ? usages.length === 0 : usages.includes(u.key)
                return (
                  <li key={u.key}>
                    <CheckRow
                      label={u.label}
                      checked={checked}
                      onClick={() =>
                        u.key === 'all' ? setUsages([]) : toggle(setUsages, usages, u.key)
                      }
                    />
                  </li>
                )
              })}
            </ul>
          </FilterBlock>

          {/* موقعیت پروژه */}
          <FilterBlock title="موقعیت پروژه">
            <div className="relative pt-2">
              <button
                onClick={() => setCityOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white"
              >
                <ChevronDown size={16} className={`transition ${cityOpen ? 'rotate-180' : ''}`} />
                {city}
              </button>
              <AnimatePresence>
                {cityOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="glass-strong absolute z-30 mt-2 w-full overflow-hidden rounded-xl p-1.5"
                  >
                    {cities.map((c) => (
                      <li key={c}>
                        <button
                          onClick={() => {
                            setCity(c)
                            setCityOpen(false)
                          }}
                          className={`w-full rounded-lg px-3 py-2 text-right text-sm transition hover:bg-white/60 ${
                            c === city ? 'font-bold text-brand-600' : 'text-slate-600'
                          }`}
                        >
                          {c}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </FilterBlock>

          {/* متراژ پروژه */}
          <FilterBlock title="متراژ پروژه (متر مربع)" last>
            <div className="px-1 pt-4" dir="ltr">
              <div className="dual-range">
                <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-200" />
                <div
                  className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-600"
                  style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
                />
                <input
                  type="range"
                  min={AREA_MIN}
                  max={AREA_MAX}
                  step={100}
                  value={minA}
                  onChange={(e) => setMinA(Math.min(Number(e.target.value), maxA - 100))}
                />
                <input
                  type="range"
                  min={AREA_MIN}
                  max={AREA_MAX}
                  step={100}
                  value={maxA}
                  onChange={(e) => setMaxA(Math.max(Number(e.target.value), minA + 100))}
                />
              </div>
              <div className="mt-3 flex justify-between text-xs font-semibold text-slate-500">
                <span>{toFa(minA)}</span>
                <span>{maxA >= AREA_MAX ? `${toFa(AREA_MAX)}+` : toFa(maxA)}</span>
              </div>
            </div>
          </FilterBlock>

          <button
            onClick={resetFilters}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50/70 py-3 text-sm font-bold text-brand-600 transition hover:bg-brand-100"
          >
            <RotateCcw size={16} />
            پاک کردن فیلترها
          </button>
        </motion.aside>

        {/* ===== ناحیه پروژه‌ها (چپ) ===== */}
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
                  {sort}
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="glass-strong absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-xl p-1.5"
                    >
                      {projectSortOptions.map((o) => (
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

            <p className="text-sm text-slate-500">
              نمایش <span className="font-bold text-slate-700">{toFa(filtered.length)}</span> از{' '}
              <span className="font-bold text-slate-700">۱۲۰</span> پروژه
            </p>
          </div>

          {/* گرید پروژه‌ها */}
          {filtered.length > 0 ? (
            <motion.div
              layout
              className={
                view === 'grid'
                  ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                  : 'flex flex-col gap-5'
              }
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <ProjectCard key={p.id} p={p} index={i} view={view} />
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
              <p className="text-lg font-bold text-slate-700">پروژه‌ای با این فیلترها یافت نشد</p>
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
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
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
              <span className="px-1 text-slate-400">…</span>
              <button
                onClick={() => setPage(10)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition ${
                  page === 10
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'glass text-slate-600 hover:text-brand-600'
                }`}
              >
                {toFa(10)}
              </button>
              <PageBtn onClick={() => setPage((p) => p + 1)}>
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

function FilterBlock({ title, children, last = false }) {
  return (
    <div className={`py-5 ${last ? '' : 'border-b border-white/50'}`}>
      <h4 className="text-right text-sm font-extrabold text-slate-800">{title}</h4>
      {children}
    </div>
  )
}

function CheckRow({ label, checked, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between text-sm text-slate-600 transition hover:text-brand-600"
    >
      <span>{label}</span>
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
          checked ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white/60'
        }`}
      >
        <AnimatePresence>
          {checked && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Check size={13} strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  )
}

function ToggleBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
        active
          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
          : 'bg-white/70 text-slate-500 hover:text-brand-600'
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
