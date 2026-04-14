import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ShoppingBag, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import useCartStore from '../../store/useCartStore'
import useUIStore from '../../store/useUIStore'
import StarRating from '../ui/StarRating'
import { formatPrice } from '../../utils/formatPrice'

export default function ProductCard({ product, index = 0 }) {
  const { t, i18n } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const addItem = useCartStore(s => s.addItem)
  const openQuickView = useUIStore(s => s.openQuickView)

  const name = product[`name_${i18n.language}`] || product.name_en
  const hasDiscount = product.original_price && product.original_price > product.price

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, product.volume_options[0])
    toast.success(t('product.added_to_cart'), {
      style: {
        background: '#1E1E1E',
        color: '#F5F5F0',
        border: '1px solid rgba(201,168,76,0.3)',
      },
      iconTheme: { primary: '#C9A84C', secondary: '#1E1E1E' },
    })
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    openQuickView(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Link
        to={`/product/${product.id}`}
        style={{ textDecoration: 'none', display: 'block' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{
          position: 'relative',
          backgroundColor: '#1E1E1E',
          borderRadius: '14px',
          overflow: 'hidden',
          border: isHovered ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(201,168,76,0.06)',
          transition: 'all 0.3s ease',
          boxShadow: isHovered ? '0 8px 30px rgba(201,168,76,0.08)' : 'none',
        }}>
          {/* Image */}
          <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', backgroundColor: '#1A1A1A' }}>
            {!imgLoaded && (
              <div style={{ position: 'absolute', inset: 0, backgroundColor: '#1E1E1E' }} />
            )}
            <img
              src={product.images[isHovered && product.images[1] ? 1 : 0]}
              alt={name}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.5s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                opacity: imgLoaded ? 1 : 0,
              }}
            />

            {/* Hover overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent 50%)',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s',
            }} />

            {/* Hover buttons */}
            <div style={{
              position: 'absolute', bottom: '16px', left: '16px', right: '16px',
              display: 'flex', gap: '8px',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.3s ease',
            }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  backgroundColor: '#C9A84C', color: '#0D0D0D',
                  padding: '10px 0', borderRadius: '10px',
                  fontSize: '0.8125rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                }}
              >
                <ShoppingBag size={15} />
                {t('product.add_to_cart')}
              </button>
              <button
                onClick={handleQuickView}
                style={{
                  width: '42px', height: '42px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: 'rgba(13,13,13,0.8)', backdropFilter: 'blur(8px)',
                  color: '#F5F5F0', borderRadius: '10px',
                  border: 'none', cursor: 'pointer',
                }}
              >
                <Eye size={15} />
              </button>
            </div>

            {/* Discount badge */}
            {hasDiscount && (
              <span style={{
                position: 'absolute', top: '12px', left: '12px',
                backgroundColor: '#C9A84C', color: '#0D0D0D',
                fontSize: '0.75rem', fontWeight: 700,
                padding: '4px 10px', borderRadius: '999px',
              }}>
                -{Math.round((1 - product.price / product.original_price) * 100)}%
              </span>
            )}

            {/* Low stock badge */}
            {product.quantity > 0 && product.quantity < 5 && (
              <span style={{
                position: 'absolute', top: '12px', right: '12px',
                backgroundColor: 'rgba(239,68,68,0.9)', color: '#fff',
                fontSize: '0.75rem', fontWeight: 500,
                padding: '4px 10px', borderRadius: '999px',
              }}>
                {t('product.low_stock', { count: product.quantity })}
              </span>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: '16px 16px 20px' }}>
            <p style={{ color: '#888880', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
              {product.brand}
            </p>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.0625rem', fontWeight: 500,
              color: '#F5F5F0', marginBottom: '8px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {name}
            </h3>
            <StarRating rating={product.rating} showCount count={product.review_count} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <span style={{ color: '#C9A84C', fontWeight: 600, fontSize: '0.9375rem' }}>{formatPrice(product.price)} DZD</span>
              {hasDiscount && (
                <span style={{ color: '#888880', fontSize: '0.8125rem', textDecoration: 'line-through' }}>{formatPrice(product.original_price)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
