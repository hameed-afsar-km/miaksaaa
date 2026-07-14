"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const GRID = 16;
const CELL = 12;
const SPACING = 2;
const SIZE = CELL - SPACING;
const TOTAL = GRID * GRID;

export function SplashScreen() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isInitialMount = useRef(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (isHome) {
        setVisible(true);
        const t = setTimeout(() => setVisible(false), 2200);
        return () => clearTimeout(t);
      }
    }
  }, [isHome]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: "#0a0614" }}
        >
          <div
            className="relative flex flex-wrap"
            style={{
              width: GRID * CELL,
              height: GRID * CELL,
            }}
          >
            {Array.from({ length: TOTAL }, (_, i) => {
              const row = Math.floor(i / GRID);
              const col = i % GRID;
              const cx = GRID / 2;
              const cy = GRID / 2;
              const dist = Math.sqrt((col - cx) ** 2 + (row - cy) ** 2);
              const maxDist = Math.sqrt(cx * cx + cy * cy);

              return (
                <motion.div
                  key={i}
                  className="shrink-0 rounded-sm"
                  style={{
                    width: SIZE,
                    height: SIZE,
                    margin: SPACING / 2,
                    background: "#a855f7",
                    boxShadow: "0 0 4px rgba(168,85,247,0.3)",
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0, 1, 1, 0],
                    scale: [0, 0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: (dist / maxDist) * 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    times: [0, 0.15, 0.35, 0.7, 1],
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
