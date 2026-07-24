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

// ===== صفحه پروژه‌ها =====
export const projectStats = [
  { value: '+۱۲۰', label: 'پروژه اجرا شده', icon: 'check' },
  { value: '+۸۰,۰۰۰', label: 'متر مربع اجرا', icon: 'area' },
  { value: '+۸', label: 'سال تجربه', icon: 'award' },
]

export const projectCategories = [
  { key: 'all', label: 'همه دسته بندی ها' },
  { key: 'sport', label: 'زمین ورزشی' },
  { key: 'roof', label: 'روف گاردن' },
  { key: 'kids', label: 'فضای بازی کودکان' },
  { key: 'villa', label: 'محوطه سازی ویلا' },
  { key: 'terrace', label: 'تراس و بالکن' },
  { key: 'office', label: 'فضای اداری و تجاری' },
  { key: 'park', label: 'پارک و فضای عمومی' },
]

export const usageTypes = [
  { key: 'all', label: 'همه کاربری ها' },
  { key: 'residential', label: 'مسکونی' },
  { key: 'commercial', label: 'تجاری' },
  { key: 'office', label: 'اداری' },
  { key: 'public', label: 'عمومی' },
  { key: 'sport', label: 'ورزشی' },
]

export const cities = ['همه شهرها', 'تهران', 'کرج و البرز', 'مشهد', 'شیراز']

export const projectSortOptions = [
  'جدیدترین پروژه ها',
  'قدیمی‌ترین',
  'بزرگ‌ترین متراژ',
  'کوچک‌ترین متراژ',
]

export const allProjects = [
  {
    id: 'p1',
    title: 'زمین فوتبال ۵۰۰ نفری',
    city: 'تهران، شهرک صنعتی شهاب',
    cityKey: 'تهران',
    category: 'sport',
    usage: 'sport',
    badge: 'زمین ورزشی',
    area: 5000,
    img: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#16a34a 0%,#15803d 55%,#052e16 120%)',
  },
  {
    id: 'p2',
    title: 'روف گاردن مجتمع ستاره',
    city: 'تهران، نیاوران',
    cityKey: 'تهران',
    category: 'roof',
    usage: 'residential',
    badge: 'روف گاردن',
    area: 800,
    img: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#4ade80 0%,#16a34a 55%,#14532d 120%)',
  },
  {
    id: 'p3',
    title: 'محوطه سازی ویلا در کردان',
    city: 'البرز، کردان',
    cityKey: 'کرج و البرز',
    category: 'villa',
    usage: 'residential',
    badge: 'محوطه ویلا',
    area: 1200,
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#64748b,#1e293b 70%,#22c55e)',
  },
  {
    id: 'p4',
    title: 'فضای بازی کودکان',
    city: 'مشهد، شهرک غرب',
    cityKey: 'مشهد',
    category: 'kids',
    usage: 'public',
    badge: 'فضای بازی کودکان',
    area: 600,
    img: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#f97316 0%,#22c55e 60%,#15803d 120%)',
  },
  {
    id: 'p5',
    title: 'تراس سبز برج آسمان',
    city: 'تهران، سعادت آباد',
    cityKey: 'تهران',
    category: 'terrace',
    usage: 'residential',
    badge: 'تراس و بالکن',
    area: 400,
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#334155,#0f172a 70%,#16a34a)',
  },
  {
    id: 'p6',
    title: 'فضای اداری شرکت رایان',
    city: 'تهران، ونک',
    cityKey: 'تهران',
    category: 'office',
    usage: 'office',
    badge: 'فضای اداری',
    area: 900,
    img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#1f2937 0%,#334155 45%,#3ea63e 120%)',
  },
  {
    id: 'p7',
    title: 'پارک و پردیسان',
    city: 'شیراز، پردیسان',
    cityKey: 'شیراز',
    category: 'park',
    usage: 'public',
    badge: 'پارک و فضای عمومی',
    area: 3000,
    img: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#38bdf8,#0ea5e9 60%,#16a34a)',
  },
  {
    id: 'p8',
    title: 'زمین فوتسال باشگاه انقلاب',
    city: 'تهران، انقلاب',
    cityKey: 'تهران',
    category: 'sport',
    usage: 'sport',
    badge: 'زمین ورزشی',
    area: 1000,
    img: 'https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#22c55e 0%,#15803d 60%,#064e3b 120%)',
  },
  {
    id: 'p9',
    title: 'محوطه تجاری پاساژ الماس',
    city: 'کرج، عظیمیه',
    cityKey: 'کرج و البرز',
    category: 'office',
    usage: 'commercial',
    badge: 'محوطه تجاری',
    area: 2000,
    img: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=70',
    gradient: 'linear-gradient(135deg,#38bdf8,#0ea5e9 55%,#15803d 120%)',
  },
]

