import { useState, useCallback, useRef } from 'react'
import useProductStore, { searchProducts } from '../store/useProductStore'

export function useSearch(lang = 'en') {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const products = useProductStore(s => s.products)
  const debounceRef = useRef(null)

  const handleSearch = useCallback((value) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        setResults(searchProducts(products, value, lang))
      } else {
        setResults([])
      }
    }, 200)
  }, [products, lang])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
  }, [])

  return { query, results, handleSearch, clearSearch }
}
