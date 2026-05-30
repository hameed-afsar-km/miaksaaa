"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { validateCoupon } from "@/lib/firebase/firestore";
import { useAuthStore } from "@/lib/store/authStore";
import toast from "react-hot-toast";

export default function CartPage() {
  const { user } = useAuthStore();
  const {
    items, removeItem, updateQuantity, clearCart,
    getSubtotal, getDiscount, getTotal,
    applyCoupon, removeCoupon, couponCode, couponDiscount,
  } = useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  async function handleCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const { valid, coupon, message } = await validateCoupon(couponInput, getSubtotal(), user?.uid);
      if (valid && coupon) {
        applyCoupon(coupon.code, coupon.discount, coupon.type);
        toast.success(`Coupon applied!`);
        setCouponInput("");
      } else {
        toast.error(message ?? "Invalid coupon");
      }
    } finally {
      setCouponLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-lg py-20 flex flex-col items-center gap-6 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse-glow"
          style={{ background: "rgba(147,51,234,0.1)", border: "1px solid rgba(147,51,234,0.3)" }}>
          <ShoppingBag size={36} style={{ color: "var(--purple-400)" }} />
        </div>
        <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "Playfair Display,serif" }}>Your Cart is Empty</h1>
        <p style={{ color: "var(--text-muted)" }}>Start shopping to add items to your cart</p>
        <Link href="/products" className="btn-primary px-8">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container-lg py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "Playfair Display,serif" }}>
          Shopping Cart <span className="text-lg" style={{ color: "var(--text-muted)" }}>({items.length} items)</span>
        </h1>
        <button onClick={clearCart} className="btn-ghost text-sm" style={{ color: "#fca5a5" }}>
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className="flex gap-4 p-4 rounded-2xl"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background: "var(--bg-surface)" }}>
                  {item.image && (
                    <Image src={item.image} alt={item.title} width={96} height={96} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-snug">{item.title}</h3>
                    <button onClick={() => removeItem(item.productId, item.selectedColor, item.selectedSize)} className="btn-ghost p-1.5 rounded-lg flex-shrink-0" style={{ color: "#fca5a5" }}>
                      <X size={15} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold" style={{ color: "var(--purple-300)" }}>
                      {formatPrice(item.discountedPrice ?? item.price)}
                    </span>
                    {item.discountedPrice && (
                      <span className="text-xs line-through" style={{ color: "var(--text-muted)" }}>
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedColor, item.selectedSize)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(147,51,234,0.15)" }}>
                        <Minus size={13} style={{ color: "var(--purple-300)" }} />
                      </button>
                      <span className="font-bold w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedColor, item.selectedSize)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-40"
                        style={{ background: "rgba(147,51,234,0.15)" }}>
                        <Plus size={13} style={{ color: "var(--purple-300)" }} />
                      </button>
                    </div>
                    <span className="font-bold text-sm gradient-text">
                      {formatPrice((item.discountedPrice ?? item.price) * item.quantity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="p-5 rounded-2xl space-y-4"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 className="font-bold text-lg">Order Summary</h2>

            {/* Coupon */}
            {couponCode ? (
              <div className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
                <div className="flex items-center gap-2">
                  <Tag size={14} style={{ color: "var(--gold-400)" }} />
                  <span className="text-sm font-semibold" style={{ color: "var(--gold-400)" }}>{couponCode}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>(-{couponDiscount}{typeof couponDiscount === "number" && couponDiscount <= 100 ? "%" : ""})</span>
                </div>
                <button onClick={removeCoupon} className="text-xs hover:text-red-400" style={{ color: "var(--text-muted)" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleCoupon()}
                  placeholder="Coupon code"
                  className="input text-sm py-2.5"
                />
                <button onClick={handleCoupon} disabled={couponLoading}
                  className="btn-outline text-sm py-2.5 px-3 whitespace-nowrap">
                  {couponLoading ? "…" : "Apply"}
                </button>
              </div>
            )}

            {/* Price breakdown */}
            <div className="space-y-2.5 text-sm border-t pt-4" style={{ borderColor: "var(--border)" }}>
              <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                <span>Subtotal</span><span>{formatPrice(getSubtotal())}</span>
              </div>
              {getDiscount() > 0 && (
                <div className="flex justify-between" style={{ color: "var(--gold-400)" }}>
                  <span>Discount</span><span>− {formatPrice(getDiscount())}</span>
                </div>
              )}
              {(() => {
                const subtotal = getSubtotal();
                const afterDiscount = Math.max(0, subtotal - getDiscount());
                const delivery = afterDiscount >= 499 ? 0 : 49;
                const total = afterDiscount + delivery;
                return (
                  <>
                    <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                      <span>Delivery</span>
                      {delivery === 0
                        ? <span style={{ color: "#86efac" }}>FREE 🎉</span>
                        : <span>{formatPrice(delivery)}</span>
                      }
                    </div>
                    {delivery > 0 && (
                      <p className="text-[10px] text-right" style={{ color: "var(--text-muted)" }}>
                        Add ₹{499 - afterDiscount} more for free delivery
                      </p>
                    )}
                    <div className="flex justify-between font-black text-lg border-t pt-3" style={{ borderColor: "var(--border)" }}>
                      <span>Total</span><span className="gradient-text">{formatPrice(total)}</span>
                    </div>
                  </>
                );
              })()}
            </div>

            <Link href="/checkout" className="btn-primary w-full justify-center gap-2">
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <Link href="/products" className="btn-ghost w-full justify-center text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
