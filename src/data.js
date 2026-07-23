// محتوای ثابت — بدون بک‌اند

// محصولات صفحه خانه (۴ مورد)
export const products = [
  {
    id: 'decor',
    title: 'چمن مصنوعی دکوراتیو',
    desc: 'مناسب برای روف گاردن، بالکن و دکوراسیون داخلی',
    icon: 'decor',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#1f2937 0%,#334155 45%,#3ea63e 120%)',
  },
  {
    id: 'kids',
    title: 'چمن مصنوعی کودک',
    desc: 'ایمن، نرم و مناسب برای فضاهای بازی کودکان',
    icon: 'kids',
    img: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#f97316 0%,#22c55e 60%,#15803d 120%)',
  },
  {
    id: 'green',
    title: 'چمن مصنوعی فضای سبز',
    desc: 'مناسب برای باغ، ویلا، تراس و محوطه‌سازی',
    icon: 'green',
    img: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#4ade80 0%,#16a34a 55%,#14532d 120%)',
  },
  {
    id: 'sport',
    title: 'چمن مصنوعی ورزشی',
    desc: 'مناسب برای زمین‌های فوتبال، چند منظوره و باشگاه‌ها',
    icon: 'sport',
    img: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#16a34a 0%,#15803d 55%,#052e16 120%)',
  },
]

// همه‌ی محصولات (صفحه محصولات)
export const allProducts = [
  {
    id: 'sport',
    title: 'چمن مصنوعی ورزشی',
    desc: 'مناسب برای زمین‌های فوتبال، چند منظوره و باشگاه‌ها',
    icon: 'sport',
    category: 'sport',
    fiber: 'مونو فیلامنت',
    density: 'خیلی زیاد',
    color: '#15803d',
    height: 50,
    img: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#16a34a 0%,#15803d 55%,#052e16 120%)',
  },
  {
    id: 'green',
    title: 'چمن مصنوعی فضای سبز',
    desc: 'مناسب برای پارک، باغ، ویلا و محوطه‌سازی',
    icon: 'green',
    category: 'green',
    fiber: 'مونو+فیبریله',
    density: 'زیاد',
    color: '#5bb85b',
    height: 40,
    img: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#4ade80 0%,#16a34a 55%,#14532d 120%)',
  },
  {
    id: 'kids',
    title: 'چمن مصنوعی کودک',
    desc: 'ایمن، نرم و مناسب برای فضاهای بازی کودکان',
    icon: 'kids',
    category: 'kids',
    fiber: 'فیبریله',
    density: 'متوسط',
    color: '#84cc16',
    height: 30,
    img: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#f97316 0%,#22c55e 60%,#15803d 120%)',
  },
  {
    id: 'decor',
    title: 'چمن مصنوعی دکوراتیو',
    desc: 'مناسب بالکن، روف گاردن و دکوراسیون داخلی',
    icon: 'decor',
    category: 'decor',
    fiber: 'مونو فیلامنت',
    density: 'متوسط',
    color: '#5bb85b',
    height: 25,
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#1f2937 0%,#334155 45%,#3ea63e 120%)',
  },
  {
    id: 'balcony',
    title: 'چمن مصنوعی بالکن',
    desc: 'نصب آسان و سریع، مناسب فضاهای کوچک',
    icon: 'balcony',
    category: 'balcony',
    fiber: 'فیبریله',
    density: 'کم',
    color: '#84cc16',
    height: 20,
    img: 'https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#22c55e 0%,#15803d 60%,#064e3b 120%)',
  },
  {
    id: 'roof',
    title: 'چمن مصنوعی روف گاردن',
    desc: 'مقاوم در برابر نور خورشید و شرایط آب و هوایی',
    icon: 'roof',
    category: 'roof',
    fiber: 'مونو+فیبریله',
    density: 'زیاد',
    color: '#15803d',
    height: 35,
    img: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#4ade80 0%,#16a34a 55%,#14532d 120%)',
  },
  {
    id: 'terrace',
    title: 'چمن مصنوعی تراس',
    desc: 'طراحی زیبا و طبیعی برای تراس و پشت‌بام',
    icon: 'terrace',
    category: 'balcony',
    fiber: 'مونو فیلامنت',
    density: 'متوسط',
    color: '#5bb85b',
    height: 30,
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#334155,#0f172a 70%,#16a34a)',
  },
  {
    id: 'rooftop',
    title: 'چمن مصنوعی پشت بام',
    desc: 'عایق حرارت و صدا با ماندگاری بالا',
    icon: 'rooftop',
    category: 'roof',
    fiber: 'مونو+فیبریله',
    density: 'زیاد',
    color: '#8a6d3b',
    height: 40,
    img: 'https://images.unsplash.com/photo-1568901839119-631418a3910d?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#16a34a,#052e16 70%,#166534)',
  },
]

