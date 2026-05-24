"use client";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { signInWithGoogle, registerWithEmail } from "@/lib/firebase/auth";
import { useAuthStore } from "@/lib/store/authStore";
import toast from "react-hot-toast";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") ?? "/";

  const { user, loading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (!loading && user) {
      router.push(redirectUrl);
    }
  }, [user, loading, router, redirectUrl]);

  async function handleGoogleLogin() {
    setError("");
    setAuthLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome to MIAKSAAA!");
      router.push(redirectUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Google authentication failed");
      toast.error("Google Sign-In failed.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setAuthLoading(true);
    try {
      await registerWithEmail(email, password, name);
      toast.success("Account created successfully! Welcome to MIAKSAAA.");
      router.push(redirectUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Registration failed. Email may already be in use.");
      toast.error("Failed to register.");
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
      {/* Background glow animations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none animate-float" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-6 p-8 rounded-3xl relative z-10 glass border border-purple-500/25 shadow-2xl"
      >
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-black tracking-widest gradient-text" style={{ fontFamily: "Playfair Display, serif" }}>
              MIAKSAAA
            </span>
          </Link>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
            Create Luxury Account
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Join the circle of premium shopping
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-xl flex items-start gap-2 text-sm bg-red-500/10 border border-red-500/30 text-red-300"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input pl-10 text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10 text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input pl-10 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="btn-primary w-full py-3 text-sm gap-2 mt-4 cursor-pointer"
          >
            {authLoading ? "Creating Account..." : "Create Account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-500/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-3 bg-[#120a24] text-purple-300/60 font-semibold tracking-widest">
              Or Sign Up With
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={authLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border rounded-xl font-semibold text-sm transition-all hover:bg-white/5 cursor-pointer"
          style={{ borderColor: "rgba(251,191,36,0.3)", background: "rgba(251,191,36,0.03)", color: "var(--gold-300)" }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google Registration
        </button>

        <div className="text-center mt-4">
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link href={`/login?redirect=${encodeURIComponent(redirectUrl)}`} className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a0614]">
        <div className="w-10 h-10 rounded-full border-4 border-t-purple-500 border-purple-900/30 animate-spin" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
