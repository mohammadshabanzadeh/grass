import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon.jsx'
import { contactAddress, contactPostal, contactMapSrc, contactCards } from '../data.js'

const iconMap = {
  phone: (p) => <Phone {...p} />,
  whatsapp: (p) => <WhatsAppIcon {...p} />,
  mail: (p) => <Mail {...p} />,
  clock: (p) => <Clock {...p} />,
}

export default function ContactLocation() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-3xl p-7 sm:p-8"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/30">
          <MapPin size={20} />
        </span>
        <h3 className="text-lg font-extrabold text-slate-800 sm:text-xl">ما کجاییم؟</h3>
      </div>

      <div className="text-right">
        <p className="text-sm leading-8 text-slate-600">{contactAddress}</p>
        <p className="mt-1 text-sm text-slate-500">
          کد پستی: <span dir="ltr">{contactPostal}</span>
        </p>
      </div>

      {/* نقشه */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-white/60 shadow-card">
        <iframe
          title="نقشه فراز چمن"
          src={contactMapSrc}
          className="h-56 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* کارت‌های اطلاعات */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {contactCards.map((c) => {
          const Icon = iconMap[c.icon] || iconMap.phone
          const inner = (
            <>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Icon size={20} />
              </span>
              <p className="text-xs font-extrabold text-slate-800">{c.label}</p>
              <p className="text-[11px] leading-5 text-slate-500" dir={c.icon === 'mail' ? 'ltr' : undefined}>
                {c.value}
              </p>
              {c.sub && <p className="text-[11px] leading-4 text-slate-500">{c.sub}</p>}
            </>
          )
          return c.href ? (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="glass flex flex-col items-center gap-1.5 rounded-2xl p-4 text-center transition hover:-translate-y-1"
            >
              {inner}
            </a>
          ) : (
            <div
              key={c.label}
              className="glass flex flex-col items-center gap-1.5 rounded-2xl p-4 text-center"
            >
              {inner}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
