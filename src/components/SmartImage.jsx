import { useState } from 'react'

/**
 * تصویر با fallback گرادیانتی.
 * گرادیانت همیشه دیده می‌شود (حتی آفلاین) و عکس واقعی با fade روی آن ظاهر می‌شود.
 */
export default function SmartImage({
  src,
  alt = '',
  gradient,
  className = '',
  imgClassName = '',
  priority = false, // برای تصاویر بالای صفحه (هیرو) تا زودتر لود شوند
  responsive = false, // نسخه‌های ۴۰۰ و ۸۰۰ پیکسلی هم موجود است
  sizes = '100vw', // عرض نمایش تصویر تا مرورگر مناسب‌ترین نسخه را بگیرد
  srcSet: srcSetProp, // srcset آماده (مثلاً همان که وردپرس می‌دهد)
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  // srcset یا از بیرون می‌آید (تصاویر وردپرس) یا برای تصاویر محلیِ هیرو
  // ساخته می‌شود. در هر دو حالت مرورگر سبک‌ترین نسخه‌ی کافی را می‌گیرد.
  const srcSet =
    srcSetProp ||
    (responsive && src?.startsWith('/') && src.endsWith('.jpg')
      ? [400, 800]
          .map((w) => `${src.replace(/\.jpg$/, `-${w}.jpg`)} ${w}w`)
          .concat(`${src} 1600w`)
          .join(', ')
      : undefined)

  // اگر className خودش یک کلاس موقعیت (absolute/fixed/sticky) بدهد، «relative»
  // پیش‌فرض را اضافه نمی‌کنیم چون در Tailwind هر دو روی یک المان تداخل پیدا کرده
  // و relative برنده می‌شود؛ همین باعث می‌شد تصویر با ارتفاع صفر رندر شود.
  const hasOwnPosition = /\b(absolute|fixed|sticky|static)\b/.test(className)

  return (
    <div className={`${hasOwnPosition ? '' : 'relative'} overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{ background: gradient || 'linear-gradient(135deg,#16a34a,#15803d)' }}
      />
      {/* بافت ظریف چمن روی گرادیانت */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, rgba(255,255,255,.18) 0 2px, transparent 2px 6px)',
        }}
      />
      {src && !failed && (
        <img
          src={src}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : undefined}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
    </div>
  )
}
