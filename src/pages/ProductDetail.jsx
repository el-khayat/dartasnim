import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ShoppingBag, Minus, Plus, Share2, Truck, Star, ShieldCheck } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import useProductStore from '../store/useProductStore'
import useCartStore from '../store/useCartStore'
import StarRating from '../components/ui/StarRating'
import ProductCard from '../components/product/ProductCard'
import { formatPrice } from '../utils/formatPrice'
import { generateReviews, getStarDistribution } from '../lib/fakeReviews'

export default function ProductDetail() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const products = useProductStore(s => s.products)
  const addItem = useCartStore(s => s.addItem)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVolume, setSelectedVolume] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [zoomed, setZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })

  const product = useMemo(() => products.find(p => p.id === id), [products, id])

  useEffect(() => {
    setSelectedImage(0)
    setQuantity(1)
    setSelectedVolume(null)
    window.scrollTo(0, 0)
  }, [id])

  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.875rem', color: '#F5F5F0', marginBottom: '16px' }}>Product not found</h2>
          <Link to="/shop" style={{ color: '#C9A84C', textDecoration: 'none' }}>
            {t('cart.continue_shopping')}
          </Link>
        </div>
      </div>
    )
  }

  const name = product[`name_${i18n.language}`] || product.name_en
  const description = product[`description_${i18n.language}`] || product.description_en
  const volume = selectedVolume || product.volume_options[0]
  const hasDiscount = product.original_price && product.original_price > product.price
  const reviews = generateReviews(product.id)
  const starDist = getStarDistribution(reviews)
  const similar = useMemo(
    () => products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4),
    [products, product.category, product.id]
  )

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, volume)
    }
    toast.success(t('product.added_to_cart'), {
      style: { background: '#1E1E1E', color: '#F5F5F0', border: '1px solid rgba(201,168,76,0.3)' },
      iconTheme: { primary: '#C9A84C', secondary: '#1E1E1E' },
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied!', {
      style: { background: '#1E1E1E', color: '#F5F5F0', border: '1px solid rgba(201,168,76,0.3)' },
    })
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  return (
    <>
      <Helmet>
        <title>{name} — VELOUR</title>
        <meta name="description" content={description?.slice(0, 160)} />
      </Helmet>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#888880', marginBottom: '32px' }}>
          <Link to="/" style={{ color: '#888880', textDecoration: 'none' }}>{t('nav.home')}</Link>
          <span>/</span>
          <Link to="/shop" style={{ color: '#888880', textDecoration: 'none' }}>{t('nav.shop')}</Link>
          <span>/</span>
          <span style={{ color: '#F5F5F0' }}>{name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '48px' }}>
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                aspectRatio: '1',
                backgroundColor: '#1E1E1E',
                cursor: 'crosshair',
              }}
              onMouseEnter={() => setZoomed(true)}
              onMouseLeave={() => setZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={product.images[selectedImage]}
                alt={name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s',
                  transform: zoomed ? 'scale(2)' : 'scale(1)',
                  transformOrigin: zoomed ? `${zoomPos.x}% ${zoomPos.y}%` : 'center',
                }}
              />
              {hasDiscount && (
                <span style={{
                  position: 'absolute', top: '16px', left: '16px',
                  backgroundColor: '#C9A84C', color: '#0D0D0D',
                  fontSize: '0.875rem', fontWeight: 700,
                  padding: '6px 14px', borderRadius: '999px',
                }}>
                  -{Math.round((1 - product.price / product.original_price) * 100)}%
                </span>
              )}
            </div>
            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '80px', height: '80px',
                    borderRadius: '10px', overflow: 'hidden',
                    border: selectedImage === idx ? '2px solid #C9A84C' : '2px solid transparent',
                    padding: 0, background: 'none', cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Brand & Name */}
              <div>
                <p style={{ color: '#888880', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{product.brand}</p>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.25rem', fontWeight: 400, color: '#F5F5F0', lineHeight: 1.2, margin: 0 }}>{name}</h1>
              </div>

              {/* Rating */}
              <StarRating rating={product.rating} size={18} showCount count={product.review_count} />

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ color: '#C9A84C', fontSize: '1.875rem', fontWeight: 600 }}>{formatPrice(product.price)} DZD</span>
                {hasDiscount && (
                  <span style={{ color: '#888880', fontSize: '1.25rem', textDecoration: 'line-through' }}>{formatPrice(product.original_price)} DZD</span>
                )}
              </div>

              {/* Divider */}
              <hr style={{ border: 'none', borderTop: '1px solid rgba(201,168,76,0.15)', margin: '4px 0' }} />

              {/* Volume */}
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#F5F5F0', marginBottom: '12px' }}>{t('product.volume')}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {product.volume_options.map(v => (
                    <button
                      key={v}
                      onClick={() => setSelectedVolume(v)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: volume === v ? 'rgba(201,168,76,0.1)' : 'transparent',
                        border: volume === v ? '1px solid #C9A84C' : '1px solid rgba(201,168,76,0.2)',
                        color: volume === v ? '#C9A84C' : '#888880',
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#F5F5F0', marginBottom: '12px' }}>{t('product.quantity')}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: '44px', height: '44px', borderRadius: '10px',
                      border: '1px solid rgba(201,168,76,0.2)', background: 'none',
                      color: '#F5F5F0', cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ color: '#F5F5F0', fontSize: '1.125rem', fontWeight: 500, width: '32px', textAlign: 'center' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      width: '44px', height: '44px', borderRadius: '10px',
                      border: '1px solid rgba(201,168,76,0.2)', background: 'none',
                      color: '#F5F5F0', cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {product.quantity > 0 && product.quantity < 5 && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{t('product.low_stock', { count: product.quantity })}</p>
              )}

              {/* Add to Cart */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    backgroundColor: '#C9A84C', color: '#0D0D0D',
                    padding: '16px 24px', borderRadius: '12px',
                    fontWeight: 600, fontSize: '0.9375rem',
                    border: 'none', cursor: product.quantity === 0 ? 'not-allowed' : 'pointer',
                    opacity: product.quantity === 0 ? 0.5 : 1,
                    transition: 'background 0.2s',
                  }}
                >
                  <ShoppingBag size={20} />
                  {product.quantity === 0 ? t('product.out_of_stock') : t('product.add_to_cart')}
                </button>
                <button
                  onClick={handleShare}
                  style={{
                    width: '52px', height: '52px',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: '12px', background: 'none',
                    color: '#888880', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Share2 size={20} />
                </button>
              </div>

              {/* Shipping Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888880', fontSize: '0.875rem' }}>
                  <Truck size={16} style={{ color: '#C9A84C' }} />
                  {t('product.free_shipping')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888880', fontSize: '0.875rem' }}>
                  <ShieldCheck size={16} style={{ color: '#C9A84C' }} />
                  {t('product.verified_purchase')}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scent Profile */}
        {product.scent_notes && (
          <div style={{
            marginTop: '64px', padding: '32px',
            backgroundColor: '#1A1A1A', borderRadius: '16px',
            border: '1px solid rgba(201,168,76,0.15)',
          }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#F5F5F0', marginBottom: '24px' }}>{t('product.scent_profile')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { key: 'top', label: t('product.top_notes'), notes: product.scent_notes.top },
                { key: 'middle', label: t('product.middle_notes'), notes: product.scent_notes.middle },
                { key: 'base', label: t('product.base_notes'), notes: product.scent_notes.base },
              ].map(group => (
                <div key={group.key}>
                  <h3 style={{ color: '#C9A84C', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>{group.label}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {group.notes.map(note => (
                      <span key={note} style={{
                        padding: '6px 14px', backgroundColor: '#1E1E1E',
                        border: '1px solid rgba(201,168,76,0.15)', borderRadius: '999px',
                        fontSize: '0.875rem', color: '#F5F5F0',
                      }}>
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#F5F5F0', marginBottom: '16px' }}>{t('product.description')}</h2>
          <p style={{ color: '#888880', lineHeight: 1.8, fontSize: '1.0625rem' }}>{description}</p>
        </div>

        {/* Reviews */}
        <div style={{ marginTop: '64px' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#F5F5F0', marginBottom: '32px' }}>
            {t('product.reviews')} ({reviews.length})
          </h2>

          {/* Star Distribution */}
          <div style={{
            marginBottom: '32px', padding: '24px',
            backgroundColor: '#1A1A1A', borderRadius: '16px',
            border: '1px solid rgba(201,168,76,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <div style={{ textAlign: 'center', minWidth: '80px' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', color: '#C9A84C', margin: 0 }}>{product.rating}</p>
                <StarRating rating={product.rating} size={14} />
                <p style={{ color: '#888880', fontSize: '0.8125rem', marginTop: '4px' }}>{product.review_count} reviews</p>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#888880', width: '32px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {star} <Star size={11} fill="#C9A84C" color="#C9A84C" />
                    </span>
                    <div style={{ flex: 1, height: '6px', backgroundColor: '#1E1E1E', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', backgroundColor: '#C9A84C', borderRadius: '999px',
                        width: `${((starDist[star] || 0) / reviews.length) * 100}%`,
                      }} />
                    </div>
                    <span style={{ fontSize: '0.8125rem', color: '#888880', width: '24px', textAlign: 'right' }}>{starDist[star] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.map(review => (
              <div key={review.id} style={{
                padding: '24px', backgroundColor: '#1A1A1A',
                borderRadius: '16px', border: '1px solid rgba(201,168,76,0.1)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 500, color: '#F5F5F0' }}>{review.name}</span>
                      {review.verified && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          fontSize: '0.75rem', color: '#C9A84C',
                          backgroundColor: 'rgba(201,168,76,0.1)',
                          padding: '2px 10px', borderRadius: '999px',
                        }}>
                          <ShieldCheck size={12} />
                          {t('product.verified_purchase')}
                        </span>
                      )}
                    </div>
                    <StarRating rating={review.rating} size={13} />
                  </div>
                  <span style={{ color: '#888880', fontSize: '0.8125rem' }}>{review.date}</span>
                </div>
                <p style={{ color: '#888880', lineHeight: 1.7, margin: 0 }}>{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div style={{ marginTop: '80px' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.875rem', color: '#F5F5F0', marginBottom: '32px' }}>
              {t('product.similar_products')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
