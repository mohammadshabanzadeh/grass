import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin } from 'lucide-react'
import SmartImage from './SmartImage.jsx'

const ProjectCard = forwardRef(function ProjectCard({ p, index = 0, view = 'grid' }, ref) {
  if (view === 'list') {
    return (
      <motion.article
        ref={ref}
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="glass group flex overflow-hidden rounded-3xl transition duration-300 hover:shadow-soft"
      >
        <div className="relative w-40 shrink-0 sm:w-56">
          <SmartImage
            src={p.img}
            alt={p.title}
            gradient={p.gradient}
            className="h-full w-full"
            imgClassName="transition duration-500 group-hover:scale-110"
          />
          <span className="glass-dark absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold text-white">
            {p.badge}
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center p-5 text-right">
          <h4 className="text-lg font-extrabold text-slate-800">{p.title}</h4>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin size={15} className="text-brand-500" />
            {p.city}
          </p>
          <a
            href="#"
            className="mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:gap-2.5"
          >
            مشاهده جزئیات
            <ArrowLeft size={16} />
          </a>
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: 'easeOut' }}
      className="glass group overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-2 hover:shadow-soft"
    >
      <div className="relative">
        <SmartImage
          src={p.img}
          alt={p.title}
          gradient={p.gradient}
          className="h-48 w-full"
          imgClassName="transition duration-[600ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 to-transparent" />
        <span className="glass-dark absolute right-1/2 top-3 translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold text-white">
          {p.badge}
        </span>
      </div>

      <div className="p-5 text-center">
        <h4 className="text-lg font-extrabold text-slate-800">{p.title}</h4>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-slate-500">
          <MapPin size={15} className="text-brand-500" />
          {p.city}
        </p>
        <a
          href="#"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:gap-2.5"
        >
          مشاهده جزئیات
          <ArrowLeft size={16} />
        </a>
      </div>
    </motion.article>
  )
})

export default ProjectCard
