// Zustand store for shopping cart
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      // Add product to cart
      addToCart: (product, quantity) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.productId === product.id);

          let updatedItems;
          if (existingItem) {
            updatedItems = state.items.map((item) =>
              item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
            );
          } else {
            updatedItems = [...state.items, { ...product, productId: product.id, quantity }];
          }

          const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

          return {
            items: updatedItems,
            total,
          };
        }),

      // Remove from cart
      removeFromCart: (productId) =>
        set((state) => {
          const updatedItems = state.items.filter((item) => item.productId !== productId);
          const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

          return {
            items: updatedItems,
            total,
          };
        }),

      // Update quantity
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return get().removeFromCart(productId);
          }

          const updatedItems = state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          );
          const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

          return {
            items: updatedItems,
            total,
          };
        }),

      // Clear cart
      clearCart: () =>
        set({
          items: [],
          total: 0,
        }),

      // Get cart summary
      getCartSummary: () => {
        const state = get();
        return {
          itemCount: state.items.length,
          totalItems: state.items.reduce((sum, item) => sum + item.quantity, 0),
          total: state.total,
        };
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
