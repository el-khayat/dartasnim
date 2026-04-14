import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { MessageCircle, ArrowLeft } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import useCartStore from '../store/useCartStore'
import { buildOrderMessage, openWhatsApp } from '../lib/whatsapp'
import { formatPrice } from '../utils/formatPrice'

export default function Checkout() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const total = getTotalPrice()

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: '',
    apartment: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#F5F5F0', marginBottom: '16px' }}>{t('cart.empty')}</h2>
        <Link to="/shop" style={{ color: '#C9A84C', textDecoration: 'none' }}>
          {t('cart.continue_shopping')}
        </Link>
      </div>
    )
  }

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = t('checkout.required')
    if (!form.phone.trim()) errs.phone = t('checkout.required')
    else if (!/^[+]?[\d\s-]{8,}$/.test(form.phone)) errs.phone = t('checkout.invalid_phone')
    if (!form.city.trim()) errs.city = t('checkout.required')
    if (!form.address.trim()) errs.address = t('checkout.required')
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)

    if (Object.keys(errs).length === 0) {
      const message = buildOrderMessage({
        name: form.fullName,
        phone: form.phone,
        city: form.city,
        address: form.address,
        apartment: form.apartment,
        notes: form.notes,
        items,
        total,
        t,
      })

      openWhatsApp(message)
      clearCart()
      navigate('/order-success')
    } else {
      toast.error(t('checkout.required'), {
        style: { background: '#1E1E1E', color: '#F5F5F0', border: '1px solid rgba(201,168,76,0.3)' },
      })
    }
  }

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '14px 16px',
    backgroundColor: '#1E1E1E',
    border: errors[field] ? '1px solid #ef4444' : '1px solid rgba(201,168,76,0.2)',
    borderRadius: '10px', color: '#F5F5F0', fontSize: '0.875rem',
    outline: 'none', fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.2s',
  })

  const labelStyle = {
    display: 'block', fontSize: '0.8125rem',
    color: '#888880', marginBottom: '8px',
  }

  return (
    <>
      <Helmet><title>{t('checkout.title')} — VELOUR</title></Helmet>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '40px 24px 80px' }}>
        <Link
          to="/cart"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#888880', textDecoration: 'none', marginBottom: '32px', fontSize: '0.875rem' }}
        >
          <ArrowLeft size={16} />
          {t('cart.title')}
        </Link>

        <div style={{ marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: '#F5F5F0', margin: 0 }}>
            {t('checkout.title')}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '40px' }}>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <div style={{
              padding: '28px', backgroundColor: '#1A1A1A',
              borderRadius: '16px', border: '1px solid rgba(201,168,76,0.1)',
              display: 'flex', flexDirection: 'column', gap: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8125rem', fontWeight: 700,
                }}>1</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.375rem', color: '#F5F5F0', margin: 0 }}>
                  {t('checkout.title')}
                </h2>
              </div>

              <div>
                <label style={labelStyle}>{t('checkout.full_name')} *</label>
                <input type="text" value={form.fullName} onChange={handleChange('fullName')} style={inputStyle('fullName')} />
                {errors.fullName && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px' }}>{errors.fullName}</p>}
              </div>

              <div>
                <label style={labelStyle}>{t('checkout.phone')} *</label>
                <input type="tel" value={form.phone} onChange={handleChange('phone')} placeholder="+213 XXX XXX XXX" style={inputStyle('phone')} />
                {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px' }}>{errors.phone}</p>}
              </div>

              <div>
                <label style={labelStyle}>{t('checkout.city')} *</label>
                <input type="text" value={form.city} onChange={handleChange('city')} style={inputStyle('city')} />
                {errors.city && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px' }}>{errors.city}</p>}
              </div>

              <div>
                <label style={labelStyle}>{t('checkout.address')} *</label>
                <input type="text" value={form.address} onChange={handleChange('address')} style={inputStyle('address')} />
                {errors.address && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px' }}>{errors.address}</p>}
              </div>

              <div>
                <label style={labelStyle}>{t('checkout.apartment')}</label>
                <input type="text" value={form.apartment} onChange={handleChange('apartment')} style={inputStyle('apartment')} />
              </div>

              <div>
                <label style={labelStyle}>{t('checkout.notes')}</label>
                <textarea value={form.notes} onChange={handleChange('notes')} rows={3} style={{ ...inputStyle('notes'), resize: 'vertical' }} />
              </div>
            </div>

            <div style={{
              padding: '16px 20px',
              backgroundColor: 'rgba(201,168,76,0.06)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '12px', textAlign: 'center',
            }}>
              <p style={{ color: '#C9A84C', fontSize: '0.875rem', fontWeight: 500 }}>{t('checkout.cod_only')}</p>
              <p style={{ color: '#888880', fontSize: '0.75rem', marginTop: '4px' }}>{t('checkout.free_shipping_note')}</p>
            </div>

            <button
              type="submit"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                backgroundColor: '#16a34a', color: '#fff',
                padding: '18px 0', borderRadius: '14px',
                fontWeight: 600, fontSize: '1.0625rem',
                border: 'none', cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <MessageCircle size={22} />
              {t('checkout.place_order')}
            </button>
          </motion.form>

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
                {items.map(item => {
                  const name = item.product[`name_${i18n.language}`] || item.product.name_en
                  return (
                    <div key={`${item.product.id}-${item.selectedVolume}`} style={{ display: 'flex', gap: '12px' }}>
                      <img src={item.product.images[0]} alt={name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '10px' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.875rem', color: '#F5F5F0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#888880', margin: '2px 0 0' }}>{item.selectedVolume} × {item.quantity}</p>
                      </div>
                      <span style={{ fontSize: '0.875rem', color: '#C9A84C', whiteSpace: 'nowrap', fontWeight: 500 }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  )
                })}
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(201,168,76,0.15)', margin: '0 0 16px' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888880', fontSize: '0.875rem' }}>
                  <span>{t('cart.subtotal')}</span>
                  <span>{formatPrice(total)} DZD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888880', fontSize: '0.875rem' }}>
                  <span>{t('cart.shipping')}</span>
                  <span style={{ color: '#C9A84C' }}>{t('cart.free_delivery')}</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid rgba(201,168,76,0.15)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 500, color: '#F5F5F0' }}>{t('cart.total')}</span>
                  <span style={{ color: '#C9A84C', fontSize: '1.5rem', fontWeight: 600 }}>{formatPrice(total)} DZD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
