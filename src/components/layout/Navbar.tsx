"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag, Heart, Search, User, Menu, X, LogOut,
  ChevronDown, Shield, Package
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import { useUIStore } from "@/lib/store/uiStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { logOut, signInWithGoogle } from "@/lib/firebase/auth";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/orders", label: "Orders" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuthStore();
  const { setCartOpen } = useUIStore();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const wishCount = useWishlistStore((s) => s.items.length);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogin() {
    try {
      await signInWithGoogle();
      toast.success("Welcome back!");
    } catch {
      toast.error("Login failed. Please try again.");
    }
  }

  async function handleLogout() {
    await logOut();
    setProfileOpen(false);
    toast.success("Signed out");
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 glass"
        style={{ borderBottom: "1px solid var(--glass-border)" }}
      >
        <div className="container-lg flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)",
                boxShadow: "0 0 20px rgba(147,51,234,0.4)",
              }}
            >
              <span className="text-white font-black text-sm" style={{ fontFamily: "Playfair Display, serif" }}>M</span>
            </div>
            <span
              className="text-xl font-black tracking-wider gradient-text hidden sm:block"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              MIAKSAAA
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative px-4 py-2 text-sm font-medium transition-colors rounded-lg"
                style={{ color: pathname === href ? "var(--purple-300)" : "var(--text-secondary)" }}
              >
                {pathname === href && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "rgba(147,51,234,0.12)", border: "1px solid rgba(147,51,234,0.25)" }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Wishlist */}
            <Link href="/wishlist" className="relative btn-ghost p-2 rounded-xl hidden sm:flex">
              <Heart size={20} />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#fbbf24,#d97706)", color: "#0a0614" }}>
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative btn-ghost p-2 rounded-xl">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#9333ea,#7e22ce)", color: "#fff" }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 btn-ghost px-2 py-1.5 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2" style={{ borderColor: "var(--purple-500)" }}>
                    {user.photoURL ? (
                      <Image src={user.photoURL} alt={user.displayName ?? "User"} width={32} height={32} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--gradient-purple)" }}>
                        <User size={16} />
                      </div>
                    )}
                  </div>
                  <ChevronDown size={14} className={`hidden sm:block transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-52 glass rounded-xl overflow-hidden"
                      style={{ border: "1px solid var(--glass-border)" }}
                    >
                      <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
                        <p className="text-sm font-semibold truncate">{user.displayName}</p>
                        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{user.email}</p>
                      </div>
                      <div className="p-1.5 flex flex-col gap-0.5">
                        <Link href="/profile" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-purple-600/10 transition-colors">
                          <User size={15} style={{ color: "var(--purple-400)" }} /> Profile
                        </Link>
                        <Link href="/orders" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-purple-600/10 transition-colors">
                          <Package size={15} style={{ color: "var(--purple-400)" }} /> My Orders
                        </Link>
                        {isAdmin && (
                          <Link href="/admin/dashboard" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-purple-600/10 transition-colors"
                            style={{ color: "var(--gold-400)" }}>
                            <Shield size={15} /> Admin Panel
                          </Link>
                        )}
                        <div className="my-1 h-px" style={{ background: "var(--border)" }} />
                        <button onClick={handleLogout}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-red-500/10 transition-colors w-full text-left"
                          style={{ color: "#fca5a5" }}>
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button onClick={handleLogin} className="btn-primary py-2 px-4 text-sm hidden sm:flex">
                Sign In
              </button>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="btn-ghost p-2 rounded-xl md:hidden">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden glass border-t"
              style={{ borderColor: "var(--glass-border)" }}
            >
              <div className="container-lg py-4 flex flex-col gap-1">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      color: pathname === href ? "var(--purple-300)" : "var(--text-secondary)",
                      background: pathname === href ? "rgba(147,51,234,0.1)" : "transparent",
                    }}>
                    {label}
                  </Link>
                ))}
                {!user && (
                  <button onClick={() => { handleLogin(); setMobileOpen(false); }}
                    className="btn-primary mt-2">Sign In with Google</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Backdrop for profile dropdown */}
      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </>
  );
}
