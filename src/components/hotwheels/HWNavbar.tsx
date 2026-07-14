"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User, Heart, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import { useUIStore } from "@/lib/store/uiStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { logOut as firebaseLogOut, signInWithGoogle } from "@/lib/firebase/auth";
import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

const HW_NAV_LINKS = [
  { href: "/hotwheels", label: "Home" },
  { href: "/hotwheels/products", label: "Collectibles" },
  { href: "/hotwheels/frames", label: "Custom Frames" },
];

export function HWNavbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { setCartOpen } = useUIStore();
  const totalItems = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const wishCount = useWishlistStore((s) => s.items.length);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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
    setProfileOpen(false);
    await firebaseLogOut();
    toast.success("Signed out");
  }

  if (!mounted) return null;
  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(26,5,0,0.92)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255,68,0,0.12)",
        }}
      >
        <div className="container-lg flex items-center justify-between h-[71px] lg:h-16">

          {/* LEFT: Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {HW_NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href || (href !== "/hotwheels" && pathname.startsWith(href));
              return (
                <Link key={href} href={href}
                  className="relative px-3 py-2 text-sm font-bold transition-colors rounded-lg whitespace-nowrap"
                  style={{ color: isActive ? "#FF6600" : "#cc9980" }}
                >
                  {isActive && (
                    <motion.div layoutId="hw-nav-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: "rgba(255,68,0,0.12)", border: "1px solid rgba(255,68,0,0.25)" }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
            <Link href="/"
              className="relative px-3 py-2 text-sm font-bold transition-colors rounded-lg whitespace-nowrap"
              style={{ color: "#a855f7" }}
            >
              Main Store
            </Link>
          </nav>

          {/* LEFT (mobile): Burger */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl transition-colors hover:bg-white/5"
            style={{ color: "#cc9980" }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* CENTER: Logo */}
          <Link href="/hotwheels" className="absolute left-1/2 -translate-x-1/2 shrink-0 hidden lg:block">
            <Image src="/hw_logo.png" alt="Hot Wheels" width={240} height={80}
              className="h-10 lg:h-12 w-auto object-contain" priority />
          </Link>
          <Link href="/hotwheels" className="shrink-0 lg:hidden">
            <Image src="/hw_logo.png" alt="Hot Wheels" width={240} height={80}
              className="h-10 w-auto object-contain" priority />
          </Link>

          {/* RIGHT: Desktop */}
          <div className="hidden lg:flex items-center gap-0.5">
            <Link href="/wishlist"
              className="relative p-2 rounded-xl transition-colors hover:bg-white/5"
              style={{ color: "#cc9980" }}
            >
              <Heart size={20} />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#FF4400,#D32F2F)", color: "#fff" }}>
                  {wishCount}
                </span>
              )}
            </Link>

            <button onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-xl transition-colors hover:bg-white/5"
              style={{ color: "#cc9980" }}
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#FF4400,#D32F2F)", color: "#fff" }}>
                  {totalItems}
                </span>
              )}
            </button>

            <Link href="/orders"
              className="relative p-2 rounded-xl transition-colors hover:bg-white/5"
              style={{ color: pathname === "/orders" ? "#FF6600" : "#cc9980" }}
            >
              <span className="text-sm font-bold">Orders</span>
            </Link>

            {/* Profile icon */}
            {user ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="p-1.5 rounded-xl transition-colors hover:bg-white/5"
                  style={{ color: "#cc9980" }}
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: "#FF4400" }}>
                    {user.photoURL ? (
                      <Image src={user.photoURL} alt="" width={28} height={28} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FF4400] to-[#D32F2F]">
                        <User size={13} />
                      </div>
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-48 rounded-xl overflow-hidden z-50"
                      style={{ background: "#1A0500", border: "1px solid rgba(255,68,0,0.25)" }}
                    >
                      <div className="p-1.5 flex flex-col gap-0.5">
                        <Link href="/profile" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-[#FF4400]/10 transition-colors text-[#FFE0CC]">
                          <User size={15} style={{ color: "#FF6600" }} /> Profile
                        </Link>
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
                className="ml-1 px-4 py-1.5 text-xs font-bold rounded-full transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #FF4400, #D32F2F)",
                  color: "#fff",
                  boxShadow: "0 0 12px rgba(255,68,0,0.3)",
                }}
              >
                Sign In
              </button>
            )}
          </div>

          {/* RIGHT: Mobile icons */}
          <div className="flex lg:hidden items-center gap-0.5">
            <Link href="/wishlist"
              className="relative p-2 rounded-xl transition-colors hover:bg-white/5"
              style={{ color: "#cc9980" }}
            >
              <Heart size={20} />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#FF4400,#D32F2F)", color: "#fff" }}>
                  {wishCount}
                </span>
              )}
            </Link>
            <button onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-xl transition-colors hover:bg-white/5"
              style={{ color: "#cc9980" }}
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#FF4400,#D32F2F)", color: "#fff" }}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-t"
              style={{ background: "rgba(26,5,0,0.98)", borderColor: "rgba(255,68,0,0.12)" }}
            >
              <div className="container-lg py-5 flex flex-col gap-1">
                {user ? (
                  <Link href="/profile" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-colors active:scale-[0.98]"
                    style={{ color: "#FFE0CC", background: "rgba(255,68,0,0.08)" }}
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden border shrink-0" style={{ borderColor: "#FF4400" }}>
                      {user.photoURL ? (
                        <Image src={user.photoURL} alt="" width={28} height={28} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FF4400] to-[#D32F2F]">
                          <User size={13} />
                        </div>
                      )}
                    </div>
                    <span>{user.displayName || "Profile"}</span>
                  </Link>
                ) : (
                  <button onClick={() => { handleLogin(); setMobileOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-colors active:scale-[0.98] text-left"
                    style={{ color: "#FFE0CC", background: "rgba(255,68,0,0.08)" }}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, #FF4400, #D32F2F)" }}>
                      <User size={13} />
                    </div>
                    <span>Sign In</span>
                  </button>
                )}

                <div className="h-px my-1.5" style={{ background: "rgba(255,68,0,0.1)" }} />

                <Link href="/hotwheels" onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-[15px] font-medium transition-colors active:scale-[0.98]"
                  style={{
                    color: pathname === "/hotwheels" ? "#FF6600" : "#cc9980",
                    background: pathname === "/hotwheels" ? "rgba(255,68,0,0.1)" : "transparent",
                  }}>
                  Home
                </Link>
                <Link href="/hotwheels/products" onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-[15px] font-medium transition-colors active:scale-[0.98]"
                  style={{
                    color: pathname.startsWith("/hotwheels/products") ? "#FF6600" : "#cc9980",
                    background: pathname.startsWith("/hotwheels/products") ? "rgba(255,68,0,0.1)" : "transparent",
                  }}>
                  Collectibles
                </Link>
                <Link href="/hotwheels/frames" onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-[15px] font-medium transition-colors active:scale-[0.98]"
                  style={{
                    color: pathname.startsWith("/hotwheels/frames") ? "#FF6600" : "#cc9980",
                    background: pathname.startsWith("/hotwheels/frames") ? "rgba(255,68,0,0.1)" : "transparent",
                  }}>
                  Custom Frames
                </Link>

                <div className="h-px my-1.5" style={{ background: "rgba(255,68,0,0.1)" }} />

                <Link href="/" onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-[15px] font-semibold transition-colors active:scale-[0.98]"
                  style={{ color: "#a855f7" }}>
                  Main Store
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {(mobileOpen || profileOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setMobileOpen(false); setProfileOpen(false); }} />
      )}
    </>
  );
}
