"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Banner } from "@/lib/types";

const STATIC_BANNERS: Omit<Banner, "id">[] = [
  {
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    title: "Premium Luxury",
    subtitle: "Exclusive collections curated for the discerning taste",
    ctaText: "Shop Now",
    ctaLink: "/products",
    ctaColor: "#9333ea",
    bgColor: "#1a0a3d",
    promoTag: "New Season",
    highlightLabel: "2026 Collection",
    isActive: true,
    order: 0,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    title: "Flash Sale Live",
    subtitle: "Up to 70% off on selected premium items — today only",
    ctaText: "Grab Deals",
    ctaLink: "/products",
    ctaColor: "#fbbf24",
    bgColor: "#1a1000",
    promoTag: "Limited Time",
    highlightLabel: "Up to 70% Off",
    isActive: true,
    order: 1,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    title: "Free Delivery",
    subtitle: "On all orders above ₹999 — Cash On Delivery available",
    ctaText: "Start Shopping",
    ctaLink: "/products",
    ctaColor: "#9333ea",
    bgColor: "#0a1a1a",
    promoTag: "COD Available",
    highlightLabel: "Free Shipping",
    isActive: true,
    order: 2,
  },
];

interface HeroSectionProps {
  banners?: Banner[];
}

export function HeroSection({ banners }: HeroSectionProps) {
  const displayBanners =
    banners && banners.length > 0 ? banners : STATIC_BANNERS;
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  // High-fidelity ticking timer for numerical progress line indicators
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrent((c) => (c + 1) % displayBanners.length);
          return 0;
        }
        return prev + 2; // 2% every 100ms = 100% in 5000ms
      });
    }, 100);
    return () => clearInterval(interval);
  }, [current, displayBanners.length]);

  const banner = displayBanners[current];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ background: "#06040d" }}
    >
      {/* Keyframes for rotating geometric animations */}
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slow {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 35s linear infinite;
        }
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 45s linear infinite;
        }
        /* Mobile: start below top navbar and fit remaining height perfectly between top and bottom navbars */
        .hero-mobile {
          height: calc(100svh - 8rem);
          margin-top: 0rem;
        }
        /* Fallback for browsers without svh support */
        @supports not (height: 100svh) {
          .hero-mobile {
            height: calc(100vh - 8rem);
            margin-top: 0rem;
          }
        }
      `}</style>

      {/* Animated colour tint overlay per slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: `radial-gradient(ellipse at 70% 35%, ${(banner.bgColor || '#120a24')}bd 0%, #06040d 75%)`,
          }}
        />
      </AnimatePresence>

      {/* Floating high-end ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <div
          className="absolute top-1/4 right-[15%] w-64 lg:w-96 h-64 lg:h-96 rounded-full opacity-20 animate-pulse blur-[60px] lg:blur-[100px]"
          style={{
            background: `radial-gradient(circle, ${(banner.ctaColor || '#fbbf24')}80 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute bottom-1/4 left-[15%] w-48 lg:w-72 h-48 lg:h-72 rounded-full opacity-15 blur-[50px] lg:blur-[80px]"
          style={{
            background: `radial-gradient(circle, ${(banner.bgColor || '#9333ea')}60 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Luxury thin grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ─────────────────────────────────────────────────────────
          MOBILE layout (< lg) — Full-bleed cinematic hero
          • Banner image fills the entire hero as background
          • Gradient overlays ensure text readability
          • PromoTag badge floats top-left
          • All content (title, subtitle, CTAs, dots) pinned bottom
          • All fields driven by admin-modifiable banner data
          ───────────────────────────────────────────────────────── */}
      <div className="hero-mobile lg:hidden relative w-full z-10 overflow-hidden">

        {/* ── Full-bleed background image with fade transition ── */}
        <AnimatePresence mode="wait">
          {banner.imageUrl ? (
            <motion.div
              key={`mob-bg-${current}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
               className="absolute inset-0"
             >
               <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 1023px) 100vw, 0px"
              />
            </motion.div>
          ) : (
            <motion.div
              key="mob-bg-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{ background: banner.bgColor || "#1a0a3d" }}
            />
          )}
        </AnimatePresence>

        {/* ── Color tint overlay (admin bgColor) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`mob-tint-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: `radial-gradient(ellipse at 50% 20%, ${banner.bgColor || '#120a24'}70 0%, transparent 65%)`,
            }}
          />
        </AnimatePresence>

        {/* ── Top gradient scrim (navbar area readability) ── */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-transparent pointer-events-none z-[2]" />

        {/* ── Bottom gradient scrim (text readability) ── */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background: "linear-gradient(to top, rgba(6,4,13,0.97) 0%, rgba(6,4,13,0.75) 35%, transparent 65%)",
          }}
        />

        {/* ── Floating PromoTag badge — top left ── */}
        <AnimatePresence mode="wait">
          {banner.promoTag && (
            <motion.div
              key={`mob-badge-${current}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="absolute top-[40px] left-4 z-30 flex items-center gap-1.5"
            >
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase"
                style={{
                  background: "rgba(251,191,36,0.15)",
                  border: "1px solid rgba(251,191,36,0.45)",
                  color: "#fbbf24",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Zap size={8} className="fill-amber-400 text-amber-400" />
                {banner.promoTag}
              </span>
              {banner.highlightLabel && (
                <span
                  className="text-[8px] font-semibold tracking-wider"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  ✦ {banner.highlightLabel}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom content: title, subtitle, CTAs, dots ── */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`mob-content-${current}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2.5"
            >
              {/* Title */}
              <h1
                className="text-2xl font-black text-white uppercase leading-tight tracking-tight"
                style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
              >
                {banner.title}
              </h1>

              {/* Subtitle */}
              <p className="text-[11px] text-white/65 leading-relaxed font-light line-clamp-2">
                {banner.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex gap-3 pt-0.5">
                <Link
                  href={banner.ctaLink}
                  className="flex-1 py-2.5 rounded-xl text-center text-[11px] font-black uppercase tracking-wider transition-transform active:scale-95"
                  style={{
                    background: banner.ctaColor || "#fbbf24",
                    color: "#0a0614",
                    boxShadow: `0 4px 20px ${banner.ctaColor || "#fbbf24"}50`,
                  }}
                >
                  {banner.ctaText}
                </Link>
                <Link
                  href="/products"
                  className="flex-1 py-2.5 rounded-xl text-center text-[11px] font-black uppercase tracking-wider text-white active:scale-95"
                  style={{
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  Explore
                </Link>
              </div>

              {/* Slide indicators */}
              <div className="flex gap-2 justify-center pt-1">
                {displayBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrent(i); setProgress(0); }}
                    aria-label={`Slide ${i + 1}`}
                    className="h-[3px] rounded-full transition-all duration-300"
                    style={{
                      width: i === current ? 24 : 6,
                      background: i === current
                        ? (banner.ctaColor || "#fbbf24")
                        : "rgba(255,255,255,0.25)",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          DESKTOP layout (≥ lg)
          • Covers height of web size (100vh)
          • Grid split ratio 1:1, divider line in the middle
          • Floating museum product image card inside glowing halo
          • Premium side index list with countdown progress bars
          • Guarantees texts NEVER go below the fold
          ───────────────────────────────────────────────────────── */}
      <div
        className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] h-screen pt-[88px] max-w-screen-xl mx-auto px-8 xl:px-12 items-center relative z-10"
        style={{ transform: "translateY(-65px)" }}
      >

        {/* Left Column — Brand & Text Details */}
        <div className="flex flex-col justify-center pr-12 h-full py-4 pb-16 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`desk-text-${current}`}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* Badges layout */}
              <div className="flex flex-wrap items-center gap-3">
                {banner.promoTag && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                    style={{
                      background: "rgba(251,191,36,0.12)",
                      border: "1px solid rgba(251,191,36,0.35)",
                      color: "var(--gold-400)",
                    }}
                  >
                    <Zap size={11} className="fill-amber-400 text-amber-400" />
                    {banner.promoTag}
                  </motion.span>
                )}
                {banner.highlightLabel && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 }}
                    className="inline-flex items-center px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    ✦ {banner.highlightLabel}
                  </motion.span>
                )}
              </div>

              {/* Title Header */}
              <h1 className="text-4xl xl:text-6xl font-black leading-[1.1] tracking-tight">
                <span
                  className="bg-gradient-to-r from-white via-purple-100 to-amber-200 bg-clip-text text-transparent filter drop-shadow-md uppercase block"
                  style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
                >
                  {banner.title}
                </span>
              </h1>

              {/* Description Subtitle */}
              <p
                className="text-sm xl:text-base leading-relaxed max-w-md font-light"
                style={{ color: "rgba(255, 255, 255, 0.65)" }}
              >
                {banner.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex gap-4 pt-2">
                <Link
                  href={banner.ctaLink}
                  className="btn-primary text-xs px-6 py-4 gap-2 font-black tracking-widest uppercase rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${(banner.ctaColor || '#fbbf24')}, ${(banner.ctaColor || '#fbbf24')}dd)`,
                    boxShadow: `0 8px 30px ${(banner.ctaColor || '#fbbf24')}25`,
                    color: "#0a0614",
                  }}
                >
                  {banner.ctaText} <ArrowRight size={14} />
                </Link>
                <Link
                  href="/products"
                  className="btn-outline text-xs px-6 py-4 font-black tracking-widest uppercase rounded-xl hover:bg-white/5 border-white/20 transition-all duration-300"
                >
                  Explore All
                </Link>
              </div>

              {/* Luxury features section */}
              <div
                className="flex gap-10 pt-6 border-t max-w-md"
                style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
              >
                {[
                  { label: "SHIPPING", value: "PRIORITY" },
                  { label: "AUTHENTIC", value: "GUARANTEED" },
                  { label: "SUPPORT", value: "24/7 VIP" },
                ].map(({ label, value }, idx) => (
                  <div key={label} className="flex flex-col">
                    <span
                      className="text-[10px] font-black tracking-widest"
                      style={{ color: banner.ctaColor || "#fbbf24" }}
                    >
                      {value}
                    </span>
                    <span className="text-[9px] font-bold tracking-widest mt-1 text-white/30 uppercase">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Vertical thin glass divider line in the middle */}
        <div className="w-[1px] h-48 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-6" />

        {/* Right Column — Product museum card showcase */}
        <div className="flex items-center justify-center pl-12 h-full py-4 pb-16 relative z-10">

          {/* Backlight orb glow matching banner color values */}
          <div
            className="absolute w-[85%] h-[85%] rounded-full opacity-35 filter blur-[90px] transition-all duration-1000"
            style={{
              background: `radial-gradient(circle, ${(banner.ctaColor || '#fbbf24')} 0%, ${(banner.bgColor || '#9333ea')} 70%)`
            }}
          />

          {/* Spinning geometric halo wires (static) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[106%] h-[106%] rounded-full border border-dashed opacity-25 animate-spin-slow"
              style={{ borderColor: banner.ctaColor || "#fbbf24" }}
            />
            <div
              className="w-[116%] h-[116%] rounded-full border border-dotted opacity-15 animate-spin-reverse-slow"
              style={{ borderColor: banner.bgColor || "#9333ea" }}
            />
          </div>

          {/* Static premium glass museum card frame */}
          <div
            className="relative group transition-all duration-500 hover:-translate-y-2.5 overflow-hidden"
            style={{
              width: "min(430px, 54vh)",
              aspectRatio: "1/1",
              borderRadius: 36,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 30px 70px rgba(0,0,0,0.65), inset 0 1px 1px rgba(255,255,255,0.1)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />

            <AnimatePresence mode="wait">
              {banner.imageUrl ? (
                <motion.div
                  key={`desk-img-${current}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                    sizes="min(430px, 54vh)"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="desk-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="text-xs tracking-widest font-black uppercase text-amber-400/40">
                    MIAKSAAA EXCLUSIVE
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </div>

      {/* Premium Side Index Navigation strip */}
      <div className="hidden lg:flex absolute right-28 top-1/2 -translate-y-1/2 flex-col gap-7 z-20">
        {displayBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrent(i);
              setProgress(0);
            }}
            className="group flex items-center gap-4 text-left transition-all"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className={`text-xs font-black transition-colors ${i === current ? 'text-white' : 'text-white/25 group-hover:text-white/50'}`}
            >
              0{i + 1}
            </span>

            {/* countdown slider bar */}
            <div className="relative w-14 h-[2px] bg-white/10 overflow-hidden rounded-full">
              <div
                className="absolute top-0 left-0 h-full transition-all duration-100 ease-linear"
                style={{
                  width: i === current ? `${progress}%` : "0%",
                  background: banner.ctaColor || "linear-gradient(90deg, #9333ea, #fbbf24)",
                }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Slide Arrow Navigation */}
      <button
        onClick={() => {
          setCurrent((c) => (c - 1 + displayBanners.length) % displayBanners.length);
          setProgress(0);
        }}
        aria-label="Previous slide"
        className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/10"
      >
        <ChevronLeft size={20} className="text-white/60 hover:text-white" />
      </button>
      <button
        onClick={() => {
          setCurrent((c) => (c + 1) % displayBanners.length);
          setProgress(0);
        }}
        aria-label="Next slide"
        className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/10"
      >
        <ChevronRight size={20} className="text-white/60 hover:text-white" />
      </button>
    </div>
  );
}
