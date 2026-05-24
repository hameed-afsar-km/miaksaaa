"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store/uiStore";

export function SplashScreen() {
  const { splashDone, setSplashDone } = useUIStore();
  const [visible, setVisible] = useState(!splashDone);

  useEffect(() => {
    if (splashDone) return;
    const t = setTimeout(() => {
      setVisible(false);
      setSplashDone(true);
    }, 2200);
    return () => clearTimeout(t);
  }, [splashDone, setSplashDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background:
              "radial-gradient(ellipse at center, #1a0a3d 0%, #0a0614 70%)",
          }}
        >
          {/* Background orbs */}
          <div
            className="absolute w-96 h-96 rounded-full opacity-20 animate-pulse"
            style={{
              background:
                "radial-gradient(circle, rgba(147,51,234,0.6) 0%, transparent 70%)",
              top: "10%",
              left: "5%",
            }}
          />
          <div
            className="absolute w-64 h-64 rounded-full opacity-15 animate-pulse"
            style={{
              background:
                "radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)",
              bottom: "15%",
              right: "5%",
              animationDelay: "0.5s",
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-6"
          >
            <img
              src="/logo2.png"
              alt="MIAKSAAA Logo"
              className="w-44 h-44 object-contain"
              style={{ filter: "drop-shadow(0 0 32px rgba(147,51,234,0.7))" }}
            />
          </motion.div>

          {/* Brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-4xl font-black tracking-widest gradient-text mb-3"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            MIAKSAAA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="text-sm tracking-[0.3em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            Premium Luxury Store
          </motion.p>

          {/* Loading bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-14 w-40"
          >
            <div
              className="h-0.5 rounded-full overflow-hidden"
              style={{ background: "rgba(147,51,234,0.2)" }}
            >
              <motion.div
                className="h-full rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 1.2, ease: "easeInOut" }}
                style={{
                  background:
                    "linear-gradient(90deg, #9333ea, #fbbf24)",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
