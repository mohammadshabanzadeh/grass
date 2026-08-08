import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Menu, X, ChevronDown, ChevronLeft, Search } from 'lucide-react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import SearchDialog from './SearchDialog.jsx'
import { navLinks, contactCards } from '../data.js'
import { fetchMenu, fetchCategories } from '../lib/wp.js'

// شماره‌ی تماس از همان منبعی خوانده می‌شود که صفحه‌ی تماس استفاده می‌کند
const phone = contactCards.find((c) => c.icon === 'phone') || {}

// فهرست ثابت سایت به همان شکل داده‌ی وردپرس درمی‌آید تا هر دو منبع با یک
// کد رندر شوند.
const STATIC_MENU = navLinks.map((l) => ({
  id: l.to,
  label: l.label,
  to: l.type === 'route' ? l.to : `#${l.id}`,
  children: [],
}))

/** درخت دسته‌بندی ووکامرس را به شکل آیتم‌های منو (با هر عمقی) درمی‌آورد. */
const catsToMenu = (nodes) =>
  nodes.map((c) => ({
    id: `cat-${c.id}`,
    label: c.name,
    to: c.href, // مسیر تودرتوی تمیز: /products/<parent>/<child>/...
    children: catsToMenu(c.children || []),
  }))

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(STATIC_MENU)
  const [openIds, setOpenIds] = useState([]) // زیرمنوهای بازِ موبایل
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // میان‌بر صفحه‌کلید برای جست‌وجو (Ctrl/⌘ + K)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

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
      let next = wpMenu || STATIC_MENU

      // دسته‌بندی‌های واقعی ووکامرس زیرمنوی «محصولات» می‌شوند (اگر خود فهرست
      // وردپرس برای آن زیرمنویی نداشته باشد).
      const cats = catRes.status === 'fulfilled' ? catRes.value : []
      if (cats.length) {
        const subs = catsToMenu(cats)
        next = next.map((it) =>
          it.to === '/products' && (!it.children || it.children.length === 0)
            ? { ...it, children: subs }
            : it,
        )
      }
      setItems(next)
    })
    return () => {
      alive = false
    }
  }, [])

  // با هر جابجایی صفحه، منوی موبایل بسته می‌شود
  useEffect(() => {
    setOpen(false)
    setOpenIds([])
  }, [location.pathname])

  const scrollToId = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const go = (e, to) => {
    e.preventDefault()
    if (to.startsWith('#')) {
      const id = to.slice(1)
      setOpen(false)
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

  const isActive = (to) => {
    if (to.startsWith('#')) return false
    if (to === '/') return location.pathname === '/'
    return location.pathname === to || location.pathname.startsWith(to + '/')
  }

  const toggleId = (id) =>
    setOpenIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

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
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center"
        >
          <Logo />
        </Link>

        {/* ===== منوی دسکتاپ ===== */}
        <ul className="hidden items-center gap-7 lg:flex xl:gap-8">
          {items.map((link) => (
            <li key={link.id ?? link.label} className="group relative">
              <a
                href={link.to}
                onClick={(e) => go(e, link.to)}
                className={`flex items-center gap-1 text-sm font-bold transition-colors ${
                  isActive(link.to) ? 'text-brand-700' : 'text-slate-800 hover:text-brand-700'
                }`}
              >
                {link.label}
                {link.children?.length > 0 && (
                  <ChevronDown size={15} className="mt-0.5 transition group-hover:rotate-180" />
                )}
              </a>
              <span
                className={`absolute -bottom-1.5 right-0 h-0.5 rounded bg-brand-700 transition-all duration-300 ${
                  isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />

              {link.children?.length > 0 && (
                <div className="invisible absolute right-0 top-full z-40 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <DesktopSubmenu items={link.children} onNavigate={go} isActive={isActive} />
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* جست‌وجو — در همه‌ی اندازه‌ها */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="جست‌وجو در سایت"
            title="جست‌وجو (Ctrl+K)"
            className="glass flex h-11 w-11 items-center justify-center rounded-xl text-brand-700 transition hover:bg-brand-600 hover:text-white"
          >
            <Search size={20} />
          </button>

          {/* کادر شماره تماس (دسکتاپ) */}
          <a
            href={phone.href}
            className="group hidden items-center gap-3 rounded-xl border border-grass-400/40 bg-gradient-to-l from-grass-500/15 to-brand-500/10 py-2 pl-4 pr-2 transition hover:-translate-y-0.5 hover:border-grass-400/70 hover:shadow-md lg:flex"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-grass-500 text-white shadow-md shadow-grass-500/30 transition group-hover:scale-105">
              <Phone size={17} />
            </span>
            <span className="text-right leading-tight">
              <span className="block text-[10px] font-medium text-slate-500">تماس سریع</span>
              {/* شماره تلفن ذاتاً چپ‌به‌راست است؛ با dir="rtl" ترتیب
                  گروه‌های عدد جابه‌جا می‌شد. */}
              <span className="block text-right text-sm font-extrabold text-slate-800" dir="ltr">
                {phone.value}
              </span>
            </span>
          </a>

          {/* تماس سریع (موبایل) */}
          <a
            href={phone.href}
            aria-label={`تماس با ${phone.value}`}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-grass-500 text-white shadow-md shadow-grass-500/30 transition hover:bg-grass-600 lg:hidden"
          >
            <Phone size={19} />
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            className="glass flex h-11 w-11 items-center justify-center rounded-xl text-brand-700 lg:hidden"
            aria-label="منو"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* ===== منوی موبایل ===== */}
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
                <MobileNode
                  key={link.id ?? link.label}
                  node={link}
                  depth={0}
                  openIds={openIds}
                  toggleId={toggleId}
                  onNavigate={go}
                  isActive={isActive}
                />
              ))}
            </ul>
            <a
              href={phone.href}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-grass-500 px-4 py-3 text-sm font-bold text-white"
            >
              <Phone size={17} />
              <span dir="ltr">{phone.value}</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}

/** پنل زیرمنوی دسکتاپ؛ سطح‌های بعدی با هاور از سمت چپ باز می‌شوند (RTL). */
function DesktopSubmenu({ items, onNavigate, isActive }) {
  return (
    <ul className="glass-menu max-h-[70vh] w-64 overflow-visible rounded-2xl p-2">
      {items.map((node) => (
        <li key={node.id ?? node.label} className="group/sub relative">
          <a
            href={node.to}
            onClick={(e) => onNavigate(e, node.to)}
            className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-right text-[13px] font-semibold transition hover:bg-white/70 hover:text-brand-700 ${
              isActive(node.to) ? 'text-brand-700' : 'text-slate-700'
            }`}
          >
            <span>{node.label}</span>
            {node.children?.length > 0 && <ChevronLeft size={14} className="shrink-0 opacity-60" />}
          </a>

          {node.children?.length > 0 && (
            <div className="invisible absolute right-full top-0 z-50 pl-2 pr-1 opacity-0 transition-all duration-200 group-hover/sub:visible group-hover/sub:opacity-100">
              <DesktopSubmenu items={node.children} onNavigate={onNavigate} isActive={isActive} />
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

/** آیتم منوی موبایل — بازگشتی، پس هر تعداد سطح را پشتیبانی می‌کند. */
function MobileNode({ node, depth, openIds, toggleId, onNavigate, isActive }) {
  const id = node.id ?? node.label
  const hasKids = node.children?.length > 0
  const expanded = openIds.includes(id)

  return (
    <li className={depth > 0 ? 'border-none' : undefined}>
      <div className="flex items-center justify-between">
        <a
          href={node.to}
          onClick={(e) => onNavigate(e, node.to)}
          style={{ paddingInlineStart: depth ? depth * 12 : undefined }}
          className={`flex-1 py-3 text-right hover:text-brand-700 ${
            depth === 0 ? 'text-sm font-bold' : 'text-[13px] font-medium'
          } ${isActive(node.to) ? 'text-brand-700' : depth === 0 ? 'text-slate-800' : 'text-slate-600'}`}
        >
          {node.label}
        </a>
        {hasKids && (
          <button
            onClick={() => toggleId(id)}
            aria-label={`زیرمنوی ${node.label}`}
            aria-expanded={expanded}
            className="p-2 text-slate-500"
          >
            <ChevronDown size={16} className={`transition ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {hasKids && expanded && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-r border-white/50 pb-1"
          >
            {node.children.map((child) => (
              <MobileNode
                key={child.id ?? child.label}
                node={child}
                depth={depth + 1}
                openIds={openIds}
                toggleId={toggleId}
                onNavigate={onNavigate}
                isActive={isActive}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  )
}
