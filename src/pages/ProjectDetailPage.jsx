import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Maximize, Tag, Layers, SearchX } from 'lucide-react'
import SmartImage from '../components/SmartImage.jsx'
import { Shimmer } from '../components/Skeleton.jsx'
import CTA from '../components/CTA.jsx'
import { fetchProjectById } from '../lib/wp.js'
import { projectCategories, usageTypes } from '../data.js'

const faDigits = '۰۱۲۳۴۵۶۷۸۹'
const toFa = (n) => String(n).replace(/\d/g, (d) => faDigits[d])

const categoryLabel = (key) => projectCategories.find((c) => c.key === key)?.label || key
const usageLabel = (key) => usageTypes.find((u) => u.key === key)?.label || key

export default function ProjectDetailPage() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | notfound | error

  useEffect(() => {
    window.scrollTo(0, 0)
    let alive = true
    setStatus('loading')
    fetchProjectById(id)
      .then((data) => {
        if (!alive) return
        if (data) {
          setProject(data)
          setStatus('ready')
        } else {
          setStatus('notfound')
        }
      })
      .catch(() => {
        if (alive) setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [id])

  if (status === 'loading') {
    // اسکلت هم‌شکل صفحه‌ی نهایی: هیرو، متن و ستون مشخصات
    return (
      <>
        <section className="container-x pt-4 sm:pt-5">
          <Shimmer className="mb-5 h-4 w-32 rounded-lg" />
          <Shimmer className="min-h-[260px] rounded-[2rem] sm:min-h-[360px]" />
        </section>
        <section className="container-x py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="glass space-y-4 rounded-3xl p-6 sm:p-8">
              {['w-full', 'w-11/12', 'w-full', 'w-9/12', 'w-10/12', 'w-2/3'].map((w, i) => (
                <Shimmer key={i} className={`h-3.5 rounded-lg ${w}`} />
              ))}
            </div>
            <div className="glass h-fit space-y-4 rounded-3xl p-6">
              <Shimmer className="h-5 w-1/2 rounded-lg" />
              {[0, 1, 2, 3].map((i) => (
                <Shimmer key={i} className="h-3.5 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </section>
      </>
    )
  }

  if (status === 'notfound' || status === 'error') {
    return (
      <section className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-4 text-center sm:pt-5">
        <SearchX size={44} className="text-brand-500" />
        <p className="text-lg font-bold text-slate-700">
          {status === 'notfound' ? 'این پروژه یافت نشد' : 'در دریافت اطلاعات پروژه مشکلی پیش آمد'}
        </p>
        <Link
          to="/projects"
          className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          بازگشت به پروژه‌ها
          <ArrowRight size={16} />
        </Link>
      </section>
    )
  }

  const specs = [
    { icon: MapPin, label: 'موقعیت', value: project.city || '—' },
    {
      icon: Layers,
      label: 'دسته‌بندی',
      value: project.category ? categoryLabel(project.category) : '—',
    },
    { icon: Tag, label: 'نوع کاربری', value: project.usage ? usageLabel(project.usage) : '—' },
    {
      icon: Maximize,
      label: 'متراژ',
      value: project.area ? `${toFa(project.area)} متر مربع` : '—',
    },
  ]

  return (
    <>
      <section className="container-x pt-4 sm:pt-5">
        <Link
          to="/projects"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:gap-2.5"
        >
          <ArrowRight size={16} />
          بازگشت به پروژه‌ها
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[2rem] shadow-soft"
        >
          <SmartImage src={project.img} alt={project.title} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="relative flex min-h-[260px] flex-col items-start justify-end gap-3 p-8 text-right text-white sm:min-h-[360px] sm:p-12">
            {project.badge && (
              <span className="glass-dark rounded-full px-4 py-1.5 text-xs font-medium sm:text-sm">
                {project.badge}
              </span>
            )}
            <h1 className="text-3xl font-extrabold text-white drop-shadow sm:text-5xl">
              {project.title}
            </h1>
            {project.city && (
              <p className="flex items-center gap-1.5 text-sm text-white/85 sm:text-base">
                <MapPin size={16} className="text-brand-300" />
                {project.city}
              </p>
            )}
          </div>
        </motion.div>
      </section>

      <section className="container-x py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            {project.content && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                className="glass rounded-3xl p-6 text-right leading-8 text-slate-700 sm:p-8 [&_p]:mb-4"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            )}

            {project.gallery.length > 0 && (
              <div>
                <h3 className="mb-4 text-right text-lg font-extrabold text-slate-800">
                  گالری تصاویر پروژه
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {project.gallery.map((url, i) => (
                    <motion.div
                      key={url}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="overflow-hidden rounded-2xl shadow-card"
                    >
                      <SmartImage
                        src={url}
                        alt={`${project.title} ${toFa(i + 1)}`}
                        className="h-32 w-full sm:h-40"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass h-fit rounded-3xl p-6"
          >
            <h3 className="mb-4 text-right text-lg font-extrabold text-slate-800">
              مشخصات پروژه
            </h3>
            <ul className="space-y-4">
              {specs.map((s) => (
                <li
                  key={s.label}
                  className="flex items-center justify-between gap-3 border-b border-white/50 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-sm font-bold text-slate-700">{s.value}</span>
                  <span className="flex items-center gap-2 text-sm text-slate-500">
                    {s.label}
                    <s.icon size={16} className="text-brand-500" />
                  </span>
                </li>
              ))}
            </ul>
          </motion.aside>
        </div>
      </section>

      <CTA
        line1="پروژه‌ای مشابه در ذهن دارید؟"
        line2="برای مشاوره رایگان با تیم ما در تماس باشید."
      />
      <div className="h-8" />
    </>
  )
}
