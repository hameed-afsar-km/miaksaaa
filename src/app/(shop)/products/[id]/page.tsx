"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Heart, Star, ChevronLeft, ChevronRight,
  Minus, Plus, Truck, Shield, RefreshCw, Share2, Flame, Sparkles, Zap
} from "lucide-react";
import { Product } from "@/lib/types";
import { getProductById } from "@/lib/firebase/firestore";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useUIStore } from "@/lib/store/uiStore";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "details">("desc");

  const addToCart = useCartStore((s) => s.addItem);
  const { setCartOpen } = useUIStore();
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    getProductById(id)
      .then((p) => { setProduct(p); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    if (!product || product.stock === 0) return;
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      discountedPrice: product.discountedPrice,
      image: product.images[0] ?? "",
      quantity: qty,
      stock: product.stock,
    });
    toast.success("Added to cart!");
    setCartOpen(true);
  }

  function toggleWishlist() {
    if (!product) return;
    if (inWishlist) {
      removeItem(product.id);
      toast("Removed from wishlist", { icon: "💔" });
    } else {
      addItem({
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

  if (loading) {
    return (
      <div className="container-lg py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="space-y-4">
            {[80, 40, 60, 100, 50].map((w, i) => (
              <div key={i} className="skeleton h-5 rounded" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-lg py-20 text-center">
        <p className="text-4xl mb-4">😕</p>
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <button onClick={() => router.push("/products")} className="btn-primary mt-4">
          Back to Shop
        </button>
      </div>
    );
  }

  const discount = product.discountedPrice
    ? getDiscountPercent(product.price, product.discountedPrice) : 0;
  const images = product.images.length > 0 ? product.images : ["/placeholder.jpg"];

  return (
    <div className="container-lg py-8 md:py-12">
      {/* Back */}
      <button onClick={() => router.back()}
        className="flex items-center gap-1.5 btn-ghost text-sm mb-6 -ml-2">
        <ChevronLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
        {/* Image Gallery */}
        <div>
          <div
            className="relative aspect-square rounded-3xl overflow-hidden mb-3"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImg}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[activeImg]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Prev/Next */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNew && <span className="badge badge-purple flex items-center gap-1"><Sparkles size={10} /> New</span>}
              {product.isHot && <span className="badge badge-red flex items-center gap-1"><Flame size={10} /> Hot</span>}
              {product.isOnSale && discount > 0 && <span className="badge badge-gold flex items-center gap-1"><Zap size={10} /> -{discount}%</span>}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all"
                  style={{
                    border: `2px solid ${i === activeImg ? "var(--purple-500)" : "var(--border)"}`,
                    opacity: i === activeImg ? 1 : 0.6,
                  }}
                >
                  <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-5">
          {/* Category */}
          <span className="badge badge-purple w-fit">{product.category}</span>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-black leading-tight" style={{ fontFamily: "Playfair Display,serif" }}>
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15}
                  fill={i < Math.round(product.rating) ? "#fbbf24" : "none"}
                  style={{ color: i < Math.round(product.rating) ? "#fbbf24" : "var(--text-muted)" }}
                />
              ))}
            </div>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black gradient-text-purple">
              {formatPrice(product.discountedPrice ?? product.price)}
            </span>
            {product.discountedPrice && (
              <>
                <span className="text-lg line-through" style={{ color: "var(--text-muted)" }}>
                  {formatPrice(product.price)}
                </span>
                <span className="badge badge-gold">{discount}% off</span>
              </>
            )}
          </div>

          {/* Stock status */}
          <div>
            {product.stock === 0 ? (
              <span className="badge badge-red">Out of Stock</span>
            ) : product.stock <= 5 ? (
              <span className="text-sm" style={{ color: "#fca5a5" }}>⚠️ Only {product.stock} left in stock!</span>
            ) : (
              <span className="text-sm" style={{ color: "#86efac" }}>✓ In Stock ({product.stock} available)</span>
            )}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Quantity</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: "rgba(147,51,234,0.15)", color: "var(--purple-300)" }}
                >
                  <Minus size={14} />
                </button>
                <span className="font-bold w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: "rgba(147,51,234,0.15)", color: "var(--purple-300)" }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={18} />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <button
              onClick={toggleWishlist}
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-105"
              style={{
                background: inWishlist ? "rgba(239,68,68,0.15)" : "rgba(147,51,234,0.1)",
                border: "1px solid",
                borderColor: inWishlist ? "rgba(239,68,68,0.4)" : "var(--border)",
              }}
            >
              <Heart size={18} fill={inWishlist ? "#ef4444" : "none"}
                style={{ color: inWishlist ? "#ef4444" : "var(--purple-300)" }} />
            </button>
            <button
              onClick={() => { navigator.share?.({ title: product.title, url: location.href }); }}
              className="w-12 h-12 rounded-xl flex items-center justify-center btn-ghost"
            >
              <Share2 size={18} />
            </button>
          </div>

          {/* Delivery info */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: "Free Delivery", sub: "Orders above ₹999" },
              { icon: Shield, label: "Secure", sub: "100% protected" },
              { icon: RefreshCw, label: "7-Day Return", sub: "Easy returns" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center p-3 rounded-xl"
                style={{ background: "rgba(147,51,234,0.06)", border: "1px solid var(--border)" }}>
                <Icon size={16} style={{ color: "var(--purple-400)" }} className="mb-1.5" />
                <p className="text-xs font-semibold">{label}</p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div>
            <div className="flex gap-1 mb-4 p-1 rounded-xl w-fit"
              style={{ background: "var(--bg-surface)" }}>
              {(["desc", "details"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {tab === "desc"
                  ? product.description
                  : (
                    <div className="space-y-2">
                      {[
                        ["Category", product.category],
                        ["Tags", product.tags.join(", ") || "—"],
                        ["Stock", `${product.stock} units`],
                        ["Rating", `${product.rating}/5`],
                      ].map(([k, v]) => (
                        <div key={k} className="flex gap-3">
                          <span className="w-24 font-semibold" style={{ color: "var(--text-muted)" }}>{k}</span>
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
      </div>
    </div>
  );
}
