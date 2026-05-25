"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Heart, Star, ChevronLeft, ChevronRight,
  Minus, Plus, Truck, Shield, RefreshCw, Share2, Flame, Sparkles, Zap
} from "lucide-react";
import { Product, Review } from "@/lib/types";
import { getProductById, getProductReviews, addReview, deleteReview, updateReview } from "@/lib/firebase/firestore";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useUIStore } from "@/lib/store/uiStore";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import toast from "react-hot-toast";
import { AddedToCartModal } from "@/components/cart/AddedToCartModal";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "details">("desc");
  const [selectedColorIdx, setSelectedColorIdx] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const authUser = useAuthStore((s) => s.user);
  const addToCart = useCartStore((s) => s.addItem);
  const { setCartOpen } = useUIStore();
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = product ? isInWishlist(product.id) : false;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editingReviewRating, setEditingReviewRating] = useState(5);
  const [editingReviewComment, setEditingReviewComment] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [addedItem, setAddedItem] = useState<{
    productId: string;
    title: string;
    price: number;
    discountedPrice?: number;
    image: string;
    quantity: number;
    category?: string;
  } | null>(null);

  useEffect(() => {
    getProductById(id)
      .then((p) => { setProduct(p); setLoading(false); })
      .catch(() => setLoading(false));
    getProductReviews(id)
      .then((r) => { setReviews(r); setReviewsLoading(false); })
      .catch(() => setReviewsLoading(false));
  }, [id]);

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!authUser || !product || !reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      await addReview(
        product.id,
        authUser.uid,
        authUser.displayName || authUser.email || "Anonymous",
        authUser.photoURL,
        reviewRating,
        reviewComment.trim()
      );
      toast.success("Review submitted!");
      setReviewComment("");
      setReviewRating(5);
      const updated = await getProductReviews(product.id);
      setReviews(updated);
      const refreshed = await getProductById(product.id);
      if (refreshed) setProduct(refreshed);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  }

  async function handleDeleteReview(reviewId: string) {
    if (!product || !confirm("Delete this review?")) return;
    try {
      await deleteReview(reviewId, product.id);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      const refreshed = await getProductById(product.id);
      if (refreshed) setProduct(refreshed);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review");
    }
  }

  function startEditReview(review: Review) {
    setEditingReviewId(review.id);
    setEditingReviewRating(review.rating);
    setEditingReviewComment(review.comment);
    setEditingReviewId(review.id);
  }

  async function handleUpdateReview(e: React.FormEvent) {
    e.preventDefault();
    if (!product || !editingReviewId || !editingReviewComment.trim()) return;
    setSavingEdit(true);
    try {
      await updateReview(editingReviewId, product.id, editingReviewRating, editingReviewComment.trim());
      toast.success("Review updated");
      setEditingReviewId(null);
      const updated = await getProductReviews(product.id);
      setReviews(updated);
      const refreshed = await getProductById(product.id);
      if (refreshed) setProduct(refreshed);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update review");
    } finally {
      setSavingEdit(false);
    }
  }

  function handleAddToCart() {
    if (!product || product.stock === 0) return;
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      discountedPrice: product.discountedPrice,
      image: displayImages[0] ?? "",
      quantity: qty,
      stock: product.stock,
      selectedColor: selectedColor?.name,
      selectedSize: selectedSize ?? undefined,
      category: product.category,
    });
    setAddedItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      discountedPrice: product.discountedPrice,
      image: displayImages[0] ?? "",
      quantity: qty,
      category: product.category,
    });
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
  const selectedColor = selectedColorIdx !== null ? product.colorVariants?.[selectedColorIdx] : null;
  const displayImages = selectedColor?.image
    ? [selectedColor.image, ...product.images]
    : (product.images.length > 0 ? product.images : ["/placeholder.jpg"]);

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
                  src={displayImages[activeImg]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Prev/Next */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg((i) => (i - 1 + displayImages.length) % displayImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveImg((i) => (i + 1) % displayImages.length)}
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
          {displayImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {displayImages.map((img, i) => (
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
          <div className="flex items-baseline gap-3 flex-wrap">
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
            {product.limitedTimeOffer?.enabled && (
              <span className="badge" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}>
                ⏱️ {product.limitedTimeOffer.label || "Limited Offer"}
              </span>
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

          {/* Color Variants */}
          {(() => {
            const colorVariants = product.colorVariants ?? [];
            if (colorVariants.length === 0) return null;
            return (
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: "var(--text-secondary)" }}>
                Available Colors
              </label>
              <div className="flex flex-wrap gap-2">
                {colorVariants.map((color, idx) => {
                  const isSelected = selectedColorIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (color.stock === 0) return;
                        if (isSelected) {
                          setSelectedColorIdx(null);
                          setActiveImg(0);
                        } else {
                          setSelectedColorIdx(idx);
                          setActiveImg(0);
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all"
                      style={{
                        background: isSelected
                          ? "rgba(147,51,234,0.25)"
                          : color.stock > 0
                            ? "rgba(147,51,234,0.08)"
                            : "rgba(100,100,100,0.05)",
                        borderColor: isSelected
                          ? "var(--purple-500)"
                          : color.stock > 0
                            ? "rgba(147,51,234,0.3)"
                            : "rgba(100,100,100,0.2)",
                        opacity: color.stock > 0 ? 1 : 0.5,
                        cursor: color.stock > 0 ? "pointer" : "not-allowed",
                      }}
                      disabled={color.stock === 0}
                    >
                      <div
                        className="w-4 h-4 rounded-full border-2"
                        style={{
                          backgroundColor: color.hexCode,
                          borderColor: isSelected ? "var(--purple-500)" : "rgba(147,51,234,0.5)",
                        }}
                      />
                      <span className="text-xs font-medium">{color.name}</span>
                      {isSelected && color.image && (
                        <span className="text-[10px] text-purple-400">✓</span>
                      )}
                      {color.stock === 0 && <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Out of stock</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            );
          })()}

          {/* Size Variants */}
          {(() => {
            const sizeVariants = product.sizeVariants ?? [];
            if (!sizeVariants.some((s) => s.enabled)) return null;
            return (
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: "var(--text-secondary)" }}>
                Select Size
              </label>
              <div className="flex flex-wrap gap-2">
                {sizeVariants
                  .filter((s) => s.enabled)
                  .map((size, idx) => {
                    const isSelected = selectedSize === size.size;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (size.stock === 0) return;
                          setSelectedSize(isSelected ? null : size.size);
                        }}
                        className="w-10 h-10 rounded-lg border font-semibold transition-all flex items-center justify-center text-xs"
                        style={{
                          background: isSelected
                            ? "rgba(147,51,234,0.3)"
                            : size.stock > 0
                              ? "rgba(147,51,234,0.1)"
                              : "rgba(100,100,100,0.05)",
                          borderColor: isSelected
                            ? "var(--purple-500)"
                            : size.stock > 0
                              ? "rgba(147,51,234,0.3)"
                              : "rgba(100,100,100,0.2)",
                          opacity: size.stock > 0 ? 1 : 0.5,
                          cursor: size.stock > 0 ? "pointer" : "not-allowed",
                        }}
                        disabled={size.stock === 0}
                        title={size.stock > 0 ? `${size.size} - ${size.stock} in stock` : `${size.size} - Out of stock`}
                      >
                        {size.size}
                      </button>
                    );
                  })}
              </div>
            </div>
            );
          })()}

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

      {/* Reviews Section */}
      <div className="mt-16 border-t pt-10" style={{ borderColor: "var(--border)" }}>
        <h2 className="text-2xl font-black mb-8" style={{ fontFamily: "Playfair Display,serif" }}>
          Customer Reviews
        </h2>

        {/* Review Form */}
        {authUser ? (
          <form onSubmit={handleSubmitReview} className="mb-10 p-5 rounded-2xl border" style={{ background: "rgba(147,51,234,0.04)", borderColor: "var(--border)" }}>
            <h3 className="text-sm font-bold mb-3 text-white">Write a Review</h3>
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hoverRating || reviewRating);
                return (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star === reviewRating ? 0 : star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 cursor-pointer"
                    title={`${star} star${star > 1 ? "s" : ""}`}
                  >
                    <Star size={22} fill={active ? "#fbbf24" : "transparent"} style={{ color: active ? "#fbbf24" : "var(--text-muted)" }} />
                  </button>
                );
              })}
              {reviewRating > 0 && <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>{reviewRating}/5</span>}
            </div>
            <textarea rows={3} value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Share your experience with this product..." className="input text-sm resize-none mb-3" required />
            <button type="submit" disabled={submittingReview || reviewRating === 0 || !reviewComment.trim()} className="btn-primary text-xs py-2.5 px-5">
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="mb-10 p-5 rounded-2xl border text-center" style={{ background: "rgba(147,51,234,0.04)", borderColor: "var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Sign in to leave a review</p>
          </div>
        )}

        {/* Review Cards */}
        {reviewsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((s) => (<div key={s} className="h-28 skeleton rounded-xl" />))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => {
              const isOwn = authUser?.uid === review.userId;
              const isEditing = editingReviewId === review.id;
              return (
                <div key={review.id} className="p-4 rounded-xl border" style={{ background: "rgba(147,51,234,0.03)", borderColor: "var(--border)" }}>
                  {isEditing ? (
                    <form onSubmit={handleUpdateReview}>
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button type="button" key={star} onClick={() => setEditingReviewRating(star)} className="p-0.5 cursor-pointer">
                            <Star size={18} fill={star <= editingReviewRating ? "#fbbf24" : "none"} style={{ color: star <= editingReviewRating ? "#fbbf24" : "var(--text-muted)" }} />
                          </button>
                        ))}
                      </div>
                      <textarea rows={2} value={editingReviewComment} onChange={(e) => setEditingReviewComment(e.target.value)} className="input text-sm resize-none mb-2" required />
                      <div className="flex gap-2">
                        <button type="submit" disabled={savingEdit || !editingReviewComment.trim()} className="btn-primary text-[10px] py-1.5 px-3">
                          {savingEdit ? "Saving..." : "Save"}
                        </button>
                        <button type="button" onClick={() => setEditingReviewId(null)} className="btn-outline text-[10px] py-1.5 px-3">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-purple-500/10 flex items-center justify-center text-xs font-bold text-purple-300 flex-shrink-0">
                            {review.userPhotoURL ? (
                              <Image src={review.userPhotoURL} alt={review.userName} width={36} height={36} className="object-cover w-full h-full" />
                            ) : (
                              review.userName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{review.userName}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={11} fill={star <= review.rating ? "#fbbf24" : "none"} style={{ color: star <= review.rating ? "#fbbf24" : "var(--text-muted)" }} />
                              ))}
                              <span className="text-[10px] ml-1" style={{ color: "var(--text-muted)" }}>
                                {review.createdAt?.toDate?.() ? new Date(review.createdAt.toDate()).toLocaleDateString() : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isOwn && (
                          <div className="flex gap-1 flex-shrink-0">
                            <button onClick={() => startEditReview(review)} className="p-1.5 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 text-[10px] font-bold">Edit</button>
                            <button onClick={() => handleDeleteReview(review.id)} className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 text-[10px] font-bold">Delete</button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{review.comment}</p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddedToCartModal
        isOpen={addedItem !== null}
        onClose={() => setAddedItem(null)}
        onGoToCart={() => { setAddedItem(null); router.push("/cart"); }}
        item={addedItem}
      />
    </div>
  );
}
