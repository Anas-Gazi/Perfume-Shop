// Zustand store for authentication
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  hasInitialized: false,
  isLoading: false,
  error: null,

  // Actions
  setUser: (user, token) =>
    set({
      user,
      token,
      hasInitialized: true,
      error: null,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      hasInitialized: true,
    }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Initialize from localStorage
  initialize: () => {
    if (typeof window !== 'undefined') {
      // Rehydrate auth state on page refresh so protected UI does not flicker.
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (user && token) {
        set({
          user: JSON.parse(user),
          token,
          hasInitialized: true,
        });
      } else {
        set({ hasInitialized: true });
      }
    }
  },
}));
