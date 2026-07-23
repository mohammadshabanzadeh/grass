import { motion } from 'framer-motion'
import { Award, Briefcase, Smile, ShieldCheck } from 'lucide-react'
import { stats } from '../data.js'

const iconMap = { award: Award, briefcase: Briefcase, smile: Smile, shield: ShieldCheck }

export default function Stats() {
  return (
    <section className="container-x">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-brand-700 via-brand-600 to-brand-500 px-6 py-10 shadow-soft sm:px-10"
      >
        {/* حباب‌های تزئینی */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 right-10 h-52 w-52 rounded-full bg-white/5" />

        <div className="relative grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = iconMap[s.icon]
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.12 }}
                className="glass-dark flex flex-col items-center gap-2 rounded-2xl px-3 py-5 text-center text-white transition hover:bg-white/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/25 bg-white/15">
                  <Icon size={24} />
                </div>
                <p className="mt-1 text-3xl font-extrabold sm:text-4xl">
                  {s.value}
                  <span className="text-lg font-bold">{s.suffix}</span>
                </p>
                <p className="text-sm text-white/80">{s.label}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
