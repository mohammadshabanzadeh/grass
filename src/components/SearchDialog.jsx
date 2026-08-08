import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, CornerDownLeft, Package, MapPin, FileText, Layers } from 'lucide-react'
import SmartImage from './SmartImage.jsx'
import { fetchProducts, fetchProjects, fetchCategories } from '../lib/wp.js'

/**
 * متن فارسی را یکدست می‌کند تا جست‌وجو به شکل نوشتنِ کاربر حساس نباشد:
 * ی/ك عربی، نیم‌فاصله، اعراب و ارقام فارسی همگی نرمال می‌شوند.
 */
const faDigits = '۰۱۲۳۴۵۶۷۸۹'
function normalize(s = '') {
  return String(s)
    .replace(/[ي]/g, 'ی')
    .replace(/[ك]/g, 'ک')
    .replace(/[ۀة]/g, 'ه')
    .replace(/[‌‏‎]/g, ' ') // نیم‌فاصله و نشانه‌های جهت
    .replace(/[ً-ٰٟ]/g, '') // اعراب
    .replace(/[۰-۹]/g, (d) => String(faDigits.indexOf(d)))
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

const STATIC_PAGES = [
  { label: 'صفحه اصلی', to: '/' },
  { label: 'محصولات', to: '/products' },
  { label: 'پروژه‌ها', to: '/projects' },
  { label: 'خدمات', to: '/services' },
  { label: 'درباره ما', to: '/about' },
  { label: 'تماس با ما', to: '/contact' },
]

const GROUP_META = {
  product: { title: 'محصولات', icon: Package },
  category: { title: 'دسته‌بندی‌ها', icon: Layers },
  project: { title: 'پروژه‌ها', icon: MapPin },
  page: { title: 'صفحات', icon: FileText },
}

export default function SearchDialog({ open, onClose }) {
  const [q, setQ] = useState('')
  const [index, setIndex] = useState([])
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const wrapRef = useRef(null)
  const navigate = useNavigate()

  // در حین بسته‌شدن، AnimatePresence همان خروجیِ رندر قبلی را نگه می‌دارد،
  // پس نمی‌توان با prop آن را خنثی کرد. مستقیم روی همان گره DOM
  // pointer-events را خاموش می‌کنیم تا اگر انیمیشن خروج کامل نشد (مثلاً
  // در تبِ پس‌زمینه که مرورگر فریم‌ها را متوقف می‌کند) این لایه کلیک‌های
  // صفحه را نگیرد.
  useEffect(() => {
    if (wrapRef.current) wrapRef.current.style.pointerEvents = open ? 'auto' : 'none'
  }, [open])

  // داده‌ها کش شده‌اند، پس باز کردن دوباره‌ی جست‌وجو درخواست جدیدی نمی‌زند
  useEffect(() => {
    if (!open) return
    let alive = true
    Promise.allSettled([fetchProducts(), fetchProjects(), fetchCategories()]).then(
      ([prod, proj, cats]) => {
        if (!alive) return
        const rows = []

        if (prod.status === 'fulfilled') {
          prod.value.forEach((p) =>
            rows.push({
              type: 'product',
              id: `p-${p.id}`,
              label: p.title,
              hint: p.categoryNames?.slice(0, 2).join('، ') || '',
              img: p.img,
              to: p.slug ? `/product/${p.slug}` : '/products',
              haystack: normalize([p.title, p.desc, ...(p.categoryNames || [])].join(' ')),
            }),
          )
        }

        if (cats.status === 'fulfilled') {
          const walk = (nodes) =>
            nodes.forEach((c) => {
              rows.push({
                type: 'category',
                id: `c-${c.id}`,
                label: c.name,
                hint: `${c.count} محصول`,
                to: c.href,
                haystack: normalize(c.name),
              })
              walk(c.children || [])
            })
          walk(cats.value)
        }

        if (proj.status === 'fulfilled') {
          proj.value.forEach((p) =>
            rows.push({
              type: 'project',
              id: `j-${p.id}`,
              label: p.title,
              hint: p.city || '',
              img: p.img,
              to: `/projects/${p.id}`,
              haystack: normalize([p.title, p.city, p.badge].join(' ')),
            }),
          )
        }

        STATIC_PAGES.forEach((p) =>
          rows.push({
            type: 'page',
            id: `s-${p.to}`,
            label: p.label,
            to: p.to,
            haystack: normalize(p.label),
          }),
        )

        setIndex(rows)
      },
    )
    return () => {
      alive = false
    }
  }, [open])

  useEffect(() => {
    if (open) {
      setQ('')
      setCursor(0)
      // فوکوس پس از پایان انیمیشن ورود
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      document.body.style.overflow = 'hidden'
      return () => clearTimeout(t)
    }
    document.body.style.overflow = ''
  }, [open])

  const results = useMemo(() => {
    const nq = normalize(q)
    if (!nq) return []
    const words = nq.split(' ').filter(Boolean)
    return index
      .map((row) => {
        if (!words.every((w) => row.haystack.includes(w))) return null
        // تطابق از ابتدای عنوان امتیاز بیشتری می‌گیرد
        const label = normalize(row.label)
        let score = 0
        if (label === nq) score += 100
        else if (label.startsWith(nq)) score += 50
        else if (label.includes(nq)) score += 25
        if (row.type === 'product') score += 6
        else if (row.type === 'category') score += 4
        else if (row.type === 'project') score += 3
        return { ...row, score }
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 24)
  }, [q, index])

  useEffect(() => setCursor(0), [q])

  const goTo = (row) => {
    if (!row) return
    onClose()
    navigate(row.to)
    window.scrollTo({ top: 0 })
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') return onClose()
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(c + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(c - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      goTo(results[cursor])
    }
  }

  // آیتم فعال همیشه در دید بماند
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${cursor}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [cursor, results])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          ref={wrapRef}
          className="fixed inset-0 z-[120] flex items-start justify-center p-4 pt-[12vh] sm:pt-[15vh]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="جست‌وجو در سایت"
            initial={{ opacity: 0, y: -18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="glass-menu relative w-full max-w-2xl overflow-hidden rounded-3xl"
          >
            {/* نوار ورودی */}
            <div className="flex items-center gap-3 border-b border-white/60 px-5 py-4">
              <Search size={20} className="shrink-0 text-brand-600" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                dir="rtl"
                placeholder="جست‌وجوی محصول، دسته‌بندی یا پروژه…"
                className="w-full bg-transparent text-right text-[15px] text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                onClick={onClose}
                aria-label="بستن جست‌وجو"
                className="shrink-0 rounded-lg p-1.5 text-slate-500 transition hover:bg-white/70 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* نتایج */}
            <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-2">
              {!q.trim() ? (
                <p className="px-4 py-10 text-center text-sm text-slate-500">
                  نام محصول، دسته‌بندی یا پروژه را بنویسید…
                </p>
              ) : results.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm font-bold text-slate-700">نتیجه‌ای پیدا نشد</p>
                  <p className="mt-1 text-xs text-slate-500">
                    شاید املای دیگری را امتحان کنید یا از فهرست محصولات کمک بگیرید.
                  </p>
                </div>
              ) : (
                Object.entries(
                  results.reduce((acc, r) => {
                    ;(acc[r.type] ||= []).push(r)
                    return acc
                  }, {}),
                ).map(([type, rows]) => {
                  const meta = GROUP_META[type]
                  const Icon = meta.icon
                  return (
                    <div key={type} className="mb-2 last:mb-0">
                      <p className="flex items-center gap-1.5 px-3 pb-1.5 pt-2 text-[11px] font-bold text-slate-500">
                        <Icon size={13} />
                        {meta.title}
                      </p>
                      <ul>
                        {rows.map((row) => {
                          const idx = results.indexOf(row)
                          const activeRow = idx === cursor
                          return (
                            <li key={row.id}>
                              <button
                                data-idx={idx}
                                onMouseEnter={() => setCursor(idx)}
                                onClick={() => goTo(row)}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right transition ${
                                  activeRow ? 'bg-brand-600 text-white' : 'hover:bg-white/70'
                                }`}
                              >
                                {row.img ? (
                                  <SmartImage
                                    src={row.img}
                                    alt=""
                                    className="h-10 w-10 shrink-0 rounded-lg"
                                  />
                                ) : (
                                  <span
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                      activeRow ? 'bg-white/20' : 'bg-white/70 text-brand-600'
                                    }`}
                                  >
                                    <Icon size={16} />
                                  </span>
                                )}
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-bold">
                                    {row.label}
                                  </span>
                                  {row.hint && (
                                    <span
                                      className={`block truncate text-[11px] ${
                                        activeRow ? 'text-white/75' : 'text-slate-500'
                                      }`}
                                    >
                                      {row.hint}
                                    </span>
                                  )}
                                </span>
                                {activeRow && (
                                  <CornerDownLeft size={15} className="shrink-0 opacity-80" />
                                )}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })
              )}
            </div>

            {/* راهنمای کلیدها */}
            <div className="hidden items-center justify-end gap-4 border-t border-white/60 px-5 py-2.5 text-[11px] text-slate-500 sm:flex">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-slate-300 bg-white/80 px-1.5 py-0.5">↑</kbd>
                <kbd className="rounded border border-slate-300 bg-white/80 px-1.5 py-0.5">↓</kbd>
                جابه‌جایی
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-slate-300 bg-white/80 px-1.5 py-0.5">
                  Enter
                </kbd>
                انتخاب
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-slate-300 bg-white/80 px-1.5 py-0.5">Esc</kbd>
                بستن
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
