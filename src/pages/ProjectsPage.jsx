import { useEffect } from 'react'
import ProjectsHero from '../components/ProjectsHero.jsx'
import ProjectsCatalog from '../components/ProjectsCatalog.jsx'
import CTA from '../components/CTA.jsx'
import { useSeo } from '../lib/seo.js'

export default function ProjectsPage() {
  useSeo({
    title: 'پروژه‌ها',
    description:
      'نمونه‌کارهای اجرا شده‌ی چمن مصنوعی؛ زمین ورزشی، روف گاردن، محوطه ویلا و فضای بازی کودکان',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <ProjectsHero />
      <ProjectsCatalog />
      <CTA
        line1="برای مشاوره و اجرای پروژه‌ خود"
        line2="با تیم متخصص ما در تماس باشید."
      />
      <div className="h-8" />
    </>
  )
}
