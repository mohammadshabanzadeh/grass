import { motion } from 'framer-motion'
import {
  BadgeCheck,
  HardHat,
  ShieldCheck,
  Tag,
  PencilRuler,
  Headset,
  Truck,
  Headphones,
  Wrench,
} from 'lucide-react'
import { features as defaultFeatures } from '../data.js'

const iconMap = {
  'badge-check': BadgeCheck,
  'hard-hat': HardHat,
  'shield-check': ShieldCheck,
  tag: Tag,
  ruler: PencilRuler,
  headset: Headset,
  truck: Truck,
  headphones: Headphones,
  wrench: Wrench,
}

export default function Features({ items = defaultFeatures, overlap = true, id }) {
  return (
    <div
      id={id}
      className={`container-x relative z-30 ${
        overlap ? '-mt-24 sm:-mt-28' : 'mt-4'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        className="glass-strong grid grid-cols-2 gap-px overflow-hidden rounded-3xl lg:grid-cols-4"
      >
        {items.map((f, i) => {
          const Icon = iconMap[f.icon] || BadgeCheck
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.1 }}
              className="group/feat flex items-center gap-3.5 bg-white/20 p-5 transition hover:bg-white/45 sm:p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/50 bg-white/40 text-brand-600 shadow-inner transition duration-300 group-hover/feat:scale-110 group-hover/feat:rotate-6 sm:h-14 sm:w-14">
                <Icon size={24} />
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-slate-800 sm:text-base">{f.title}</p>
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{f.desc}</p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
