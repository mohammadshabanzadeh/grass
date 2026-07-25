import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EASE = [0.76, 0, 0.24, 1]
const MIN_DURATION = 2200

export default function Preloader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const timer = setTimeout(() => setVisible(false), MIN_DURATION)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!visible) document.body.style.overflow = ''
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* دو لَته‌ی تیره که مثل پرده از هم باز می‌شوند */}
          <motion.div
            key="curtain-top"
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="fixed inset-x-0 top-0 z-[101] h-1/2 bg-[#05070a]"
          />
          <motion.div
            key="curtain-bottom"
            exit={{ y: '100%' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-[101] h-1/2 bg-[#05070a]"
          />

          {/* محتوای وسط: لوگو + جلوه‌های نورانی */}
          <motion.div
            key="preloader-content"
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.45, ease: 'easeIn' }}
            className="fixed inset-0 z-[102] flex flex-col items-center justify-center gap-6"
          >
            <div className="relative flex h-40 w-40 items-center justify-center">
              {/* هاله‌های نورانی متحرک پشت لوگو */}
              <motion.span
                animate={{ scale: [1, 1.35, 1], opacity: [0.45, 0.85, 0.45] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute h-36 w-36 rounded-full bg-brand-500/40 blur-3xl"
              />
              <motion.span
                animate={{ scale: [1.25, 0.95, 1.25], opacity: [0.35, 0.7, 0.35] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute h-28 w-28 rounded-full bg-grass-500/35 blur-3xl"
              />

              {/* حلقه‌ی گرادیانتی چرخان */}
              <motion.svg
                viewBox="0 0 100 100"
                className="absolute h-32 w-32"
                animate={{ rotate: 360 }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
              >
                <defs>
                  <linearGradient id="preloader-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b74f6" />
                    <stop offset="55%" stopColor="#5bb85b" />
                    <stop offset="100%" stopColor="#3b74f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="url(#preloader-ring)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="200 76"
                />
              </motion.svg>

              {/* لوگو با جلوه‌ی درخشش عبوری */}
              <motion.div
                initial={{ opacity: 0, scale: 0.55 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="relative z-10 h-20 w-20 overflow-hidden rounded-2xl sm:h-24 sm:w-24"
              >
                <img src="/logo.png" alt="فراز چمن" className="h-full w-full object-contain" />
                <motion.span
                  animate={{ x: ['-130%', '230%'] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.7,
                    ease: 'easeInOut',
                  }}
                  className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                  style={{ mixBlendMode: 'overlay' }}
                />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg font-extrabold text-white sm:text-xl"
            >
              فراز چمن
            </motion.p>

            {/* نقطه‌های در حال بارگذاری */}
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
                  className="h-1.5 w-1.5 rounded-full bg-brand-400"
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
