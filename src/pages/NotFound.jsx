import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <>
      <Helmet><title>404 — VELOUR</title></Helmet>

      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center' }}
        >
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '10rem', color: 'rgba(201,168,76,0.2)', lineHeight: 1, marginBottom: '16px' }}>
            404
          </h1>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#F5F5F0', marginBottom: '16px' }}>
            {t('not_found.title')}
          </h2>
          <p style={{ color: '#888880', marginBottom: '32px', maxWidth: '28rem', margin: '0 auto 32px' }}>
            {t('not_found.subtitle')}
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 36px', backgroundColor: '#C9A84C', color: '#0D0D0D',
              fontWeight: 500, borderRadius: '10px', textDecoration: 'none',
              fontSize: '0.8125rem', letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >
            <Home size={18} />
            {t('not_found.back_home')}
          </Link>
        </motion.div>
      </div>
    </>
  )
}
