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

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/orders", label: "Orders" },
];

export function Navbar({ logoUrl }: { logoUrl?: string }) {
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
    setMobileOpen(false);
    await firebaseLogOut();
    toast.success("Signed out");
  }

  if (!mounted) return null;
  return (
    <>
      <header
        className="fixed top-12 left-0 right-0 z-50"
        style={{
          background: "rgba(6,4,13,0.92)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="container-lg flex items-center justify-between h-[88px] lg:h-[80px]">

          {/* LEFT: Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}
                className="relative px-3 py-2 text-sm font-medium transition-colors rounded-lg whitespace-nowrap"
                style={{ color: pathname === href ? "var(--purple-300)" : "var(--text-secondary)" }}
              >
                {pathname === href && (
                  <motion.div layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "rgba(147,51,234,0.12)", border: "1px solid rgba(147,51,234,0.25)" }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            ))}
            <Link href="/hotwheels"
              className="relative px-3 py-2 text-sm font-bold transition-colors rounded-lg whitespace-nowrap"
              style={{ color: "#fbbf24" }}
            >
              HotWheels
            </Link>
          </nav>

          {/* LEFT (mobile): Burger */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-xl transition-colors hover:bg-white/5"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Open menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* CENTER: Brand */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
            <span
              className="text-xl lg:text-3xl font-black tracking-wider gradient-text leading-tight"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              MIAKSAAA
            </span>
            <span
              className="text-[10px] lg:text-xs tracking-[0.15em] uppercase leading-none mt-0.5 whitespace-nowrap"
              style={{ color: "var(--text-muted)" }}
            >
              Fashion and Fun World
            </span>
          </Link>

          {/* RIGHT: Desktop */}
          <div className="hidden lg:flex items-center gap-0.5">
            <Link href="/wishlist"
              className="relative p-2 rounded-xl transition-colors hover:bg-white/5"
              style={{ color: "var(--text-secondary)" }}
            >
              <Heart size={22} />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#fbbf24,#d97706)", color: "#0a0614" }}>
                  {wishCount}
                </span>
              )}
            </Link>

            <button onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-xl transition-colors hover:bg-white/5"
              style={{ color: "var(--text-secondary)" }}
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#9333ea,#7e22ce)", color: "#fff" }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Profile icon */}
            {user ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="p-1.5 rounded-xl transition-colors hover:bg-white/5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: "var(--purple-500)" }}>
                    {user.photoURL ? (
                      <Image src={user.photoURL} alt="" width={28} height={28} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--gradient-purple)" }}>
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
                      style={{ background: "rgba(18,10,36,0.95)", border: "1px solid var(--glass-border)" }}
                    >
                      <div className="p-1.5 flex flex-col gap-0.5">
                        <Link href="/profile" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-purple-600/10 transition-colors">
                          <User size={15} style={{ color: "var(--purple-400)" }} /> Profile
                        </Link>
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
              <button onClick={handleLogin}
                className="ml-1 px-4 py-1.5 text-xs font-bold rounded-full transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #9333ea, #7e22ce)",
                  color: "#fff",
                  boxShadow: "0 0 12px rgba(147,51,234,0.3)",
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
              style={{ color: "var(--text-secondary)" }}
            >
              <Heart size={22} />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#fbbf24,#d97706)", color: "#0a0614" }}>
                  {wishCount}
                </span>
              )}
            </Link>
            <button onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-xl transition-colors hover:bg-white/5"
              style={{ color: "var(--text-secondary)" }}
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#9333ea,#7e22ce)", color: "#fff" }}>
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
              style={{ background: "rgba(10,6,20,0.98)", borderColor: "rgba(147,51,234,0.12)" }}
            >
              <div className="container-lg pt-4 pb-5 px-5 flex flex-col gap-1">

                {user ? (
                  <Link href="/profile" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-colors active:scale-[0.98]"
                    style={{ color: "var(--text-primary)", background: "rgba(147,51,234,0.08)" }}
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden border shrink-0" style={{ borderColor: "var(--purple-500)" }}>
                      {user.photoURL ? (
                        <Image src={user.photoURL} alt="" width={28} height={28} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--gradient-purple)" }}>
                          <User size={13} />
                        </div>
                      )}
                    </div>
                    <span>{user.displayName || "Profile"}</span>
                  </Link>
                ) : (
                  <button onClick={() => { handleLogin(); setMobileOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-colors active:scale-[0.98] text-left"
                    style={{ color: "var(--text-primary)", background: "rgba(147,51,234,0.08)" }}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "var(--gradient-purple)" }}>
                      <User size={13} />
                    </div>
                    <span>Sign In</span>
                  </button>
                )}

                <div className="h-px my-1.5" style={{ background: "rgba(147,51,234,0.1)" }} />

                <Link href="/" onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-[15px] font-medium transition-colors active:scale-[0.98]"
                  style={{
                    color: pathname === "/" ? "var(--purple-300)" : "rgba(196,181,253,0.7)",
                    background: pathname === "/" ? "rgba(147,51,234,0.1)" : "transparent",
                  }}>
                  Home
                </Link>
                <Link href="/products" onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-[15px] font-medium transition-colors active:scale-[0.98]"
                  style={{
                    color: pathname.startsWith("/products") ? "var(--purple-300)" : "rgba(196,181,253,0.7)",
                    background: pathname.startsWith("/products") ? "rgba(147,51,234,0.1)" : "transparent",
                  }}>
                  Shop
                </Link>
                <Link href="/orders" onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-[15px] font-medium transition-colors active:scale-[0.98]"
                  style={{
                    color: pathname === "/orders" ? "var(--purple-300)" : "rgba(196,181,253,0.7)",
                    background: pathname === "/orders" ? "rgba(147,51,234,0.1)" : "transparent",
                  }}>
                  Orders
                </Link>

                <div className="h-px my-1.5" style={{ background: "rgba(147,51,234,0.1)" }} />

                <Link href="/hotwheels" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-[15px] font-bold transition-colors active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,68,0,0.12), rgba(251,191,36,0.08))",
                    border: "1px solid rgba(255,68,0,0.2)",
                    color: "#fbbf24",
                  }}>
                  Go To HotWheels Store
                </Link>

                {user && (
                  <button onClick={handleLogout}
                    className="px-4 py-3 rounded-xl text-[15px] font-medium transition-colors active:scale-[0.98] text-left mt-1"
                    style={{ color: "#fca5a5", background: "rgba(239,68,68,0.06)" }}>
                    Sign Out
                  </button>
                )}
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
