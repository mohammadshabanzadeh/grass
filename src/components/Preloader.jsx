import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DURATION = 2400
// دایره‌ی پیشرفت دور لوگو
const R = 92
const CIRC = 2 * Math.PI * R

export default function Preloader() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const start = performance.now()
    let raf
    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION)
      setProgress(1 - Math.pow(1 - t, 3)) // ease-out برای حرکت نرم‌تر
      if (t < 1) raf = requestAnimationFrame(tick)
      else setVisible(false)
    }
    raf = requestAnimationFrame(tick)

    // تضمین بسته‌شدن لودینگ: اگر صفحه در تبِ پس‌زمینه باز شود مرورگر
    // requestAnimationFrame را متوقف می‌کند و لودینگ برای همیشه باقی می‌ماند.
    const failsafe = setTimeout(() => setVisible(false), DURATION + 400)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(failsafe)
    }
  }, [])

  useEffect(() => {
    if (!visible) document.body.style.overflow = ''
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          exit={{ opacity: 0, scale: 1.07, filter: 'blur(6px)' }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          // pointer-events-none تا این لایه هرگز کلیک‌های منو را نگیرد؛ اگر
          // انیمیشن خروج کامل نشود (مثلاً تب در پس‌زمینه)، وگرنه کل صفحه
          // غیرقابل کلیک می‌ماند. اسکرول هم با overflow روی body کنترل می‌شود.
          className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* تصویر چمن با زوم بسیار آرام */}
          <motion.img
            src="/images/artificial-grass-07.jpg"
            srcSet="/images/artificial-grass-07-400.jpg 400w, /images/artificial-grass-07-800.jpg 800w, /images/artificial-grass-07.jpg 1600w"
            sizes="100vw"
            alt=""
            initial={{ scale: 1.18 }}
            animate={{ scale: 1 }}
            transition={{ duration: 3.4, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* لایه‌ی شیشه‌ای روشن روی تصویر (هماهنگ با تم سایت) */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-brand-50/75 backdrop-blur-md" />
          {/* هاله‌ی نور مرکزی */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.85)_0%,transparent_55%)]" />

          {/* ===== لوگو + حلقه‌ی لودینگ ===== */}
          <div className="relative flex h-56 w-56 items-center justify-center sm:h-72 sm:w-72">
            {/* هاله‌های نرم پشت لوگو */}
            <motion.span
              animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.6, 0.35] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute h-40 w-40 rounded-full bg-brand-400/40 blur-3xl sm:h-52 sm:w-52"
            />
            <motion.span
              animate={{ scale: [1.2, 0.95, 1.2], opacity: [0.25, 0.5, 0.25] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute h-32 w-32 rounded-full bg-grass-400/40 blur-3xl sm:h-44 sm:w-44"
            />

            {/* حلقه‌ها */}
            <svg viewBox="0 0 200 200" className="absolute h-full w-full -rotate-90">
              <defs>
                <linearGradient id="fcp-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="60%" stopColor="#3ea63e" />
                  <stop offset="100%" stopColor="#6096fa" />
                </linearGradient>
              </defs>
              {/* مسیر خالی */}
              <circle
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="5"
              />
              {/* مسیر پرشونده بر اساس درصد بارگذاری */}
              <circle
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke="url(#fcp-ring)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - progress)}
                style={{ filter: 'drop-shadow(0 2px 8px rgba(37,99,235,0.45))' }}
              />
            </svg>

            {/* قوس نازک چرخان برای حس زنده بودن */}
            <motion.svg
              viewBox="0 0 200 200"
              className="absolute h-[86%] w-[86%]"
              animate={{ rotate: 360 }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
            >
              <circle
                cx="100"
                cy="100"
                r="78"
                fill="none"
                stroke="rgba(37,99,235,0.35)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="60 430"
              />
            </motion.svg>

            {/* لوگوی بزرگ سایت */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 h-28 w-28 overflow-hidden sm:h-36 sm:w-36"
            >
              <motion.img
                src="/logo.png"
                alt="فراز چمن"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="h-full w-full object-contain drop-shadow-[0_10px_25px_rgba(37,99,235,0.35)]"
              />
              {/* درخشش عبوری روی لوگو */}
              <motion.span
                animate={{ x: ['-140%', '240%'] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
                className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/90 to-transparent"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
