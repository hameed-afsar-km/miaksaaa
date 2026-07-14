"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const GRID = 12;
const CELL = 20;
const SPACING = 3;
const SIZE = CELL - SPACING;

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

  // Spiral order from outer edge to center
  const path = (() => {
    const order: number[] = [];
    let top = 0, bottom = GRID - 1, left = 0, right = GRID - 1;
    while (top <= bottom && left <= right) {
      for (let c = left; c <= right; c++) order.push(top * GRID + c);
      top++;
      for (let r = top; r <= bottom; r++) order.push(r * GRID + right);
      right--;
      if (top <= bottom) { for (let c = right; c >= left; c--) order.push(bottom * GRID + c); bottom--; }
      if (left <= right) { for (let r = bottom; r >= top; r--) order.push(r * GRID + left); left++; }
    }
    return order;
  })();

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
            className="relative"
            style={{ width: GRID * CELL, height: GRID * CELL }}
          >
            {path.map((idx, step) => {
              const row = Math.floor(idx / GRID);
              const col = idx % GRID;

              return (
                <motion.div
                  key={idx}
                  className="absolute rounded-sm"
                  style={{
                    left: col * CELL + SPACING / 2,
                    top: row * CELL + SPACING / 2,
                    width: SIZE,
                    height: SIZE,
                    background: "#a855f7",
                    boxShadow: "0 0 4px rgba(168,85,247,0.3)",
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0, 1, 1, 0],
                    scale: [0, 0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    delay: (step / path.length) * 1.2,
                    ease: [0.16, 1, 0.3, 1],
                    times: [0, 0.1, 0.3, 0.7, 1],
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
