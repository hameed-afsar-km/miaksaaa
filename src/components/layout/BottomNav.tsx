"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const TABS = [
  { href: "/",          icon: Home,        label: "Home" },
  { href: "/products",  icon: ShoppingBag, label: "Shop" },
  { href: "/cart",      icon: ShoppingBag, label: "Cart", isCart: true },
  { href: "/profile",   icon: User,        label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass bottom-nav-safe"
      style={{ borderTop: "1px solid var(--glass-border)" }}
    >
      <div className="flex items-center justify-around px-2 h-16">
        {TABS.map(({ href, icon: Icon, label, isCart }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl transition-all"
            >
              <div className="relative">
                {active && (
                  <motion.div
                    layoutId="bottom-tab"
                    className="absolute inset-0 -m-2 rounded-xl"
                    style={{ background: "rgba(147,51,234,0.15)" }}
                  />
                )}
                <Icon
                  size={22}
                  className="relative z-10 transition-transform"
                  style={{
                    color: active ? "var(--purple-400)" : "var(--text-muted)",
                    transform: active ? "scale(1.1)" : "scale(1)",
                  }}
                />
                {isCart && mounted && totalItems > 0 && (
                  <span
                    className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#9333ea,#7e22ce)", color: "#fff" }}
                  >
                    {totalItems}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] font-medium"
                style={{ color: active ? "var(--purple-400)" : "var(--text-muted)" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
