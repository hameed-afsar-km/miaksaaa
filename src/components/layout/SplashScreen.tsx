"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const N = 8;
const R = 22;
const dots = Array.from({ length: N }, (_, i) => {
  const a = (i / N) * Math.PI * 2 - Math.PI / 2;
  return { x: Math.cos(a) * R, y: Math.sin(a) * R, delay: i * (1 / N) };
});

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
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "#0a0614" }}
        >
          <div className="relative" style={{ width: 0, height: 0 }}>
            {dots.map((d, i) => (
              <span
                key={i}
                className="px-dot"
                style={{
                  position: "absolute",
                  left: d.x - 6,
                  top: d.y - 6,
                  animationDelay: `${d.delay}s`,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
