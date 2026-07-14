"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flame, ArrowRight, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface Position {
  offset: number;
  x: number;
  scale: number;
  opacity: number;
  z: number;
}

const DESKTOP_POSITIONS: Position[] = [
  { offset: -2, x: -400, scale: 0.5, opacity: 0.12, z: 0 },
  { offset: -1, x: -230, scale: 0.75, opacity: 0.35, z: 1 },
  { offset: 0, x: 0, scale: 1, opacity: 1, z: 3 },
  { offset: 1, x: 230, scale: 0.75, opacity: 0.35, z: 1 },
  { offset: 2, x: 400, scale: 0.5, opacity: 0.12, z: 0 },
];

const MOBILE_POSITIONS: Position[] = [
  { offset: -2, x: -210, scale: 0.4, opacity: 0.08, z: 0 },
  { offset: -1, x: -126, scale: 0.65, opacity: 0.25, z: 1 },
  { offset: 0, x: 0, scale: 1, opacity: 1, z: 3 },
  { offset: 1, x: 126, scale: 0.65, opacity: 0.25, z: 1 },
  { offset: 2, x: 210, scale: 0.4, opacity: 0.08, z: 0 },
];

export function HWTrendingCarousel({ products }: { products: Product[] }) {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const total = products.length;
  const positions = isMobile ? MOBILE_POSITIONS : DESKTOP_POSITIONS;

  const goNext = () => setCurrent((p) => (p + 1) % total);
  const goPrev = () => setCurrent((p) => (p - 1 + total) % total);

  const items = useMemo(
    () =>
      positions.map((pos) => ({
        ...pos,
        product: products[(current + pos.offset + total) % total],
      })),
    [current, products, total, positions]
  );

  if (total === 0) return null;

  return (
    <section className="py-12 md:py-20 overflow-hidden" style={{ background: "#0D0200" }}>
      <div className="container-lg">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame size={20} style={{ color: "#FF4400" }} />
            <span className="text-sm font-bold uppercase tracking-[0.3em]" style={{ color: "#FF6600" }}>
              Trending Now
            </span>
            <Flame size={20} style={{ color: "#FFD600" }} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black" style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
            HOT <span style={{ color: "#FF4400" }}>PICKS</span>
          </h2>
        </div>

        <div className="relative flex items-center justify-center h-[300px] md:h-[420px]">
          <button
            onClick={goPrev}
            className="absolute left-2 md:-left-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm"
            style={{
              background: "rgba(255,68,0,0.15)",
              border: "1px solid rgba(255,68,0,0.3)",
              color: "#FF6600",
            }}
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            {items.map(({ product, x, scale, opacity, z, offset }) => {
              const imgSrc = product.images?.[0];
              const w = isMobile ? "140px" : "clamp(160px, 18vw, 240px)";
              return (
                <div
                  key={`${product.id}-${offset}`}
                  className="absolute transition-all duration-500 ease-out"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: "50%",
                    zIndex: z,
                    transform: "translate(-50%, -50%)",
                    width: w,
                    aspectRatio: "1",
                  }}
                >
                  <motion.div
                    className="w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                    animate={{ scale, opacity }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 24,
                      mass: 0.6,
                    }}
                  >
                    <Link
                      href={`/hotwheels/products/${product.id}`}
                      className="block w-full h-full"
                      style={{ position: "relative", width: "100%", height: "100%" }}
                    >
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 140px, 240px"
                          priority={offset === 0}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: "#1A0500" }}
                        >
                          <ShoppingBag size={28} style={{ color: "rgba(255,68,0,0.2)" }} />
                        </div>
                      )}
                    </Link>
                  </motion.div>
                </div>
              );
            })}
          </div>

          <button
            onClick={goNext}
            className="absolute right-2 md:-right-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm"
            style={{
              background: "rgba(255,68,0,0.15)",
              border: "1px solid rgba(255,68,0,0.3)",
              color: "#FF6600",
            }}
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {products[current] && (
          <div className="text-center mt-6 md:mt-8">
            <Link
              href={`/hotwheels/products/${products[current].id}`}
              className="hover:opacity-80 transition-opacity"
            >
              <h3
                className="text-xl md:text-2xl font-black"
                style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}
              >
                {products[current].title}
              </h3>
            </Link>
            <p className="text-sm mt-1" style={{ color: "#cc9980" }}>
              {products[current].series || "Die-Cast Collectible"}
            </p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-lg font-black" style={{ color: "#FF6600" }}>
                {formatPrice(
                  products[current].discountedPrice ?? products[current].price
                )}
              </span>
              {products[current].grading && (
                <span className="text-sm font-bold" style={{ color: "#FFD600" }}>
                  ★ {products[current].grading}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <Link
            href="/hotwheels/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:gap-3"
            style={{
              background: "transparent",
              color: "#FF6600",
              border: "2px solid rgba(255,68,0,0.3)",
            }}
          >
            View All Collectibles <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
