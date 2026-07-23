import { motion } from 'framer-motion'
import { Store, HardHat, Layers, PencilRuler, RefreshCw, ShieldCheck, ArrowLeft } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'
import { services } from '../data.js'

const iconMap = {
  store: Store,
  hardhat: HardHat,
  layers: Layers,
  ruler: PencilRuler,
  refresh: RefreshCw,
  shield: ShieldCheck,
}

const faDigits = '۰۱۲۳۴۵۶۷۸۹'
const toFa = (n) => String(n).replace(/\d/g, (d) => faDigits[d])

export default function ServicesGrid() {
  return (
    <section id="services-list" className="relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute right-[-6rem] top-16 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
      <div className="pointer-events-none absolute left-[-6rem] bottom-10 h-80 w-80 rounded-full bg-grass-400/20 blur-3xl" />

      <div className="container-x relative">
        <SectionHeading eyebrow="چه کاری برای شما انجام می‌دهیم" title="خدمات" highlight="تخصصی ما" />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon] || Store
            return (
              <motion.article
                key={s.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass group relative overflow-hidden rounded-3xl p-7 transition duration-300 hover:-translate-y-2 hover:shadow-soft"
              >
                {/* شماره کم‌رنگ */}
                <span className="pointer-events-none absolute -left-2 -top-4 text-7xl font-black text-brand-500/10">
                  {toFa(i + 1)}
                </span>

                <div
                  className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg transition duration-300 group-hover:scale-110 group-hover:-rotate-6"
                  style={{ background: s.gradient }}
                >
                  <Icon size={30} />
                </div>

                <h4 className="mb-2 text-lg font-extrabold text-slate-800">{s.title}</h4>
                <p className="text-sm leading-8 text-slate-500">{s.desc}</p>

                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 opacity-0 transition-all duration-300 group-hover:gap-2.5 group-hover:opacity-100">
                  اطلاعات بیشتر
                  <ArrowLeft size={16} />
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
