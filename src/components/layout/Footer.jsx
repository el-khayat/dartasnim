import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Globe, Heart, Send, MessageCircle } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()
  const whatsappNumber = import.meta.env.VITE_STORE_WHATSAPP || '+213XXXXXXXXX'

  return (
    <footer style={{ backgroundColor: '#1A1A1A', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '64px 24px' }}>
        <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: '48px' }}>
          <div className="md:col-span-1">
            <Link to="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.875rem', fontWeight: 600, color: '#C9A84C', letterSpacing: '0.05em', textDecoration: 'none' }}>
              VELOUR
            </Link>
            <p style={{ marginTop: '16px', color: '#888880', fontSize: '0.875rem', lineHeight: 1.7 }}>
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.125rem', color: '#F5F5F0', marginBottom: '16px' }}>{t('footer.quick_links')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/" style={{ fontSize: '0.875rem', color: '#888880', textDecoration: 'none' }}>{t('nav.home')}</Link>
              <Link to="/shop" style={{ fontSize: '0.875rem', color: '#888880', textDecoration: 'none' }}>{t('nav.shop')}</Link>
              <Link to="/cart" style={{ fontSize: '0.875rem', color: '#888880', textDecoration: 'none' }}>{t('nav.cart')}</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.125rem', color: '#F5F5F0', marginBottom: '16px' }}>{t('footer.contact')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#888880', textDecoration: 'none' }}
              >
                <MessageCircle size={16} />
                {t('footer.whatsapp_us')}
              </a>
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.125rem', color: '#F5F5F0', marginBottom: '16px' }}>{t('footer.follow_us')}</h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[Globe, Heart, Send].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    border: '1px solid rgba(201,168,76,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#888880', textDecoration: 'none',
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '48px', paddingTop: '32px',
          borderTop: '1px solid rgba(201,168,76,0.15)',
          textAlign: 'center', color: '#888880', fontSize: '0.875rem',
        }}>
          © {new Date().getFullYear()} VELOUR. {t('footer.rights')}
        </div>
      </div>
    </footer>
  )
}
