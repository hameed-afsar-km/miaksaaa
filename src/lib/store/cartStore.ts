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
      couponCategories: [] as string[],

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

      clearCart: () =>
        set({ items: [], couponCode: "", couponDiscount: 0, couponCategories: [] }),

      applyCoupon: (
        code: string,
        discount: number,
        type: "percent" | "fixed",
        categories?: string[]
      ) => {
        set({ couponCode: code, couponDiscount: discount, couponType: type, couponCategories: categories ?? [] });
      },

      removeCoupon: () =>
        set({ couponCode: "", couponDiscount: 0, couponType: "percent", couponCategories: [] }),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => {
          const price = item.discountedPrice ?? item.price;
          return sum + price * item.quantity;
        }, 0);
      },

      getEligibleSubtotal: () => {
        const { items, couponCategories } = get();
        if (couponCategories.length === 0) return get().getSubtotal();
        return items.reduce((sum, item) => {
          if (!item.category || !couponCategories.includes(item.category)) return sum;
          const price = item.discountedPrice ?? item.price;
          return sum + price * item.quantity;
        }, 0);
      },

      getDiscount: () => {
        const { couponDiscount, couponType, getEligibleSubtotal } = get();
        if (!couponDiscount) return 0;
        const eligible = getEligibleSubtotal();
        if (eligible === 0) return 0;
        if (couponType === "percent") {
          return Math.round(eligible * (couponDiscount / 100) * 100) / 100;
        }
        return Math.min(couponDiscount, eligible);
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
