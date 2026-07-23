import { useState } from 'react'

/**
 * تصویر با fallback گرادیانتی.
 * گرادیانت همیشه دیده می‌شود (حتی آفلاین) و عکس واقعی با fade روی آن ظاهر می‌شود.
 */
export default function SmartImage({ src, alt = '', gradient, className = '', imgClassName = '' }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
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
          alt={alt}
          loading="lazy"
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
