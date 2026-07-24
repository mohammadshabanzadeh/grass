import { motion } from 'framer-motion'
import { CheckCircle2, Maximize, Award } from 'lucide-react'
import SmartImage from './SmartImage.jsx'
import { projectStats } from '../data.js'

const iconMap = { check: CheckCircle2, area: Maximize, award: Award }

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.15 + i * 0.12 },
  }),
}

export default function ProjectsHero() {
  return (
    <section className="container-x pt-28 sm:pt-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-brand-50 via-white to-brand-100/60 shadow-soft ring-1 ring-white/60"
      >
        <div className="grid items-stretch lg:grid-cols-2">
          {/* متن + آمار (راست در RTL) */}
          <div className="order-2 flex flex-col justify-center gap-4 p-8 text-right sm:p-10 lg:order-1">
            <motion.span
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="glass w-fit rounded-full px-4 py-1.5 text-xs font-bold text-brand-700 sm:text-sm"
            >
              پروژه‌های اجرا شده
            </motion.span>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="text-3xl font-extrabold leading-tight text-slate-800 sm:text-4xl"
            >
              نمونه کارهایی که
              <br />
              <span className="text-brand-600">با کیفیت اجرا شدند</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="max-w-md text-sm leading-8 text-slate-500 sm:text-base"
            >
              هر پروژه، نتیجه‌ی تعهد ما به کیفیت، دقت در اجرا و استفاده از بهترین
              متریال برای خلق فضایی سبز و ماندگار است.
            </motion.p>

            {/* آمار */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-2 grid grid-cols-3 gap-3"
            >
              {projectStats.map((s) => {
                const Icon = iconMap[s.icon] || Award
                return (
                  <div
                    key={s.label}
                    className="glass flex flex-col items-center gap-1.5 rounded-2xl px-2 py-4 text-center transition hover:-translate-y-1"
                  >
                    <Icon size={20} className="text-brand-600" />
                    <span className="text-lg font-extrabold text-slate-800 sm:text-xl">
                      {s.value}
                    </span>
                    <span className="text-[11px] leading-4 text-slate-500 sm:text-xs">
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </motion.div>
          </div>

          {/* تصویر (چپ در RTL) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-1 min-h-[240px] lg:order-2 lg:min-h-full"
          >
            <SmartImage
              src="https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1200&q=80"
              alt="نمونه پروژه چمن مصنوعی اجرا شده"
              gradient="linear-gradient(120deg,#0f2417 0%,#14532d 45%,#1e3a8a 130%)"
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-brand-100/30" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
