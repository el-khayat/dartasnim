import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { seedProducts } from '../lib/seedData'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      if (!supabase) return seedProducts

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) {
        return seedProducts
      }
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}