// ===== صفحه خدمات =====
export const services = [
  {
    title: 'فروش چمن مصنوعی',
    desc: 'عرضه‌ی انواع چمن مصنوعی دکوراتیو، ورزشی و فضای سبز با ضمانت اصالت کالا.',
    icon: 'store',
    gradient: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
  },
  {
    title: 'نصب حرفه‌ای',
    desc: 'اجرای دقیق و اصولی توسط تیم متخصص با تضمین کیفیت و ماندگاری.',
    icon: 'hardhat',
    gradient: 'linear-gradient(135deg,#3ea63e,#15803d)',
  },
  {
    title: 'زیرسازی و آماده‌سازی',
    desc: 'آماده‌سازی کامل بستر، زهکشی و تسطیح اصولی پیش از نصب چمن.',
    icon: 'layers',
    gradient: 'linear-gradient(135deg,#6096fa,#2563eb)',
  },
  {
    title: 'مشاوره و طراحی',
    desc: 'طراحی و انتخاب بهترین متریال متناسب با فضا و کاربری شما.',
    icon: 'ruler',
    gradient: 'linear-gradient(135deg,#22c55e,#0e7a3a)',
  },
  {
    title: 'نگهداری و ترمیم',
    desc: 'خدمات دوره‌ای شست‌وشو، برس‌کشی و ترمیم برای حفظ زیبایی چمن.',
    icon: 'refresh',
    gradient: 'linear-gradient(135deg,#1d4ed8,#4338ca)',
  },
  {
    title: 'ضمانت و پشتیبانی',
    desc: 'تا ۸ سال ضمانت کیفیت و پشتیبانی سریع پس از فروش در سراسر کشور.',
    icon: 'shield',
    gradient: 'linear-gradient(135deg,#16a34a,#166534)',
  },
]

export const processSteps = [
  {
    title: 'مشاوره و بازدید',
    desc: 'کارشناسان ما فضای شما را بررسی و بهترین راهکار را پیشنهاد می‌دهند.',
    icon: 'phone',
  },
  {
    title: 'طراحی و انتخاب متریال',
    desc: 'طرح نهایی و نوع چمن متناسب با کاربری فضا انتخاب می‌شود.',
    icon: 'ruler',
  },
  {
    title: 'زیرسازی و نصب',
    desc: 'بستر آماده و چمن با دقت و کیفیت بالا توسط تیم اجرا نصب می‌شود.',
    icon: 'hardhat',
  },
  {
    title: 'تحویل و پشتیبانی',
    desc: 'پروژه تحویل داده شده و تحت ضمانت و پشتیبانی قرار می‌گیرد.',
    icon: 'check',
  },
]

export const servicePackages = [
  {
    name: 'پایه',
    tagline: 'مناسب بالکن و فضاهای کوچک',
    featured: false,
    features: ['مشاوره تلفنی', 'چمن دکوراتیو استاندارد', 'نصب استاندارد', '۲ سال ضمانت'],
  },
  {
    name: 'حرفه‌ای',
    tagline: 'محبوب‌ترین انتخاب برای ویلا و حیاط',
    featured: true,
    features: [
      'مشاوره حضوری و بازدید رایگان',
      'متریال درجه یک',
      'زیرسازی کامل',
      'نصب حرفه‌ای',
      '۵ سال ضمانت',
      'پشتیبانی دوره‌ای',
    ],
  },
  {
    name: 'ویژه',
    tagline: 'پروژه‌های بزرگ و ورزشی',
    featured: false,
    features: [
      'طراحی اختصاصی',
      'متریال ورزشی وارداتی',
      'زیرسازی و زهکشی پیشرفته',
      'اجرای تیمی',
      '۸ سال ضمانت',
      'نگهداری سالانه رایگان',
    ],
  },
]

export const faqs = [
  {
    q: 'عمر مفید چمن مصنوعی چقدر است؟',
    a: 'با نگهداری صحیح، چمن مصنوعی باکیفیت بین ۸ تا ۱۰ سال دوام دارد و ظاهر خود را حفظ می‌کند.',
  },
  {
    q: 'آیا چمن مصنوعی برای کودکان و حیوانات خانگی بی‌خطر است؟',
    a: 'بله، متریال مورد استفاده‌ی ما ضدحساسیت، غیرسمی و کاملاً ایمن برای بازی کودکان و حیوانات خانگی است.',
  },
  {
    q: 'نصب چمن چقدر زمان می‌برد؟',
    a: 'بسته به متراژ و نوع زیرسازی، اجرای پروژه معمولاً بین ۱ تا ۳ روز کاری زمان می‌برد.',
  },
  {
    q: 'آیا امکان نصب روی پشت‌بام و بالکن وجود دارد؟',
    a: 'بله، با زیرسازی مناسب، چمن مصنوعی روی تقریباً هر سطحی از جمله پشت‌بام، بالکن و بتن قابل اجراست.',
  },
  {
    q: 'هزینه‌ی خدمات چگونه محاسبه می‌شود؟',
    a: 'هزینه بر اساس متراژ، نوع چمن و نوع زیرسازی محاسبه و پس از بازدید رایگان به‌صورت شفاف اعلام می‌شود.',
  },
  {
    q: 'آیا خدمات شامل ضمانت می‌شود؟',
    a: 'بله، تمام پروژه‌های ما تا ۸ سال ضمانت کیفیت و خدمات پشتیبانی پس از فروش دارند.',
  },
]

