"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowUpRight, RotateCcw } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface ProductExpandModalProps {
  product: Product | null;
  onClose: () => void;
}

const RARITY_CONFIG: Record<string, { label: string; gradient: string; text: string }> = {
  "super-treasure-hunt": { label: "Super Treasure Hunt", gradient: "linear-gradient(135deg,#FFD600,#FF6600)", text: "#1a0900" },
  "treasure-hunt":       { label: "Treasure Hunt",       gradient: "linear-gradient(135deg,#FF6600,#D32F2F)", text: "#fff" },
  rare:                  { label: "Rare",                 gradient: "linear-gradient(135deg,#4F46E5,#7C3AED)", text: "#fff" },
  chase:                 { label: "Chase",                gradient: "linear-gradient(135deg,#7C3AED,#DB2777)", text: "#fff" },
  uncommon:              { label: "Uncommon",             gradient: "linear-gradient(135deg,#334155,#475569)", text: "#cbd5e1" },
};

export function ProductExpandModal({ product, onClose }: ProductExpandModalProps) {
  if (!product) return null;

  const rarity = RARITY_CONFIG[product.rarity ?? ""];
  const img    = product.images?.[0] ?? "";
  const price  = formatPrice(product.discountedPrice ?? product.price);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-5"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[14px]" />

        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.82, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.82, y: 30 }}
          transition={{ type: "spring", stiffness: 360, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-md rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #131313 0%, #0c0c0c 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 50px 130px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.03)",
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-200 transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <X size={14} />
          </button>

          {/* Image panel — large white blister area */}
          <div className="relative h-64 flex items-center justify-center overflow-hidden"
            style={{ background: "linear-gradient(160deg,#ffffff,#e8e8e8)" }}
          >
            {/* Subtle colour tint from rarity */}
            {rarity && (
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{ background: rarity.gradient }}
              />
            )}

            {img && (
              <motion.div
                initial={{ scale: 0.8, rotate: -5, y: 10 }}
                animate={{ scale: 1, rotate: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 24, delay: 0.06 }}
              >
                <Image
                  src={img}
                  alt={product.title}
                  width={200}
                  height={220}
                  className="object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.22)]"
                />
              </motion.div>
            )}

            {/* Blister plastic sheen */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%, rgba(255,255,255,0.12) 100%)",
              }}
            />

            {/* Rarity badge overlaid on image panel */}
            {rarity && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <span
                  className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ background: rarity.gradient, color: rarity.text, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
                >
                  {rarity.label}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-5 flex flex-col gap-4">
            {/* Name & series */}
            <div>
              {product.series && (
                <p className="text-[10px] font-bold text-amber-500/60 uppercase tracking-[0.22em] mb-1">{product.series}</p>
              )}
              <h2 className="text-2xl font-black text-white leading-tight">{product.title}</h2>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-2">
              {[
                product.scale     && { label: product.scale },
                product.condition && { label: product.condition.toUpperCase() },
                product.modelYear && { label: `#${product.modelYear}` },
                product.grading   && { label: `★ ${product.grading}/10`, highlight: true },
              ].filter(Boolean).map((stat: any, i) => (
                <span
                  key={i}
                  className="text-[9px] font-bold px-2.5 py-1 rounded-lg"
                  style={{
                    background: stat.highlight ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${stat.highlight ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.08)"}`,
                    color: stat.highlight ? "#fbbf24" : "#9ca3af",
                  }}
                >
                  {stat.label}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{price}</span>
              {product.discountedPrice && product.price > product.discountedPrice && (
                <span className="text-sm text-zinc-600 line-through">{formatPrice(product.price)}</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-1 border-t border-white/[0.05]">
              <Link
                href={`/hotwheels/products/${product.id}`}
                className="group flex items-center justify-center gap-2.5 w-full py-3 rounded-xl font-black text-sm text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #FF4400 0%, #cc2200 100%)",
                  boxShadow: "0 8px 24px rgba(255,68,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
              >
                View Product Page
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <button
                onClick={onClose}
                className="group flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-xs text-zinc-500 hover:text-zinc-300 transition-all duration-200 active:scale-[0.98]"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <RotateCcw size={11} className="group-hover:-rotate-45 transition-transform duration-300" />
                Back to Gallery
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
