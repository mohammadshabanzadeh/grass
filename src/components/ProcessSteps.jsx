import { motion } from 'framer-motion'
import { Phone, PencilRuler, HardHat, CheckCircle2 } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'
import { processSteps } from '../data.js'

const iconMap = { phone: Phone, ruler: PencilRuler, hardhat: HardHat, check: CheckCircle2 }
const faDigits = '۰۱۲۳۴۵۶۷۸۹'
const toFa = (n) => String(n).replace(/\d/g, (d) => faDigits[d])

export default function ProcessSteps() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="container-x">
        <SectionHeading eyebrow="فرایند کار" title="مسیر همکاری" highlight="با ما" />

        <div className="relative mt-16">
          {/* خط اتصال (دسکتاپ) */}
          <div className="pointer-events-none absolute inset-x-10 top-9 hidden lg:block">
            <div className="h-0.5 w-full rounded-full bg-slate-200" />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
              className="absolute inset-0 h-0.5 origin-right rounded-full bg-gradient-to-l from-grass-500 via-brand-500 to-brand-600"
            />
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((s, i) => {
              const Icon = iconMap[s.icon] || Phone
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative">
                    <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-soft ring-8 ring-[#eef3fb]">
                      <Icon size={30} />
                    </div>
                    <span className="glass absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold text-brand-700">
                      {toFa(i + 1)}
                    </span>
                  </div>
                  <h4 className="mt-5 text-base font-extrabold text-slate-800">{s.title}</h4>
                  <p className="mx-auto mt-2 max-w-[15rem] text-sm leading-7 text-slate-500">
                    {s.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
