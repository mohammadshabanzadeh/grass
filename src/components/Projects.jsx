import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import SmartImage from './SmartImage.jsx'
import SectionHeading from './SectionHeading.jsx'
import { projects } from '../data.js'

export default function Projects() {
  return (
    <section id="projects" className="relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute left-[-5rem] top-16 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-5rem] bottom-10 h-72 w-72 rounded-full bg-grass-400/20 blur-3xl" />

      <div className="container-x relative">
        <SectionHeading eyebrow="پروژه‌های ما" title="نمونه کارهای" highlight="اجرا شده" />

        <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {projects.map((p, i) => (
            <motion.figure
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-white/40 shadow-card"
            >
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
            </motion.figure>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-brand-600 px-7 py-3.5 text-sm font-bold text-brand-600 transition hover:bg-brand-600 hover:text-white"
          >
            مشاهده تمامی پروژه‌ها
            <ArrowLeft size={18} className="transition group-hover:-translate-x-1" />
          </motion.a>
        </div>
      </div>
    </section>
  )
}
