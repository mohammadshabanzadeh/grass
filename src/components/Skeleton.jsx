import { motion } from 'framer-motion'

/** یک بلوک خاکستری با درخشش عبوری — پایه‌ی همه‌ی حالت‌های بارگذاری. */
export function Shimmer({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-slate-200/70 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  )
}

/**
 * گرید کارت‌های اسکلتی؛ به‌جای اسپینر ساده، شکل نهایی محتوا را از قبل
 * نشان می‌دهد تا انتظار کوتاه‌تر حس شود و صفحه هنگام آمدن داده نپرد.
 */
export default function SkeletonCards({
  count = 6,
  imageClass = 'h-48',
  view = 'grid',
  // باید با گرید واقعی همان صفحه یکی باشد تا چیدمان هنگام آمدن داده نپرد
  gridClass = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
}) {
  const items = Array.from({ length: count })

  if (view === 'list') {
    return (
      <div className="flex flex-col gap-5">
        {items.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="glass flex overflow-hidden rounded-3xl"
          >
            <Shimmer className="w-40 shrink-0 sm:w-56" />
            <div className="flex flex-1 flex-col justify-center gap-3 p-5">
              <Shimmer className="h-5 w-1/2 rounded-lg" />
              <Shimmer className="h-3.5 w-3/4 rounded-lg" />
              <Shimmer className="h-3.5 w-1/3 rounded-lg" />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className={gridClass}>
      {items.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="glass overflow-hidden rounded-3xl"
        >
          <Shimmer className={`w-full ${imageClass}`} />
          <div className="flex flex-col items-center gap-3 p-5">
            <Shimmer className="h-5 w-2/3 rounded-lg" />
            <Shimmer className="h-3.5 w-1/2 rounded-lg" />
            <Shimmer className="h-3.5 w-1/3 rounded-lg" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
