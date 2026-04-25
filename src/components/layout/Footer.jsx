import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import logoNav from '../../assets/logo_nav_64.png'

export default function Footer() {
  const { t } = useTranslation()
  const whatsappNumber = import.meta.env.VITE_STORE_WHATSAPP || '212666865774'

  return (
    <footer style={{ backgroundColor: '#1A1A1A', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '64px 24px' }}>
        <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: '48px' }}>
          <div className="md:col-span-1">
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <img src={logoNav} alt="Dar Tasnim" style={{ height: '52px', width: 'auto' }} />
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
              {/* Instagram */}
              <a
                href="https://www.instagram.com/dar_tasnim_parfume/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888880', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'; e.currentTarget.style.color = '#C9A84C' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; e.currentTarget.style.color = '#888880' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@dar.tasnim.parfum"
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888880', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'; e.currentTarget.style.color = '#C9A84C' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; e.currentTarget.style.color = '#888880' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.83 1.56V6.78a4.85 4.85 0 0 1-1.06-.09z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a
                href="https://wa.me/212666865774"
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888880', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'; e.currentTarget.style.color = '#C9A84C' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; e.currentTarget.style.color = '#888880' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '48px', paddingTop: '32px',
          borderTop: '1px solid rgba(201,168,76,0.15)',
          textAlign: 'center', color: '#888880', fontSize: '0.875rem',
        }}>
          © {new Date().getFullYear()} Dar Tasnim. {t('footer.rights')}
        </div>
      </div>
    </footer>
  )
}
