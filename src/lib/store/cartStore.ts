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
          const key = `${newItem.productId}::${newItem.selectedColor || ""}::${newItem.selectedSize || ""}::${newItem.frameCustomization ? JSON.stringify(newItem.frameCustomization) : ""}`;
          const existing = state.items.find(
            (i) => `${i.productId}::${i.selectedColor || ""}::${i.selectedSize || ""}::${i.frameCustomization ? JSON.stringify(i.frameCustomization) : ""}` === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                `${i.productId}::${i.selectedColor || ""}::${i.selectedSize || ""}::${i.frameCustomization ? JSON.stringify(i.frameCustomization) : ""}` === key
                  ? { ...i, quantity: Math.min(i.quantity + newItem.quantity, i.stock) }
                  : i
              ),
            };
          }
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId: string, selectedColor?: string, selectedSize?: string) => {
        set((state) => ({
          items: state.items.filter((i) => {
            if (selectedColor !== undefined || selectedSize !== undefined) {
              return !(
                i.productId === productId &&
                (i.selectedColor || "") === (selectedColor || "") &&
                (i.selectedSize || "") === (selectedSize || "")
              );
            }
            return i.productId !== productId;
          }),
        }));
      },

      removeCustomItem: (productId: string, frameCustomization?: any) => {
        set((state) => ({
          items: state.items.filter((i) => {
            if (frameCustomization) {
              return !(i.productId === productId && JSON.stringify(i.frameCustomization) === JSON.stringify(frameCustomization));
            }
            return i.productId !== productId;
          }),
        }));
      },

      updateQuantity: (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => {
        set((state) => ({
          items: state.items.map((i) => {
            const match =
              selectedColor !== undefined || selectedSize !== undefined
                ? i.productId === productId &&
                  (i.selectedColor || "") === (selectedColor || "") &&
                  (i.selectedSize || "") === (selectedSize || "")
                : i.productId === productId;
            return match
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
              : i;
          }),
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
