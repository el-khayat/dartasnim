import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PackageOpen } from 'lucide-react'
import ProductCard from './ProductCard'

export default function ProductGrid({ products }) {
  const { t } = useTranslation()

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}
      >
        <PackageOpen size={64} style={{ color: '#888880', marginBottom: '16px' }} />
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#F5F5F0', marginBottom: '8px' }}>{t('shop.no_results')}</h3>
        <p style={{ color: '#888880' }}>{t('shop.no_results_subtitle')}</p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" style={{ gap: '24px' }}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}
