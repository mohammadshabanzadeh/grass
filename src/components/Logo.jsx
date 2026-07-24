import { useState } from 'react'

export default function Logo({ light = false, size = 'md' }) {
  const [imgOk, setImgOk] = useState(true)
  const iconSizeClass = size === 'lg' ? 'h-16 w-16' : 'h-11 w-11 sm:h-12 sm:w-12'
  const titleColor = light ? 'text-white' : 'text-brand-700'
  const textSize = size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'

  // آیکون تصویری (public/logo.png، پس‌زمینه شفاف) + متن کنار آن
  if (imgOk) {
    return (
      <div className="flex items-center gap-2.5">
        <img
          src="/logo.png"
          alt="فراز چمن"
          onError={() => setImgOk(false)}
          className={`${iconSizeClass} shrink-0 object-contain`}
        />
        <h1 className={`${textSize} font-extrabold ${titleColor}`}>فراز چمن</h1>
      </div>
    )
  }

  // نسخه‌ی جایگزین کامل متنی + آیکون svg
  const svgSize = size === 'lg' ? 44 : 38
  const subColor = light ? 'text-white/70' : 'text-slate-400'

  return (
    <div className="flex items-center gap-2.5">
      <div className="text-right leading-tight">
        <h1 className={`text-xl font-extrabold sm:text-2xl ${titleColor}`}>فراز چمن</h1>
        <p className={`text-[11px] font-medium ${subColor}`}>فروش و نصب چمن مصنوعی</p>
      </div>
      <svg width={svgSize} height={svgSize} viewBox="0 0 48 48" fill="none" className="shrink-0">
        <g stroke={light ? '#93bbfd' : '#2563eb'} strokeWidth="3" strokeLinecap="round">
          <path d="M12 40 C11 30 10 24 8 18" />
          <path d="M19 40 C18 27 17 18 14 10" />
          <path d="M24 40 C24 25 24 15 24 6" />
          <path d="M29 40 C30 27 31 18 34 10" />
          <path d="M36 40 C37 30 38 24 40 18" />
        </g>
        <path d="M6 42 H42" stroke={light ? '#93bbfd' : '#2563eb'} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  )
}