// ===== صفحه درباره ما =====
export const aboutInfo = [
  { label: 'تاسیس', value: '۱۳۹۶', icon: 'calendar' },
  { label: 'موقعیت', value: 'البرز، کرج', icon: 'pin' },
  { label: 'حوزه فعالیت', value: 'فروش و نصب چمن مصنوعی', icon: 'grid' },
  { label: 'ماموریت ما', value: 'ارائه بهترین کیفیت با قیمت مناسب و خدمات حرفه‌ای', icon: 'target' },
]

export const aboutStats = [
  { icon: 'pin', value: 'سراسر کشور', label: 'پروژه‌های اجرا شده' },
  { icon: 'smile', value: '+۲۰۰۰ مشتری', label: 'رضایتمند' },
  { icon: 'briefcase', value: '+۵۰۰ پروژه', label: 'اجرای موفق' },
  { icon: 'users', value: '+۸ سال', label: 'تجربه درخشان' },
]

export const aboutValues = [
  {
    title: 'کیفیت برتر',
    desc: 'استفاده از بهترین متریال و برندهای معتبر برای تضمین کیفیت و دوام محصولات.',
    icon: 'shield',
  },
  {
    title: 'تیم متخصص',
    desc: 'تیم حرفه‌ای و مجرب در تمام مراحل، از مشاوره تا اجرا، همراه شماست.',
    icon: 'users',
  },
  {
    title: 'اجرای استاندارد',
    desc: 'اجرای دقیق و اصولی با رعایت استانداردهای روز و جزئیات فنی پروژه.',
    icon: 'medal',
  },
  {
    title: 'خدمات پس از فروش',
    desc: 'پشتیبانی و خدمات پس از فروش حرفه‌ای برای اطمینان خاطر شما.',
    icon: 'headset',
  },
  {
    title: 'قیمت منصفانه',
    desc: 'ارائه بهترین کیفیت با مناسب‌ترین قیمت و شفافیت کامل در قیمت‌گذاری.',
    icon: 'tag',
  },
]

export const workingHours = [
  { day: 'شنبه تا چهارشنبه', time: '۸:۰۰ تا ۱۷:۰۰' },
  { day: 'پنجشنبه', time: '۸:۰۰ تا ۱۳:۰۰' },
]

// ===== صفحه تماس با ما =====
export const contactAddress = 'کرج - بلوار یادگار امام شمال - نبش بلال ۷ - مجتمع نور هشتم'
export const contactPostal = '۱۴۵۸۴۶۵۳۴۷۱'
// مختصات: 35°49'23.3"N 50°57'50.5"E
export const contactMapSrc =
  'https://maps.google.com/maps?q=35.823139,50.964028&z=17&hl=fa&output=embed'

export const contactCards = [
  { icon: 'phone', label: 'تلفن تماس', value: '۰۹۱۲ ۳۳۶ ۵۴۳۰', href: 'tel:09123365430' },
  { icon: 'whatsapp', label: 'واتساپ', value: '۰۹۱۲ ۳۳۶ ۵۴۳۰', href: 'https://wa.me/989123365430' },
  { icon: 'mail', label: 'ایمیل', value: 'info@farazchaman.ir', href: 'mailto:info@farazchaman.ir' },
  { icon: 'clock', label: 'ساعات کاری', value: 'شنبه تا پنجشنبه', sub: '۸:۰۰ الی ۱۷:۰۰' },
]

// لینک‌های منو
export const navLinks = [
  { label: 'صفحه اصلی', type: 'route', to: '/', match: '/' },
  { label: 'محصولات', type: 'route', to: '/products', match: '/products', dropdown: true },
  { label: 'پروژه‌ها', type: 'route', to: '/projects', match: '/projects' },
  { label: 'خدمات', type: 'route', to: '/services', match: '/services' },
  { label: 'درباره ما', type: 'route', to: '/about', match: '/about' },
  { label: 'تماس با ما', type: 'route', to: '/contact', match: '/contact' },
]
