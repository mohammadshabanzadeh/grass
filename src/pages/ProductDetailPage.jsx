import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Phone,
  Layers,
  BadgeCheck,
  PackageCheck,
  Hash,
  SearchX,
  Loader2,
} from 'lucide-react'
import SmartImage from '../components/SmartImage.jsx'
import ProductCard from '../components/ProductCard.jsx'
import CTA from '../components/CTA.jsx'
import { fetchProductBySlug, fetchProducts } from '../lib/wp.js'
import { useSeo, productSchema } from '../lib/seo.js'

const faDigits = '۰۱۲۳۴۵۶۷۸۹'
const toFa = (n) => String(n).replace(/\d/g, (d) => faDigits[d])

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | notfound | error
  const [active, setActive] = useState(0)

  // عنوان و متاهای صفحه از خودِ محصول ساخته می‌شوند
  useSeo({
    title: product?.title,
    description: product?.desc,
    image: product?.img,
    type: 'product',
    schema: productSchema(product),
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    let alive = true
    setStatus('loading')
    setActive(0)

    fetchProductBySlug(slug)
      .then((p) => {
        if (!alive) return
        if (!p) return setStatus('notfound')
        setProduct(p)
        setStatus('ready')
        // محصولات مرتبط: هم‌دسته با این محصول
        return fetchProducts().then((all) => {
          if (!alive) return
          const mine = new Set(p.categorySlugs)
          setRelated(
            all
              .filter((x) => x.id !== p.id && x.categorySlugs.some((s) => mine.has(s)))
              .slice(0, 4),
          )
        })
      })
      .catch(() => alive && setStatus((s) => (s === 'ready' ? s : 'error')))

    return () => {
      alive = false
    }
  }, [slug])

  if (status === 'loading') {
    return (
      <section className="container-x pt-4 sm:pt-5">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="h-[22rem] animate-pulse rounded-3xl bg-white/50" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded-xl bg-white/50" />
            <div className="h-4 w-1/3 animate-pulse rounded-lg bg-white/40" />
            <div className="h-28 animate-pulse rounded-2xl bg-white/40" />
            <div className="h-12 w-48 animate-pulse rounded-xl bg-white/40" />
          </div>
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin text-brand-500" />
          در حال دریافت اطلاعات محصول…
        </p>
      </section>
    )
  }

  if (status !== 'ready') {
    return (
      <section className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-4 text-center sm:pt-5">
        <SearchX size={44} className="text-brand-500" />
        <p className="text-lg font-bold text-slate-700">
          {status === 'notfound' ? 'این محصول پیدا نشد' : 'در دریافت اطلاعات محصول مشکلی پیش آمد'}
        </p>
        <Link
          to="/products"
          className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          بازگشت به محصولات
          <ArrowRight size={16} />
        </Link>
      </section>
    )
  }

  const gallery = product.images.length ? product.images : [null]
  const hasPrice = product.prices && Number(product.prices.price) > 0

  return (
    <>
      <section className="container-x pt-4 sm:pt-5">
        <Link
          to="/products"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:gap-2.5"
        >
          <ArrowRight size={16} />
          بازگشت به محصولات
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* ===== گالری تصاویر ===== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="glass overflow-hidden rounded-3xl p-2">
              <SmartImage
                key={active}
                src={gallery[active]}
                alt={product.title}
                className="h-72 w-full rounded-2xl sm:h-[26rem]"
                priority
              />
            </div>

            {gallery.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {gallery.map((src, i) => (
                  <button
                    key={src || i}
                    onClick={() => setActive(i)}
                    aria-label={`تصویر ${toFa(i + 1)}`}
                    className={`shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                      i === active
                        ? 'border-brand-600 shadow-md shadow-brand-600/25'
                        : 'border-white/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <SmartImage src={src} alt="" className="h-20 w-24" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ===== اطلاعات محصول ===== */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-right"
          >
            <h1 className="text-2xl font-extrabold leading-relaxed text-slate-800 sm:text-4xl">
              {product.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                  product.inStock
                    ? 'bg-grass-500/15 text-grass-600'
                    : 'bg-slate-200/70 text-slate-500'
                }`}
              >
                <PackageCheck size={14} />
                {product.inStock ? 'موجود در انبار' : 'ناموجود'}
              </span>
              {product.sku && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-600">
                  <Hash size={14} />
                  کد: {product.sku}
                </span>
              )}
              {hasPrice && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
                  {toFa(Number(product.prices.price).toLocaleString('en-US'))}{' '}
                  {product.prices.currency_symbol}
                </span>
              )}
            </div>

            {product.shortHtml && (
              <div
                className="mt-5 text-sm leading-8 text-slate-600 sm:text-base"
                dangerouslySetInnerHTML={{ __html: product.shortHtml }}
              />
            )}

            {/* مشخصات */}
            <div className="glass mt-6 rounded-2xl p-5">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-800">
                <BadgeCheck size={17} className="text-brand-600" />
                مشخصات محصول
              </h2>

              {product.attributes.length > 0 ? (
                <ul className="space-y-3">
                  {product.attributes.map((a) => (
                    <li
                      key={a.name}
                      className="flex items-start justify-between gap-3 border-b border-white/60 pb-2.5 last:border-0 last:pb-0"
                    >
                      <span className="text-sm font-bold text-slate-700">
                        {a.values.join('، ')}
                      </span>
                      <span className="shrink-0 text-sm text-slate-500">{a.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-7 text-slate-500">
                  برای دریافت مشخصات فنی دقیق (ارتفاع الیاف، تراکم، نوع نخ و ضمانت) با
                  کارشناسان ما تماس بگیرید.
                </p>
              )}

              {product.categories.length > 0 && (
                <div className="mt-4 border-t border-white/60 pt-4">
                  <p className="mb-2.5 flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Layers size={14} className="text-brand-600" />
                    مناسب برای
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((c) => (
                      <Link
                        key={c.id}
                        to={`/products/${c.slug}`}
                        className="rounded-lg bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-brand-600 hover:text-white"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-700"
              >
                <Phone size={17} />
                استعلام قیمت و مشاوره
              </Link>
            </div>
          </motion.div>
        </div>

        {/* توضیحات کامل */}
        {product.descHtml && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="glass mt-10 rounded-3xl p-6 text-right leading-8 text-slate-700 sm:p-8 [&_p]:mb-4"
            dangerouslySetInnerHTML={{ __html: product.descHtml }}
          />
        )}
      </section>

      {/* محصولات مرتبط */}
      {related.length > 0 && (
        <section className="container-x py-14">
          <h2 className="mb-8 text-right text-xl font-extrabold text-slate-800 sm:text-2xl">
            محصولات مشابه
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} linkText="مشاهده محصول" />
            ))}
          </div>
        </section>
      )}

      <CTA
        line1="برای انتخاب بهترین چمن متناسب با فضای شما"
        line2="با کارشناسان ما در تماس باشید."
      />
      <div className="h-8" />
    </>
  )
}
