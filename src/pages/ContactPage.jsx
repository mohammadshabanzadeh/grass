import { useEffect } from 'react'
import { Headset } from 'lucide-react'
import ContactHero from '../components/ContactHero.jsx'
import ContactForm from '../components/ContactForm.jsx'
import ContactLocation from '../components/ContactLocation.jsx'
import CTA from '../components/CTA.jsx'
import { useSeo } from '../lib/seo.js'

export default function ContactPage() {
  useSeo({
    title: 'تماس با ما',
    description:
      'برای مشاوره رایگان، استعلام قیمت و بازدید پروژه با کارشناسان فراز چمن در تماس باشید',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <ContactHero />

      <section className="container-x py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ContactForm />
          <ContactLocation />
        </div>
      </section>

      <CTA
        line1="مشاوره رایگان می‌خواهید؟"
        subtitle="کارشناسان ما آماده ارائه مشاوره تخصصی به شما هستند."
        buttonText="مشاوره رایگان"
        icon={Headset}
      />
      <div className="h-8" />
    </>
  )
}
