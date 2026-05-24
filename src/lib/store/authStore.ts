// Zustand auth store
import { create } from "zustand";
import { User } from "firebase/auth";

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  setIsAdmin: (val: boolean) => void;
  setLoading: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  loading: true,
  setUser: (user) => set({ user }),
  setIsAdmin: (val) => set({ isAdmin: val }),
  setLoading: (val) => set({ loading: val }),
}));
