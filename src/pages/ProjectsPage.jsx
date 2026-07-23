import { useEffect } from 'react'
import ProjectsHero from '../components/ProjectsHero.jsx'
import ProjectsCatalog from '../components/ProjectsCatalog.jsx'
import CTA from '../components/CTA.jsx'

export default function ProjectsPage() {
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
