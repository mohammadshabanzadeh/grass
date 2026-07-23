import { motion } from 'framer-motion'
import { Calendar, MapPin, LayoutGrid, Target } from 'lucide-react'
import SmartImage from './SmartImage.jsx'
import { aboutInfo } from '../data.js'

const iconMap = { calendar: Calendar, pin: MapPin, grid: LayoutGrid, target: Target }

export default function AboutStory() {
  return (
    <section className="container-x py-16 sm:py-20">
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        {/* کارت اطلاعات (راست) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="glass order-1 flex flex-col justify-center gap-5 rounded-3xl p-7 lg:col-span-4"
        >
          {aboutInfo.map((row) => {
            const Icon = iconMap[row.icon] || Calendar
            return (
              <div key={row.label} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon size={20} />
                </span>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-slate-800">{row.label}</p>
                  <p className="mt-0.5 text-sm leading-7 text-slate-500">{row.value}</p>
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* تصویر (وسط) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="order-2 min-h-[260px] lg:col-span-4"
        >
          <SmartImage
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
            alt="پروژه اجرا شده"
            gradient="linear-gradient(135deg,#334155,#0f172a 70%,#16a34a)"
            className="h-full min-h-[260px] w-full rounded-3xl shadow-card"
          />
        </motion.div>

        {/* متن داستان (چپ) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="order-3 flex flex-col justify-center text-right lg:col-span-4"
        >
          <p className="mb-2 text-sm font-bold text-brand-600">داستان ما</p>
          <h3 className="text-2xl font-extrabold leading-relaxed text-slate-800 sm:text-3xl">
            از یک ایده تا تبدیل شدن به مرجع تخصصی چمن مصنوعی
          </h3>
          <p className="mt-5 text-sm leading-8 text-slate-500">
            فراز چمن فعالیت خود را با هدف ارائه‌ی بهترین راهکارهای فضای سبز مصنوعی
            آغاز کرد. ما باور داریم که هر فضایی، شایسته‌ی داشتن چمنی زیبا، باکیفیت
            و بادوام است. به همین دلیل از ابتدا تمرکز خود را بر کیفیت محصول، اجرای
            استاندارد و رضایت مشتری قرار دادیم.
          </p>
          <p className="mt-4 text-sm leading-8 text-slate-500">
            امروز، با افتخار در کنار شما هستیم تا فضاهایی سبز، زیبا و ماندگار برای
            خانه‌ها، ویلاها، مجموعه‌های ورزشی، تجاری و عمومی خلق کنیم.
          </p>
          <p className="signature mt-6 text-2xl font-bold text-brand-600">تیم فراز چمن</p>
        </motion.div>
      </div>
    </section>
  )
}
