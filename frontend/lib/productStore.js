// Zustand store for products
import { create } from 'zustand';

export const useProductStore = create((set) => ({
  products: [],
  selectedProduct: null,
  filters: {
    category: '',
    fragranceType: '',
    minPrice: 0,
    maxPrice: 10000,
    search: '',
  },
  isLoading: false,
  error: null,

  // Actions
  setProducts: (products) => set({ products, error: null }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  resetFilters: () =>
    set({
      filters: {
        category: '',
        fragranceType: '',
        minPrice: 0,
        maxPrice: 10000,
        search: '',
      },
    }),
}));
