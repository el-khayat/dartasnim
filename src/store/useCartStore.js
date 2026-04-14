import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, volume) => {
        const { items } = get()
        const existingIndex = items.findIndex(
          item => item.product.id === product.id && item.selectedVolume === volume
        )

        if (existingIndex >= 0) {
          const newItems = [...items]
          newItems[existingIndex].quantity += 1
          set({ items: newItems })
        } else {
          set({
            items: [...items, { product, quantity: 1, selectedVolume: volume }],
          })
        }
      },

      removeItem: (productId, volume) => {
        const { items } = get()
        set({
          items: items.filter(
            item => !(item.product.id === productId && item.selectedVolume === volume)
          ),
        })
      },

      updateQuantity: (productId, volume, qty) => {
        if (qty < 1) return
        const { items } = get()
        const newItems = items.map(item =>
          item.product.id === productId && item.selectedVolume === volume
            ? { ...item, quantity: qty }
            : item
        )
        set({ items: newItems })
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      },

      getTotalItems: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'perfume-cart',
    }
  )
)

export default useCartStore
