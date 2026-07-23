import { motion } from 'framer-motion'
import SmartImage from './SmartImage.jsx'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.15 + i * 0.13 },
  }),
}

export default function ProductsHero() {
  return (
    <section className="container-x pt-28 sm:pt-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[2rem] shadow-soft"
      >
        <SmartImage
          src="https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1600&q=80"
          alt="چمن مصنوعی"
          gradient="linear-gradient(120deg,#0f2417 0%,#14532d 45%,#1e3a8a 130%)"
          className="absolute inset-0 h-full w-full"
        />
        {/* لایه‌ی تیره‌ی شیشه‌ای از راست */}
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950/85 via-slate-900/55 to-slate-900/10" />

        {/* حباب تزئینی */}
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-brand-400/25 blur-3xl"
        />

        <div className="relative flex min-h-[230px] flex-col items-end justify-center gap-3 p-8 text-right text-white sm:min-h-[300px] sm:p-12">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="glass-dark rounded-full px-4 py-1.5 text-xs font-medium sm:text-sm"
          >
            فروشگاه فراز چمن
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="text-4xl font-extrabold sm:text-6xl"
          >
            محصولات
          </motion.h1>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="text-lg font-bold text-brand-200 sm:text-2xl"
          >
            انواع چمن مصنوعی با کیفیت بالا
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="max-w-xl text-sm leading-8 text-white/85 sm:text-base"
          >
            مجموعه‌ای کامل از بهترین مدل‌های چمن مصنوعی برای فضاهای مختلف با
            بالاترین کیفیت و مناسب‌ترین انتخاب
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}
