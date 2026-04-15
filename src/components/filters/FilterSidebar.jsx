import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X, SlidersHorizontal } from 'lucide-react'
import useProductStore from '../../store/useProductStore'
import useUIStore from '../../store/useUIStore'

const categories = [
  { value: 'all', label: 'shop.all_products' },
  { value: 'men', label: 'collections.men' },
  { value: 'women', label: 'collections.women' },
  { value: 'unisex', label: 'collections.unisex' },
  { value: 'oud', label: 'collections.oud' },
  { value: 'gift-sets', label: 'collections.gift_sets' },
]

export default function FilterSidebar({ filters, setFilters }) {
  const { t } = useTranslation()
  const products = useProductStore(s => s.products)
  const isFilterDrawerOpen = useUIStore(s => s.isFilterDrawerOpen)
  const closeFilterDrawer = useUIStore(s => s.closeFilterDrawer)

  const brands = useMemo(() => [...new Set(products.map(p => p.brand).filter(Boolean))], [products])
  const maxPrice = useMemo(() => Math.max(...products.map(p => p.price), 0), [products])

  const handleCategoryChange = (cat) => {
    setFilters(prev => ({ ...prev, category: cat }))
  }

  const handleBrandToggle = (brand) => {
    setFilters(prev => {
      const current = prev.brand || []
      return {
        ...prev,
        brand: current.includes(brand)
          ? current.filter(b => b !== brand)
          : [...current, brand],
      }
    })
  }

  const handlePriceChange = (value) => {
    setFilters(prev => ({ ...prev, maxPrice: Number(value) }))
  }

  const clearFilters = () => {
    setFilters({
      category: 'all',
      brand: [],
      minPrice: 0,
      maxPrice: maxPrice,
      scentNotes: [],
      sort: 'featured',
    })
  }

  const sectionTitle = (text) => ({
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#F5F5F0',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '12px',
  })

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: '#F5F5F0', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <SlidersHorizontal size={18} />
          {t('shop.filters')}
        </h3>
        <button
          onClick={clearFilters}
          style={{ fontSize: '0.75rem', color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          {t('shop.clear_filters')}
        </button>
      </div>

      {/* Category */}
      <div>
        <h4 style={sectionTitle()}>{t('shop.category')}</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                cursor: 'pointer',
                border: filters.category === cat.value ? '1px solid rgba(201,168,76,0.3)' : '1px solid transparent',
                backgroundColor: filters.category === cat.value ? 'rgba(201,168,76,0.08)' : 'transparent',
                color: filters.category === cat.value ? '#C9A84C' : '#888880',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (filters.category !== cat.value) { e.currentTarget.style.color = '#F5F5F0'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)' } }}
              onMouseLeave={e => { if (filters.category !== cat.value) { e.currentTarget.style.color = '#888880'; e.currentTarget.style.backgroundColor = 'transparent' } }}
            >
              {t(cat.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid rgba(201,168,76,0.1)', margin: 0 }} />

      {/* Price Range */}
      <div>
        <h4 style={sectionTitle()}>
          {t('shop.price_range')}: {(filters.maxPrice || maxPrice).toLocaleString()} MAD
        </h4>
        <input
          type="range"
          min="0"
          max={maxPrice}
          value={filters.maxPrice || maxPrice}
          onChange={e => handlePriceChange(e.target.value)}
          style={{ width: '100%', accentColor: '#C9A84C', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888880', marginTop: '6px' }}>
          <span>0 MAD</span>
          <span>{maxPrice.toLocaleString()} MAD</span>
        </div>
      </div>

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid rgba(201,168,76,0.1)', margin: 0 }} />

      {/* Brand */}
      <div>
        <h4 style={sectionTitle()}>{t('shop.brand')}</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {brands.map(brand => (
            <label
              key={brand}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.875rem', color: '#888880' }}
            >
              <input
                type="checkbox"
                checked={(filters.brand || []).includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                style={{ accentColor: '#C9A84C', width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid rgba(201,168,76,0.1)', margin: 0 }} />

      {/* Sort By */}
      <div>
        <h4 style={sectionTitle()}>{t('shop.sort_by')}</h4>
        <select
          value={filters.sort || 'featured'}
          onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))}
          style={{
            width: '100%',
            backgroundColor: '#1E1E1E',
            border: '1px solid rgba(201,168,76,0.2)',
            color: '#F5F5F0',
            fontSize: '0.875rem',
            borderRadius: '10px',
            padding: '10px 12px',
            outline: 'none',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <option value="featured">{t('shop.sort_featured')}</option>
          <option value="price_low">{t('shop.sort_price_low')}</option>
          <option value="price_high">{t('shop.sort_price_high')}</option>
          <option value="newest">{t('shop.sort_newest')}</option>
          <option value="rating">{t('shop.sort_rating')}</option>
        </select>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block" style={{ width: '260px', flexShrink: 0 }}>
        <div style={{
          position: 'sticky', top: '96px',
          padding: '24px',
          backgroundColor: '#1A1A1A',
          borderRadius: '16px',
          border: '1px solid rgba(201,168,76,0.1)',
        }}>
          {content}
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden"
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 40 }}
              onClick={closeFilterDrawer}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden"
              style={{
                position: 'fixed', top: 0, bottom: 0, left: 0,
                width: '320px', maxWidth: '85vw',
                backgroundColor: '#1A1A1A', zIndex: 50,
                padding: '24px', overflowY: 'auto',
              }}
            >
              <button
                onClick={closeFilterDrawer}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  padding: '8px', background: 'none', border: 'none',
                  color: '#888880', cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
