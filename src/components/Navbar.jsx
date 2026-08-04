import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Menu, X, ChevronDown } from 'lucide-react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { navLinks } from '../data.js'
import { fetchMenu, fetchCategories } from '../lib/wp.js'

// فهرست ثابت سایت به شکل یکسان با داده‌ی وردپرس درمی‌آید تا هر دو منبع
// با یک کد رندر شوند.
const STATIC_MENU = navLinks.map((l) => ({
  label: l.label,
  to: l.type === 'route' ? l.to : `#${l.id}`,
  children: [],
}))

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(STATIC_MENU)
  const [openSub, setOpenSub] = useState(null) // زیرمنوی بازشده در موبایل
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let alive = true
    Promise.allSettled([fetchMenu(), fetchCategories()]).then(([menuRes, catRes]) => {
      if (!alive) return

      const wpMenu = menuRes.status === 'fulfilled' ? menuRes.value : null
      let next = wpMenu
        ? wpMenu.map((m) => ({
            label: m.label,
            to: m.url,
            children: (m.children || []).map((c) => ({ label: c.label, to: c.url })),
          }))
        : STATIC_MENU

      // دسته‌بندی‌های واقعی ووکامرس را به‌عنوان زیرمنوی «محصولات» می‌گذاریم
      // (اگر فهرست وردپرس خودش زیرمنو نداشته باشد).
      const cats = catRes.status === 'fulfilled' ? catRes.value : []
      if (cats.length) {
        next = next.map((it) =>
          it.to === '/products' && it.children.length === 0
            ? {
                ...it,
                children: cats.map((c) => ({
                  label: c.name,
                  to: `/products?cat=${encodeURIComponent(c.slug)}`,
                })),
              }
            : it,
        )
      }
      setItems(next)
    })
    return () => {
      alive = false
    }
  }, [])

  const scrollToId = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const go = (e, to) => {
    e.preventDefault()
    setOpen(false)
    setOpenSub(null)
    if (to.startsWith('#')) {
      const id = to.slice(1)
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => scrollToId(id), 350)
      } else {
        scrollToId(id)
      }
      return
    }
    navigate(to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isActive = (to) => !to.startsWith('#') && location.pathname === to.split('?')[0]

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`container-x flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 sm:px-6 ${
          scrolled ? 'glass-strong' : 'glass'
        }`}
      >
        {/* لوگو (راست در RTL) */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center"
        >
          <Logo />
        </Link>

        {/* منوی دسکتاپ */}
        <ul className="hidden items-center gap-7 lg:flex xl:gap-8">
          {items.map((link) => (
            <li key={link.label} className="group relative">
              <a
                href={link.to}
                onClick={(e) => go(e, link.to)}
                className={`flex items-center gap-1 text-sm font-bold transition-colors ${
                  isActive(link.to) ? 'text-brand-700' : 'text-slate-800 hover:text-brand-700'
                }`}
              >
                {link.label}
                {link.children.length > 0 && (
                  <ChevronDown size={15} className="mt-0.5 transition group-hover:rotate-180" />
                )}
              </a>
              <span
                className={`absolute -bottom-1.5 right-0 h-0.5 rounded bg-brand-700 transition-all duration-300 ${
                  isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />

              {/* زیرمنوی دسکتاپ (با هاور) */}
              {link.children.length > 0 && (
                <div className="invisible absolute right-0 top-full z-40 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <ul className="glass-strong max-h-[70vh] w-64 overflow-auto rounded-2xl p-2 shadow-soft">
                    {link.children.map((sub) => (
                      <li key={sub.to}>
                        <a
                          href={sub.to}
                          onClick={(e) => go(e, sub.to)}
                          className="block rounded-xl px-3 py-2 text-right text-[13px] font-semibold text-slate-700 transition hover:bg-white/70 hover:text-brand-700"
                        >
                          {sub.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* دکمه مشاوره (چپ در RTL) */}
        <a
          href="#contact"
          onClick={(e) => go(e, '#contact')}
          className="hidden items-center gap-2 rounded-xl border border-white/30 bg-grass-500/90 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-grass-500/30 backdrop-blur transition hover:-translate-y-0.5 hover:bg-grass-600 lg:flex"
        >
          <Phone size={17} />
          مشاوره رایگان
        </a>

        {/* همبرگر موبایل */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="glass flex h-11 w-11 items-center justify-center rounded-xl text-brand-700 lg:hidden"
          aria-label="منو"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      {/* منوی موبایل */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass-strong container-x mt-2 max-h-[75vh] overflow-auto rounded-2xl p-4 lg:hidden"
          >
            <ul className="flex flex-col divide-y divide-white/40">
              {items.map((link) => (
                <li key={link.label}>
                  <div className="flex items-center justify-between">
                    <a
                      href={link.to}
                      onClick={(e) => go(e, link.to)}
                      className={`flex-1 py-3 text-right text-sm font-bold hover:text-brand-700 ${
                        isActive(link.to) ? 'text-brand-700' : 'text-slate-800'
                      }`}
                    >
                      {link.label}
                    </a>
                    {link.children.length > 0 && (
                      <button
                        onClick={() => setOpenSub((s) => (s === link.label ? null : link.label))}
                        aria-label={`زیرمنوی ${link.label}`}
                        aria-expanded={openSub === link.label}
                        className="p-2 text-slate-500"
                      >
                        <ChevronDown
                          size={16}
                          className={`transition ${openSub === link.label ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                  </div>

                  <AnimatePresence initial={false}>
                    {link.children.length > 0 && openSub === link.label && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden pb-2"
                      >
                        {link.children.map((sub) => (
                          <li key={sub.to}>
                            <a
                              href={sub.to}
                              onClick={(e) => go(e, sub.to)}
                              className="block py-2 pr-4 text-right text-[13px] font-medium text-slate-600 hover:text-brand-700"
                            >
                              {sub.label}
                            </a>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={(e) => go(e, '#contact')}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-grass-500 px-4 py-3 text-sm font-bold text-white"
            >
              <Phone size={17} />
              مشاوره رایگان
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
