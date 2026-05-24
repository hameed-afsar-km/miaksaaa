// Zustand UI store for modals, drawers, and global UI state
import { create } from "zustand";

interface UIState {
  cartOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  splashDone: boolean;
  setCartOpen: (val: boolean) => void;
  setMobileMenuOpen: (val: boolean) => void;
  setSearchOpen: (val: boolean) => void;
  setSplashDone: (val: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  splashDone: false,
  setCartOpen: (val) => set({ cartOpen: val }),
  setMobileMenuOpen: (val) => set({ mobileMenuOpen: val }),
  setSearchOpen: (val) => set({ searchOpen: val }),
  setSplashDone: (val) => set({ splashDone: val }),
}));
