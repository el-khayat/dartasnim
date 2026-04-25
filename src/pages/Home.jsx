import { useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import logoTransparent from '../assets/logo_dar_tasnim_transparent.png'
import { useTranslation } from 'react-i18next'
import { motion, useInView } from 'framer-motion'
import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import useProductStore from '../store/useProductStore'
import ProductCard from '../components/product/ProductCard'

function AnimatedSection({ children, style = {} }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const { t } = useTranslation()
  const products = useProductStore(s => s.products)
  const bestsellers = useMemo(() => products.filter(p => p.is_bestseller), [products])
  const [email, setEmail] = useState('')
  const scrollContainerRef = useRef(null)

  const categories = [
    { key: 'men', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=800&fit=crop', link: '/shop?category=men' },
    { key: 'women', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop', link: '/shop?category=women' },
    { key: 'unisex', image: 'https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=600&h=800&fit=crop', link: '/shop?category=unisex' },
    { key: 'oud', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=800&fit=crop', link: '/shop?category=oud' },
  ]

  const scrollCarousel = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleNewsletter = (e) => {
    e.preventDefault()
    toast.success(t('newsletter.success'), {
      style: {
        background: '#1E1E1E',
        color: '#F5F5F0',
        border: '1px solid rgba(201,168,76,0.3)',
      },
      iconTheme: { primary: '#C9A84C', secondary: '#1E1E1E' },
    })
    setEmail('')
  }

  return (
    <>
      <Helmet>
        <title>VELOUR — The Art of Fragrance</title>
        <meta name="description" content="Discover our curated collection of the world's finest perfumes." />
      </Helmet>

      {/* Hero */}
      <section style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', height: '100vh', minHeight: '600px', paddingTop: '72px' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1731972206678-3376c8240198?w=1920&h=1080&fit=crop&q=80"
            alt="Arabic luxury perfume"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.35) 50%, #0D0D0D)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: '56rem', margin: '0 auto' }}>
          <motion.img
            src={logoTransparent}
            alt="Dar Tasnim"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ maxWidth: '360px', width: '100%', display: 'block', margin: '0 auto 16px' }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            style={{ fontSize: '1.125rem', maxWidth: '40rem', margin: '0 auto 40px', lineHeight: 1.7, color: '#888880' }}
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col sm:flex-row"
            style={{ alignItems: 'center', justifyContent: 'center', gap: '16px' }}
          >
            <Link
              to="/shop"
              style={{
                padding: '14px 36px', fontWeight: 500, borderRadius: '10px',
                fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                backgroundColor: '#C9A84C', color: '#0D0D0D', textDecoration: 'none',
                transition: 'background 0.2s',
              }}
            >
              {t('hero.shop_now')}
            </Link>
            <Link
              to="/shop"
              style={{
                padding: '14px 36px', fontWeight: 500, borderRadius: '10px',
                fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                border: '1px solid rgba(245,245,240,0.3)', color: '#F5F5F0', textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              {t('hero.explore')}
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)' }}
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ArrowDown size={24} style={{ color: '#888880' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* Collections */}
      <section style={{ padding: '96px 24px', maxWidth: '80rem', margin: '0 auto' }}>
        <AnimatedSection style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.75rem', fontWeight: 300, color: '#F5F5F0', marginBottom: '12px' }}>
            {t('collections.title')}
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#888880' }}>{t('collections.subtitle')}</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '24px' }}>
          {categories.map((cat) => (
            <AnimatedSection key={cat.key}>
              <Link to={cat.link} style={{ display: 'block', position: 'relative', borderRadius: '14px', overflow: 'hidden', aspectRatio: '3/4', textDecoration: 'none' }}>
                <img
                  src={cat.image}
                  alt={t(`collections.${cat.key}`)}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2) 40%, transparent)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#F5F5F0' }}>
                    {t(`collections.${cat.key}`)}
                  </h3>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section style={{ padding: '96px 0', backgroundColor: '#1A1A1A' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 24px' }}>
            <AnimatedSection>
              <div className="flex flex-col sm:flex-row" style={{ alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', gap: '16px' }}>
                <div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.75rem', fontWeight: 300, color: '#F5F5F0', marginBottom: '8px' }}>
                    {t('bestsellers.title')}
                  </h2>
                  <p style={{ fontSize: '1.0625rem', color: '#888880' }}>{t('bestsellers.subtitle')}</p>
                </div>
                <div className="hidden sm:flex" style={{ gap: '8px' }}>
                  <button
                    onClick={() => scrollCarousel('left')}
                    style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid rgba(201,168,76,0.2)', background: 'none',
                      color: '#888880', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => scrollCarousel('right')}
                    style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid rgba(201,168,76,0.2)', background: 'none',
                      color: '#888880', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </AnimatedSection>

            <div
              ref={scrollContainerRef}
              style={{
                display: 'flex', gap: '24px', overflowX: 'auto',
                paddingBottom: '16px', scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none', msOverflowStyle: 'none',
              }}
            >
              {bestsellers.map((product, index) => (
                <div key={product.id} style={{ minWidth: '280px', maxWidth: '280px', scrollSnapAlign: 'start' }}>
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Story */}
      <section style={{ padding: '96px 24px', maxWidth: '80rem', margin: '0 auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '64px', alignItems: 'center' }}>
          <AnimatedSection>
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/5' }}>
              <img
                src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&h=1000&fit=crop"
                alt="Brand story"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.75rem', fontWeight: 300, color: '#F5F5F0' }}>
                {t('brand_story.title')}
              </h2>
              <p style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: '#888880' }}>{t('brand_story.text1')}</p>
              <p style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: '#888880' }}>{t('brand_story.text2')}</p>
              <div>
                <Link
                  to="/shop"
                  style={{
                    display: 'inline-block',
                    padding: '14px 36px', fontWeight: 500, borderRadius: '10px',
                    fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                    border: '1px solid #C9A84C', color: '#C9A84C', textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {t('brand_story.cta')}
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ padding: '96px 24px', backgroundColor: '#1A1A1A' }}>
        <AnimatedSection style={{ maxWidth: '40rem', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.75rem', fontWeight: 300, color: '#F5F5F0', marginBottom: '12px' }}>
            {t('newsletter.title')}
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#888880', marginBottom: '32px' }}>{t('newsletter.subtitle')}</p>
          <form
            onSubmit={handleNewsletter}
            className="flex flex-col sm:flex-row"
            style={{ gap: '12px', maxWidth: '28rem', margin: '0 auto' }}
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder')}
              required
              style={{
                flex: 1, padding: '14px 16px', borderRadius: '10px',
                fontSize: '0.875rem', outline: 'none',
                backgroundColor: '#1E1E1E', border: '1px solid rgba(201,168,76,0.2)',
                color: '#F5F5F0', fontFamily: "'Inter', sans-serif",
                transition: 'border-color 0.2s',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '14px 28px', fontWeight: 500, borderRadius: '10px',
                fontSize: '0.8125rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                backgroundColor: '#C9A84C', color: '#0D0D0D',
                border: 'none', cursor: 'pointer', transition: 'background 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {t('newsletter.subscribe')}
            </button>
          </form>
        </AnimatedSection>
      </section>
    </>
  )
}
