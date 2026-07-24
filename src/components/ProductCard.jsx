import { useState, forwardRef } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Heart,
  Dribbble,
  Umbrella,
  Baby,
  Sparkles,
  Building2,
  Sun,
  Sofa,
  Layers,
} from 'lucide-react'
import SmartImage from './SmartImage.jsx'

const iconMap = {
  sport: Dribbble,
  green: Umbrella,
  kids: Baby,
  decor: Sparkles,
  balcony: Building2,
  roof: Sun,
  terrace: Sofa,
  rooftop: Layers,
}

const ProductCard = forwardRef(function ProductCard(
  { p, index = 0, linkText = 'مشاهده محصول', showFav = false, view = 'grid' },
  ref,
) {
  const Icon = iconMap[p.icon] || Sparkles
  const [fav, setFav] = useState(false)

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
        </div>
        <div className="flex flex-1 flex-col justify-center p-5 text-right">
          <div className="mb-2 flex items-center gap-2">
            <span className="glass flex h-10 w-10 items-center justify-center rounded-full text-brand-600">
              <Icon size={20} />
            </span>
            <h4 className="text-lg font-extrabold text-slate-800">{p.title}</h4>
          </div>
          <p className="text-sm leading-7 text-slate-600">{p.desc}</p>
          <a
            href="#"
            className="mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:gap-2.5"
          >
            {linkText}
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
          className="h-44 w-full"
          imgClassName="transition duration-[600ms] group-hover:scale-110"
        />

        {showFav && (
          <button
            onClick={() => setFav((v) => !v)}
            aria-label="افزودن به علاقه‌مندی"
            className="glass absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:scale-110"
          >
            <Heart size={17} className={fav ? 'fill-red-500 text-red-500' : ''} />
          </button>
        )}

        {/* آیکون شناور */}
        <div className="glass absolute -bottom-7 right-1/2 z-10 flex h-14 w-14 translate-x-1/2 items-center justify-center rounded-full text-brand-600 shadow-lg transition duration-300 group-hover:-translate-y-1 group-hover:scale-110">
          <Icon size={26} />
        </div>
      </div>

      <div className="px-5 pb-6 pt-10 text-center">
        <h4 className="text-lg font-extrabold text-slate-800">{p.title}</h4>
        <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-7 text-slate-600">{p.desc}</p>
        <a
          href="#"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:gap-2.5"
        >
          {linkText}
          <ArrowLeft size={16} />
        </a>
      </div>
    </motion.article>
  )
})

export default ProductCard
