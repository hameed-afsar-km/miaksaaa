"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useUIStore } from "@/lib/store/uiStore";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { validateCoupon } from "@/lib/firebase/firestore";
import { useAuthStore } from "@/lib/store/authStore";
import toast from "react-hot-toast";

export function CartDrawer() {
  const { user } = useAuthStore();
  const { cartOpen, setCartOpen } = useUIStore();
  const {
    items, removeItem, updateQuantity,
    getSubtotal, getDiscount, getTotal,
    applyCoupon, removeCoupon, couponCode,
  } = useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const { valid, coupon, message } = await validateCoupon(couponInput, getSubtotal(), user?.uid);
      if (valid && coupon) {
        applyCoupon(coupon.code, coupon.discount, coupon.type);
        toast.success(`Coupon applied! ${coupon.type === "percent" ? `${coupon.discount}% off` : formatPrice(coupon.discount) + " off"}`);
        setCouponInput("");
      } else {
        toast.error(message ?? "Invalid coupon");
      }
    } finally {
      setCouponLoading(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setCartOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0"
              style={{
                zIndex: 999,
                background: "var(--bg-card)",
                borderLeft: "1px solid var(--border)",
                width: "100%",
                maxWidth: "24rem",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} style={{ color: "var(--purple-400)" }} />
                  <h2 className="font-bold text-lg">Cart</h2>
                  {items.length > 0 && (
                    <span className="badge badge-purple">{items.length}</span>
                  )}
                </div>
                <button onClick={() => setCartOpen(false)} className="btn-ghost p-2 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(147,51,234,0.1)" }}>
                      <ShoppingBag size={32} style={{ color: "var(--purple-400)" }} />
                    </div>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>Your cart is empty</p>
                    <Link href="/products" onClick={() => setCartOpen(false)} className="btn-primary text-sm py-2.5">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(147,51,234,0.06)", border: "1px solid var(--border)" }}
                    >
                      <div className="w-18 h-18 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ width: 72, height: 72, background: "var(--bg-surface)" }}>
                        {item.image ? (
                          <Image src={item.image} alt={item.title} width={72} height={72} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={24} style={{ color: "var(--text-muted)" }} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{item.title}</p>
                        {(item.selectedColor || item.selectedSize) && (
                          <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {[item.selectedColor, item.selectedSize].filter(Boolean).join(" / ")}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-bold" style={{ color: "var(--purple-300)" }}>
                            {formatPrice(item.discountedPrice ?? item.price)}
                          </span>
                          {item.discountedPrice && (
                            <span className="text-xs line-through" style={{ color: "var(--text-muted)" }}>
                              {formatPrice(item.price)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                              style={{ background: "rgba(147,51,234,0.15)", color: "var(--purple-300)" }}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="w-6 h-6 rounded-md flex items-center justify-center transition-colors disabled:opacity-40"
                              style={{ background: "rgba(147,51,234,0.15)", color: "var(--purple-300)" }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.productId)}
                            className="p-1 rounded-md transition-colors hover:bg-red-500/15"
                            style={{ color: "#fca5a5" }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-4 border-t space-y-3" style={{ borderColor: "var(--border)" }}>
                  {/* Coupon */}
                  {couponCode ? (
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
                      <div className="flex items-center gap-2">
                        <Tag size={14} style={{ color: "var(--gold-400)" }} />
                        <span className="text-sm font-semibold" style={{ color: "var(--gold-400)" }}>{couponCode}</span>
                      </div>
                      <button onClick={removeCoupon} className="text-xs hover:text-red-400 transition-colors" style={{ color: "var(--text-muted)" }}>Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                        placeholder="Coupon code"
                        className="input text-sm py-2.5"
                      />
                      <button onClick={handleApplyCoupon} disabled={couponLoading}
                        className="btn-outline text-sm py-2.5 px-3 whitespace-nowrap">
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                  )}

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                      <span>Subtotal</span>
                      <span>{formatPrice(getSubtotal())}</span>
                    </div>
                    {getDiscount() > 0 && (
                      <div className="flex justify-between" style={{ color: "var(--gold-400)" }}>
                        <span>Discount</span>
                        <span>− {formatPrice(getDiscount())}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-base pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                      <span>Total</span>
                      <span className="gradient-text">{formatPrice(getTotal())}</span>
                    </div>
                  </div>

                  <Link href="/checkout" onClick={() => setCartOpen(false)}
                    className="btn-primary w-full justify-center gap-2">
                    Checkout <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
