import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Breadcrumbs from './components/Breadcrumbs.jsx'

// صفحات این‌جا مستقیم (و نه با lazy) وارد می‌شوند: renderToString نمی‌تواند
// Suspense را منتظر بماند و در نتیجه خروجی همان fallback خالی می‌شد.
import Home from './pages/Home.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import ProjectDetailPage from './pages/ProjectDetailPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

/**
 * همان چیدمان App، ولی بدون Preloader و انیمیشن‌ها.
 * Preloader یک لایه‌ی تمام‌صفحه است و اگر در HTML ثابت بیاید، تنها چیزی
 * می‌شود که خزنده‌ی گوگل می‌بیند.
 */
function Shell() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Breadcrumbs />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/*" element={<ProductsPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

/** یک مسیر را به HTML تبدیل می‌کند. */
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <Shell />
    </StaticRouter>,
  )
}
