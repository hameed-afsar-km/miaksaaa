import { create } from "zustand";

export interface AddedToCartItem {
  productId: string;
  title: string;
  price: number;
  discountedPrice?: number;
  image: string;
  quantity: number;
  category?: string;
}

interface ModalState {
  isOpen: boolean;
  item: AddedToCartItem | null;
  openModal: (item: AddedToCartItem) => void;
  closeModal: () => void;
}

export const useAddedToCartModal = create<ModalState>((set) => ({
  isOpen: false,
  item: null,
  openModal: (item) => set({ isOpen: true, item }),
  closeModal: () => set({ isOpen: false, item: null }),
}));
