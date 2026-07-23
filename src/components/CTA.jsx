import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import SmartImage from './SmartImage.jsx'

export default function CTA({
  line1 = 'برای مشاوره رایگان و دریافت قیمت',
  line2 = 'با ما در تماس باشید.',
  subtitle,
  buttonText = 'تماس با ما',
}) {
  return (
    <section id="contact" className="container-x py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl px-6 py-12 shadow-soft sm:px-12 sm:py-14"
      >
        <SmartImage
          src="https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?auto=format&fit=crop&w=1400&q=70"
          alt=""
          gradient="linear-gradient(100deg,#1d4ed8 0%,#2563eb 55%,#16a34a 130%)"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-brand-700/85 to-brand-600/85" />

        <div className="relative flex flex-col items-center justify-between gap-6 sm:flex-row-reverse">
          <div className="text-center text-white sm:text-right">
            <h3 className="text-2xl font-extrabold leading-relaxed sm:text-3xl">
              {line1}
              {!subtitle && (
                <>
                  <br />
                  {line2}
                </>
              )}
            </h3>
            {subtitle && (
              <p className="mt-2.5 text-sm leading-8 text-white/85 sm:text-base">{subtitle}</p>
            )}
          </div>
          <a
            href="tel:09121234567"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/50 bg-white/90 px-8 py-4 text-sm font-bold text-brand-700 shadow-lg backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white hover:shadow-xl"
          >
            <Phone size={18} />
            {buttonText}
          </a>
        </div>
      </motion.div>
    </section>
  )
}
