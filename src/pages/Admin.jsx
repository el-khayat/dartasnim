import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, AlertTriangle, Grid3X3, Star, Plus, Search,
  Edit2, Trash2, Save, X, LogOut, Lock, Eye, EyeOff
} from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import useProductStore from '../store/useProductStore'
import { supabaseAdmin, hasValidConfig } from '../lib/supabase'
import { formatPrice } from '../utils/formatPrice'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

function StatsCard({ icon: Icon, label, value, color }) {
  return (
    <div style={{
      padding: '24px', backgroundColor: '#1E1E1E',
      borderRadius: '16px', border: '1px solid rgba(201,168,76,0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <Icon size={24} style={{ color }} />
        <span style={{ fontSize: '2rem', fontFamily: "'Cormorant Garamond', serif", color: '#F5F5F0' }}>{value}</span>
      </div>
      <p style={{ color: '#888880', fontSize: '0.8125rem' }}>{label}</p>
    </div>
  )
}

function ProductForm({ product, onSave, onCancel }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(
    product || {
      name_en: '', name_fr: '', name_ar: '',
      description_en: '', description_fr: '', description_ar: '',
      price: '', original_price: '',
      images: [''],
      category: 'men',
      brand: '',
      volume_options: ['50ml'],
      scent_notes: { top: [''], middle: [''], base: [''] },
      quantity: 0,
      is_featured: false,
      is_bestseller: false,
      rating: 4.5,
      review_count: 0,
    }
  )

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (index, value) => {
    const newImages = [...form.images]
    newImages[index] = value
    setForm(prev => ({ ...prev, images: newImages }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      quantity: Number(form.quantity),
      rating: Number(form.rating),
      review_count: Number(form.review_count),
      images: form.images.filter(Boolean),
    })
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    backgroundColor: '#0D0D0D', border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '10px', color: '#F5F5F0', fontSize: '0.875rem',
    outline: 'none', fontFamily: "'Inter', sans-serif",
  }

  const labelStyle = { display: 'block', fontSize: '0.75rem', color: '#888880', marginBottom: '6px' }

  return (
    <motion.form
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      onSubmit={handleSubmit}
      style={{
        position: 'fixed', top: 0, bottom: 0, right: 0,
        width: '100%', maxWidth: '480px',
        backgroundColor: '#1A1A1A', borderLeft: '1px solid rgba(201,168,76,0.15)',
        zIndex: 50, overflowY: 'auto', padding: '28px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#F5F5F0', margin: 0 }}>
          {product ? t('admin.edit') : t('admin.add_product')}
        </h2>
        <button type="button" onClick={onCancel} style={{ padding: '8px', background: 'none', border: 'none', color: '#888880', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Name (EN)</label>
          <input value={form.name_en} onChange={e => handleChange('name_en', e.target.value)} style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>Name (FR)</label>
          <input value={form.name_fr} onChange={e => handleChange('name_fr', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Name (AR)</label>
          <input value={form.name_ar} onChange={e => handleChange('name_ar', e.target.value)} style={inputStyle} dir="rtl" />
        </div>

        <div>
          <label style={labelStyle}>Description (EN)</label>
          <textarea value={form.description_en} onChange={e => handleChange('description_en', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
        <div>
          <label style={labelStyle}>Description (FR)</label>
          <textarea value={form.description_fr} onChange={e => handleChange('description_fr', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
        <div>
          <label style={labelStyle}>Description (AR)</label>
          <textarea value={form.description_ar} onChange={e => handleChange('description_ar', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} dir="rtl" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Price (MAD)</label>
            <input type="number" value={form.price} onChange={e => handleChange('price', e.target.value)} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Original Price</label>
            <input type="number" value={form.original_price || ''} onChange={e => handleChange('original_price', e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Category</label>
          <select value={form.category} onChange={e => handleChange('category', e.target.value)} style={inputStyle}>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
            <option value="oud">Oud</option>
            <option value="gift-sets">Gift Sets</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Brand</label>
          <input value={form.brand} onChange={e => handleChange('brand', e.target.value)} style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Quantity</label>
            <input type="number" value={form.quantity} onChange={e => handleChange('quantity', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Rating</label>
            <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => handleChange('rating', e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Image URLs</label>
          {form.images.map((img, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                value={img}
                onChange={e => handleImageChange(i, e.target.value)}
                style={inputStyle}
                placeholder="https://..."
              />
              {i === form.images.length - 1 && (
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, images: [...prev.images, ''] }))}
                  style={{
                    flexShrink: 0, width: '40px', height: '40px', borderRadius: '10px',
                    border: '1px solid rgba(201,168,76,0.2)', background: 'none',
                    color: '#C9A84C', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_featured} onChange={e => handleChange('is_featured', e.target.checked)} style={{ accentColor: '#C9A84C' }} />
            <span style={{ fontSize: '0.8125rem', color: '#888880' }}>Featured</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_bestseller} onChange={e => handleChange('is_bestseller', e.target.checked)} style={{ accentColor: '#C9A84C' }} />
            <span style={{ fontSize: '0.8125rem', color: '#888880' }}>Bestseller</span>
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
        <button
          type="submit"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            backgroundColor: '#C9A84C', color: '#0D0D0D',
            padding: '14px 0', borderRadius: '12px',
            fontWeight: 600, fontSize: '0.875rem',
            border: 'none', cursor: 'pointer',
          }}
        >
          <Save size={18} />
          {t('admin.save')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            border: '1px solid rgba(201,168,76,0.2)', background: 'none',
            color: '#888880', padding: '14px 0', borderRadius: '12px',
            cursor: 'pointer', fontSize: '0.875rem',
          }}
        >
          {t('admin.cancel')}
        </button>
      </div>
    </motion.form>
  )
}

export default function Admin() {
  const { t } = useTranslation()
  const { products, fetchProducts, usingSeedData } = useProductStore()
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [editingProduct, setEditingProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
    } else {
      toast.error(t('admin.wrong_password'), {
        style: { background: '#1E1E1E', color: '#F5F5F0', border: '1px solid rgba(201,168,76,0.3)' },
      })
    }
  }

  const filtered = products.filter(p => {
    const matchesSearch = p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
    const matchesStock = stockFilter === 'all' ||
      (stockFilter === 'low' && p.quantity < 5) ||
      (stockFilter === 'in_stock' && p.quantity >= 5)
    return matchesSearch && matchesCategory && matchesStock
  })

  const lowStockCount = products.filter(p => p.quantity < 5).length
  const categoryCount = new Set(products.map(p => p.category)).size
  const featuredCount = products.filter(p => p.is_featured).length

  const handleSave = async (productData) => {
    if (usingSeedData) {
      toast.error('Cannot save to database — using seed data. Configure Supabase to enable saving.', {
        style: { background: '#1E1E1E', color: '#F5F5F0', border: '1px solid rgba(201,168,76,0.3)' },
        duration: 4000,
      })
      setShowForm(false)
      setEditingProduct(null)
      return
    }

    try {
      if (editingProduct) {
        const { error } = await supabaseAdmin
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
        if (error) throw error
        toast.success(t('admin.product_updated'))
      } else {
        const { error } = await supabaseAdmin
          .from('products')
          .insert([productData])
        if (error) throw error
        toast.success(t('admin.product_added'))
      }
      fetchProducts()
    } catch (err) {
      toast.error(err.message || 'Error saving product')
    }

    setShowForm(false)
    setEditingProduct(null)
  }

  const handleDelete = async (id) => {
    if (usingSeedData) {
      toast.error('Cannot delete — using seed data. Configure Supabase to enable deletion.', {
        style: { background: '#1E1E1E', color: '#F5F5F0', border: '1px solid rgba(201,168,76,0.3)' },
      })
      setDeleteConfirm(null)
      return
    }

    try {
      const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
      if (error) throw error
      toast.success(t('admin.product_deleted'))
      fetchProducts()
    } catch (err) {
      toast.error(err.message || 'Error deleting product')
    }
    setDeleteConfirm(null)
  }

  const getStockColor = (qty) => {
    if (qty < 5) return { bg: 'rgba(239,68,68,0.15)', text: '#f87171', border: 'rgba(239,68,68,0.3)' }
    if (qty < 20) return { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', border: 'rgba(245,158,11,0.3)' }
    return { bg: 'rgba(34,197,94,0.15)', text: '#4ade80', border: 'rgba(34,197,94,0.3)' }
  }

  // Login screen
  if (!authenticated) {
    return (
      <>
        <Helmet><title>{t('admin.login')} — VELOUR</title></Helmet>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0D0D0D', padding: '0 24px' }}>
          <motion.form
            onSubmit={handleLogin}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              width: '100%', maxWidth: '400px', padding: '36px',
              backgroundColor: '#1A1A1A', borderRadius: '20px',
              border: '1px solid rgba(201,168,76,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                backgroundColor: 'rgba(201,168,76,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Lock size={28} style={{ color: '#C9A84C' }} />
              </div>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#F5F5F0', textAlign: 'center', marginBottom: '24px' }}>
              {t('admin.login')}
            </h1>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('admin.password')}
                style={{
                  width: '100%', padding: '14px 48px 14px 16px',
                  backgroundColor: '#1E1E1E', border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: '10px', color: '#F5F5F0', fontSize: '0.875rem',
                  outline: 'none', fontFamily: "'Inter', sans-serif",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', top: '50%', right: '14px', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#888880', cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              style={{
                width: '100%', backgroundColor: '#C9A84C', color: '#0D0D0D',
                padding: '14px 0', borderRadius: '10px',
                fontWeight: 600, fontSize: '0.875rem',
                border: 'none', cursor: 'pointer',
              }}
            >
              {t('admin.enter')}
            </button>
          </motion.form>
        </div>
      </>
    )
  }

  const selectStyle = {
    backgroundColor: '#1E1E1E', border: '1px solid rgba(201,168,76,0.2)',
    color: '#F5F5F0', fontSize: '0.875rem', borderRadius: '10px',
    padding: '10px 14px', outline: 'none', cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  }

  return (
    <>
      <Helmet><title>{t('admin.title')} — VELOUR</title></Helmet>

      <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0D' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#1A1A1A', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '16px 24px' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#C9A84C', margin: 0 }}>
              VELOUR — {t('admin.title')}
            </h1>
            <button
              onClick={() => setAuthenticated(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                color: '#888880', background: 'none', border: 'none',
                cursor: 'pointer', fontSize: '0.875rem',
              }}
            >
              <LogOut size={16} />
              {t('admin.logout')}
            </button>
          </div>
        </div>

        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '32px 24px' }}>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '16px', marginBottom: '32px' }}>
            <StatsCard icon={Package} label={t('admin.total_products')} value={products.length} color="#C9A84C" />
            <StatsCard icon={AlertTriangle} label={t('admin.low_stock')} value={lowStockCount} color="#f87171" />
            <StatsCard icon={Grid3X3} label={t('admin.categories')} value={categoryCount} color="#60a5fa" />
            <StatsCard icon={Star} label={t('admin.featured')} value={featuredCount} color="#fbbf24" />
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row" style={{ gap: '12px', marginBottom: '24px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', color: '#888880' }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('admin.search_products')}
                style={{
                  width: '100%', paddingLeft: '42px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px',
                  backgroundColor: '#1E1E1E', border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: '10px', color: '#F5F5F0', fontSize: '0.875rem',
                  outline: 'none', fontFamily: "'Inter', sans-serif",
                }}
              />
            </div>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={selectStyle}>
              <option value="all">{t('admin.all')}</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
              <option value="oud">Oud</option>
              <option value="gift-sets">Gift Sets</option>
            </select>
            <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} style={selectStyle}>
              <option value="all">{t('admin.all')}</option>
              <option value="low">{t('admin.low_stock')}</option>
              <option value="in_stock">{t('admin.in_stock')}</option>
            </select>
            <button
              onClick={() => { setEditingProduct(null); setShowForm(true) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', backgroundColor: '#C9A84C', color: '#0D0D0D',
                borderRadius: '10px', fontWeight: 600, fontSize: '0.8125rem',
                border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              <Plus size={18} />
              {t('admin.add_product')}
            </button>
          </div>

          {/* Table */}
          <div style={{
            backgroundColor: '#1A1A1A', borderRadius: '16px',
            border: '1px solid rgba(201,168,76,0.1)', overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                    {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                      <th key={h} style={{
                        textAlign: h === 'Actions' ? 'right' : 'left',
                        fontSize: '0.6875rem', color: '#888880', textTransform: 'uppercase',
                        letterSpacing: '0.08em', padding: '14px 16px', fontWeight: 600,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(product => {
                    const sc = getStockColor(product.quantity)
                    return (
                      <tr key={product.id} style={{ borderBottom: '1px solid rgba(201,168,76,0.06)' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(30,30,30,0.5)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={product.images[0]} alt="" style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }} />
                            <div>
                              <p style={{ fontSize: '0.875rem', color: '#F5F5F0', fontWeight: 500, margin: 0 }}>{product.name_en}</p>
                              <p style={{ fontSize: '0.75rem', color: '#888880', margin: '2px 0 0' }}>{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '0.875rem', color: '#888880', textTransform: 'capitalize' }}>{product.category}</span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '0.875rem', color: '#C9A84C' }}>{formatPrice(product.price)} MAD</span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            display: 'inline-flex', padding: '4px 12px', borderRadius: '999px',
                            fontSize: '0.75rem', fontWeight: 500,
                            backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                          }}>
                            {product.quantity}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '0.75rem', color: product.is_featured ? '#C9A84C' : '#888880' }}>
                            {product.is_featured ? '★ Yes' : 'No'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                            <button
                              onClick={() => { setEditingProduct(product); setShowForm(true) }}
                              style={{ padding: '8px', background: 'none', border: 'none', color: '#888880', cursor: 'pointer' }}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              style={{ padding: '8px', background: 'none', border: 'none', color: '#888880', cursor: 'pointer' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Product Form Slide-in */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 40 }}
              onClick={() => { setShowForm(false); setEditingProduct(null) }}
            />
            <ProductForm
              product={editingProduct}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingProduct(null) }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)' }}
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'relative', backgroundColor: '#1A1A1A',
                border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px',
                padding: '28px', maxWidth: '400px', margin: '0 16px', width: '100%',
              }}
            >
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: '#F5F5F0', marginBottom: '20px' }}>
                {t('admin.confirm_delete')}
              </h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  style={{
                    flex: 1, backgroundColor: '#ef4444', color: '#fff',
                    padding: '12px 0', borderRadius: '10px', fontWeight: 600,
                    fontSize: '0.875rem', border: 'none', cursor: 'pointer',
                  }}
                >
                  {t('admin.delete')}
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  style={{
                    flex: 1, border: '1px solid rgba(201,168,76,0.2)', background: 'none',
                    color: '#888880', padding: '12px 0', borderRadius: '10px',
                    cursor: 'pointer', fontSize: '0.875rem',
                  }}
                >
                  {t('admin.cancel')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
