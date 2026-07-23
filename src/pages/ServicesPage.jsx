import { useEffect } from 'react'
import ServicesHero from '../components/ServicesHero.jsx'
import ServicesGrid from '../components/ServicesGrid.jsx'
import ProcessSteps from '../components/ProcessSteps.jsx'
import ServicePackages from '../components/ServicePackages.jsx'
import FAQ from '../components/FAQ.jsx'
import CTA from '../components/CTA.jsx'

export default function ServicesPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <ServicesHero />
      <ServicesGrid />
      <ProcessSteps />
      <ServicePackages />
      <FAQ />
      <CTA
        line1="برای دریافت مشاوره و اجرای خدمات"
        line2="همین حالا با ما در تماس باشید."
      />
      <div className="h-8" />
    </>
  )
}