// فیلترها
export const categories = [
  { key: 'all', label: 'همه دسته بندی ها' },
  { key: 'sport', label: 'چمن مصنوعی ورزشی' },
  { key: 'green', label: 'چمن مصنوعی فضای سبز' },
  { key: 'kids', label: 'چمن مصنوعی کودک' },
  { key: 'decor', label: 'چمن مصنوعی دکوراتیو' },
  { key: 'balcony', label: 'چمن مصنوعی بالکن و تراس' },
  { key: 'roof', label: 'چمن مصنوعی روف گاردن' },
]

export const fiberTypes = ['مونو فیلامنت', 'فیبریله', 'مونو+فیبریله']
export const densities = ['کم', 'متوسط', 'زیاد', 'خیلی زیاد']
export const swatchColors = [
  { name: 'سبز روشن', hex: '#5bb85b' },
  { name: 'لایم', hex: '#84cc16' },
  { name: 'سبز تیره', hex: '#15803d' },
  { name: 'خاکی', hex: '#8a6d3b' },
]

export const sortOptions = ['جدیدترین', 'محبوب‌ترین', 'ارزان‌ترین', 'گران‌ترین']

// نوارهای ویژگی
export const features = [
  { title: 'ضمانت کیفیت', desc: 'تا ۸ سال', icon: 'badge-check' },
  { title: 'نصب حرفه‌ای', desc: 'توسط تیم متخصص', icon: 'hard-hat' },
  { title: 'متریال با کیفیت', desc: 'ضمانت اصالت کالا', icon: 'shield-check' },
  { title: 'قیمت مناسب', desc: 'بهترین قیمت بازار', icon: 'tag' },
]

export const productFeatures = [
  { title: 'ضمانت کیفیت', desc: 'تا ۸ سال', icon: 'shield-check' },
  { title: 'مشاوره حرفه‌ای', desc: 'انتخاب تیم متخصص', icon: 'ruler' },
  { title: 'مشاوره تخصصی', desc: 'انتخاب بهترین گزینه', icon: 'headset' },
  { title: 'ارسال سریع', desc: 'به سراسر کشور', icon: 'truck' },
]

export const serviceFeatures = [
  { title: 'پشتیبانی ۲۴/۷', desc: 'پاسخگوی شما هستیم', icon: 'headphones' },
  { title: 'نصب تخصصی', desc: 'توسط تیم مجرب', icon: 'wrench' },
  { title: 'قیمت مناسب', desc: 'بهترین قیمت بازار', icon: 'tag' },
  { title: 'بالاترین کیفیت', desc: 'استفاده از بهترین متریال', icon: 'shield-check' },
]

export const stats = [
  { value: '+۸', suffix: ' سال', label: 'سابقه و تجربه', icon: 'award' },
  { value: '+۵۰۰', suffix: '', label: 'پروژه موفق', icon: 'briefcase' },
  { value: '۱۰۰٪', suffix: '', label: 'رضایت مشتریان', icon: 'smile' },
  { value: '۸', suffix: ' سال', label: 'ضمانت کیفیت', icon: 'shield' },
]

export const projects = [
  {
    title: 'تراس سبز',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=700&q=70',
    gradient: 'linear-gradient(135deg,#334155,#0f172a 70%,#16a34a)',
  },
  {
    title: 'محوطه‌سازی ویلا',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=70',
    gradient: 'linear-gradient(135deg,#64748b,#1e293b 70%,#22c55e)',
  },
  {
    title: 'فضای اجرا شده',
    img: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=700&q=70',
    gradient: 'linear-gradient(135deg,#38bdf8,#0ea5e9 60%,#16a34a)',
  },
  {
    title: 'فضای بازی کودکان',
    img: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=700&q=70',
    gradient: 'linear-gradient(135deg,#fb923c,#22c55e 70%,#15803d)',
  },
  {
    title: 'زمین فوتبال چمن مصنوعی',
    img: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=700&q=70',
    gradient: 'linear-gradient(135deg,#16a34a,#052e16 70%,#166534)',
  },
]

// لینک‌های منو
export const navLinks = [
  { label: 'صفحه اصلی', type: 'route', to: '/', match: '/' },
  { label: 'محصولات', type: 'route', to: '/products', match: '/products', dropdown: true },
  { label: 'پروژه‌ها', type: 'hash', id: 'projects' },
  { label: 'خدمات', type: 'hash', id: 'features' },
  { label: 'درباره ما', type: 'hash', id: 'about' },
  { label: 'تماس با ما', type: 'hash', id: 'contact' },
]
