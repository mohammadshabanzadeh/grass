import { motion } from 'framer-motion'
import { ShieldCheck, UsersRound, Award, Headset, Tag } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'
import { aboutValues } from '../data.js'

const iconMap = { shield: ShieldCheck, users: UsersRound, medal: Award, headset: Headset, tag: Tag }

export default function AboutValues() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-400/15 blur-3xl" />

      <div className="container-x relative">
        <SectionHeading eyebrow="ارزش‌های ما" title="آنچه ما را" highlight="متمایز می‌کند" />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {aboutValues.map((v, i) => {
            const Icon = iconMap[v.icon] || ShieldCheck
            return (
              <motion.article
                key={v.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass group flex flex-col items-center rounded-3xl p-6 text-center transition duration-300 hover:-translate-y-2 hover:shadow-soft"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-brand-700 text-white shadow-lg transition duration-300 group-hover:scale-110">
                  <Icon size={28} />
                </div>
                <h4 className="mb-2 text-base font-extrabold text-slate-800">{v.title}</h4>
                <p className="text-sm leading-7 text-slate-500">{v.desc}</p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
