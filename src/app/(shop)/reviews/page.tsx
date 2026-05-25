"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Edit2, Trash2, ExternalLink, MessageSquare } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { getUserReviews, deleteReview, updateReview, getProductById } from "@/lib/firebase/firestore";
import { Review, Product } from "@/lib/types";
import toast from "react-hot-toast";

export default function MyReviewsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/reviews");
      return;
    }
    if (!user) return;
    setLoading(true);
    getUserReviews(user.uid)
      .then(async (data) => {
        setReviews(data);
        const productMap: Record<string, Product> = {};
        await Promise.all(
          [...new Set(data.map((r) => r.productId))].map(async (pid) => {
            const p = await getProductById(pid);
            if (p) productMap[pid] = p;
          })
        );
        setProducts(productMap);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  async function handleDelete(reviewId: string, productId: string) {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteReview(reviewId, productId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    }
  }

  function startEdit(review: Review) {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId || !editComment.trim()) return;
    setSaving(true);
    try {
      const review = reviews.find((r) => r.id === editingId);
      if (!review) return;
      await updateReview(editingId, review.productId, editRating, editComment.trim());
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingId ? { ...r, rating: editRating, comment: editComment.trim() } : r
        )
      );
      setEditingId(null);
      toast.success("Review updated");
    } catch {
      toast.error("Failed to update review");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="w-10 h-10 rounded-full border-4 border-t-purple-500 border-purple-900/30 animate-spin" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="container-lg py-20 flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <MessageSquare size={36} style={{ color: "var(--purple-400)" }} />
        </div>
        <h1 className="text-3xl font-black gradient-text">No Reviews Yet</h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "420px" }}>
          You haven&apos;t reviewed any products yet. Share your experience with other shoppers!
        </p>
        <Link href="/products" className="btn-primary px-8">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-lg py-10">
      <h1 className="text-3xl font-black gradient-text mb-2">My Reviews</h1>
      <p className="text-xs mb-8" style={{ color: "var(--text-muted)" }}>
        {reviews.length} review{reviews.length !== 1 ? "s" : ""} written
      </p>

      <div className="space-y-4">
        {reviews.map((review) => {
          const product = products[review.productId];
          const isEditing = editingId === review.id;
          return (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setEditRating(star)} className="p-0.5 cursor-pointer">
                        <Star size={20} fill={star <= editRating ? "#fbbf24" : "none"} style={{ color: star <= editRating ? "#fbbf24" : "var(--text-muted)" }} />
                      </button>
                    ))}
                  </div>
                  <textarea rows={3} value={editComment} onChange={(e) => setEditComment(e.target.value)} className="input text-sm resize-none" required />
                  <div className="flex gap-2">
                    <button type="submit" disabled={saving || !editComment.trim()} className="btn-primary text-xs py-2 px-4">
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="btn-outline text-xs py-2 px-4">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {product?.images[0] && (
                        <Link href={`/products/${review.productId}`} className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-purple-500/10">
                          <Image src={product.images[0]} alt={product.title} width={48} height={48} className="w-full h-full object-cover" />
                        </Link>
                      )}
                      <div className="min-w-0">
                        <Link href={`/products/${review.productId}`} className="text-sm font-bold text-white hover:text-purple-300 transition-colors truncate block">
                          {product?.title || "Unknown Product"}
                        </Link>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={12} fill={star <= review.rating ? "#fbbf24" : "none"} style={{ color: star <= review.rating ? "#fbbf24" : "var(--text-muted)" }} />
                          ))}
                          <span className="text-[10px] ml-1" style={{ color: "var(--text-muted)" }}>
                            {review.createdAt?.toDate?.() ? new Date(review.createdAt.toDate()).toLocaleDateString() : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => startEdit(review)} className="p-2 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(review.id, review.productId)} className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <Trash2 size={14} />
                      </button>
                      <Link href={`/products/${review.productId}`} className="p-2 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{review.comment}</p>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
