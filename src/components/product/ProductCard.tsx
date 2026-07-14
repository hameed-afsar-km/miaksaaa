"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Star, Zap, Sparkles, Flame, Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { AddedToCartModal } from "@/components/cart/AddedToCartModal";

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
}

export function ProductCard({ product, index = 0, priority = false }: ProductCardProps) {
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
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const discountPct = product.discountedPrice
    ? getDiscountPercent(product.price, product.discountedPrice) : 0;

  // Check if truly out of stock (handles variants too)
  const allColorVariantsOut = (product.colorVariants ?? []).length > 0
    && (product.colorVariants ?? []).every((v) => v.stock === 0);
  const allSizeVariantsOut = (product.sizeVariants ?? []).filter((s) => s.enabled).length > 0
    && (product.sizeVariants ?? []).filter((s) => s.enabled).every((v) => v.stock === 0);
  const outOfStock = product.hasVariants
    ? (allColorVariantsOut || allSizeVariantsOut)
    : product.stock === 0;

  function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeWishlist(product.id);
    } else {
      addWishlist({
        productId: product.id,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice,
        image: product.images[0] ?? "",
        addedAt: new Date(),
      });
    }
  }

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
      <Link href={`/products/${product.id}`} target="_blank" rel="noopener noreferrer" className="group block h-full">
        <div
          className="relative rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-xl h-full flex flex-col"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {/* Wishlist toggle — visible on hover, desktop only */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 hidden md:flex"
            style={{
              background: inWishlist ? "rgba(239,68,68,0.2)" : "rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)",
            }}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={16}
              className="transition-colors duration-200"
              style={{
                color: inWishlist ? "#ef4444" : "#fff",
                fill: inWishlist ? "#ef4444" : "none",
              }}
            />
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.isNew && !outOfStock && (
              <span className="badge flex items-center gap-1"
                style={{ background: "rgba(147,51,234,0.85)", color: "#fff", border: "1px solid rgba(147,51,234,0.6)" }}>
                <Sparkles size={10} /> New
              </span>
            )}
            {product.isHot && !outOfStock && (
              <span className="badge flex items-center gap-1"
                style={{ background: "rgba(239,68,68,0.85)", color: "#fff", border: "1px solid rgba(239,68,68,0.6)" }}>
                <Flame size={10} /> Hot
              </span>
            )}
            {product.isOnSale && discountPct > 0 && !outOfStock && (
              <span className="badge flex items-center gap-1"
                style={{ background: "rgba(217,119,6,0.85)", color: "#fff", border: "1px solid rgba(217,119,6,0.6)" }}>
                <Zap size={10} /> -{discountPct}%
              </span>
            )}
          </div>

          {/* Image */}
          <div className="product-img-wrapper aspect-square select-none pointer-events-none relative">
            {product.images[0] && !imgError ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className={`object-cover transition-transform duration-500 group-hover:scale-106 ${outOfStock ? "opacity-30" : ""}`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onError={() => setImgError(true)}
                draggable={false}
                priority={priority}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center aspect-square"
                style={{ background: "var(--bg-surface)" }}>
                <ShoppingBag size={40} style={{ color: "var(--text-muted)" }} />
              </div>
            )}
            {outOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/40 via-transparent to-black/40">
                {/* Diagonal stripe pattern */}
                <div className="absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(45deg, #ef4444 0px, #ef4444 2px, transparent 2px, transparent 8px)",
                  }}
                />
                <div className="relative flex flex-col items-center gap-2">
                  <div className="absolute inset-0 bg-black/50 blur-2xl rounded-full scale-150" />
                  <div className="relative flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-red-500/60 bg-gradient-to-r from-black/90 to-red-950/80 backdrop-blur shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center">
                      <span className="text-red-400 text-xs font-black">!</span>
                    </div>
                    <span className="text-red-300 font-black text-sm tracking-[0.15em] uppercase">Out of Stock</span>
                  </div>
                </div>
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
                className={`w-full text-xs py-1.5 sm:text-sm sm:py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  outOfStock
                    ? "bg-gradient-to-r from-red-950/40 to-red-900/20 text-red-400/40 border border-red-900/30 cursor-not-allowed"
                    : "btn-primary"
                }`}
              >
                {outOfStock ? (
                  <><div className="w-4 h-4 rounded-full border border-red-500/40 flex items-center justify-center"><span className="text-red-500/50 text-[10px] font-black">!</span></div> Out of Stock</>
                ) : (
                  <><ShoppingBag className="w-4 h-4 sm:w-[13px] sm:h-[13px]" /> Add to Cart</>
                )}
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
