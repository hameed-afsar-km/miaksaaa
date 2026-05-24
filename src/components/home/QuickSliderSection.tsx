"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export function QuickSliderSection({ products }: { products: Product[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (sliderRef.current) {
      const scrollAmount = 340;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }

  if (products.length === 0) return null;

  return (
    <section className="py-12 border-b border-purple-500/5 relative overflow-hidden" style={{ background: "rgba(14,8,30,0.4)" }}>
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-600/5 blur-[80px] pointer-events-none" />

      <div className="container-lg">
        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Sparkles size={12} /> Fast Browse
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: "Playfair Display, serif" }}>
              Quick Discoveries
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:bg-purple-950/15 cursor-pointer text-purple-300"
              style={{ borderColor: "var(--border)" }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:bg-purple-950/15 cursor-pointer text-purple-300"
              style={{ borderColor: "var(--border)" }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Horizontal Slider */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="w-[260px] sm:w-[280px] flex-shrink-0 snap-start"
            >
              <ProductCard product={product} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
