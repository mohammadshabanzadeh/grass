import { motion } from 'framer-motion'
import { Phone, Send } from 'lucide-react'
import SmartImage from './SmartImage.jsx'
import WhatsAppIcon from './WhatsAppIcon.jsx'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.15 + i * 0.12 },
  }),
}

const channels = [
  { key: 'phone', href: 'tel:09123365430', icon: <Phone size={20} /> },
  { key: 'whatsapp', href: 'https://wa.me/989123365430', icon: <WhatsAppIcon size={20} /> },
  { key: 'telegram', href: 'https://t.me/', icon: <Send size={20} /> },
]

export default function ContactHero() {
  return (
    <section className="container-x pt-28 sm:pt-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[2rem] shadow-soft"
      >
        <SmartImage
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt="فضای سبز فراز چمن"
          gradient="linear-gradient(120deg,#0f2417 0%,#14532d 45%,#1e3a8a 130%)"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-white/55 via-white/10 to-transparent" />

        <div className="relative flex min-h-[360px] items-center justify-start p-6 sm:min-h-[420px] sm:p-10">
          {/* کارت شیشه‌ای (راست در RTL) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="glass-strong w-full max-w-md rounded-3xl p-8 text-right sm:p-10"
          >
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="text-3xl font-extrabold text-brand-600 sm:text-4xl"
            >
              تماس با ما
            </motion.h1>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-3 text-base font-bold text-slate-700 sm:text-lg"
            >
              ما همیشه آماده پاسخگویی به شما هستیم
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-3 text-sm leading-8 text-slate-500"
            >
              برای دریافت مشاوره رایگان، استعلام قیمت، بازدید از پروژه‌ها با هرگونه
              سوال با ما در ارتباط باشید.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="mt-7 flex justify-center gap-4"
            >
              {channels.map((c) => (
                <a
                  key={c.key}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="glass flex h-14 w-14 items-center justify-center rounded-full text-brand-600 transition hover:-translate-y-1 hover:bg-brand-600 hover:text-white"
                >
                  {c.icon}
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
