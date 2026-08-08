import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Users, Medal, Headset } from 'lucide-react'
import SmartImage from './SmartImage.jsx'
import { aboutValues } from '../data.js'

const iconMap = { shield: ShieldCheck, users: Users, medal: Medal, headset: Headset }

// چهار مورد نخست از همان ارزش‌هایی که در صفحه‌ی «درباره ما» آمده‌اند
const items = aboutValues.slice(0, 4)

export default function HomeAbout() {
  return (
    <section id="about" className="relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-brand-400/15 blur-3xl" />

      <div className="container-x relative">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* تصویر (چپ در RTL) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="order-2 lg:order-1"
          >
            <SmartImage
              src="/images/artificial-grass-07.jpg"
              alt="اجرای چمن مصنوعی توسط فراز چمن"
              gradient="linear-gradient(135deg,#334155,#0f172a 70%,#16a34a)"
              className="h-64 w-full rounded-3xl shadow-card sm:h-80"
              responsive
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </motion.div>

          {/* متن (راست در RTL) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="order-1 text-right lg:order-2"
          >
            <span className="glass inline-block rounded-full px-4 py-1.5 text-xs font-bold text-brand-700 sm:text-sm">
              درباره فراز چمن
            </span>

            <h2 className="mt-4 text-2xl font-extrabold leading-relaxed text-slate-800 sm:text-3xl">
              تجربه، تخصص و تعهد در خلق
              <br />
              <span className="text-brand-600">فضاهای سبز ماندگار</span>
            </h2>

            <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
              فراز چمن با سال‌ها تجربه در زمینه‌ی فروش و نصب چمن مصنوعی، با بهره‌گیری از متریال
              باکیفیت و تیم متخصص، توانسته است اعتماد هزاران مشتری را جلب کرده و پروژه‌های
              متعددی را در سراسر کشور با موفقیت اجرا کند.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {items.map((v, i) => {
                const Icon = iconMap[v.icon] || ShieldCheck
                return (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                    className="glass flex items-center gap-3 rounded-2xl p-3.5"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon size={19} />
                    </span>
                    <span className="text-sm font-bold text-slate-800">{v.title}</span>
                  </motion.div>
                )
              })}
            </div>

            <Link
              to="/about"
              className="group mt-7 inline-flex items-center gap-2 rounded-xl border-2 border-brand-600 px-7 py-3.5 text-sm font-bold text-brand-600 transition hover:bg-brand-600 hover:text-white"
            >
              بیشتر درباره ما
              <ArrowLeft size={18} className="transition group-hover:-translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
