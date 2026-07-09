"use client";
import { useRef, MouseEvent } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Product } from "@/lib/types";

interface HeroProductCardProps {
  product: Product;
  isHovered: boolean;
  isAnyHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const RARITY_ACCENT: Record<string, string> = {
  "super-treasure-hunt": "#FFD600",
  "treasure-hunt":       "#FF6600",
  rare:                  "#818CF8",
  chase:                 "#C084FC",
};

export function HeroProductCard({
  product, isHovered, isAnyHovered, onClick, onMouseEnter, onMouseLeave,
}: HeroProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 320, damping: 32 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]),  { stiffness: 320, damping: 32 });
  const shX  = useTransform(mx, [-0.5, 0.5], ["15%", "85%"]);
  const shY  = useTransform(my, [-0.5, 0.5], ["15%", "85%"]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); onMouseLeave(); };

  const accent = RARITY_ACCENT[product.rarity ?? ""] ?? "#FF6A00";
  const img = product.images?.[0] ?? "";

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      animate={{
        scale:   isHovered ? 1.1 : isAnyHovered ? 0.92 : 1,
        opacity: isAnyHovered && !isHovered ? 0.22 : 1,
        filter:  isAnyHovered && !isHovered ? "blur(2.5px) saturate(0.4)" : "blur(0px) saturate(1)",
        zIndex:  isHovered ? 50 : 1,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative cursor-pointer select-none w-full h-full"
    >
      {/* Outer glow — only on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute -inset-2 rounded-[22px] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 70%, ${accent}88 0%, transparent 65%)`,
            filter: "blur(16px)",
          }}
        />
      )}

      {/* Card */}
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "linear-gradient(160deg,#1c1c1e 0%,#111111 100%)",
          border: isHovered
            ? `1px solid ${accent}55`
            : "1px solid rgba(255,255,255,0.07)",
          boxShadow: isHovered
            ? `0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px ${accent}33`
            : "0 4px 20px rgba(0,0,0,0.6)",
        }}
      >
        {/* Top meta strip */}
        <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-white/[0.05]">
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 truncate max-w-[70%]">
            {product.series || "Hot Wheels"}
          </span>
          {product.scale && (
            <span className="text-[8px] font-bold text-zinc-600">{product.scale}</span>
          )}
        </div>

        {/* Image */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden p-3">
          {img ? (
            <Image
              src={img}
              alt={product.title}
              width={180}
              height={200}
              className="object-contain w-full h-full transition-transform duration-300"
              style={{ transform: isHovered ? "scale(1.06)" : "scale(1)" }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="text-zinc-600 text-xs font-black">HW</span>
            </div>
          )}

          {/* Shine sweep on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                background: `radial-gradient(circle 80px at ${shX} ${shY}, rgba(255,255,255,0.12) 0%, transparent 70%)`,
              }}
            />
          )}

          {/* Rarity accent line at bottom of image */}
          {(product.rarity && product.rarity !== "common") && (
            <div
              className="absolute bottom-0 left-1/4 right-1/4 h-px opacity-60"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
            />
          )}
        </div>

        {/* Bottom info */}
        <div className="shrink-0 px-3 py-2.5 border-t border-white/[0.05]">
          <p className="text-[9px] font-black text-zinc-200 truncate leading-none mb-1">{product.title}</p>
          <div className="flex items-center justify-between">
            <span className="text-[7.5px] font-semibold text-zinc-600 uppercase tracking-wide">
              {product.condition || "Carded"}
            </span>
            {product.rarity && product.rarity !== "common" && (
              <span
                className="text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{
                  background: `${accent}18`,
                  color: accent,
                }}
              >
                {product.rarity === "super-treasure-hunt" ? "STH" :
                 product.rarity === "treasure-hunt" ? "TH" :
                 product.rarity}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
