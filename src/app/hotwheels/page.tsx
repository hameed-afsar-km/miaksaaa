"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Flame, ArrowRight, Sparkles, Ruler, ShoppingBag, Frame } from "lucide-react";
import { getCollectibleProducts, getVisibleFrameProducts } from "@/lib/firebase/firestore";
import { Product, FrameProduct } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { HWTrendingCarousel } from "@/components/hotwheels/HWTrendingCarousel";

const SCALES = [
  { label: "1:64", desc: "Classic size", image: "/hw_scale_64.png" },
  { label: "1:43", desc: "Mid scale", image: "/hw_scale_43.png" },
  { label: "1:24", desc: "Large scale", image: "/hw_scale_24.png" },
  { label: "1:18", desc: "Ultra detail", image: "/hw_scale_18.png" },
];

const FALLBACK_VIDEO = "/hw_hero_bg.mp4";

export default function HotWheelsLanding() {
  const [collectibles, setCollectibles] = useState<Product[]>([]);
  const [frameProducts, setFrameProducts] = useState<FrameProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCollectibleProducts().catch(() => [] as Product[]),
      getVisibleFrameProducts().catch(() => [] as FrameProduct[]),
    ]).then(([prods, frames]) => {
      setCollectibles(prods);
      setFrameProducts(frames);
    }).finally(() => setLoading(false));
  }, []);

  const trending = collectibles.filter((p) => p.isHot).slice(0, 8);
  const newArrivals = [...collectibles].sort((a, b) => {
    const aT = a.createdAt?.toMillis?.() || 0;
    const bT = b.createdAt?.toMillis?.() || 0;
    return bT - aT;
  }).slice(0, 8);
  const otherCars = collectibles.filter((p) => !p.isHot).slice(0, 8);

  return (
    <div className="overflow-hidden" style={{ background: "#0D0200" }}>

      {/* ════════════════════════════════════════════════════════ */}
      {/* HERO SECTION — Video Background */}
      {/* ════════════════════════════════════════════════════════ */}
      <section className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/hw_hero_poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.4) contrast(1.2)" }}
        >
          <source src={FALLBACK_VIDEO} type="video/mp4" />
        </video>

        {/* Flame gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D0200]" />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, rgba(255,68,0,0.15) 0%, transparent 60%)",
        }} />

        {/* Animated flame particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 w-2 h-16 rounded-full"
              style={{
                left: `${15 + i * 15}%`,
                background: `linear-gradient(to top, transparent, ${i % 2 === 0 ? "#FF4400" : "#FFD600"}, transparent)`,
                filter: "blur(4px)",
              }}
              animate={{
                height: [16, 40, 16],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Flame size={28} style={{ color: "#FF4400" }} />
              <span className="text-sm font-bold uppercase tracking-[0.3em]" style={{ color: "#FF6600" }}>
                Hot Wheels Division
              </span>
              <Flame size={28} style={{ color: "#FFD600" }} />
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-4"
              style={{
                fontFamily: "Impact, sans-serif",
                color: "#FFE0CC",
                textShadow: "0 4px 30px rgba(255,68,0,0.5), 0 0 60px rgba(255,68,0,0.2)",
                letterSpacing: "0.02em",
              }}
            >
              FUEL YOUR
              <br />
              <span style={{ color: "#FF4400" }}>COLLECTION</span>
            </h1>

            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: "#cc9980" }}>
              Premium die-cast collectibles and custom framed displays.
              From treasure hunts to custom frames — every car tells a story.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/hotwheels/products"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #FF4400, #D32F2F)",
                  color: "#fff",
                  boxShadow: "0 0 30px rgba(255,68,0,0.4)",
                }}
              >
                Explore Collectibles <ArrowRight size={18} />
              </Link>
              <Link href="/hotwheels/frames"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "transparent",
                  color: "#FFD600",
                  border: "2px solid rgba(255,214,0,0.4)",
                }}
              >
                Custom Frames <Frame size={18} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0200] to-transparent" />
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* TRENDING COLLECTIBLES — Image Carousel */}
      {/* ════════════════════════════════════════════════════════ */}
      {trending.length > 0 && <HWTrendingCarousel products={trending} />}

      {/* ════════════════════════════════════════════════════════ */}
      {/* SHOP BY SCALE */}
      {/* ════════════════════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="container-lg">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-2" style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
              SHOP BY <span style={{ color: "#FF4400" }}>SCALE</span>
            </h2>
            <p className="text-sm" style={{ color: "#cc9980" }}>Find your perfect size</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SCALES.map((scale) => (
              <Link key={scale.label} href={`/hotwheels/products?scale=${scale.label}`}
                className="group relative overflow-hidden rounded-2xl border p-6 text-center transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(145deg, #1A0500, #2A0F00)",
                  borderColor: "rgba(255,68,0,0.15)",
                }}
              >
                <Ruler size={32} className="mx-auto mb-3 group-hover:scale-110 transition-transform" style={{ color: "#FF6600" }} />
                <h3 className="text-2xl font-black mb-1" style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
                  {scale.label}
                </h3>
                <p className="text-xs" style={{ color: "#cc9980" }}>{scale.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* NEW ARRIVALS */}
      {/* ════════════════════════════════════════════════════════ */}
      {newArrivals.length > 0 && (
        <section className="section-padding" style={{ background: "#120500" }}>
          <div className="container-lg">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Sparkles size={24} style={{ color: "#FFD600" }} />
                <div>
                  <h2 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
                    NEW <span style={{ color: "#FFD600" }}>ARRIVALS</span>
                  </h2>
                  <p className="text-sm mt-1" style={{ color: "#cc9980" }}>Fresh drops</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {newArrivals.map((product) => (
                <div key={product.id} className="snap-start shrink-0 w-[200px]">
                  <CollectibleCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* CUSTOM FRAMES */}
      {/* ════════════════════════════════════════════════════════ */}
      <section className="section-padding relative overflow-hidden">
        {/* Decorative bg */}
        <div className="absolute inset-0 opacity-5" style={{
          background: "radial-gradient(ellipse at center, #FF4400 0%, transparent 70%)",
        }} />

        <div className="container-lg relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Frame size={24} style={{ color: "#FF4400" }} />
                <span className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: "#FF6600" }}>Custom Framing</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4"
                style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
                FRAME YOUR
                <br />
                <span style={{ color: "#FF4400" }}>DIE-CAST</span>
              </h2>
              <p className="text-base mb-6" style={{ color: "#cc9980" }}>
                Choose your car, position, background, and frame size.
                Each piece is hand-assembled to create a one-of-a-kind display.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {["Choose your car", "Pick a position", "Select background", "Select size"].map((step, i) => (
                  <div key={step} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "rgba(255,68,0,0.06)", border: "1px solid rgba(255,68,0,0.12)" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                      style={{ background: "linear-gradient(135deg, #FF4400, #D32F2F)", color: "#fff" }}>
                      {i + 1}
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#FFE0CC" }}>{step}</span>
                  </div>
                ))}
              </div>

              <Link href="/hotwheels/frames"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #FF4400, #D32F2F)",
                  color: "#fff",
                  boxShadow: "0 0 30px rgba(255,68,0,0.4)",
                }}
              >
                Customize Yours <ArrowRight size={18} />
              </Link>
            </div>

            {/* Frame showcase */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden border-2"
                style={{
                  borderColor: "rgba(255,68,0,0.3)",
                  background: "linear-gradient(145deg, #1A0500, #2A0F00)",
                }}>
                {frameProducts.length > 0 ? (
                  <Image
                    src={frameProducts[0].images[0] || "/hw_frame_placeholder.png"}
                    alt="Custom Frame"
                    fill
                    className="object-contain p-4"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <Frame size={64} style={{ color: "rgba(255,68,0,0.3)" }} />
                    <p className="mt-4 text-sm font-bold" style={{ color: "#cc9980" }}>
                      Frame designs coming soon
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#8a6650" }}>
                      Admin can add frame products
                    </p>
                  </div>
                )}
              </div>

              {/* Decorative flame corner */}
              <div className="absolute -top-3 -right-3 w-16 h-16 opacity-30"
                style={{
                  background: "radial-gradient(circle, #FF4400 0%, transparent 70%)",
                  filter: "blur(8px)",
                }}
              />
              <div className="absolute -bottom-3 -left-3 w-16 h-16 opacity-30"
                style={{
                  background: "radial-gradient(circle, #FFD600 0%, transparent 70%)",
                  filter: "blur(8px)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* OTHER DIE-CAST CARS */}
      {/* ════════════════════════════════════════════════════════ */}
      {otherCars.length > 0 && (
        <section className="section-padding" style={{ background: "#0D0200" }}>
          <div className="container-lg">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
                  MORE <span style={{ color: "#FF6600" }}>DIE-CAST</span>
                </h2>
                <p className="text-sm mt-1" style={{ color: "#cc9980" }}>Browse our full catalog</p>
              </div>
              <Link href="/hotwheels/products"
                className="hidden sm:flex items-center gap-1 text-sm font-bold hover:gap-2 transition-all"
                style={{ color: "#FF6600" }}>
                Browse All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {otherCars.slice(0, 8).map((product) => (
                <CollectibleCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/hotwheels/products"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all hover:gap-3"
                style={{
                  background: "transparent",
                  color: "#FF6600",
                  border: "2px solid rgba(255,68,0,0.3)",
                }}>
                View Full Catalog <ShoppingBag size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* BOTTOM CTA */}
      {/* ════════════════════════════════════════════════════════ */}
      <section className="section-padding text-center">
        <div className="container-lg max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Flame size={48} className="mx-auto mb-4 animate-bob" style={{ color: "#FF4400" }} />
            <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
              READY TO START YOUR
              <br />
              <span style={{ color: "#FF4400" }}>COLLECTION?</span>
            </h2>
            <p className="text-base mb-8" style={{ color: "#cc9980" }}>
              Join other collectors who trust MIAKSAAA for premium die-cast and custom framing.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/hotwheels/products"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #FF4400, #D32F2F)",
                  color: "#fff",
                  boxShadow: "0 0 30px rgba(255,68,0,0.4)",
                }}>
                Start Shopping <ShoppingBag size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ─── Collectible Card Component ─────────────────────────────── */
function CollectibleCard({ product }: { product: Product }) {
  const isRare = product.rarity === "rare" || product.rarity === "super-treasure-hunt" || product.rarity === "treasure-hunt";

  return (
    <Link href={`/hotwheels/products/${product.id}`}
      className="group block rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "linear-gradient(145deg, #1A0500, #2A0F00)",
        borderColor: isRare ? "rgba(255,214,0,0.3)" : "rgba(255,68,0,0.12)",
      }}
    >
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-[#0D0200]">
        {product.images[0] ? (
          <Image src={product.images[0]} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ShoppingBag size={32} style={{ color: "rgba(255,68,0,0.2)" }} />
          </div>
        )}

        {/* Rarity badge */}
        {product.rarity && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: product.rarity === "super-treasure-hunt" ? "linear-gradient(135deg, #FFD600, #FF4400)" :
                product.rarity === "treasure-hunt" ? "linear-gradient(135deg, #FF6600, #D32F2F)" :
                product.rarity === "rare" ? "linear-gradient(135deg, #3B82F6, #1D4ED8)" :
                "rgba(255,255,255,0.15)",
              color: product.rarity === "super-treasure-hunt" ? "#1A0500" :
                product.rarity === "treasure-hunt" ? "#fff" :
                product.rarity === "rare" ? "#fff" : "#cc9980",
            }}>
            {product.rarity === "super-treasure-hunt" ? "🔥 STH" :
             product.rarity === "treasure-hunt" ? "TH" :
             product.rarity === "rare" ? "RARE" : product.rarity}
          </span>
        )}

        {/* Scale badge */}
        {product.scale && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold"
            style={{ background: "rgba(0,0,0,0.7)", color: "#cc9980" }}>
            {product.scale}
          </span>
        )}

        {/* Condition */}
        {product.condition && (
          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold"
            style={{
              background: product.condition === "graded" ? "rgba(255,214,0,0.2)" :
                product.condition === "carded" ? "rgba(74,222,128,0.2)" :
                "rgba(255,255,255,0.1)",
              color: product.condition === "graded" ? "#FFD600" :
                product.condition === "carded" ? "#4ade80" : "#cc9980",
            }}>
            {product.condition.toUpperCase()}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <p className="text-xs font-bold truncate" style={{ color: "#cc9980" }}>
          {product.series || "Die-Cast"}
        </p>
        <h3 className="text-sm font-bold truncate" style={{ color: "#FFE0CC" }}>
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-base font-black" style={{ color: "#FF6600" }}>
            {formatPrice(product.discountedPrice ?? product.price)}
          </span>
          {product.grading && (
            <span className="text-xs font-bold" style={{ color: "#FFD600" }}>
              ★ {product.grading}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
