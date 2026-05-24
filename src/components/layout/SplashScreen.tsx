"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store/uiStore";
import { BeamsBackground } from "@/components/ui/beams-background";

export function SplashScreen() {
  const { splashDone, setSplashDone } = useUIStore();
  const [visible, setVisible] = useState(!splashDone);

  useEffect(() => {
    if (splashDone) return;
    const t = setTimeout(() => {
      setVisible(false);
      setSplashDone(true);
    }, 2500);
    return () => clearTimeout(t);
  }, [splashDone, setSplashDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999]"
        >
          {/* Canvas-based beams — much lighter than SVG filters */}
          <BeamsBackground
            intensity="strong"
            className="w-full h-full"
          >
            {/* Dark vignette so text stays readable */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 25%, rgba(10,6,20,0.65) 100%)",
              }}
            />

            {/* Centred content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.55, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="mb-8"
              >
                <img
                  src="/logo2.png"
                  alt="MIAKSAAA Logo"
                  className="w-56 h-56 md:w-72 md:h-72 object-contain"
                  style={{ filter: "drop-shadow(0 0 48px rgba(147,51,234,0.9))" }}
                />
              </motion.div>

              {/* Brand name */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.6 }}
                className="text-4xl md:text-5xl font-black tracking-widest gradient-text mb-3"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                MIAKSAAA
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.58, duration: 0.5 }}
                className="text-sm md:text-base tracking-[0.3em] uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                Fashion and Fun World
              </motion.p>

              {/* Loading bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
                className="mt-10 w-40"
              >
                <div
                  className="h-0.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(147,51,234,0.2)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.85, duration: 1.3, ease: "easeInOut" }}
                    style={{ background: "linear-gradient(90deg, #9333ea, #fbbf24)" }}
                  />
                </div>
              </motion.div>
            </div>
          </BeamsBackground>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
