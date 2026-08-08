import { useEffect } from 'react'
import Hero from '../components/Hero.jsx'
import Features from '../components/Features.jsx'
import HomeCategories from '../components/HomeCategories.jsx'
import Products from '../components/Products.jsx'
import Stats from '../components/Stats.jsx'
import Projects from '../components/Projects.jsx'
import HomeAbout from '../components/HomeAbout.jsx'
import CTA from '../components/CTA.jsx'

export default function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash)
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 200)
    }
  }, [])

  // ترتیب صفحه: دسته‌بندی‌ها مهم‌تر از تک‌محصول‌ها هستند، پس بلافاصله
  // بعد از هیرو می‌آیند و محصولات پس از آمار قرار می‌گیرند.
  return (
    <>
      <Hero />
      <Features id="features" glassClass="glass" overlapClass="-mt-28 sm:-mt-32" />
      <HomeCategories />
      <Stats />
      <Products />
      <Projects />
      <HomeAbout />
      <CTA />
    </>
  )
}
