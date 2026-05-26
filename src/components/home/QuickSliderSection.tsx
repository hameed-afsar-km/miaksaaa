"use client";
import { useRef, useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export function QuickSliderSection({ products }: { products: Product[] }) {
  const [page, setPage] = useState(0);
  const perPage = 4;
  const totalPages = Math.ceil(products.length / perPage);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState(0);

  useEffect(() => {
    function updateWidth() {
      if (viewportRef.current) {
        setPageWidth(viewportRef.current.clientWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const pages: Product[][] = [];
  for (let i = 0; i < products.length; i += perPage) {
    pages.push(products.slice(i, i + perPage));
  }

  function goTo(direction: "prev" | "next") {
    if (direction === "next" && page < totalPages - 1) setPage(page + 1);
    if (direction === "prev" && page > 0) setPage(page - 1);
  }

  if (products.length === 0) return null;

  return (
    <section className="py-12 border-b border-purple-500/5 relative" style={{ background: "rgba(14,8,30,0.4)" }}>
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-600/5 blur-[80px] pointer-events-none overflow-hidden" />

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
        </div>

        {/* Mobile: draggable carousel with peek */}
        <div className="md:hidden -mx-4">
          <div
            className="flex gap-2 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none pl-4 pr-4"
            style={{ scrollbarWidth: "none" }}
          >
            {products.map((product, i) => (
              <div
                key={product.id}
                className="flex-[0_0_calc(100vw-3.5rem)] snap-start"
              >
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: paginated grid with arrow navigation */}
        <div className="hidden md:block relative">
          {/* Left Arrow */}
          <button
            onClick={() => goTo("prev")}
            disabled={page === 0}
            className="absolute -left-15 top-1/2 -translate-y-1/2 z-10 w-10 h-20 rounded-full border flex items-center justify-center transition-all hover:bg-purple-950/30 cursor-pointer text-purple-300 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ borderColor: "var(--border)", background: "rgba(14,8,30,0.8)", backdropFilter: "blur(8px)" }}
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Viewport */}
          <div ref={viewportRef} className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-in-out will-change-transform"
              style={{ transform: `translateX(-${page * pageWidth}px)` }}
            >
              {pages.map((pageProducts, pi) => (
                <div
                  key={pi}
                  className="grid grid-cols-4 gap-4 flex-shrink-0 pb-4 pt-1"
                  style={{ width: pageWidth || "100%" }}
                >
                  {pageProducts.map((product, i) => (
                    <div key={product.id}>
                      <ProductCard product={product} index={pi * perPage + i} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => goTo("next")}
            disabled={page >= totalPages - 1}
            className="absolute -right-15 top-1/2 -translate-y-1/2 z-10 w-10 h-20 rounded-full border flex items-center justify-center transition-all hover:bg-purple-950/30 cursor-pointer text-purple-300 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ borderColor: "var(--border)", background: "rgba(14,8,30,0.8)", backdropFilter: "blur(8px)" }}
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
