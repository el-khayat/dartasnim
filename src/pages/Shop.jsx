import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { SlidersHorizontal } from 'lucide-react'
import useProductStore, { getFiltered } from '../store/useProductStore'
import useUIStore from '../store/useUIStore'
import ProductGrid from '../components/product/ProductGrid'
import FilterSidebar from '../components/filters/FilterSidebar'
import { ProductGridSkeleton } from '../components/ui/Skeleton'

export default function Shop() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const products = useProductStore(s => s.products)
  const isLoading = useProductStore(s => s.isLoading)
  const toggleFilterDrawer = useUIStore(s => s.toggleFilterDrawer)

  const categoryParam = searchParams.get('category')
  const maxPrice = useMemo(() => Math.max(...products.map(p => p.price), 0), [products])

  const [filters, setFilters] = useState({
    category: categoryParam || 'all',
    brand: [],
    minPrice: 0,
    maxPrice: 0,
    scentNotes: [],
    sort: 'featured',
  })

  useEffect(() => {
    if (products.length > 0 && filters.maxPrice === 0) {
      setFilters(prev => ({ ...prev, maxPrice: maxPrice }))
    }
  }, [products, maxPrice, filters.maxPrice])

  useEffect(() => {
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }))
    }
  }, [categoryParam])

  const filtered = useMemo(() => getFiltered(products, filters), [products, filters])

  return (
    <>
      <Helmet>
        <title>{t('shop.title')} — VELOUR</title>
        <meta name="description" content="Browse our collection of luxury perfumes" />
      </Helmet>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 300, color: '#F5F5F0', margin: 0, lineHeight: 1.1 }}>
              {t('shop.title')}
            </h1>
            <p style={{ color: '#888880', marginTop: '8px', fontSize: '0.9375rem' }}>
              {t('shop.products_count', { count: filtered.length })}
            </p>
          </div>
          <button
            onClick={toggleFilterDrawer}
            className="lg:hidden"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px',
              border: '1px solid rgba(201,168,76,0.2)', borderRadius: '10px',
              background: 'none', color: '#888880', cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            <SlidersHorizontal size={18} />
            {t('shop.filters')}
          </button>
        </div>

        {/* Content: Sidebar + Grid */}
        <div style={{ display: 'flex', gap: '40px' }}>
          <FilterSidebar filters={filters} setFilters={setFilters} />

          <div style={{ flex: 1, minWidth: 0 }}>
            {isLoading ? (
              <ProductGridSkeleton />
            ) : (
              <ProductGrid products={filtered} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
