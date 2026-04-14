import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { CheckCircle, Home, ShoppingBag } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

export default function OrderSuccess() {
  const { t } = useTranslation()

  return (
    <>
      <Helmet><title>{t('order_success.title')} — VELOUR</title></Helmet>

      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', maxWidth: '28rem' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle size={100} strokeWidth={1.5} style={{ color: '#C9A84C', margin: '0 auto 32px' }} />
          </motion.div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: '#F5F5F0', marginBottom: '16px' }}>
            {t('order_success.title')}
          </h1>
          <p style={{ color: '#888880', fontSize: '1.0625rem', marginBottom: '40px', lineHeight: 1.6 }}>
            {t('order_success.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row" style={{ alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <Link
              to="/"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px', backgroundColor: '#C9A84C', color: '#0D0D0D',
                fontWeight: 500, borderRadius: '10px', textDecoration: 'none',
                fontSize: '0.875rem',
              }}
            >
              <Home size={18} />
              {t('order_success.back_home')}
            </Link>
            <Link
              to="/shop"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px',
                border: '1px solid rgba(201,168,76,0.2)', color: '#F5F5F0',
                fontWeight: 500, borderRadius: '10px', textDecoration: 'none',
                fontSize: '0.875rem',
              }}
            >
              <ShoppingBag size={18} />
              {t('order_success.continue_shopping')}
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  )
}
