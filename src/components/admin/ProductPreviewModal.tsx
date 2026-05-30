"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice, getDiscountPercent } from "@/lib/utils";

interface ProductPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Partial<Product> | null;
}

export function ProductPreviewModal({ isOpen, onClose, product }: ProductPreviewModalProps) {
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (!product) return null;

  const discount = product.discountedPrice
    ? getDiscountPercent(product.price ?? 0, product.discountedPrice) : 0;
  const hasVariants = product.hasVariants ?? false;
  const colorVariants = product.colorVariants ?? [];
  const validVariantIdx = Math.min(selectedVariant, colorVariants.length - 1);
  const productImage = hasVariants && colorVariants[validVariantIdx]?.images?.[0]
    ? colorVariants[validVariantIdx].images[0]
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
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)" }}
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
              className="w-full max-w-lg rounded-2xl overflow-hidden"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pb-4 flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(147,51,234,0.15)" }}
                >
                  <Eye size={22} style={{ color: "var(--purple-400)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg">Product Preview</h3>
                  <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                    How it will look to customers
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center btn-ghost flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Product Preview Card */}
              <div className="px-6 pb-4">
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={productImage}
                      alt={product.title || ""}
                      fill
                      className="object-cover"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.isNew && (
                        <span className="badge" style={{ background: "rgba(147,51,234,0.85)", color: "#fff", border: "1px solid rgba(147,51,234,0.6)" }}>
                          New
                        </span>
                      )}
                      {product.isHot && (
                        <span className="badge" style={{ background: "rgba(239,68,68,0.85)", color: "#fff", border: "1px solid rgba(239,68,68,0.6)" }}>
                          Hot
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="badge" style={{ background: "rgba(217,119,6,0.85)", color: "#fff", border: "1px solid rgba(217,119,6,0.6)" }}>
                          -{discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2.5">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      {product.category || "Category"}
                    </span>
                    <h4 className="font-bold text-base leading-snug" style={{ fontFamily: "Playfair Display, serif" }}>
                      {product.title || "Product Title"}
                    </h4>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black" style={{ color: "var(--purple-300)" }}>
                        {formatPrice(displayPrice)}
                      </span>
                      {product.discountedPrice && product.price && (
                        <>
                          <span className="text-sm line-through" style={{ color: "var(--text-muted)" }}>
                            {formatPrice(product.price)}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Variants preview */}
                    {hasVariants && colorVariants.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>Available Colors</p>
                        <div className="flex flex-wrap gap-1.5">
                          {colorVariants.map((v, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setSelectedVariant(i)}
                              className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer"
                              style={{
                                background: i === validVariantIdx ? "rgba(147,51,234,0.3)" : "rgba(147,51,234,0.1)",
                                border: `1px solid ${i === validVariantIdx ? "rgba(147,51,234,0.6)" : "rgba(147,51,234,0.2)"}`,
                              }}
                            >
                              {v.hexCode && (
                                <span
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: v.hexCode }}
                                />
                              )}
                              {v.name}
                              <span style={{ color: "var(--text-muted)" }}>({v.stock})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description preview */}
                    {product.description && (
                      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Cart button preview */}
                  <div className="px-4 pb-4">
                    <button
                      disabled
                      className="btn-primary w-full text-xs py-3 opacity-80 cursor-not-allowed"
                    >
                      <ShoppingBag size={14} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-2">
                <button onClick={onClose} className="btn-primary w-full text-sm py-3">
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
