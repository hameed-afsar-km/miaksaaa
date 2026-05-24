"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Banner } from "@/lib/types";

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
    promoTag: "🔥 Limited Time",
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
  const displayBanners = (banners && banners.length > 0) ? banners : STATIC_BANNERS;
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setCurrent((c) => (c + 1) % displayBanners.length);
    }, 5000);
    return () => clearInterval(t);
  }, [displayBanners.length]);

  function go(i: number) {
    setDir(i > current ? 1 : -1);
    setCurrent(i);
  }

  const banner = displayBanners[current];

  return (
    <section className="relative overflow-hidden min-h-[92vh] md:min-h-screen flex items-center">
      {/* Animated background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 60% 40%, ${banner.bgColor}cc 0%, #0a0614 65%)`,
          }}
        />
      </AnimatePresence>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full opacity-10 animate-pulse"
          style={{ background: "radial-gradient(circle, rgba(147,51,234,0.8) 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/3 left-1/5 w-48 h-48 rounded-full opacity-10 animate-float"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.7) 0%, transparent 70%)", animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full opacity-5 animate-spin-slow"
          style={{ background: "conic-gradient(from 0deg, rgba(147,51,234,0.4), rgba(251,191,36,0.2), transparent)", transform: "translate(-50%,-50%)" }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(147,51,234,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

      {/* Content */}
      <div className="container-lg relative z-10 pt-24 pb-16 w-full">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5"
            >
              {/* Promo tag */}
              {banner.promoTag && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
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
              <h1
                className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                <span className="gradient-text">{banner.title}</span>
              </h1>

              {/* Highlight label */}
              {banner.highlightLabel && (
                <div
                  className="inline-block px-5 py-2 rounded-lg text-sm font-bold"
                  style={{
                    background: "linear-gradient(135deg, rgba(147,51,234,0.25), rgba(251,191,36,0.15))",
                    border: "1px solid rgba(147,51,234,0.3)",
                    color: "var(--text-primary)",
                  }}
                >
                  ✦ {banner.highlightLabel}
                </div>
              )}

              {/* Subtitle */}
              <p className="text-lg md:text-xl leading-relaxed max-w-xl" style={{ color: "var(--text-secondary)" }}>
                {banner.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href={banner.ctaLink}
                  className="btn-primary text-base px-7 py-3.5 gap-2.5"
                  style={{ background: `linear-gradient(135deg, ${banner.ctaColor}, ${banner.ctaColor}cc)` }}>
                  {banner.ctaText}
                  <ArrowRight size={18} />
                </Link>
                <Link href="/products" className="btn-outline text-base px-7 py-3.5">
                  Explore All
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-6 pt-4 border-t" style={{ borderColor: "rgba(147,51,234,0.2)" }}>
                {[
                  { label: "Products", value: "500+" },
                  { label: "Customers", value: "10K+" },
                  { label: "Brands", value: "50+" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xl font-black gradient-text">{value}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {displayBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              background: i === current
                ? "linear-gradient(90deg,#9333ea,#fbbf24)"
                : "rgba(147,51,234,0.3)",
            }}
          />
        ))}
      </div>

      {/* Arrow buttons */}
      <button
        onClick={() => go((current - 1 + displayBanners.length) % displayBanners.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center glass transition-all hover:scale-110"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go((current + 1) % displayBanners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center glass transition-all hover:scale-110"
      >
        <ChevronRight size={20} />
      </button>
    </section>
  );
}
