import { motion } from 'framer-motion'
import { MapPin, Smile, Briefcase, Users } from 'lucide-react'
import { aboutStats } from '../data.js'

const iconMap = { pin: MapPin, smile: Smile, briefcase: Briefcase, users: Users }

export default function AboutStats() {
  return (
    <section className="container-x py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="glass grid grid-cols-2 gap-y-8 rounded-3xl px-6 py-10 lg:grid-cols-4"
      >
        {aboutStats.map((s, i) => {
          const Icon = iconMap[s.icon] || MapPin
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className={`flex flex-col items-center gap-2 text-center ${
                i > 0 ? 'lg:border-l lg:border-slate-200/70' : ''
              }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon size={24} />
              </span>
              <p className="mt-1 text-xl font-extrabold text-brand-600 sm:text-2xl">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
