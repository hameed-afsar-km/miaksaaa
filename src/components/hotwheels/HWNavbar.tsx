"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag, User, Menu, X, LogOut,
  ChevronDown, Shield, Package, Star, Heart, Flame,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import { useUIStore } from "@/lib/store/uiStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { logOut, signInWithGoogle } from "@/lib/firebase/auth";
import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

const NAV_LINKS = [
  { href: "/hotwheels", label: "Home" },
  { href: "/hotwheels/products", label: "Collectibles" },
  { href: "/hotwheels/frames", label: "Custom Frames" },
];

export function HWNavbar() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuthStore();
  const { setCartOpen } = useUIStore();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const wishCount = useWishlistStore((s) => s.items.length);

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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

  if (!mounted) return null;
  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(26,5,0,0.92)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255,68,0,0.15)",
        }}
      >
        <div className="container-lg flex items-center h-16 lg:h-[72px]">

          {/* LEFT: Desktop nav */}
          <div className="flex-1 flex justify-start items-center">
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href || (href !== "/hotwheels" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative px-4 py-2 text-sm font-bold transition-colors rounded-lg whitespace-nowrap"
                  style={{
                    color: isActive ? "#FF6600" : "#cc9980",
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="hw-nav-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: "rgba(255,68,0,0.12)", border: "1px solid rgba(255,68,0,0.25)" }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
          </nav>
          </div>

          {/* CENTER: Logo */}
          <div className="flex items-center justify-center">
            <Link href="/hotwheels" className="flex items-center gap-2 shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
              <Image
                src="/hw_logo.png"
                alt="Hot Wheels"
                width={240}
                height={96}
                className="h-14 lg:h-20 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex-1 flex items-center justify-end gap-0.5">
            {/* Return to Main Shop */}
            <Link href="/"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wide rounded-full transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
                color: "#fff",
                boxShadow: "0 0 12px rgba(124,58,237,0.3)",
                letterSpacing: "0.03em",
              }}
            >
              <Flame size={13} />
              Main Store
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist"
              className="hidden lg:flex relative btn-ghost rounded-xl"
              style={{ padding: "10px", color: "#cc9980" }}
            >
              <Heart size={20} />
              {mounted && wishCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#FF4400,#D32F2F)", color: "#fff" }}>
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative btn-ghost rounded-xl" style={{ padding: "10px", color: "#cc9980" }}>
              <ShoppingBag size={20} />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#FF4400,#D32F2F)", color: "#fff" }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Profile */}
            {user ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1 btn-ghost rounded-xl"
                  style={{ padding: "6px 8px", color: "#cc9980" }}>
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: "#FF4400" }}>
                    {user.photoURL ? (
                      <Image src={user.photoURL} alt={user.displayName ?? "User"} width={32} height={32} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FF4400] to-[#D32F2F]">
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
                      className="absolute right-0 top-14 w-52 rounded-xl overflow-hidden z-50"
                      style={{ background: "#1A0500", border: "1px solid rgba(255,68,0,0.25)" }}
                    >
                      <div className="p-3 border-b" style={{ borderColor: "rgba(255,68,0,0.15)" }}>
                        <p className="text-sm font-semibold truncate text-[#FFE0CC]">{user.displayName}</p>
                        <p className="text-xs truncate" style={{ color: "#cc9980" }}>{user.email}</p>
                      </div>
                      <div className="p-1.5 flex flex-col gap-0.5">
                        <Link href="/profile" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-[#FF4400]/10 transition-colors text-[#FFE0CC]">
                          <User size={15} style={{ color: "#FF6600" }} /> Profile
                        </Link>
                        <Link href="/orders" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-[#FF4400]/10 transition-colors text-[#FFE0CC]">
                          <Package size={15} style={{ color: "#FF6600" }} /> My Orders
                        </Link>
                        {isAdmin && (
                          <Link href="/admin/dashboard" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-[#FF4400]/10 transition-colors"
                            style={{ color: "#FFD600" }}>
                            <Shield size={15} /> Admin Panel
                          </Link>
                        )}
                        <div className="my-1 h-px" style={{ background: "rgba(255,68,0,0.1)" }} />
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
              <button onClick={handleLogin}
                className="flex items-center gap-1.5 font-bold tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #FF4400, #D32F2F)",
                  color: "#fff",
                  fontSize: "0.75rem",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  boxShadow: "0 0 16px rgba(255,68,0,0.4)",
                  letterSpacing: "0.05em",
                }}
              >
                <User size={14} />
                <span className="hidden xs:inline">Sign In</span>
                <span className="xs:hidden">In</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden btn-ghost rounded-xl"
              style={{ padding: "10px", color: "#cc9980" }}>
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
              className="overflow-hidden"
              style={{ background: "#1A0500", borderTop: "1px solid rgba(255,68,0,0.15)" }}
            >
              <div className="container-lg py-4 flex flex-col gap-1">
                {NAV_LINKS.map(({ href, label }) => {
                  const isActive = pathname === href || (href !== "/hotwheels" && pathname.startsWith(href));
                  return (
                    <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                      style={{
                        color: isActive ? "#FF6600" : "#cc9980",
                        background: isActive ? "rgba(255,68,0,0.1)" : "transparent",
                      }}>
                      {label}
                    </Link>
                  );
                })}
                <Link href="/wishlist" onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between"
                  style={{ color: pathname === "/wishlist" ? "#FF6600" : "#cc9980" }}>
                  Wishlist
                  {wishCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: "linear-gradient(135deg,#FF4400,#D32F2F)", color: "#fff" }}>
                      {wishCount}
                    </span>
                  )}
                </Link>
                <Link href="/" onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium transition-colors text-amber-400/70 hover:text-amber-300">
                  ← Main Store
                </Link>
                {!user && (
                  <button onClick={() => { handleLogin(); setMobileOpen(false); }}
                    className="btn-primary mt-2" style={{ background: "linear-gradient(135deg, #FF4400, #D32F2F)" }}>
                    Sign In with Google
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </>
  );
}
