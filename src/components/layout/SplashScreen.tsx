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
    }, 2800);
    return () => clearTimeout(t);
  }, [splashDone, setSplashDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] overflow-hidden"
        >
          <BeamsBackground
            intensity="strong"
            className="w-full h-full"
            style={{ minHeight: "100dvh" }}
          >
            {/* Full-height centered content wrapper */}
            <div
              className="flex flex-col items-center justify-center text-center px-6"
              style={{ minHeight: "100dvh" }}
            >
              <motion.div
                initial={{ scale: 0.55, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mb-1"
              >
                <img
                  src="/logo2.png"
                  alt="MIAKSAAA Logo"
                  className="w-48 h-48 md:w-64 md:h-64 object-contain"
                  style={{ filter: "drop-shadow(0 0 56px rgba(147,51,234,0.95))" }}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl md:text-5xl font-black tracking-widest gradient-text mb-0"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                MIAKSAAA
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-sm md:text-base tracking-[0.3em] uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                Fashion and Fun World
              </motion.p>

              {/* Progress bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.78 }}
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
                    transition={{ delay: 0.9, duration: 1.5, ease: "easeInOut" }}
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
