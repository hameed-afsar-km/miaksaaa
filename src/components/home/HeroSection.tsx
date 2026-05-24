"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Banner } from "@/lib/types";
import { BeamsBackground } from "@/components/ui/beams-background";

const STATIC_BANNERS: Omit<Banner, "id">[] = [
  {
    imageUrl: "",
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
    imageUrl: "",
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
    imageUrl: "",
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

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % displayBanners.length),
      5000
    );
    return () => clearInterval(t);
  }, [displayBanners.length]);

  const banner = displayBanners[current];

  return (
    <BeamsBackground
      className="relative w-full overflow-hidden"
      // Desktop: exactly 100vh height
      // Mobile (Android): covers the width, making the ratio 1:1 (so height is 100vw)
      style={{
        height: "var(--hero-height)",
      }}
    >
      {/* Dynamic CSS variable for responsive heights */}
      <style jsx global>{`
        :root {
          --hero-height: 100vw;
        }
        @media (min-width: 1024px) {
          :root {
            --hero-height: 100vh;
          }
        }
      `}</style>

      {/* Animated colour tint per slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 65% 40%, ${banner.bgColor}cc 0%, #0a0614 65%)`,
          }}
        />
      </AnimatePresence>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full opacity-10 animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(147,51,234,0.8) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/3 left-[10%] w-48 h-48 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(251,191,36,0.7) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(147,51,234,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ─────────────────────────────────────────────────────────
          MOBILE layout (< lg)
          • Covers size of width (width = height = 100vw, ratio 1:1)
          • Text overlaid over the 1:1 square image
          • Guarantees texts NEVER go below the fold
          ───────────────────────────────────────────────────────── */}
      <div className="lg:hidden relative w-full h-full pt-16">
        {/* Background Image Container (1:1 aspect ratio) */}
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            {banner.imageUrl ? (
              <motion.div
                key={`mob-img-${current}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
              </motion.div>
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center w-full h-full"
                style={{
                  background: "rgba(147,51,234,0.06)",
                  border: "1px solid rgba(147,51,234,0.15)",
                }}
              >
                <span className="text-[10px] tracking-widest font-black uppercase text-amber-400/50">
                  MIAKSAAA EXCLUSIVE
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Gradient backdrop to ensure rich readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0614] via-[#0a0614]/75 to-transparent pointer-events-none" />

        {/* Content Container (flex to position texts, actions & dots) */}
        <div className="relative z-10 w-full h-full flex flex-col justify-end px-6 pb-6 pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`mob-text-${current}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
              className="space-y-3 text-center"
            >
              {banner.promoTag && (
                <div
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold"
                  style={{
                    background: "rgba(251,191,36,0.15)",
                    border: "1px solid rgba(251,191,36,0.35)",
                    color: "var(--gold-400)",
                  }}
                >
                  <Zap size={10} />
                  {banner.promoTag}
                </div>
              )}

              <h1 className="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow-md">
                {banner.title}
              </h1>

              <p
                className="text-xs leading-snug max-w-xs mx-auto drop-shadow"
                style={{ color: "rgba(255, 255, 255, 0.75)" }}
              >
                {banner.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-center pt-1">
                <Link
                  href={banner.ctaLink}
                  className="btn-primary text-[10px] px-4 py-2 gap-1"
                  style={{
                    background: `linear-gradient(135deg, ${banner.ctaColor}, ${banner.ctaColor}cc)`,
                  }}
                >
                  {banner.ctaText} <ArrowRight size={12} />
                </Link>
                <Link
                  href="/products"
                  className="btn-outline text-[10px] px-4 py-2 text-white border-white/20 hover:bg-white/10"
                >
                  Explore All
                </Link>
              </div>

              {/* Mobile Slide dots */}
              <div className="flex gap-1.5 justify-center pt-2">
                {displayBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Slide ${i + 1}`}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: i === current ? 18 : 6,
                      height: 5,
                      background:
                        i === current
                          ? "linear-gradient(90deg,#9333ea,#fbbf24)"
                          : "rgba(255,255,255,0.3)",
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
          • Grid split is 1:1 (equal columns lg:grid-cols-2)
          • Product image aspect ratio is 1:1 (square)
          • Guarantees texts NEVER go below the fold
          ───────────────────────────────────────────────────────── */}
      <div className="hidden lg:grid lg:grid-cols-2 h-full pt-16 max-w-screen-xl mx-auto px-8 xl:px-12 items-center">
        {/* Left Column — Text (50% width) */}
        <div className="flex flex-col justify-center pr-8 h-full py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`desk-text-${current}`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {banner.promoTag && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(251,191,36,0.15)",
                    border: "1px solid rgba(251,191,36,0.35)",
                    color: "var(--gold-400)",
                  }}
                >
                  <Zap size={12} />
                  {banner.promoTag}
                </motion.div>
              )}

              <h1 className="text-4xl xl:text-5xl font-black leading-tight">
                <span className="gradient-text">{banner.title}</span>
              </h1>

              {banner.highlightLabel && (
                <div
                  className="inline-block px-4 py-1.5 rounded-lg text-xs font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(147,51,234,0.25), rgba(251,191,36,0.15))",
                    border: "1px solid rgba(147,51,234,0.3)",
                    color: "var(--text-primary)",
                  }}
                >
                  ✦ {banner.highlightLabel}
                </div>
              )}

              <p
                className="text-sm xl:text-base leading-relaxed max-w-md"
                style={{ color: "var(--text-secondary)" }}
              >
                {banner.subtitle}
              </p>

              <div className="flex gap-3 pt-1">
                <Link
                  href={banner.ctaLink}
                  className="btn-primary text-xs px-5 py-3 gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${banner.ctaColor}, ${banner.ctaColor}cc)`,
                  }}
                >
                  {banner.ctaText} <ArrowRight size={15} />
                </Link>
                <Link href="/products" className="btn-outline text-xs px-5 py-3">
                  Explore All
                </Link>
              </div>

              <div
                className="flex gap-6 pt-3 border-t max-w-sm"
                style={{ borderColor: "rgba(147,51,234,0.2)" }}
              >
                {[
                  { label: "Products", value: "500+" },
                  { label: "Customers", value: "10K+" },
                  { label: "Brands", value: "50+" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-base font-black gradient-text">{value}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column — Image (50% width) */}
        <div className="flex items-center justify-center pl-8 h-full py-6">
          <AnimatePresence mode="wait">
            {banner.imageUrl ? (
              <motion.div
                key={`desk-img-${current}`}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                // Responsive square sizing constraint so it never overflows 100vh height
                className="relative"
                style={{
                  width: "min(460px, 58vh)",
                  aspectRatio: "1/1",
                  borderRadius: 28,
                  overflow: "hidden",
                  border: "1px solid rgba(251,191,36,0.25)",
                  boxShadow:
                    "0 32px 64px rgba(0,0,0,0.55), 0 0 60px rgba(147,51,234,0.2)",
                }}
              >
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                  sizes="min(460px, 58vh)"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0614]/60 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            ) : (
              <div
                className="flex items-center justify-center"
                style={{
                  width: "min(460px, 58vh)",
                  aspectRatio: "1/1",
                  borderRadius: 28,
                  background: "rgba(147,51,234,0.05)",
                  border: "1px solid rgba(147,51,234,0.15)",
                }}
              >
                <span className="text-xs tracking-widest font-black uppercase text-amber-400/60">
                  MIAKSAAA EXCLUSIVE
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop slide dots */}
      <div className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 gap-2 z-10">
        {displayBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              background:
                i === current
                  ? "linear-gradient(90deg,#9333ea,#fbbf24)"
                  : "rgba(147,51,234,0.3)",
            }}
          />
        ))}
      </div>

      {/* Desktop arrow buttons */}
      <button
        onClick={() =>
          setCurrent((c) => (c - 1 + displayBanners.length) % displayBanners.length)
        }
        aria-label="Previous slide"
        className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center glass transition-all hover:scale-110"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % displayBanners.length)}
        aria-label="Next slide"
        className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center glass transition-all hover:scale-110"
      >
        <ChevronRight size={20} />
      </button>
    </BeamsBackground>
  );
}
