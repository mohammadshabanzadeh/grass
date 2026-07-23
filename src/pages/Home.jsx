import { useEffect } from 'react'
import Hero from '../components/Hero.jsx'
import Features from '../components/Features.jsx'
import Products from '../components/Products.jsx'
import Stats from '../components/Stats.jsx'
import Projects from '../components/Projects.jsx'
import CTA from '../components/CTA.jsx'

export default function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash)
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 200)
    }
  }, [])

  return (
    <>
      <Hero />
      <Features id="features" />
      <Products />
      <Stats />
      <Projects />
      <CTA />
    </>
  )
}
