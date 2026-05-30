"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X, ShoppingBag, Heart, Star, Truck, Shield, RefreshCw,
  Sparkles, Flame, Zap, Eye
} from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice, getDiscountPercent } from "@/lib/utils";

interface ProductDetailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ProductDetailPreviewModal({ isOpen, onClose, product }: ProductDetailPreviewModalProps) {
  const [tab, setTab] = useState<"desc" | "details">("desc");

  if (!product) return null;

  const discount = product.discountedPrice
    ? getDiscountPercent(product.price, product.discountedPrice) : 0;
  const hasVariants = product.hasVariants ?? false;
  const colorVariants = (product.colorVariants ?? []).map((cv) => ({
    ...cv,
    images: (cv as any).images ?? ((cv as any).image ? [(cv as any).image] : []),
  }));
  const productImage = hasVariants && colorVariants[0]?.images?.[0]
    ? colorVariants[0].images[0]
    : product.images?.[0] || "/placeholder.jpg";
  const displayPrice = product.discountedPrice ?? product.price ?? 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(14px)" }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center gap-3 p-4 border-b" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(147,51,234,0.15)" }}>
                  <Eye size={16} style={{ color: "var(--purple-400)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm">Product Detail Preview</h3>
                  <p className="text-[11px] truncate" style={{ color: "var(--text-secondary)" }}>
                    How customers will see this product
                  </p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center btn-ghost flex-shrink-0">
                  <X size={16} />
                </button>
              </div>

              {/* Preview Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {/* Image */}
                  <div>
                    <div
                      className="relative aspect-square rounded-2xl overflow-hidden"
                      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
                    >
                      <Image src={productImage} alt={product.title} fill className="object-cover" />
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.isNew && <span className="badge badge-purple flex items-center gap-1"><Sparkles size={10} /> New</span>}
                        {product.isHot && <span className="badge badge-red flex items-center gap-1"><Flame size={10} /> Hot</span>}
                        {product.isOnSale && discount > 0 && <span className="badge badge-gold flex items-center gap-1"><Zap size={10} /> -{discount}%</span>}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-4">
                    <span className="badge badge-purple w-fit text-[10px]">{product.category}</span>
                    <h2 className="text-xl font-black leading-tight" style={{ fontFamily: "Playfair Display,serif" }}>
                      {product.title}
                    </h2>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14}
                            fill={i < Math.round(product.rating) ? "#fbbf24" : "none"}
                            style={{ color: i < Math.round(product.rating) ? "#fbbf24" : "var(--text-muted)" }}
                          />
                        ))}
                      </div>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-2xl font-black gradient-text-purple">
                        {formatPrice(displayPrice)}
                      </span>
                      {product.discountedPrice && (
                        <>
                          <span className="text-sm line-through" style={{ color: "var(--text-muted)" }}>
                            {formatPrice(product.price)}
                          </span>
                          <span className="badge badge-gold text-[10px]">{discount}% off</span>
                        </>
                      )}
                      {product.limitedTimeOffer?.enabled && (
                        <span className="badge text-[10px]" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}>
                          ⏱️ {product.limitedTimeOffer.label || "Limited Offer"}
                        </span>
                      )}
                    </div>

                    {/* Stock */}
                    <div>
                      {product.stock === 0 ? (
                        <span className="badge badge-red text-[10px]">Out of Stock</span>
                      ) : product.stock <= 5 ? (
                        <span className="text-xs" style={{ color: "#fca5a5" }}>⚠️ Only {product.stock} left in stock!</span>
                      ) : (
                        <span className="text-xs" style={{ color: "#86efac" }}>✓ In Stock ({product.stock} available)</span>
                      )}
                    </div>

                    {/* Color Variants */}
                    {colorVariants.length > 0 && (
                      <div>
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                          Available Colors
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {colorVariants.map((color, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col items-center gap-1 p-1.5 rounded-lg border"
                              style={{
                                background: "rgba(147,51,234,0.08)",
                                borderColor: "rgba(147,51,234,0.3)",
                                opacity: color.stock > 0 ? 1 : 0.5,
                              }}
                            >
                              {color.hexCode ? (
                                <div className="w-7 h-7 rounded-full border-2" style={{ backgroundColor: color.hexCode, borderColor: "rgba(147,51,234,0.5)" }} />
                              ) : (
                                <div className="w-7 h-7 rounded-full border-2" style={{ background: "conic-gradient(#9333ea, #a855f7, #c084fc, #9333ea)", borderColor: "rgba(147,51,234,0.5)" }} />
                              )}
                              <span className="text-[10px] font-medium">{color.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Size Variants */}
                    {(() => {
                      const sizeVariants = product.sizeVariants ?? [];
                      if (!sizeVariants.some((s) => s.enabled)) return null;
                      return (
                        <div>
                          <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                            Select Size
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {sizeVariants.filter((s) => s.enabled).map((size, idx) => (
                              <div
                                key={idx}
                                className="w-9 h-9 rounded-lg border font-semibold flex items-center justify-center text-[10px]"
                                style={{
                                  background: size.stock > 0 ? "rgba(147,51,234,0.1)" : "rgba(100,100,100,0.05)",
                                  borderColor: size.stock > 0 ? "rgba(147,51,234,0.3)" : "rgba(100,100,100,0.2)",
                                  opacity: size.stock > 0 ? 1 : 0.5,
                                }}
                              >
                                {size.size}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* CTAs (disabled for preview) */}
                    <div className="flex gap-2">
                      <button disabled className="btn-primary flex-1 text-xs py-2.5 opacity-60 cursor-not-allowed">
                        <ShoppingBag size={14} /> Add to Cart
                      </button>
                      <button disabled className="w-10 h-10 rounded-xl flex items-center justify-center opacity-60 cursor-not-allowed" style={{ background: "rgba(147,51,234,0.1)", border: "1px solid var(--border)" }}>
                        <Heart size={16} style={{ color: "var(--purple-300)" }} />
                      </button>
                    </div>

                    {/* Delivery info */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { icon: Truck, label: "Free Delivery", sub: "Orders above ₹499" },
                        { icon: Shield, label: "Secure", sub: "100% protected" },
                        { icon: RefreshCw, label: "7-Day Return", sub: "Easy returns" },
                      ].map(({ icon: Icon, label, sub }) => (
                        <div key={label} className="flex flex-col items-center text-center p-2 rounded-lg"
                          style={{ background: "rgba(147,51,234,0.06)", border: "1px solid var(--border)" }}>
                          <Icon size={13} style={{ color: "var(--purple-400)" }} className="mb-1" />
                          <p className="text-[10px] font-semibold">{label}</p>
                          <p className="text-[8px]" style={{ color: "var(--text-muted)" }}>{sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tabs for Description/Details */}
                <div className="mt-6">
                  <div className="flex gap-1 mb-3 p-0.5 rounded-lg w-fit" style={{ background: "var(--bg-surface)" }}>
                    {(["desc", "details"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: tab === t ? "rgba(147,51,234,0.25)" : "transparent",
                          color: tab === t ? "var(--purple-300)" : "var(--text-muted)",
                          border: tab === t ? "1px solid rgba(147,51,234,0.3)" : "1px solid transparent",
                        }}
                      >
                        {t === "desc" ? "Description" : "Details"}
                      </button>
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tab}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {tab === "desc"
                        ? product.description
                        : (
                          <div className="space-y-1.5">
                            {[
                              ["Category", product.category],
                              ["Stock", hasVariants ? "Variant-based" : `${product.stock} units`],
                              ["Rating", `${product.rating}/5`],
                            ].map(([k, v]) => (
                              <div key={k} className="flex gap-2">
                                <span className="w-20 font-semibold" style={{ color: "var(--text-muted)" }}>{k}</span>
                                <span>{v}</span>
                              </div>
                            ))}
                          </div>
                        )
                      }
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
                <button onClick={onClose} className="btn-primary w-full text-sm py-2.5">
                  Close Preview
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
