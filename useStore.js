import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import API from '../lib/api';

const useStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      token: null,
      setUser: (user, token) => {
        if (token) localStorage.setItem('treandspot_token', token);
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem('treandspot_token');
        set({ user: null, token: null, cart: { items: [] }, wishlist: [] });
      },

      // Cart
      cart: { items: [] },
      cartCount: 0,
      setCart: (cart) => set({ cart, cartCount: cart?.items?.length || 0 }),
      fetchCart: async () => {
        try {
          const { data } = await API.get('/cart');
          set({ cart: data.cart, cartCount: data.cart?.items?.length || 0 });
        } catch {}
      },

      // Wishlist
      wishlist: [],
      setWishlist: (wishlist) => set({ wishlist }),
      fetchWishlist: async () => {
        try {
          const { data } = await API.get('/wishlist');
          set({ wishlist: data.wishlist.map((p) => p._id) });
        } catch {}
      },
      toggleWishlist: async (productId) => {
        try {
          const { data } = await API.post(`/wishlist/toggle/${productId}`);
          set({ wishlist: data.wishlist });
        } catch {}
      },
      isWishlisted: (productId) => get().wishlist.includes(productId),

      // Notifications
      notifications: [],
      addNotification: (msg) => set((s) => ({ notifications: [{ id: Date.now(), msg }, ...s.notifications.slice(0, 4)] })),
    }),
    { name: 'treandspot-store', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);

export default useStore;
