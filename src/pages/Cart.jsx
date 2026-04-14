import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import useCartStore from '../store/useCartStore'
import { formatPrice } from '../utils/formatPrice'

export default function Cart() {
  const { t, i18n } = useTranslation()
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const total = getTotalPrice()

  const handleRemove = (productId, volume) => {
    removeItem(productId, volume)
    toast.success(t('cart.item_removed'), {
      style: { background: '#1E1E1E', color: '#F5F5F0', border: '1px solid rgba(201,168,76,0.3)' },
    })
  }

  if (items.length === 0) {
    return (
      <>
        <Helmet><title>{t('cart.title')} — VELOUR</title></Helmet>
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ShoppingBag size={80} strokeWidth={1} style={{ color: '#888880', margin: '0 auto 24px' }} />
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#F5F5F0', marginBottom: '8px' }}>{t('cart.empty')}</h2>
            <p style={{ color: '#888880', marginBottom: '32px' }}>{t('cart.empty_subtitle')}</p>
            <Link
              to="/shop"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 36px', backgroundColor: '#C9A84C', color: '#0D0D0D',
                fontWeight: 500, borderRadius: '10px', textDecoration: 'none',
                fontSize: '0.8125rem', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}
            >
              {t('cart.continue_shopping')}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet><title>{t('cart.title')} — VELOUR</title></Helmet>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: '#F5F5F0', margin: 0 }}>
            {t('cart.title')}
          </h1>
          <p style={{ color: '#888880', marginTop: '8px', fontSize: '0.9375rem' }}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '40px' }}>
          {/* Cart Items */}
          <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map((item, index) => {
              const name = item.product[`name_${i18n.language}`] || item.product.name_en
              return (
                <motion.div
                  key={`${item.product.id}-${item.selectedVolume}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    display: 'flex', gap: '20px', padding: '20px',
                    backgroundColor: '#1A1A1A', borderRadius: '16px',
                    border: '1px solid rgba(201,168,76,0.1)',
                  }}
                >
                  <Link to={`/product/${item.product.id}`} style={{ flexShrink: 0 }}>
                    <img
                      src={item.product.images[0]}
                      alt={name}
                      className="w-24 h-24 sm:w-28 sm:h-28"
                      style={{ objectFit: 'cover', borderRadius: '12px' }}
                    />
                  </Link>

                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <div>
                        <p style={{ color: '#888880', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>{item.product.brand}</p>
                        <Link
                          to={`/product/${item.product.id}`}
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.125rem', color: '#F5F5F0', textDecoration: 'none' }}
                        >
                          {name}
                        </Link>
                        <p style={{ color: '#888880', fontSize: '0.8125rem', marginTop: '2px' }}>{item.selectedVolume}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.product.id, item.selectedVolume)}
                        style={{ padding: '8px', background: 'none', border: 'none', color: '#888880', cursor: 'pointer', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = '#888880'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedVolume, item.quantity - 1)}
                          style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            border: '1px solid rgba(201,168,76,0.2)', background: 'none',
                            color: '#F5F5F0', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ color: '#F5F5F0', width: '24px', textAlign: 'center', fontWeight: 500 }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedVolume, item.quantity + 1)}
                          style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            border: '1px solid rgba(201,168,76,0.2)', background: 'none',
                            color: '#F5F5F0', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span style={{ color: '#C9A84C', fontWeight: 600, fontSize: '1.0625rem' }}>
                        {formatPrice(item.product.price * item.quantity)} DZD
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div style={{
              position: 'sticky', top: '96px',
              padding: '28px',
              backgroundColor: '#1A1A1A', borderRadius: '16px',
              border: '1px solid rgba(201,168,76,0.1)',
            }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.375rem', color: '#F5F5F0', marginBottom: '24px' }}>
                {t('checkout.order_summary')}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888880', fontSize: '0.9375rem' }}>
                  <span>{t('cart.subtotal')}</span>
                  <span>{formatPrice(total)} DZD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888880', fontSize: '0.9375rem' }}>
                  <span>{t('cart.shipping')}</span>
                  <span style={{ color: '#C9A84C' }}>{t('cart.free_delivery')}</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid rgba(201,168,76,0.15)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 500, color: '#F5F5F0', fontSize: '1rem' }}>{t('cart.total')}</span>
                  <span style={{ color: '#C9A84C', fontSize: '1.5rem', fontWeight: 600 }}>{formatPrice(total)} DZD</span>
                </div>
              </div>

              <p style={{ color: '#888880', fontSize: '0.75rem', marginBottom: '20px', textAlign: 'center' }}>{t('cart.cod_note')}</p>

              <Link
                to="/checkout"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  width: '100%', padding: '16px 0',
                  backgroundColor: '#C9A84C', color: '#0D0D0D',
                  fontWeight: 600, borderRadius: '12px', textDecoration: 'none',
                  fontSize: '0.875rem', letterSpacing: '0.06em', textTransform: 'uppercase',
                  transition: 'background 0.2s',
                }}
              >
                {t('cart.checkout')}
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/shop"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  width: '100%', marginTop: '12px', padding: '10px 0',
                  color: '#888880', textDecoration: 'none', fontSize: '0.875rem',
                }}
              >
                {t('cart.continue_shopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
