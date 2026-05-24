"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, Key, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { signInWithEmail, checkIsAdmin } from "@/lib/firebase/auth";
import { useAuthStore } from "@/lib/store/authStore";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // If already admin, redirect to dashboard
  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.push("/admin/dashboard");
    }
  }, [user, isAdmin, loading, router]);

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please input credential set.");
      return;
    }

    setError("");
    setAuthLoading(true);
    try {
      const loggedUser = await signInWithEmail(email, password);
      const adminStatus = await checkIsAdmin(loggedUser.uid);

      if (adminStatus) {
        toast.success("Welcome, sovereign admin!");
        router.push("/admin/dashboard");
      } else {
        setError("Security Violation: Credentials do not possess admin privileges.");
        toast.error("Access Denied: Non-admin account.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Invalid credential set or access expired.");
      toast.error("Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0614]">
        <div className="w-10 h-10 rounded-full border-4 border-t-purple-500 border-purple-900/30 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#0a0614] gradient-hero">
      {/* Intense dark gold glow lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full p-8 rounded-3xl relative z-10 glass-gold border border-amber-500/35 shadow-[0_0_50px_rgba(217,119,6,0.15)] space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center animate-pulse-glow"
            style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)" }}>
            <ShieldCheck size={28} className="text-amber-400" />
          </div>
          <h1 className="text-2xl font-black tracking-widest text-white mt-4" style={{ fontFamily: "Playfair Display, serif" }}>
            ADMIN SANCTUM
          </h1>
          <p className="text-xs tracking-wider" style={{ color: "var(--text-secondary)" }}>
            MIAKSAAA Sovereignty Terminal Gate
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl flex items-start gap-2 text-xs bg-red-500/10 border border-red-500/30 text-red-300"
          >
            <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-amber-300">
              Admin Keys Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-10 text-sm focus:border-amber-400 focus:ring-amber-500/20"
                placeholder="admin@miaksaaa.com"
                style={{ borderColor: "rgba(251,191,36,0.15)", background: "rgba(251,191,36,0.02)" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-amber-300">
              Authorization Passcode
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-10 text-sm focus:border-amber-400 focus:ring-amber-500/20"
                placeholder="••••••••"
                style={{ borderColor: "rgba(251,191,36,0.15)", background: "rgba(251,191,36,0.02)" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="btn-gold w-full py-3.5 text-sm gap-2 mt-6 cursor-pointer font-bold"
          >
            {authLoading ? "Decrypting Core Keys..." : "Authorize Portal Entry"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-purple-300/60 hover:text-white transition-colors">
            ← Return to Main Store
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
