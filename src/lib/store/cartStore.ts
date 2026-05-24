// Zustand cart store with persist middleware
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, CartState } from "@/lib/types";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: "",
      couponDiscount: 0,
      couponType: "percent" as const,

      addItem: (newItem: CartItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === newItem.productId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === newItem.productId
                  ? {
                      ...i,
                      quantity: Math.min(i.quantity + newItem.quantity, i.stock),
                    }
                  : i
              ),
            };
          }
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: "", couponDiscount: 0 }),

      applyCoupon: (
        code: string,
        discount: number,
        type: "percent" | "fixed"
      ) => {
        set({ couponCode: code, couponDiscount: discount, couponType: type });
      },

      removeCoupon: () =>
        set({ couponCode: "", couponDiscount: 0, couponType: "percent" }),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => {
          const price = item.discountedPrice ?? item.price;
          return sum + price * item.quantity;
        }, 0);
      },

      getDiscount: () => {
        const { couponDiscount, couponType, getSubtotal } = get();
        if (!couponDiscount) return 0;
        const subtotal = getSubtotal();
        if (couponType === "percent") {
          return Math.round(subtotal * (couponDiscount / 100) * 100) / 100;
        }
        return Math.min(couponDiscount, subtotal);
      },

      getTotal: () => {
        const { getSubtotal, getDiscount } = get();
        return Math.max(0, getSubtotal() - getDiscount());
      },

      getTotalItems: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: "miaksaaa-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
