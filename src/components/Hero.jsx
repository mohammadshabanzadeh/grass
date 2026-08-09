import { motion } from 'framer-motion'
import { ArrowLeft, Phone, Trophy } from 'lucide-react'
import SmartImage from './SmartImage.jsx'

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.15 + i * 0.12 },
  }),
}

export default function Hero() {
  return (
    <section id="home" className="relative z-20 overflow-hidden">
      {/* تصویر پس‌زمینه */}
      <div className="absolute inset-0">
        <SmartImage
          src="/images/artificial-grass-07.jpg"
          alt="چمن مصنوعی سبز و خیره‌کننده"
          gradient="linear-gradient(120deg,#0f2417 0%,#14532d 40%,#1e3a8a 130%)"
          className="h-full w-full"
          priority
          responsive
        />
        {/* لایه‌ی تیره برای خوانایی کارت شیشه‌ای (راست‌چین) */}
        <div className="absolute inset-0 bg-gradient-to-l from-slate-900/15 via-slate-900/25 to-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-900/20" />
      </div>

      <div className="container-x relative pb-40 pt-32 sm:pb-48 sm:pt-36 lg:pb-56 lg:pt-44">
        <div className="flex justify-start">
          {/* کارت آبی */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="glass-strong w-full max-w-xl rounded-3xl p-7 text-slate-800 sm:p-9"
          >
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50/80 px-4 py-1.5 text-xs font-semibold text-brand-700 sm:text-sm"
            >
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-brand-500" />
              زیبایی ماندگار، کیفیت بی‌نظیر
            </motion.div>

            {/* تنها h1 صفحه‌ی اصلی — موضوع واقعی صفحه */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="text-3xl font-extrabold leading-[1.3] text-slate-800 sm:text-[2.75rem] sm:leading-[1.25]"
            >
              مرجع تخصصی اجرای
              <br />
              <span className="text-brand-600">چمن مصنوعی</span> در ایران
            </motion.h1>

            {/* کادر ویژه‌ی استاندارد فیفا */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-grass-400/40 bg-gradient-to-l from-grass-500/15 to-brand-500/10 px-5 py-3.5 shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-grass-500 text-white shadow-md shadow-grass-500/30">
                <Trophy size={20} />
              </span>
              <span className="text-sm font-extrabold leading-7 text-slate-800 sm:text-base">
                زمین‌های فوتبال با استانداردهای فیفا
              </span>
            </motion.div>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-5 max-w-lg text-sm leading-8 text-slate-600 sm:text-base"
            >
              با استفاده از بهترین متریال و جدیدترین تکنولوژی، فضایی سبز و دلنشین
              برای محیط زندگی، کار و ورزش خود ایجاد کنید.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#products"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl"
              >
                مشاهده محصولات
                <ArrowLeft size={18} className="transition group-hover:-translate-x-1" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white/60 px-6 py-3.5 text-sm font-bold text-brand-700 backdrop-blur-md transition hover:bg-white"
              >
                <Phone size={17} />
                دریافت مشاوره رایگان
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* منحنی پایین هیرو (هم‌رنگ پس‌زمینه) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 rounded-t-[3rem] bg-[#eef4fc] sm:h-20" />
    </section>
  )
}
