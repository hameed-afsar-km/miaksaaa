"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Banner } from "@/lib/types";
import { BeamsBackground } from "@/components/ui/beams-background";

// Fallback static banners if Firestore is empty
const STATIC_BANNERS: Omit<Banner, "id">[] = [
  {
    imageUrl: "",
    title: "Premium Luxury",
    subtitle: "Discover exclusive collections curated for the discerning taste",
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
    subtitle: "On all orders above ₹999 — Cash On Delivery available everywhere",
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
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % displayBanners.length);
    }, 5000);
    return () => clearInterval(t);
  }, [displayBanners.length]);

  function go(i: number) {
    setCurrent(i);
  }

  const banner = displayBanners[current];

  return (
    <BeamsBackground
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* Animated background tint per slide */}
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
          className="absolute bottom-1/3 left-[10%] w-48 h-48 rounded-full opacity-10 animate-float"
          style={{
            background:
              "radial-gradient(circle, rgba(251,191,36,0.7) 0%, transparent 70%)",
            animationDelay: "1s",
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

      {/* ─── Main layout ─────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        {/*
          Mobile  (< lg): single column, image on TOP then text below
          Desktop (≥ lg): two columns — text LEFT (7/12), image RIGHT (5/12)
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-10 lg:items-center min-h-[100svh]">

          {/* ── IMAGE — order-first on mobile, right col on desktop ── */}
          <div className="lg:col-span-5 lg:order-2 flex justify-center items-end lg:items-center pt-24 pb-4 lg:pt-0 lg:pb-0">
            <AnimatePresence mode="wait">
              {banner.imageUrl ? (
                <motion.div
                  key={`img-${current}`}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="relative"
                  style={{
                    /* Fixed card size — no overflow */
                    width: "min(280px, 70vw)",
                    aspectRatio: "4/5",
                    borderRadius: 28,
                    overflow: "hidden",
                    border: "1px solid rgba(251,191,36,0.3)",
                    boxShadow: "0 24px 48px rgba(0,0,0,0.6), 0 0 40px rgba(251,191,36,0.15)",
                  }}
                >
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                    sizes="(max-width: 1024px) 70vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0614]/70 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              ) : (
                <div
                  className="flex items-center justify-center text-center"
                  style={{
                    width: "min(280px, 70vw)",
                    aspectRatio: "4/5",
                    borderRadius: 28,
                    background: "rgba(147,51,234,0.06)",
                    border: "1px solid rgba(147,51,234,0.2)",
                  }}
                >
                  <span className="text-xs tracking-widest font-black uppercase text-amber-400 px-4">
                    MIAKSAAA
                    <br />
                    EXCLUSIVE
                  </span>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* ── TEXT — below image on mobile, left col on desktop ── */}
          <div className="lg:col-span-7 lg:order-1 pb-28 pt-4 lg:py-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${current}`}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5 text-center lg:text-left"
              >
                {/* Promo tag */}
                {banner.promoTag && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
                    style={{
                      background: "rgba(251,191,36,0.15)",
                      border: "1px solid rgba(251,191,36,0.35)",
                      color: "var(--gold-400)",
                    }}
                  >
                    <Zap size={13} />
                    {banner.promoTag}
                  </motion.div>
                )}

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
                  <span className="gradient-text">{banner.title}</span>
                </h1>

                {/* Highlight label */}
                {banner.highlightLabel && (
                  <div
                    className="inline-block px-5 py-2 rounded-lg text-sm font-bold"
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

                {/* Subtitle */}
                <p
                  className="text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {banner.subtitle}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                  <Link
                    href={banner.ctaLink}
                    className="btn-primary text-sm px-6 py-3.5 gap-2.5"
                    style={{
                      background: `linear-gradient(135deg, ${banner.ctaColor}, ${banner.ctaColor}cc)`,
                    }}
                  >
                    {banner.ctaText}
                    <ArrowRight size={18} />
                  </Link>
                  <Link href="/products" className="btn-outline text-sm px-6 py-3.5">
                    Explore All
                  </Link>
                </div>

                {/* Stats */}
                <div
                  className="flex gap-6 pt-4 border-t justify-center lg:justify-start"
                  style={{ borderColor: "rgba(147,51,234,0.2)" }}
                >
                  {[
                    { label: "Products", value: "500+" },
                    { label: "Customers", value: "10K+" },
                    { label: "Brands", value: "50+" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xl font-black gradient-text">{value}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {displayBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
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

      {/* Arrow buttons */}
      <button
        onClick={() => go((current - 1 + displayBanners.length) % displayBanners.length)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center glass transition-all hover:scale-110"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go((current + 1) % displayBanners.length)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center glass transition-all hover:scale-110"
      >
        <ChevronRight size={20} />
      </button>
    </BeamsBackground>
  );
}
