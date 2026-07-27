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

function AnimatedRoutes() {
  const location = useLocation()
  // بدون AnimatePresence و انیمیشن خروج: صفحه‌ی جدید بلافاصله سوار می‌شود و
  // فقط محو می‌شود. با mode="wait" تعویض محتوا به پایان انیمیشن خروج گره
  // می‌خورد و اگر آن انیمیشن به هر دلیلی کامل نشود، کاربر روی صفحه‌ی قبلی
  // گیر می‌کرد در حالی که آدرس عوض شده بود.
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
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
