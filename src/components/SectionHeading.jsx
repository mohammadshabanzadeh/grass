import { motion } from 'framer-motion'

export default function SectionHeading({ eyebrow, title, highlight, light = false }) {
  return (
    <div className="text-center">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`text-sm font-bold ${light ? 'text-brand-200' : 'text-brand-600'}`}
      >
        {eyebrow}
      </motion.p>
      <motion.h3
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.05 }}
        className={`relative mt-2 inline-block text-2xl font-extrabold sm:text-3xl md:text-4xl ${
          light ? 'text-white' : 'text-slate-800'
        }`}
      >
        {title}{' '}
        {highlight && <span className={light ? 'text-brand-200' : 'text-brand-600'}>{highlight}</span>}
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`absolute -bottom-2 right-1/2 h-1 w-24 origin-right translate-x-1/2 rounded-full ${
            light ? 'bg-brand-200' : 'bg-brand-600'
          }`}
        />
      </motion.h3>
    </div>
  )
}
