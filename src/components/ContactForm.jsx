import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Phone, Mail, Pencil, Send, CheckCircle2, MessageSquare } from 'lucide-react'

const fields = [
  { name: 'name', placeholder: 'نام و نام خانوادگی', icon: User, type: 'text' },
  { name: 'phone', placeholder: 'شماره تماس', icon: Phone, type: 'tel' },
  { name: 'email', placeholder: 'ایمیل', icon: Mail, type: 'email' },
]

export default function ContactForm() {
  const [values, setValues] = useState({ name: '', phone: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setValues({ name: '', phone: '', email: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-3xl p-7 sm:p-8"
    >
      <div className="mb-6 text-right">
        <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/30">
          <MessageSquare size={22} />
        </span>
        <h3 className="text-lg font-extrabold text-slate-800 sm:text-xl">برای ما پیام بگذارید</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map((f) => {
          const Icon = f.icon
          return (
            <div key={f.name} className="relative">
              <Icon
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                name={f.name}
                type={f.type}
                required={f.name !== 'email'}
                value={values[f.name]}
                onChange={onChange}
                placeholder={f.placeholder}
                className="w-full rounded-xl border border-white/60 bg-white/60 py-3.5 pr-12 pl-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-200"
              />
            </div>
          )
        })}

        <div className="relative">
          <Pencil size={18} className="pointer-events-none absolute right-4 top-4 text-slate-400" />
          <textarea
            name="message"
            rows={4}
            required
            value={values.message}
            onChange={onChange}
            placeholder="پیام شما"
            className="w-full resize-none rounded-xl border border-white/60 bg-white/60 py-3.5 pr-12 pl-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-200"
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-4 text-sm font-bold text-white shadow-md shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-700"
        >
          <Send size={18} />
          ارسال پیام
        </button>
      </form>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.p
            key="sent"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center justify-center gap-1.5 text-center text-sm font-semibold text-grass-600"
          >
            <CheckCircle2 size={16} />
            پیام شما ثبت شد؛ به‌زودی با شما تماس می‌گیریم.
          </motion.p>
        ) : (
          <p className="mt-4 text-center text-sm text-slate-400">
            در اسرع وقت با شما تماس خواهیم گرفت.
          </p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
