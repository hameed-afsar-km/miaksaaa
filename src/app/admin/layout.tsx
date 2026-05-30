"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  Image as ImageIcon,
  Tag,
  Settings,
  ChevronRight,
  ShieldAlert,
  Menu,
  X,
  ArrowLeft,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

const SIDEBAR_ITEMS = [
  { label: "Overview",   path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products",   path: "/admin/products",  icon: ShoppingBag },
  { label: "Orders",     path: "/admin/orders",    icon: Receipt },
  { label: "Banners",    path: "/admin/banners",   icon: ImageIcon },
  { label: "Categories", path: "/admin/categories",icon: Tag },
  { label: "Coupons",    path: "/admin/coupons",   icon: Tag },
  { label: "Team",       path: "/admin/team",      icon: Users },
  { label: "Settings",   path: "/admin/settings",  icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, loading } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Guard the route: only allow admins
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/admin/login");
      } else if (!isAdmin) {
        toast.error("Access Denied: You are not authorized here.");
        router.push("/profile");
      }
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0614]">
        <div className="w-10 h-10 rounded-full border-4 border-t-purple-500 border-purple-900/30 animate-spin" />
      </div>
    );
  }

  // Double check admin guard
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0614] text-center p-4">
        <ShieldAlert className="w-16 h-16 text-red-500 animate-bounce mb-4" />
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Playfair Display, serif" }}>Access Denied</h1>
        <p className="text-sm mt-2 max-w-sm" style={{ color: "var(--text-secondary)" }}>
          You do not possess the required administrator credentials to access the MIAKSAAA admin dashboard.
        </p>
        <Link href="/" className="btn-primary mt-6 text-xs px-6">Return to Main Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0a0614] text-white">
      {/* Mobile Top Navbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-4 glass border-b border-purple-500/20"
        style={{ background: "rgba(18,10,36,0.95)" }}>
        <Link href="/" className="text-xl font-black tracking-widest gradient-text" style={{ fontFamily: "Playfair Display, serif" }}>
          MIAKSAAA
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg border border-purple-500/20 bg-purple-950/20 text-purple-300">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Sidebar Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 z-50 glass border-r border-purple-500/20 p-5 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "rgba(18,10,36,0.95)" }}>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard">
              <span className="text-2xl font-black tracking-widest gradient-text" style={{ fontFamily: "Playfair Display, serif" }}>
                ADMIN
              </span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 rounded-lg text-purple-300">
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-1.5">
            <div className="text-[10px] uppercase font-black tracking-widest px-3 mb-2 text-purple-300/40">Core Operations</div>
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all group ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600/30 to-purple-800/10 border border-purple-500/40 text-white glow-purple"
                      : "text-purple-300/60 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={isActive ? "text-purple-400" : "text-purple-300/50 group-hover:text-purple-300"} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={12} className={`opacity-0 transition-transform ${isActive ? "opacity-100 text-purple-400" : "group-hover:opacity-40"}`} />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 pt-4 border-t border-purple-500/10">
          <Link href="/" className="flex items-center gap-2.5 text-xs text-amber-400/70 hover:text-amber-300 transition-colors">
            <ArrowLeft size={14} /> Return to Main Shop
          </Link>
          <Link href="/profile" className="flex items-center gap-2.5 text-xs text-purple-300/60 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back to User Profile
          </Link>
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-xs text-amber-400">
              A
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate text-white">{user.displayName || "Admin"}</p>
              <p className="text-[10px] truncate text-purple-300/40">Active Controller</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content grid */}
      <main className="flex-1 min-w-0 md:h-screen md:overflow-y-auto pt-20 md:pt-0 pb-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
