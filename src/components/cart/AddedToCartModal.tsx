"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Check, X } from "lucide-react";
import { Product } from "@/lib/types";
import { getSimilarProducts } from "@/lib/firebase/firestore";
import { formatPrice } from "@/lib/utils";

export interface AddedToCartItem {
  productId: string;
  title: string;
  price: number;
  discountedPrice?: number;
  image: string;
  quantity: number;
  category?: string;
}

interface AddedToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToCart: () => void;
  item: AddedToCartItem | null;
}

export function AddedToCartModal({ isOpen, onClose, onGoToCart, item }: AddedToCartModalProps) {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  useEffect(() => {
    if (isOpen && item?.category) {
      setLoadingSimilar(true);
      getSimilarProducts(item.category, item.productId, 4)
        .then(setSimilarProducts)
        .catch(() => setSimilarProducts([]))
        .finally(() => setLoadingSimilar(false));
    } else {
      setSimilarProducts([]);
    }
  }, [isOpen, item]);

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
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
                  style={{ background: "rgba(34,197,94,0.15)" }}
                >
                  <Check size={22} style={{ color: "#22c55e" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg">Added to Cart!</h3>
                  <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                    {item.title} × {item.quantity}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center btn-ghost flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="px-6 pb-4">
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-surface)" }}>
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.title}</p>
                    <p className="text-sm font-bold" style={{ color: "var(--purple-300)" }}>
                      {formatPrice(item.discountedPrice ?? item.price)}
                    </p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>
                    ×{item.quantity}
                  </span>
                </div>
              </div>

              {item.category && (
                <div className="px-6 pb-4">
                  <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
                    Similar Products You Might Like
                  </h4>
                  {loadingSimilar ? (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-24 flex-shrink-0">
                          <div className="aspect-square skeleton rounded-lg mb-1.5" />
                          <div className="skeleton h-3 w-16 rounded" />
                        </div>
                      ))}
                    </div>
                  ) : similarProducts.length > 0 ? (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {similarProducts.map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.id}`}
                          onClick={onClose}
                          className="w-24 flex-shrink-0 group"
                        >
                          <div className="aspect-square rounded-lg overflow-hidden relative mb-1.5"
                            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                            {p.images[0] && (
                              <Image
                                src={p.images[0]}
                                alt={p.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            )}
                          </div>
                          <p className="text-xs truncate font-medium">{p.title}</p>
                          <p className="text-xs font-bold" style={{ color: "var(--purple-300)" }}>
                            {formatPrice(p.discountedPrice ?? p.price)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}

              <div className="p-6 pt-2 flex gap-3">
                <button onClick={onClose} className="btn-outline flex-1 text-sm py-3">
                  Continue Shopping
                </button>
                <button onClick={onGoToCart} className="btn-primary flex-1 text-sm py-3">
                  <ShoppingBag size={15} />
                  Go to Cart
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
