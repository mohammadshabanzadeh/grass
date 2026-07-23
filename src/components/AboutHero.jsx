import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import SmartImage from './SmartImage.jsx'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.15 + i * 0.12 },
  }),
}

export default function AboutHero() {
  return (
    <section className="container-x pt-28 sm:pt-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass relative overflow-hidden rounded-[2rem]"
      >
        <div className="grid items-stretch lg:grid-cols-2">
          {/* تصویر با لبه‌ی منحنی (چپ در RTL) */}
          <div className="relative order-2 min-h-[260px] lg:order-1 lg:min-h-[440px]">
            <SmartImage
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="فضای سبز اجرا شده توسط فراز چمن"
              gradient="linear-gradient(120deg,#0f2417 0%,#14532d 45%,#1e3a8a 130%)"
              className="about-hero-clip absolute inset-0 h-full w-full lg:rounded-l-[2rem]"
            />
          </div>

          {/* متن (راست در RTL) */}
          <div className="order-1 flex flex-col items-end justify-center gap-4 p-8 text-right sm:p-12 lg:order-2">
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="text-3xl font-extrabold text-brand-600 sm:text-5xl"
            >
              درباره فراز چمن
            </motion.h1>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="text-base font-bold text-slate-700 sm:text-xl"
            >
              تجربه، تخصص و تعهد در خلق فضاهای سبز ماندگار
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="max-w-lg text-sm leading-8 text-slate-500 sm:text-base"
            >
              فراز چمن با سال‌ها تجربه در زمینه‌ی فروش و نصب چمن مصنوعی، با
              بهره‌گیری از متریال باکیفیت و تیم متخصص، توانسته است اعتماد هزاران
              مشتری را جلب کرده و پروژه‌های متعددی را در سراسر کشور با موفقیت اجرا
              کند.
            </motion.p>

            <motion.button
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              onClick={() =>
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="mt-2 inline-flex items-center gap-2 rounded-xl border-2 border-brand-600 px-7 py-3.5 text-sm font-bold text-brand-600 transition hover:bg-brand-600 hover:text-white"
            >
              <Phone size={17} />
              تماس با ما
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
