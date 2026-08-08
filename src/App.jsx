import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Preloader from './components/Preloader.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import BackToTop from './components/BackToTop.jsx'
import Home from './pages/Home.jsx'

// صفحه‌ی خانه مستقیم لود می‌شود؛ بقیه‌ی صفحات فقط هنگام نیاز
// دانلود می‌شوند تا حجم بارگذاری اولیه کمتر شود.
const ProductsPage = lazy(() => import('./pages/ProductsPage.jsx'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage.jsx'))
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'))
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))

function AnimatedRoutes() {
  const location = useLocation()
  // بدون AnimatePresence و انیمیشن خروج: صفحه‌ی جدید بلافاصله سوار می‌شود و
  // فقط محو می‌شود. با mode="wait" تعویض محتوا به پایان انیمیشن خروج گره
  // می‌خورد و اگر آن انیمیشن به هر دلیلی کامل نشود، کاربر روی صفحه‌ی قبلی
  // گیر می‌کرد در حالی که آدرس عوض شده بود.
  //
  // کلید فقط با عوض شدن «بخش» سایت تغییر می‌کند، نه با هر آدرس. اگر کلید
  // برابر کل مسیر باشد، رفتن از یک دسته‌بندی به دسته‌بندی دیگر کل صفحه را
  // از نو می‌سازد و داده‌ها هر بار دوباره از وردپرس گرفته می‌شوند.
  const section = location.pathname.split('/')[1] || 'home'

  return (
    <motion.div
      key={section}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          {/* یک مسیر برای هر دو حالت «/products» و دسته‌بندی‌های تودرتو
              «/products/decorative-artificial-grass/residential/patio».
              اگر این دو، دو Route جدا باشند، جابجایی بینشان کامپوننت را
              از نو می‌سازد و هر بار داده‌ها دوباره از وردپرس گرفته می‌شوند. */}
          <Route path="/products/*" element={<ProductsPage />} />
          {/* صفحه‌ی اختصاصی هر محصول — مسیر مفرد تا با دسته‌بندی‌ها تداخل نکند */}
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* هر آدرس ناشناخته (مثلاً آیتمی از فهرست وردپرس که هنوز صفحه‌ای
              برایش ساخته نشده) به‌جای صفحه‌ی سفید، این صفحه را می‌بیند. */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </motion.div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Preloader />
      <ScrollProgress />
      <div className="min-h-screen overflow-x-hidden">
        <Navbar />
        <main>
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
      <BackToTop />
    </BrowserRouter>
  )
}
