import { useEffect } from 'react'
import ProductsHero from '../components/ProductsHero.jsx'
import Features from '../components/Features.jsx'
import ProductsCatalog from '../components/ProductsCatalog.jsx'
import CTA from '../components/CTA.jsx'
import { productFeatures, serviceFeatures } from '../data.js'

export default function ProductsPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <ProductsHero />
      <Features items={productFeatures} overlapClass="-mt-12 sm:-mt-14" />
      <ProductsCatalog />
      <CTA />
      <Features items={serviceFeatures} overlap={false} />
      <div className="h-8" />
    </>
  )
}
