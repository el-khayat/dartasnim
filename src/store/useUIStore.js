import { create } from 'zustand'

const useUIStore = create((set) => ({
  isMobileMenuOpen: false,
  isFilterDrawerOpen: false,
  isQuickViewOpen: false,
  quickViewProduct: null,
  isCartDrawerOpen: false,

  toggleMobileMenu: () => set(s => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  toggleFilterDrawer: () => set(s => ({ isFilterDrawerOpen: !s.isFilterDrawerOpen })),
  closeFilterDrawer: () => set({ isFilterDrawerOpen: false }),

  openQuickView: (product) => set({ isQuickViewOpen: true, quickViewProduct: product }),
  closeQuickView: () => set({ isQuickViewOpen: false, quickViewProduct: null }),

  toggleCartDrawer: () => set(s => ({ isCartDrawerOpen: !s.isCartDrawerOpen })),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
}))

export default useUIStore
