"use client";
import { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Flame, SlidersHorizontal, X } from "lucide-react";
import { getCollectibleProducts } from "@/lib/firebase/firestore";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const RARITIES = ["common", "uncommon", "rare", "treasure-hunt", "super-treasure-hunt"];
const CONDITIONS = ["loose", "carded", "graded"];
const SCALES = ["1:64", "1:43", "1:24", "1:18"];

export default function HotWheelsProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "#0D0200" }} />}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [scaleFilter, setScaleFilter] = useState(searchParams.get("scale") || "");
  const [rarityFilter, setRarityFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "rating">("newest");

  useEffect(() => {
    getCollectibleProducts().then(setProducts).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];
    if (scaleFilter) result = result.filter((p) => p.scale === scaleFilter);
    if (rarityFilter) result = result.filter((p) => p.rarity === rarityFilter);
    if (conditionFilter) result = result.filter((p) => p.condition === conditionFilter);
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price)); break;
      case "price-desc": result.sort((a, b) => (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price)); break;
      case "rating": result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: result.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)); break;
    }
    return result;
  }, [products, scaleFilter, rarityFilter, conditionFilter, sortBy]);

  const hasFilters = scaleFilter || rarityFilter || conditionFilter;

  return (
    <div style={{ background: "#0D0200", minHeight: "100vh" }}>
      <div className="container-lg py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame size={20} style={{ color: "#FF4400" }} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#FF6600" }}>
                Collectibles
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black" style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
              DIE-CAST <span style={{ color: "#FF4400" }}>CATALOG</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: "#cc9980" }}>
              {filtered.length} collectible{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: showFilters ? "rgba(255,68,0,0.15)" : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,68,0,0.2)",
              color: showFilters ? "#FF6600" : "#cc9980",
            }}>
            <SlidersHorizontal size={16} />
            Filters {hasFilters ? "(active)" : ""}
          </button>
        </div>

        {/* Active filter pills */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {scaleFilter && (
              <button onClick={() => setScaleFilter("")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: "rgba(255,68,0,0.15)", color: "#FF6600", border: "1px solid rgba(255,68,0,0.3)" }}>
                Scale: {scaleFilter} <X size={12} />
              </button>
            )}
            {rarityFilter && (
              <button onClick={() => setRarityFilter("")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: "rgba(255,214,0,0.15)", color: "#FFD600", border: "1px solid rgba(255,214,0,0.3)" }}>
                Rarity: {rarityFilter} <X size={12} />
              </button>
            )}
            {conditionFilter && (
              <button onClick={() => setConditionFilter("")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }}>
                Condition: {conditionFilter} <X size={12} />
              </button>
            )}
          </div>
        )}

        {/* Filter bar + Sort */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden mb-8"
          >
            <div className="p-6 rounded-2xl space-y-5"
              style={{ background: "#1A0500", border: "1px solid rgba(255,68,0,0.12)" }}>
              {/* Scale filters */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#cc9980" }}>Scale</p>
                <div className="flex flex-wrap gap-2">
                  {SCALES.map((s) => (
                    <button key={s} onClick={() => setScaleFilter(scaleFilter === s ? "" : s)}
                      className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                      style={{
                        background: scaleFilter === s ? "linear-gradient(135deg, #FF4400, #D32F2F)" : "rgba(255,255,255,0.04)",
                        color: scaleFilter === s ? "#fff" : "#cc9980",
                        border: scaleFilter === s ? "none" : "1px solid rgba(255,68,0,0.15)",
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rarity filters */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#cc9980" }}>Rarity</p>
                <div className="flex flex-wrap gap-2">
                  {RARITIES.map((r) => (
                    <button key={r} onClick={() => setRarityFilter(rarityFilter === r ? "" : r)}
                      className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                      style={{
                        background: rarityFilter === r ? "linear-gradient(135deg, #FFD600, #FF4400)" : "rgba(255,255,255,0.04)",
                        color: rarityFilter === r ? "#1A0500" : "#cc9980",
                        border: rarityFilter === r ? "none" : "1px solid rgba(255,68,0,0.15)",
                      }}>
                      {r.replace("-", " ").toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition filters */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#cc9980" }}>Condition</p>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map((c) => (
                    <button key={c} onClick={() => setConditionFilter(conditionFilter === c ? "" : c)}
                      className="px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize"
                      style={{
                        background: conditionFilter === c ? "linear-gradient(135deg, #22c55e, #16a34a)" : "rgba(255,255,255,0.04)",
                        color: conditionFilter === c ? "#fff" : "#cc9980",
                        border: conditionFilter === c ? "none" : "1px solid rgba(255,68,0,0.15)",
                      }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="pt-2 border-t" style={{ borderColor: "rgba(255,68,0,0.1)" }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#cc9980" }}>Sort By</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "newest", label: "Newest" },
                    { value: "price-asc", label: "Price: Low → High" },
                    { value: "price-desc", label: "Price: High → Low" },
                    { value: "rating", label: "Top Rated" },
                  ].map((opt) => (
                    <button key={opt.value} onClick={() => setSortBy(opt.value as any)}
                      className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                      style={{
                        background: sortBy === opt.value ? "rgba(255,68,0,0.15)" : "transparent",
                        color: sortBy === opt.value ? "#FF6600" : "#cc9980",
                        border: "1px solid rgba(255,68,0,0.15)",
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="aspect-square skeleton" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-2/3 skeleton" />
                  <div className="h-4 w-1/2 skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: "rgba(255,68,0,0.3)" }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: "#FFE0CC" }}>No collectibles found</h3>
            <p className="text-sm" style={{ color: "#cc9980" }}>
              {hasFilters ? "Try adjusting your filters" : "No products added yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <CollectibleCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Collectible Card ───────────────────────────────────────── */
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
      <div className="aspect-square relative overflow-hidden bg-[#0D0200]">
        {product.images[0] ? (
          <Image src={product.images[0]} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ShoppingBag size={32} style={{ color: "rgba(255,68,0,0.2)" }} />
          </div>
        )}
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
        {product.scale && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold"
            style={{ background: "rgba(0,0,0,0.7)", color: "#cc9980" }}>
            {product.scale}
          </span>
        )}
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
      <div className="p-3 space-y-1">
        <p className="text-xs font-bold truncate" style={{ color: "#cc9980" }}>{product.series || "Die-Cast"}</p>
        <h3 className="text-sm font-bold truncate" style={{ color: "#FFE0CC" }}>{product.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-base font-black" style={{ color: "#FF6600" }}>
            {formatPrice(product.discountedPrice ?? product.price)}
          </span>
          {product.grading && (
            <span className="text-xs font-bold" style={{ color: "#FFD600" }}>★ {product.grading}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
