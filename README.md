# فراز چمن 🌿

وب‌سایت **فروش و نصب چمن مصنوعی** — ساخته‌شده با React + Vite + Tailwind CSS، کاملاً راست‌چین (RTL)، ریسپانسیو، با المان‌های شیشه‌ای (glassmorphism) و انیمیشن‌های نرم (Framer Motion).

🔗 **نسخه آنلاین:** https://mohammadshabanzadeh.github.io/grass/

## امکانات

- **صفحه‌ی خانه:** هیرو، نوار ویژگی‌ها، محصولات، آمار، نمونه‌کارها، CTA و فوتر
- **صفحه‌ی محصولات:** فیلتر شیشه‌ای (دسته‌بندی، ارتفاع، نوع الیاف، رنگ، تراکم)، مرتب‌سازی، نمای گرید/لیست و صفحه‌بندی — همراه با انیمیشن فیلترینگ زنده

## راه‌اندازی محلی

```bash
npm install
npm run dev
```

سپس آدرس http://localhost:5173 را باز کنید.

## بیلد نهایی

```bash
npm run build
npm run preview
```

انتشار آنلاین به‌صورت خودکار توسط **GitHub Actions** روی **GitHub Pages** انجام می‌شود (هر push روی شاخه‌ی `main`).

## ساختار

```
src/
  components/   Navbar, Hero, Features, Products, ProductCard,
                ProductsHero, ProductsCatalog, Stats, Projects,
                CTA, Footer, SmartImage, SectionHeading, Logo
  pages/        Home.jsx, ProductsPage.jsx
  data.js       محتوای ثابت
  App.jsx / main.jsx / index.css
```

> تصاویر از Unsplash بارگذاری می‌شوند؛ در نبود اینترنت، گرادیانت‌های تم‌دار جایگزین می‌شوند و صفحه هرگز خراب نمی‌شود. بک‌اندی وجود ندارد.
