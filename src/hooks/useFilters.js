import { useState, useCallback } from 'react'

const defaultFilters = {
  category: 'all',
  brand: [],
  minPrice: 0,
  maxPrice: 0,
  scentNotes: [],
  sort: 'featured',
}

export function useFilters(initialFilters = {}) {
  const [filters, setFilters] = useState({ ...defaultFilters, ...initialFilters })

  const resetFilters = useCallback((maxPrice) => {
    setFilters({ ...defaultFilters, maxPrice: maxPrice || 0 })
  }, [])

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  return { filters, setFilters, resetFilters, updateFilter }
}
