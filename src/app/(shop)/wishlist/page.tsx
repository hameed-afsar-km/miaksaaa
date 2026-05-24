"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  function handleMove(item: typeof items[0]) {
    addToCart({
      productId: item.productId,
      title: item.title,
      price: item.price,
      discountedPrice: item.discountedPrice,
      image: item.image,
      quantity: 1,
      stock: 99,
    });
    removeItem(item.productId);
    toast.success("Moved to cart!");
  }

  if (items.length === 0) {
    return (
      <div className="container-lg py-20 flex flex-col items-center gap-6 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse-glow"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
          <Heart size={36} style={{ color: "#ef4444" }} />
        </div>
        <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "Playfair Display,serif" }}>
          Wishlist is Empty
        </h1>
        <p style={{ color: "var(--text-muted)" }}>Save items you love and shop them later</p>
        <Link href="/products" className="btn-primary px-8">Discover Products</Link>
      </div>
    );
  }

  return (
    <div className="container-lg py-10">
      <h1 className="text-3xl font-black gradient-text mb-8" style={{ fontFamily: "Playfair Display,serif" }}>
        My Wishlist ({items.length})
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.productId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="relative rounded-2xl overflow-hidden"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div className="aspect-square relative" style={{ background: "var(--bg-surface)" }}>
              {item.image && (
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              )}
              <button
                onClick={() => { removeItem(item.productId); toast("Removed", { icon: "💔" }); }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)" }}
              >
                <Trash2 size={13} style={{ color: "#fca5a5" }} />
              </button>
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm truncate mb-1">{item.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-sm" style={{ color: "var(--purple-300)" }}>
                  {formatPrice(item.discountedPrice ?? item.price)}
                </span>
                {item.discountedPrice && (
                  <span className="text-xs line-through" style={{ color: "var(--text-muted)" }}>
                    {formatPrice(item.price)}
                  </span>
                )}
              </div>
              <button onClick={() => handleMove(item)} className="btn-primary w-full text-xs py-2.5 gap-1.5">
                <ShoppingBag size={13} /> Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
