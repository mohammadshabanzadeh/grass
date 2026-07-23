import { motion } from 'framer-motion'
import { Check, Star, Phone } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'
import { servicePackages } from '../data.js'

export default function ServicePackages() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-400/15 blur-3xl" />

      <div className="container-x relative">
        <SectionHeading eyebrow="پکیج‌های خدمات" title="متناسب با" highlight="هر فضا و بودجه" />

        <div className="mt-14 grid grid-cols-1 items-center gap-6 md:grid-cols-3">
          {servicePackages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`relative rounded-3xl p-7 transition duration-300 hover:-translate-y-2 ${
                pkg.featured
                  ? 'bg-gradient-to-br from-brand-700 to-brand-600 text-white shadow-soft md:-my-4 md:py-11'
                  : 'glass text-slate-700 hover:shadow-soft'
              }`}
            >
              {pkg.featured && (
                <span className="absolute -top-3 right-1/2 flex translate-x-1/2 items-center gap-1 rounded-full bg-grass-500 px-4 py-1 text-xs font-bold text-white shadow-md">
                  <Star size={13} className="fill-white" />
                  محبوب‌ترین
                </span>
              )}

              <h4
                className={`text-xl font-extrabold ${pkg.featured ? 'text-white' : 'text-slate-800'}`}
              >
                پکیج {pkg.name}
              </h4>
              <p className={`mt-1.5 text-sm ${pkg.featured ? 'text-white/80' : 'text-slate-500'}`}>
                {pkg.tagline}
              </p>

              <div className={`my-6 h-px w-full ${pkg.featured ? 'bg-white/20' : 'bg-slate-200'}`} />

              <ul className="space-y-3.5">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        pkg.featured ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-600'
                      }`}
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span className={pkg.featured ? 'text-white/90' : 'text-slate-600'}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() =>
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }
                className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition ${
                  pkg.featured
                    ? 'bg-white text-brand-700 hover:-translate-y-0.5 hover:shadow-lg'
                    : 'bg-brand-600 text-white hover:bg-brand-700'
                }`}
              >
                <Phone size={16} />
                استعلام قیمت
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
