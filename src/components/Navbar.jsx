import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Menu, X, ChevronDown } from 'lucide-react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { navLinks } from '../data.js'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToId = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleNav = (e, link) => {
    e.preventDefault()
    setOpen(false)
    if (link.type === 'route') {
      navigate(link.to)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => scrollToId(link.id), 350)
      } else {
        scrollToId(link.id)
      }
    }
  }

  const isActive = (link) => link.type === 'route' && location.pathname === link.match

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
        {/* دکمه مشاوره (راست در RTL) */}
        <a
          href="#contact"
          onClick={(e) => handleNav(e, { type: 'hash', id: 'contact' })}
          className="hidden items-center gap-2 rounded-xl border border-white/30 bg-grass-500/90 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-grass-500/30 backdrop-blur transition hover:-translate-y-0.5 hover:bg-grass-600 lg:flex"
        >
          <Phone size={17} />
          مشاوره رایگان
        </a>

        {/* منوی دسکتاپ */}
        <ul className="hidden items-center gap-7 xl:gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.label} className="group relative">
              <a
                href={link.type === 'route' ? link.to : `#${link.id}`}
                onClick={(e) => handleNav(e, link)}
                className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                  isActive(link) ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'
                }`}
              >
                {link.label}
                {link.dropdown && (
                  <ChevronDown size={15} className="mt-0.5 transition group-hover:rotate-180" />
                )}
              </a>
              <span
                className={`absolute -bottom-1.5 right-0 h-0.5 rounded bg-brand-600 transition-all duration-300 ${
                  isActive(link) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </li>
          ))}
        </ul>

        {/* لوگو (چپ در RTL) */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center"
        >
          <Logo />
        </Link>

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
            className="glass-strong container-x mt-2 overflow-hidden rounded-2xl p-4 lg:hidden"
          >
            <ul className="flex flex-col divide-y divide-white/40">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.type === 'route' ? link.to : `#${link.id}`}
                    onClick={(e) => handleNav(e, link)}
                    className={`flex items-center justify-between py-3 text-sm font-semibold hover:text-brand-600 ${
                      isActive(link) ? 'text-brand-600' : 'text-slate-800'
                    }`}
                  >
                    {link.label}
                    {link.dropdown && <ChevronDown size={16} />}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={(e) => handleNav(e, { type: 'hash', id: 'contact' })}
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
