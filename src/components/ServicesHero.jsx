import { motion } from 'framer-motion'
import { Phone, ArrowLeft } from 'lucide-react'
import SmartImage from './SmartImage.jsx'

const chips = ['فروش', 'نصب', 'زیرسازی', 'مشاوره', 'نگهداری', 'ضمانت']

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.12 + i * 0.1 },
  }),
}

export default function ServicesHero() {
  return (
    <section className="container-x pt-28 sm:pt-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[2rem] shadow-soft"
      >
        <SmartImage
          src="https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?auto=format&fit=crop&w=1600&q=80"
          alt="خدمات چمن مصنوعی"
          gradient="linear-gradient(120deg,#0f2417 0%,#14532d 45%,#1e3a8a 130%)"
          className="absolute inset-0 h-full w-full"
        />
        {/* گرادیانت مشکی شیشه‌ای از راست به چپ */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/85 from-20% via-black/45 to-transparent backdrop-blur-[1px]" />
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -left-10 top-8 h-44 w-44 rounded-full bg-grass-400/25 blur-3xl"
        />

        <div className="relative flex min-h-[260px] flex-col items-end justify-center gap-4 p-8 text-right text-white sm:min-h-[320px] sm:p-12">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="glass-dark rounded-full px-4 py-1.5 text-xs font-medium sm:text-sm"
          >
            خدمات فراز چمن
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="text-3xl font-extrabold leading-tight text-white drop-shadow sm:text-5xl"
          >
            از مشاوره تا اجرا،
            <br />
            <span className="text-brand-300">همراه شما هستیم</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="max-w-xl text-sm leading-8 text-white/85 sm:text-base"
          >
            مجموعه‌ی کاملی از خدمات تخصصی چمن مصنوعی؛ از فروش و طراحی گرفته تا
            زیرسازی، نصب حرفه‌ای و پشتیبانی پس از فروش.
          </motion.p>

          {/* چیپ‌های خدمات */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="flex flex-wrap justify-end gap-2"
          >
            {chips.map((c) => (
              <span
                key={c}
                className="glass-dark rounded-full px-3.5 py-1.5 text-xs font-medium text-white/90"
              >
                {c}
              </span>
            ))}
          </motion.div>

          <motion.button
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="group mt-1 inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/25"
          >
            <Phone size={17} />
            دریافت مشاوره رایگان
            <ArrowLeft size={16} className="transition group-hover:-translate-x-1" />
          </motion.button>
        </div>
      </motion.div>
    </section>
  )
}
