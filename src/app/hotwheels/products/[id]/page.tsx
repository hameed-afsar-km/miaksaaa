"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShoppingBag, Heart, Star, ChevronLeft, ChevronRight,
  Minus, Plus, Flame, Zap, Shield,
} from "lucide-react";
import { Product, Review } from "@/lib/types";
import { getProductById, getProductReviews, addReview } from "@/lib/firebase/firestore";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useUIStore } from "@/lib/store/uiStore";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import toast from "react-hot-toast";

export default function HWProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);

  const authUser = useAuthStore((s) => s.user);
  const addToCart = useCartStore((s) => s.addItem);
  const { setCartOpen } = useUIStore();
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = product ? isInWishlist(product.id) : false;
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      getProductById(id),
      getProductReviews(id),
    ]).then(([prod, revs]) => {
      if (!prod) { router.push("/hotwheels/products"); return; }
      setProduct(prod);
      setReviews(revs);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="container-lg py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 w-1/3 skeleton" />
            <div className="h-10 w-2/3 skeleton" />
            <div className="h-8 w-1/4 skeleton" />
            <div className="h-24 skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const isRare = product.rarity === "rare" || product.rarity === "super-treasure-hunt" || product.rarity === "treasure-hunt";
  const finalPrice = product.discountedPrice ?? product.price;
  const images = product.images.filter(Boolean);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      discountedPrice: product.discountedPrice,
      image: product.images[0] || "",
      quantity: qty,
      stock: product.stock,
      category: product.category,
      itemType: "collectible",
    });
    toast.success("Added to cart!");
    setCartOpen(true);
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeItem(product.id);
      toast.success("Removed from wishlist");
    } else {
      addItem({
        productId: product.id,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice,
        image: product.images[0] || "",
        addedAt: new Date(),
      });
      toast.success("Added to wishlist!");
    }
  };

  return (
    <div style={{ background: "#0D0200", minHeight: "100vh" }}>
      <div className="container-lg py-8">
        {/* Back */}
        <button onClick={() => router.back()}
          className="flex items-center gap-1 text-sm font-bold mb-6 transition-colors hover:text-[#FF6600]"
          style={{ color: "#cc9980" }}>
          <ChevronLeft size={16} /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* ─── Images ─── */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden"
              style={{ background: "#1A0500", border: "1px solid rgba(255,68,0,0.12)" }}>
              {images[activeImg] ? (
                <Image src={images[activeImg]} alt={product.title} fill className="object-contain p-4" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ShoppingBag size={48} style={{ color: "rgba(255,68,0,0.2)" }} />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.rarity && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{
                      background: product.rarity === "super-treasure-hunt" ? "linear-gradient(135deg, #FFD600, #FF4400)" :
                        product.rarity === "treasure-hunt" ? "linear-gradient(135deg, #FF6600, #D32F2F)" :
                        product.rarity === "rare" ? "linear-gradient(135deg, #3B82F6, #1D4ED8)" :
                        "rgba(255,255,255,0.15)",
                      color: product.rarity === "super-treasure-hunt" ? "#1A0500" :
                        ["treasure-hunt", "rare"].includes(product.rarity) ? "#fff" : "#cc9980",
                    }}>
                    {product.rarity === "super-treasure-hunt" ? "🔥 SUPER TREASURE HUNT" :
                     product.rarity === "treasure-hunt" ? "⚡ TREASURE HUNT" :
                     product.rarity === "rare" ? "💎 RARE" : product.rarity.toUpperCase()}
                  </span>
                )}
                {product.discountedPrice && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: "rgba(255,68,0,0.2)", color: "#FF6600", border: "1px solid rgba(255,68,0,0.3)" }}>
                    {getDiscountPercent(product.price, product.discountedPrice)}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all"
                    style={{
                      borderColor: i === activeImg ? "#FF4400" : "rgba(255,68,0,0.12)",
                      opacity: i === activeImg ? 1 : 0.5,
                    }}>
                    <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Details ─── */}
          <div className="space-y-6">
            {/* Series + Scale */}
            <div className="flex flex-wrap items-center gap-2">
              {product.series && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold"
                  style={{ background: "rgba(255,68,0,0.1)", color: "#FF6600", border: "1px solid rgba(255,68,0,0.2)" }}>
                  {product.series}
                </span>
              )}
              {product.scale && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#cc9980", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {product.scale}
                </span>
              )}
              {product.modelYear && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#cc9980", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {product.modelYear}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black leading-tight"
              style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black" style={{ color: "#FF4400" }}>
                {formatPrice(finalPrice)}
              </span>
              {product.discountedPrice && (
                <span className="text-lg line-through" style={{ color: "#cc9980" }}>
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3 p-5 rounded-2xl"
              style={{ background: "#1A0500", border: "1px solid rgba(255,68,0,0.1)" }}>
              {product.condition && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#cc9980" }}>Condition</p>
                  <p className="text-sm font-bold capitalize" style={{ color: "#FFE0CC" }}>{product.condition}</p>
                </div>
              )}
              {product.grading && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#cc9980" }}>Grading</p>
                  <p className="text-sm font-bold" style={{ color: "#FFD600" }}>★ {product.grading}/10</p>
                </div>
              )}
              {product.packagingType && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#cc9980" }}>Packaging</p>
                  <p className="text-sm font-bold capitalize" style={{ color: "#FFE0CC" }}>{product.packagingType}</p>
                </div>
              )}
              {product.isAuthenticated !== undefined && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#cc9980" }}>Authentication</p>
                  <p className="text-sm font-bold" style={{ color: product.isAuthenticated ? "#4ade80" : "#fca5a5" }}>
                    {product.isAuthenticated ? "✓ Authenticated" : "Standard"}
                  </p>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-400" : "bg-red-400"}`} />
              <span className="text-sm font-bold" style={{ color: product.stock > 0 ? "#4ade80" : "#fca5a5" }}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.round(product.rating) ? "#FFD600" : "none"}
                      style={{ color: "#FFD600" }} />
                  ))}
                </div>
                <span className="text-sm" style={{ color: "#cc9980" }}>
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div>
                <p className="text-sm leading-relaxed" style={{ color: "#cc9980" }}>{product.description}</p>
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 p-1.5 rounded-xl"
                style={{ background: "#1A0500", border: "1px solid rgba(255,68,0,0.15)" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[#FF4400]/10"
                  style={{ color: "#FF6600" }}>
                  <Minus size={14} />
                </button>
                <span className="text-sm font-bold w-8 text-center" style={{ color: "#FFE0CC" }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  disabled={qty >= product.stock}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[#FF4400]/10 disabled:opacity-30"
                  style={{ color: "#FF6600" }}>
                  <Plus size={14} />
                </button>
              </div>

              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #FF4400, #D32F2F)",
                  color: "#fff",
                  boxShadow: "0 0 20px rgba(255,68,0,0.3)",
                }}>
                <ShoppingBag size={16} /> Add to Cart
              </button>

              <button onClick={handleWishlist}
                className="p-3 rounded-xl transition-all"
                style={{
                  background: inWishlist ? "rgba(255,68,0,0.15)" : "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,68,0,0.15)",
                  color: inWishlist ? "#FF4400" : "#cc9980",
                }}>
                <Heart size={18} fill={inWishlist ? "#FF4400" : "none"} />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Reviews ─── */}
        <div className="mt-16">
          <h2 className="text-2xl font-black mb-6" style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
            COLLECTOR <span style={{ color: "#FF6600" }}>REVIEWS</span>
          </h2>
          {reviews.length === 0 ? (
            <p className="text-sm" style={{ color: "#cc9980" }}>No reviews yet.</p>
          ) : (
            <div className="space-y-4 max-w-2xl">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-xl"
                  style={{ background: "#1A0500", border: "1px solid rgba(255,68,0,0.1)" }}>
                  <div className="flex items-center gap-3 mb-2">
                    {r.userPhotoURL ? (
                      <Image src={r.userPhotoURL} alt={r.userName} width={28} height={28} className="rounded-full" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#FF4400]/20 flex items-center justify-center">
                        <span className="text-xs font-bold" style={{ color: "#FF6600" }}>{r.userName[0]}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#FFE0CC" }}>{r.userName}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} fill={i < r.rating ? "#FFD600" : "none"} style={{ color: "#FFD600" }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: "#cc9980" }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
