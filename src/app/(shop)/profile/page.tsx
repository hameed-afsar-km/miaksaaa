"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User, LogOut, Package, Heart, ShieldCheck, Mail, Calendar, ArrowRight, UserCheck } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { logOut } from "@/lib/firebase/auth";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuthStore();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, loading, router]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await logOut();
      toast.success("Signed out successfully. Until next time!");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      toast.error("Error signing out.");
    } finally {
      setSigningOut(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0614]">
        <div className="w-10 h-10 rounded-full border-4 border-t-purple-500 border-purple-900/30 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container-lg py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Card Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-6 sm:p-8 rounded-3xl overflow-hidden glass border border-purple-500/25 shadow-2xl"
        >
          {/* Accent glow lights */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-purple-600/10 blur-[50px] -z-10" />
          <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-amber-500/5 blur-[40px] -z-10" />

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar image */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-lg flex-shrink-0 animate-pulse-glow">
              <Image
                src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName || 'User')}`}
                alt={user.displayName || "User"}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white truncate" style={{ fontFamily: "Playfair Display, serif" }}>
                  {user.displayName || "Premium Customer"}
                </h1>
                {isAdmin && (
                  <span className="badge badge-gold flex items-center gap-1 text-[9px] py-0.5 px-2.5 font-bold shadow-sm glow-gold animate-bounce">
                    <ShieldCheck size={10} /> Sovereign Admin
                  </span>
                )}
              </div>

              <p className="text-sm flex items-center justify-center sm:justify-start gap-2" style={{ color: "var(--text-secondary)" }}>
                <Mail size={14} className="text-purple-300" /> {user.email}
              </p>

              {user.metadata.creationTime && (
                <p className="text-xs flex items-center justify-center sm:justify-start gap-2" style={{ color: "var(--text-muted)" }}>
                  <Calendar size={13} /> Exclusive Member since {new Date(user.metadata.creationTime).toLocaleDateString(undefined, { dateStyle: "medium" })}
                </p>
              )}
            </div>

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="btn-outline px-5 py-2.5 text-xs gap-1.5 cursor-pointer font-bold border-red-500/30 text-red-300 hover:bg-red-500/10 hover:border-red-500"
            >
              <LogOut size={13} />
              {signingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </motion.div>

        {/* Portal gateways */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left panel quick actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl space-y-4"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck size={18} style={{ color: "var(--purple-300)" }} /> Quick Gateways
            </h2>

            <div className="space-y-3">
              <Link href="/orders" className="flex items-center justify-between p-4 rounded-2xl hover:bg-purple-950/15 border border-purple-500/10 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-600/15 border border-purple-500/20">
                    <Package className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Purchase History</h4>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Track your shipped and past orders</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-purple-400 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link href="/wishlist" className="flex items-center justify-between p-4 rounded-2xl hover:bg-purple-950/15 border border-purple-500/10 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/15 border border-red-500/20">
                    <Heart className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Saved Wishlist</h4>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Browse items you've added to favorites</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-red-400 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Right panel admin check */}
          {isAdmin ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-3xl flex flex-col justify-between"
              style={{ background: "rgba(251,191,36,0.02)", border: "1px solid var(--border-gold)" }}
            >
              <div className="space-y-3">
                <span className="badge badge-gold py-0.5 px-2.5 text-[9px] font-bold">Admin Portal</span>
                <h3 className="text-xl font-bold text-white leading-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                  MIAKSAAA Sovereignty System
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  As a sovereign administrator, you hold complete permissions to update product offerings, adjust promotional sliders, compile discount coupon matrices, and authorize fulfillment updates.
                </p>
              </div>

              <Link href="/admin/dashboard" className="btn-gold w-full mt-6 py-3 justify-center gap-2 cursor-pointer">
                Enter Admin Sanctum <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-3xl flex flex-col justify-between"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <div className="space-y-3">
                <span className="badge badge-purple py-0.5 px-2 text-[9px] font-bold">Loyalty Rewards</span>
                <h3 className="text-xl font-bold text-white leading-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                  MIAKSAAA Privilege Circle
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Enjoy exclusive perks, seasonal catalog reductions, and priority shipping handles. Our customer support ensures matching luxury standard responses within minutes.
                </p>
              </div>

              <Link href="/products" className="btn-primary w-full mt-6 py-3 justify-center gap-2 cursor-pointer">
                Shop the Catalog
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
