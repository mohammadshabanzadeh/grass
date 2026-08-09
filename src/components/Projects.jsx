import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import SmartImage from './SmartImage.jsx'
import SectionHeading from './SectionHeading.jsx'
import { projects as fallbackProjects } from '../data.js'
import { fetchProjects, seededProjects } from '../lib/wp.js'

const MAX = 5

export default function Projects() {
  const navigate = useNavigate()
  const [items, setItems] = useState(() => {
    const s = seededProjects()
    return s ? s.slice(0, MAX) : null // null = هنوز در حال دریافت
  })

  useEffect(() => {
    let alive = true
    fetchProjects()
      .then((list) => {
        if (!alive) return
        setItems(list.length ? list.slice(0, MAX) : fallbackProjects.slice(0, MAX))
      })
      .catch(() => {
        // در نبود دسترسی به وردپرس، نمونه‌کارهای ثابت نمایش داده می‌شوند
        if (alive) setItems(fallbackProjects.slice(0, MAX))
      })
    return () => {
      alive = false
    }
  }, [])

  const loading = items === null
  const list = items || []

  return (
    <section id="projects" className="relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute left-[-5rem] top-16 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-[-5rem] h-72 w-72 rounded-full bg-grass-400/20 blur-3xl" />

      <div className="container-x relative">
        <SectionHeading eyebrow="پروژه‌های ما" title="نمونه کارهای" highlight="اجرا شده" />

        <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {loading
            ? Array.from({ length: MAX }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse overflow-hidden rounded-2xl border border-white/40 bg-white/40 shadow-card sm:h-44"
                />
              ))
            : list.map((p, i) => {
                const card = (
                  <>
                    <SmartImage
                      src={p.img}
                      alt={p.title}
                      gradient={p.gradient}
                      className="h-40 w-full sm:h-44"
                      imgClassName="transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                    <figcaption className="absolute inset-x-3 bottom-3">
                      <span className="glass-dark block rounded-xl px-3 py-2 text-center text-sm font-bold text-white sm:text-[15px]">
                        {p.title}
                      </span>
                    </figcaption>
                  </>
                )

                return (
                  <motion.figure
                    key={p.id ?? p.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/40 shadow-card"
                  >
                    {/* پروژه‌های وردپرس صفحه‌ی اختصاصی دارند؛ نمونه‌های ثابت نه */}
                    {p.id ? (
                      <Link to={`/projects/${p.id}`} className="block">
                        {card}
                      </Link>
                    ) : (
                      card
                    )}
                  </motion.figure>
                )
              })}
        </div>

        <div className="mt-12 flex justify-center">
          <motion.button
            onClick={() => {
              navigate('/projects')
              window.scrollTo({ top: 0 })
            }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-brand-600 px-7 py-3.5 text-sm font-bold text-brand-600 transition hover:bg-brand-600 hover:text-white"
          >
            مشاهده تمامی پروژه‌ها
            <ArrowLeft size={18} className="transition group-hover:-translate-x-1" />
          </motion.button>
        </div>
      </div>
    </section>
  )
}
