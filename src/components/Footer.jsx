import { MapPin, Phone, Mail, Instagram, Send, Heart } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'

const quickLinks = [
  { label: 'صفحه اصلی', type: 'route', to: '/' },
  { label: 'محصولات', type: 'route', to: '/products' },
  { label: 'پروژه‌ها', type: 'route', to: '/projects' },
  { label: 'درباره ما', type: 'hash', id: 'about' },
  { label: 'تماس با ما', type: 'hash', id: 'contact' },
]

const services = ['فروش چمن مصنوعی', 'نصب چمن مصنوعی', 'زیرسازی و آماده‌سازی', 'مشاوره و طراحی']

// آیکون واتساپ سبک ساده
function WhatsApp({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2zm5.8 14.03c-.24.68-1.42 1.32-1.95 1.36-.5.05-1.13.24-3.66-.77-3.08-1.24-5.05-4.4-5.2-4.6-.15-.2-1.24-1.65-1.24-3.15S6.5 6.68 6.75 6.4a.83.83 0 0 1 .6-.28c.15 0 .3 0 .43.01.14 0 .32-.05.5.38.19.44.65 1.53.7 1.64.06.11.1.24.02.39-.08.15-.12.24-.24.37-.12.14-.25.3-.36.4-.12.12-.24.25-.1.48.13.24.6.98 1.28 1.59.88.78 1.62 1.02 1.85 1.14.24.12.38.1.51-.06.14-.15.6-.68.75-.92.15-.24.3-.2.5-.12.2.07 1.29.61 1.51.72.22.11.37.16.42.25.06.09.06.53-.18 1.21z" />
    </svg>
  )
}

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNav = (e, link) => {
    e.preventDefault()
    if (link.type === 'route') {
      navigate(link.to)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' }), 350)
    } else {
      document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer id="about" className="relative mt-8 bg-slate-900 pt-16 text-slate-300">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-10 pb-12 lg:grid-cols-4">
          {/* دسترسی سریع */}
          <div>
            <h4 className="mb-5 text-base font-bold text-white">دسترسی سریع</h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.type === 'route' ? l.to : `#${l.id}`}
                    onClick={(e) => handleNav(e, l)}
                    className="text-slate-400 transition hover:text-brand-300"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* خدمات */}
          <div>
            <h4 className="mb-5 text-base font-bold text-white">خدمات</h4>
            <ul className="space-y-3 text-sm">
              {services.map((s) => (
                <li key={s} className="text-slate-400 transition hover:text-brand-300">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* اطلاعات تماس */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="mb-5 text-base font-bold text-white">اطلاعات تماس</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={18} className="mt-0.5 shrink-0 text-brand-400" />
                <span className="leading-7 text-slate-400">
                  تهران، شهرک صنعتی شهاب، صنعت ۱۴، پلاک ۴۵
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={18} className="shrink-0 text-brand-400" />
                <a href="tel:09121234567" dir="ltr" className="text-slate-400 hover:text-brand-300">
                  0912 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={18} className="shrink-0 text-brand-400" />
                <a href="mailto:info@farazchaman.ir" className="text-slate-400 hover:text-brand-300">
                  info@farazchaman.ir
                </a>
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              {[Instagram, WhatsApp, Send].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="glass-dark flex h-10 w-10 items-center justify-center rounded-full text-slate-200 transition hover:bg-brand-600 hover:text-white"
                  aria-label="شبکه اجتماعی"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* درباره برند */}
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4 flex justify-start">
              <Logo light size="lg" />
            </div>
            <p className="text-sm leading-8 text-slate-400">
              فراز چمن، تولیدکننده و مجری تخصصی چمن مصنوعی با بهترین کیفیت و خدمات
              پس از فروش در سراسر کشور.
            </p>
          </div>
        </div>
      </div>

      {/* نوار پایین */}
      <div className="border-t border-slate-800">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-center text-xs text-slate-500 sm:flex-row sm:text-sm">
          <p>© تمامی حقوق برای فراز چمن محفوظ است.</p>
          <p className="flex items-center gap-1.5">
            طراحی و توسعه با
            <Heart size={14} className="fill-red-500 text-red-500" />
          </p>
        </div>
      </div>
    </footer>
  )
}
