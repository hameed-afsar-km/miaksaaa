"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Zap, Sparkles, Flame } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { formatPrice, getDiscountPercent, truncate } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const [imgError, setImgError] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const addToCart = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = mounted && isInWishlist(product.id);
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
    toast.success("Added to cart!");
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast("Removed from wishlist", { icon: "💔" });
    } else {
      addToWishlist({
        productId: product.id,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice,
        image: product.images[0] ?? "",
        addedAt: new Date(),
      });
      toast.success("Added to wishlist!");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link href={`/products/${product.id}`} className="group block">
        <div
          className="relative rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-xl"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="badge badge-purple flex items-center gap-1">
                <Sparkles size={10} /> New
              </span>
            )}
            {product.isHot && (
              <span className="badge badge-red flex items-center gap-1">
                <Flame size={10} /> Hot
              </span>
            )}
            {product.isOnSale && discountPct > 0 && (
              <span className="badge badge-gold flex items-center gap-1">
                <Zap size={10} /> -{discountPct}%
              </span>
            )}
            {outOfStock && (
              <span className="badge" style={{ background: "rgba(0,0,0,0.6)", color: "#9ca3af" }}>
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: inWishlist ? "rgba(239,68,68,0.2)" : "rgba(0,0,0,0.4)",
              border: "1px solid",
              borderColor: inWishlist ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)",
            }}
          >
            <Heart
              size={14}
              fill={inWishlist ? "#ef4444" : "none"}
              style={{ color: inWishlist ? "#ef4444" : "#fff" }}
            />
          </button>

          {/* Image */}
          <div className="product-img-wrapper aspect-square">
            {product.images[0] && !imgError ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-106"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center aspect-square"
                style={{ background: "var(--bg-surface)" }}>
                <ShoppingBag size={40} style={{ color: "var(--text-muted)" }} />
              </div>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3 px-3"
              style={{ background: "linear-gradient(to top, rgba(10,6,20,0.9) 0%, transparent 50%)" }}>
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="btn-primary w-full text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={15} />
                {outOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3.5">
            <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              {product.category}
            </p>
            <h3 className="font-semibold text-sm leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
              {truncate(product.title, 50)}
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
            <div className="flex items-center justify-between">
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
          </div>
        </div>
      </Link>
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
