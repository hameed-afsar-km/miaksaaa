"use client";
// Auth provider that syncs Firebase auth state to Zustand
import { useEffect } from "react";
import { onAuthChange, checkIsAdmin } from "@/lib/firebase/auth";
import { useAuthStore } from "@/lib/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setIsAdmin, setLoading } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      setUser(user);
      if (user) {
        const admin = await checkIsAdmin(user.uid, user.email);
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [setUser, setIsAdmin, setLoading]);

  return <>{children}</>;
}
