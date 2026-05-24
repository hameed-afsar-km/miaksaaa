// Zustand wishlist store with localStorage persistence
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { WishlistItem, WishlistState } from "@/lib/types";

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: WishlistItem) => {
        if (!get().isInWishlist(item.productId)) {
          set((state) => ({ items: [...state.items, item] }));
        }
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      isInWishlist: (productId: string) => {
        return get().items.some((i) => i.productId === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "miaksaaa-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
