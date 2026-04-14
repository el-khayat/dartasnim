import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingBag, Minus, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '../ui/Modal'
import StarRating from '../ui/StarRating'
import useCartStore from '../../store/useCartStore'
import useUIStore from '../../store/useUIStore'
import { formatPrice } from '../../utils/formatPrice'

export default function QuickView() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { isQuickViewOpen, quickViewProduct, closeQuickView } = useUIStore()
  const addItem = useCartStore(s => s.addItem)
  const [selectedVolume, setSelectedVolume] = useState(null)
  const [quantity, setQuantity] = useState(1)

  if (!quickViewProduct) return null

  const product = quickViewProduct
  const name = product[`name_${i18n.language}`] || product.name_en
  const volume = selectedVolume || product.volume_options[0]
  const hasDiscount = product.original_price && product.original_price > product.price

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, volume)
    }
    toast.success(t('product.added_to_cart'), {
      style: {
        background: '#1E1E1E',
        color: '#F5F5F0',
        border: '1px solid rgba(201,168,76,0.3)',
      },
      iconTheme: { primary: '#C9A84C', secondary: '#1E1E1E' },
    })
    closeQuickView()
    setQuantity(1)
    setSelectedVolume(null)
  }

  return (
    <Modal isOpen={isQuickViewOpen} onClose={closeQuickView} title={t('product.quick_view')} maxWidth="40rem">
      <div className="flex flex-col sm:flex-row" style={{ gap: '24px' }}>
        {/* Image */}
        <div className="sm:w-1/2">
          <img
            src={product.images[0]}
            alt={name}
            style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '12px' }}
          />
        </div>

        {/* Info */}
        <div className="sm:w-1/2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <p style={{ color: '#888880', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
              {product.brand}
            </p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#F5F5F0', margin: 0, lineHeight: 1.3 }}>
              {name}
            </h3>
          </div>

          <StarRating rating={product.rating} showCount count={product.review_count} />

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ color: '#C9A84C', fontSize: '1.375rem', fontWeight: 600 }}>{formatPrice(product.price)} DZD</span>
            {hasDiscount && (
              <span style={{ color: '#888880', fontSize: '0.9375rem', textDecoration: 'line-through' }}>{formatPrice(product.original_price)}</span>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(201,168,76,0.1)', margin: '2px 0' }} />

          {/* Volume */}
          <div>
            <p style={{ fontSize: '0.8125rem', color: '#888880', marginBottom: '8px' }}>{t('product.volume')}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {product.volume_options.map(v => (
                <button
                  key={v}
                  onClick={() => setSelectedVolume(v)}
                  style={{
                    padding: '8px 16px', borderRadius: '8px', fontSize: '0.8125rem',
                    cursor: 'pointer', transition: 'all 0.15s',
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
            <p style={{ fontSize: '0.8125rem', color: '#888880', marginBottom: '8px' }}>{t('product.quantity')}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  border: '1px solid rgba(201,168,76,0.2)', background: 'none',
                  color: '#F5F5F0', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Minus size={14} />
              </button>
              <span style={{ color: '#F5F5F0', width: '24px', textAlign: 'center', fontWeight: 500 }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  border: '1px solid rgba(201,168,76,0.2)', background: 'none',
                  color: '#F5F5F0', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              backgroundColor: '#C9A84C', color: '#0D0D0D',
              padding: '14px 0', borderRadius: '12px',
              fontWeight: 600, fontSize: '0.875rem',
              border: 'none', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <ShoppingBag size={18} />
            {t('product.add_to_cart')}
          </button>

          {/* View Full Details */}
          <button
            onClick={() => {
              closeQuickView()
              navigate(`/product/${product.id}`)
            }}
            style={{
              width: '100%', textAlign: 'center',
              fontSize: '0.875rem', color: '#C9A84C',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            {t('product.view_details') || 'View Full Details'} →
          </button>
        </div>
      </div>
    </Modal>
  )
}
