import { useEffect } from 'react'
import ProductsHero from '../components/ProductsHero.jsx'
import Features from '../components/Features.jsx'
import ProductsCatalog from '../components/ProductsCatalog.jsx'
import CTA from '../components/CTA.jsx'
import { productFeatures, serviceFeatures } from '../data.js'
import { useSeo } from '../lib/seo.js'

export default function ProductsPage() {
  useSeo({
    title: 'محصولات',
    description:
      'انواع چمن مصنوعی ورزشی، تزئینی، رنگی و فضای سبز با کیفیت بالا — فراز چمن',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <ProductsHero />
      <Features items={productFeatures} overlapClass="mt-0" />
      <ProductsCatalog />
      <CTA />
      <Features items={serviceFeatures} overlap={false} />
      <div className="h-8" />
    </>
  )
}
