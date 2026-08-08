import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, ArrowRight } from 'lucide-react'
import { navLinks } from '../data.js'

export default function NotFoundPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center gap-5 pt-4 text-center sm:pt-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass flex h-20 w-20 items-center justify-center rounded-3xl text-brand-600"
      >
        <Compass size={36} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-2xl font-extrabold text-slate-800 sm:text-3xl"
      >
        این صفحه پیدا نشد
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        className="max-w-md text-sm leading-8 text-slate-600 sm:text-base"
      >
        ممکن است آدرس تغییر کرده باشد. از میان‌برهای زیر ادامه دهید.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.26 }}
        className="mt-2 flex flex-wrap items-center justify-center gap-2"
      >
        {navLinks
          .filter((l) => l.type === 'route')
          .map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="glass rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:text-brand-700"
            >
              {l.label}
            </Link>
          ))}
      </motion.div>

      <Link
        to="/"
        className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
      >
        بازگشت به صفحه اصلی
        <ArrowRight size={16} />
      </Link>
    </section>
  )
}
