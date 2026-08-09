import { useEffect } from 'react'
import AboutHero from '../components/AboutHero.jsx'
import AboutStory from '../components/AboutStory.jsx'
import AboutStats from '../components/AboutStats.jsx'
import AboutValues from '../components/AboutValues.jsx'
import CTA from '../components/CTA.jsx'
import { useSeo } from '../lib/seo.js'

export default function AboutPage() {
  useSeo({
    title: 'درباره ما',
    description:
      'فراز چمن؛ سال‌ها تجربه در فروش و نصب چمن مصنوعی با متریال باکیفیت و تیم متخصص',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutStats />
      <AboutValues />
      <CTA
        line1="پروژه‌ی بعدی شما، تخصص ماست"
        subtitle="برای دریافت مشاوره رایگان و اطلاع از بهترین راهکارها، با ما در ارتباط باشید."
        buttonText="مشاوره رایگان"
      />
      <div className="h-8" />
    </>
  )
}
