"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroProductCard } from "./HeroProductCard";
import { ProductExpandModal } from "./ProductExpandModal";
import { Product } from "@/lib/types";

interface HeroSectionProps {
  collectibles: Product[];
}

// ─── Single infinite drifting row ─────────────────────────────────────────────
function DriftRow({
  products, direction, speed, cardW, cardH, gap,
  hoveredId, selectedId, onHover, onLeave, onSelect,
}: {
  products: Product[];
  direction: "left" | "right";
  speed: number;
  cardW: number; cardH: number; gap: number;
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string) => void;
  onLeave: () => void;
  onSelect: (p: Product) => void;
}) {
  const stride    = products.length * (cardW + gap);
  const offsetRef = useRef(direction === "right" ? stride : 0);
  const rafRef    = useRef<number | null>(null);
  const [, tick]  = useState(0);
  const paused    = hoveredId !== null || selectedId !== null;

  const frame = useCallback(() => {
    if (!paused) {
      if (direction === "left") {
        offsetRef.current = (offsetRef.current + speed) % stride;
      } else {
        offsetRef.current = ((offsetRef.current - speed) % stride + stride) % stride;
      }
      tick((n) => n + 1);
    }
    rafRef.current = requestAnimationFrame(frame);
  }, [paused, direction, speed, stride]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [frame]);

  // Triple-duplicate so the seam is always hidden
  const items = [...products, ...products, ...products];

  return (
    <div className="relative w-full overflow-visible" style={{ height: cardH }}>
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
        style={{ background: "linear-gradient(to right, #080808, transparent)" }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
        style={{ background: "linear-gradient(to left, #080808, transparent)" }} />

      <div
        className="absolute top-0 left-0 flex will-change-transform"
        style={{ gap, transform: `translate3d(${-offsetRef.current}px,0,0)` }}
      >
        {items.map((p, i) => (
          <div key={`${p.id}-${i}`} style={{ width: cardW, height: cardH, flexShrink: 0 }}>
            <HeroProductCard
              product={p}
              isHovered={hoveredId === p.id}
              isAnyHovered={hoveredId !== null}
              onClick={() => onSelect(p)}
              onMouseEnter={() => onHover(p.id)}
              onMouseLeave={onLeave}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export function HeroSection({ collectibles }: HeroSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selected,  setSelected]  = useState<Product | null>(null);

  // Product pool — prefer hero-flagged, fallback to all visible
  let pool = collectibles.filter((p) => p.showInHero && p.isVisible && p.images?.[0]);
  if (!pool.length) pool = collectibles.filter((p) => p.isVisible && p.images?.[0]);
  if (!pool.length) return null;

  // Pad array so each row has at least 6 unique cards
  const pad = (arr: Product[], min: number, tag: string): Product[] => {
    let out = [...arr]; let n = 0;
    while (out.length < min)
      out = [...out, ...arr.map((p) => ({ ...p, id: `${p.id}__${tag}${n++}` }))];
    return out;
  };

  const row0 = pad(pool.filter((_, i) => i % 2 === 0), 6, "a");
  const row1 = pad(pool.filter((_, i) => i % 2 !== 0).length ? pool.filter((_, i) => i % 2 !== 0) : pool, 6, "b");

  // Card dimensions
  const CW = 200; // width  px
  const CH = 280; // height px
  const G  = 16;  // gap    px

  return (
    <>
      <section
        className="relative w-full overflow-visible"
        style={{ background: "#080808" }}
      >
        {/* ── Ambient lighting ── */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Centre warm beam from top */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[500px] opacity-[0.15]"
            style={{ background: "radial-gradient(ellipse at 50% 0%, #ff6a00, transparent 65%)", filter: "blur(50px)" }} />
          {/* Left cool rim */}
          <div className="absolute top-0 -left-24 w-[360px] h-[400px] opacity-[0.08]"
            style={{ background: "radial-gradient(ellipse at 0% 50%, #38bdf8, transparent 70%)", filter: "blur(70px)" }} />
          {/* Right warm rim */}
          <div className="absolute top-0 -right-24 w-[360px] h-[400px] opacity-[0.07]"
            style={{ background: "radial-gradient(ellipse at 100% 50%, #fb923c, transparent 70%)", filter: "blur(70px)" }} />
        </div>

        {/* ── Two drifting rows ── */}
        <div className="relative z-10 flex flex-col gap-4 pt-8 pb-4 overflow-visible">
          <DriftRow
            products={row0} direction="left" speed={0.5}
            cardW={CW} cardH={CH} gap={G}
            hoveredId={hoveredId} selectedId={selected?.id ?? null}
            onHover={setHoveredId} onLeave={() => setHoveredId(null)} onSelect={setSelected}
          />
          <DriftRow
            products={row1} direction="right" speed={0.35}
            cardW={CW} cardH={CH} gap={G}
            hoveredId={hoveredId} selectedId={selected?.id ?? null}
            onHover={setHoveredId} onLeave={() => setHoveredId(null)} onSelect={setSelected}
          />
        </div>

        {/* ── Hero text — below the grid, clean separation ── */}
        <div className="relative z-20 flex flex-col items-center gap-3 pt-8 pb-12 px-4"
          style={{ background: "linear-gradient(to bottom, transparent, #080808 30%)" }}
        >
          {/* Thin separator */}
          <div className="w-48 h-px mb-2"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-[10px] font-black uppercase tracking-[0.32em] flex items-center gap-2.5"
            style={{ color: "#FF6A00" }}
          >
            <span className="w-6 h-px bg-current opacity-60" />
            Premium Collectibles
            <span className="w-6 h-px bg-current opacity-60" />
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.75, ease: [0.16, 1, 0.3, 1] as any }}
            className="text-4xl sm:text-5xl md:text-[56px] font-black text-center leading-[1.0] tracking-tight"
            style={{ fontFamily: "'Outfit','Inter',sans-serif" }}
          >
            <span className="text-white">The Rarest</span>
            <br />
            <span style={{
              background: "linear-gradient(90deg,#FF6A00 0%,#FFD600 50%,#FF6A00 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Die-Cast on Earth.
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[12px] text-zinc-600 text-center font-medium"
          >
            Hover to inspect &nbsp;·&nbsp; Click to explore
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex gap-3 mt-2"
          >
            <Link
              href="/hotwheels/products"
              className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black text-white transition-all hover:brightness-110 active:scale-95"
              style={{
                background: "linear-gradient(135deg,#FF4400,#cc2200)",
                boxShadow: "0 6px 24px rgba(255,68,0,0.28)",
              }}
            >
              Explore Collection
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/hotwheels/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-bold text-zinc-400 hover:text-zinc-200 transition-all active:scale-95"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              View All
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Expand modal ── */}
      <AnimatePresence>
        {selected && (
          <ProductExpandModal product={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
