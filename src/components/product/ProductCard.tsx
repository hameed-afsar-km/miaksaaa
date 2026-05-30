"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Star, Zap, Sparkles, Flame } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { AddedToCartModal } from "@/components/cart/AddedToCartModal";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [addedItem, setAddedItem] = useState<{
    productId: string;
    title: string;
    price: number;
    discountedPrice?: number;
    image: string;
    quantity: number;
    category?: string;
  } | null>(null);

  const addToCart = useCartStore((s) => s.addItem);
  const discountPct = product.discountedPrice
    ? getDiscountPercent(product.price, product.discountedPrice) : 0;
  const outOfStock = product.stock === 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (outOfStock) return;
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      discountedPrice: product.discountedPrice,
      image: product.images[0] ?? "",
      quantity: 1,
      stock: product.stock,
    });
    setAddedItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      discountedPrice: product.discountedPrice,
      image: product.images[0] ?? "",
      quantity: 1,
      category: product.category,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="h-full"
    >
      <Link href={`/products/${product.id}`} className="group block h-full">
        <div
          className="relative rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-xl h-full flex flex-col"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="badge flex items-center gap-1"
                style={{ background: "rgba(147,51,234,0.85)", color: "#fff", border: "1px solid rgba(147,51,234,0.6)" }}>
                <Sparkles size={10} /> New
              </span>
            )}
            {product.isHot && (
              <span className="badge flex items-center gap-1"
                style={{ background: "rgba(239,68,68,0.85)", color: "#fff", border: "1px solid rgba(239,68,68,0.6)" }}>
                <Flame size={10} /> Hot
              </span>
            )}
            {product.isOnSale && discountPct > 0 && (
              <span className="badge flex items-center gap-1"
                style={{ background: "rgba(217,119,6,0.85)", color: "#fff", border: "1px solid rgba(217,119,6,0.6)" }}>
                <Zap size={10} /> -{discountPct}%
              </span>
            )}
            {outOfStock && (
              <span className="badge" style={{ background: "rgba(0,0,0,0.75)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.1)" }}>
                Out of Stock
              </span>
            )}
          </div>

          {/* Image */}
          <div className="product-img-wrapper aspect-square select-none pointer-events-none">
            {product.images[0] && !imgError ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-106"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onError={() => setImgError(true)}
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center aspect-square"
                style={{ background: "var(--bg-surface)" }}>
                <ShoppingBag size={40} style={{ color: "var(--text-muted)" }} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3.5 flex flex-col flex-1">
            <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              {product.category}
            </p>
            <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2" style={{ color: "var(--text-primary)" }}>
              {product.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  fill={i < Math.round(product.rating) ? "#fbbf24" : "none"}
                  style={{ color: i < Math.round(product.rating) ? "#fbbf24" : "var(--text-muted)" }}
                />
              ))}
              <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>
                ({product.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold" style={{ color: "var(--purple-300)" }}>
                  {formatPrice(product.discountedPrice ?? product.price)}
                </span>
                {product.discountedPrice && (
                  <span className="text-xs line-through" style={{ color: "var(--text-muted)" }}>
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-xs" style={{ color: "#fca5a5" }}>
                  Only {product.stock} left
                </span>
              )}
            </div>
            <div className="mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="btn-primary w-full text-xs py-1.5 sm:text-sm sm:py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4 sm:w-[13px] sm:h-[13px]" />
                {outOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </Link>
      <AddedToCartModal
        isOpen={addedItem !== null}
        onClose={() => setAddedItem(null)}
        onGoToCart={() => { setAddedItem(null); router.push("/cart"); }}
        item={addedItem}
      />
    </motion.div>
  );
}

// Skeleton loader
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <div className="aspect-square skeleton" />
      <div className="p-3.5 space-y-2.5">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-5 w-20 rounded" />
      </div>
    </div>
  );
}
