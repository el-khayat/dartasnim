import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { seedProducts } from '../lib/seedData'

const useProductStore = create((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  usingSeedData: false,

  fetchProducts: async () => {
    set({ isLoading: true, error: null })

    if (!supabase) {
      set({ products: seedProducts, isLoading: false, usingSeedData: true })
      return
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        set({ products: data, isLoading: false, usingSeedData: false })
      } else {
        set({ products: seedProducts, isLoading: false, usingSeedData: true })
      }
    } catch {
      set({ products: seedProducts, isLoading: false, usingSeedData: true, error: null })
    }
  },
}))

export function getFiltered(products, filters) {
  let filtered = [...products]

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(p => p.category === filters.category)
  }

  if (filters.brand && filters.brand.length > 0) {
    filtered = filtered.filter(p => filters.brand.includes(p.brand))
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= filters.minPrice)
  }
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice)
  }

  if (filters.scentNotes && filters.scentNotes.length > 0) {
    filtered = filtered.filter(p => {
      const allNotes = [
        ...(p.scent_notes?.top || []),
        ...(p.scent_notes?.middle || []),
        ...(p.scent_notes?.base || []),
      ].map(n => n.toLowerCase())
      return filters.scentNotes.some(note => allNotes.includes(note.toLowerCase()))
    })
  }

  if (filters.sort) {
    switch (filters.sort) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'featured':
      default:
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
        break
    }
  }

  return filtered
}

export function searchProducts(products, query, lang = 'en') {
  if (!query || query.trim() === '') return products

  const q = query.toLowerCase().trim()
  const nameField = `name_${lang}`

  return products.filter(p => {
    const name = (p[nameField] || p.name_en || '').toLowerCase()
    const brand = (p.brand || '').toLowerCase()
    const category = (p.category || '').toLowerCase()
    return name.includes(q) || brand.includes(q) || category.includes(q)
  })
}

export default useProductStore
