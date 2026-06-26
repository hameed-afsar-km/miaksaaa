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

// ─── Theme detection ───────────────────────────────────────────
type CartTheme = "luxury" | "collectible" | "mixed" | "empty";

function getCartTheme(items: { itemType?: string }[]): CartTheme {
  if (items.length === 0) return "empty";
  const hasCollectible = items.some((i) => i.itemType === "collectible" || i.itemType === "custom-frame");
  const hasStandard = items.some((i) => !i.itemType || i.itemType === "standard");
  if (hasCollectible && hasStandard) return "mixed";
  if (hasCollectible) return "collectible";
  return "luxury";
}

// ─── Theme helpers ─────────────────────────────────────────────
const HW = {
  accent: "#FF4400",
  accentLight: "rgba(255,68,0,0.12)",
  bg: "#1A0500",
  cardBg: "#2A0F00",
  text: "#FFE0CC",
  textSecondary: "#cc9980",
  border: "rgba(255,68,0,0.2)",
};

const MIXED = {
  accent: "#a855f7",
  accentLight: "rgba(147,51,234,0.12)",
  bg: "#120a24",
  cardBg: "#1a1030",
  text: "#f8f4ff",
  textSecondary: "#c4b5fd",
  border: "rgba(147,51,234,0.2)",
};

function themeFor(ct: CartTheme) {
  if (ct === "collectible") return HW;
  if (ct === "mixed") return MIXED;
  return null; // luxury = use CSS variables
}

export function CartDrawer() {
  const { user } = useAuthStore();
  const { cartOpen, setCartOpen } = useUIStore();
  const {
    items, removeItem, updateQuantity, removeCustomItem,
    getSubtotal, getEligibleSubtotal, getDiscount, getTotal,
    applyCoupon, removeCoupon, couponCode, couponCategories,
  } = useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const cartTheme = getCartTheme(items);
  const T = themeFor(cartTheme);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const { valid, coupon, message } = await validateCoupon(couponInput, getSubtotal(), user?.uid);
      if (valid && coupon) {
        const cats = coupon.categories ?? [];
        const eligibleTotal = cats.length === 0
          ? getSubtotal()
          : items.reduce((sum, item) => {
              if (!item.category || !cats.includes(item.category)) return sum;
              return sum + (item.discountedPrice ?? item.price) * item.quantity;
            }, 0);
        if (eligibleTotal < coupon.minOrder) {
          toast.error(`Minimum eligible order of ₹${coupon.minOrder} required`);
          setCouponLoading(false);
          return;
        }
        if (eligibleTotal === 0) {
          toast.error("No items in your cart match this coupon's categories");
          setCouponLoading(false);
          return;
        }
        applyCoupon(coupon.code, coupon.discount, coupon.type, cats);
        toast.success(`Coupon applied! ${coupon.type === "percent" ? `${coupon.discount}% off` : formatPrice(coupon.discount) + " off"}${cats.length ? " on eligible items" : ""}`);
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
              className="fixed inset-0 bg-black/50 backdrop-blur-md"
              style={{ zIndex: 9999 }}
              onClick={() => setCartOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0"
              style={{
                zIndex: 10000,
                background: T?.bg ?? "var(--bg-card)",
                borderLeft: `1px solid ${T?.border ?? "var(--border)"}`,
                width: "100%",
                maxWidth: "24rem",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: T?.border ?? "var(--border)" }}>
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} style={{ color: T?.accent ?? "var(--purple-400)" }} />
                  <h2 className="font-bold text-lg" style={{ color: T?.text ?? "inherit" }}>Cart</h2>
                  {items.length > 0 && (
                    <span className={cartTheme === "collectible" ? "px-2 py-0.5 rounded-full text-[10px] font-bold" : "badge badge-purple"}
                      style={cartTheme === "collectible" ? { background: "linear-gradient(135deg,#FF4400,#D32F2F)", color: "#fff" } : {}}>
                      {items.length}
                    </span>
                  )}
                </div>
                <button onClick={() => setCartOpen(false)} className="btn-ghost p-2 rounded-lg" style={{ color: T?.textSecondary ?? undefined }}>
                  <X size={20} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ background: T ? `${T.accent}15` : "rgba(147,51,234,0.1)" }}>
                      <ShoppingBag size={32} style={{ color: T?.accent ?? "var(--purple-400)" }} />
                    </div>
                    <p className="text-sm" style={{ color: T?.textSecondary ?? "var(--text-muted)" }}>Your cart is empty</p>
                    <Link href={cartTheme === "collectible" ? "/hotwheels/products" : "/products"}
                      onClick={() => setCartOpen(false)}
                      className="btn-primary text-sm py-2.5"
                      style={T ? { background: `linear-gradient(135deg, ${T.accent}, #D32F2F)` } : {}}>
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  items.map((item) => {
                    const isHw = item.itemType === "collectible" || item.itemType === "custom-frame";
                    const itemAccent = isHw ? "#FF4400" : "var(--purple-300)";
                    const itemBg = isHw ? "rgba(255,68,0,0.06)" : "rgba(147,51,234,0.06)";
                    const itemBorder = isHw ? "rgba(255,68,0,0.15)" : "var(--border)";
                    return (
                    <motion.div
                      key={item.productId + (item.frameCustomization ? JSON.stringify(item.frameCustomization) : "")}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-3 rounded-xl"
                      style={{ background: itemBg, border: `1px solid ${itemBorder}` }}
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
                        <p className="text-sm font-semibold truncate"
                          style={{ color: isHw ? "#FFE0CC" : "inherit" }}>
                          {item.frameCustomization?.frameTitle || item.title}
                        </p>

                        {/* Collectible badges */}
                        {item.itemType === "collectible" && (
                          <p className="text-[10px] mt-0.5 font-bold" style={{ color: "#FF6600" }}>
                            Hot Wheels Collectible
                          </p>
                        )}

                        {/* Frame customization details */}
                        {item.frameCustomization && (
                          <div className="text-[10px] mt-0.5 space-y-0.5">
                            <p style={{ color: "#cc9980" }}>
                              Car: {item.frameCustomization.selectedCarTitle}
                            </p>
                            <p style={{ color: "#cc9980" }}>
                              {item.frameCustomization.selectedPositionLabel} · {item.frameCustomization.selectedSizeLabel}
                            </p>
                          </div>
                        )}

                        {(item.selectedColor || item.selectedSize) && !item.frameCustomization && (
                          <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {[item.selectedColor, item.selectedSize].filter(Boolean).join(" / ")}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-bold" style={{ color: itemAccent }}>
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
                              onClick={() => {
                                if (item.frameCustomization) {
                                  removeCustomItem(item.productId, item.frameCustomization);
                                } else {
                                  updateQuantity(item.productId, item.quantity - 1, item.selectedColor, item.selectedSize);
                                }
                              }}
                              className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                              style={{ background: isHw ? "rgba(255,68,0,0.15)" : "rgba(147,51,234,0.15)", color: itemAccent }}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => {
                                if (!item.frameCustomization) {
                                  updateQuantity(item.productId, item.quantity + 1, item.selectedColor, item.selectedSize);
                                }
                              }}
                              disabled={(item.quantity >= item.stock) || !!item.frameCustomization}
                              className="w-6 h-6 rounded-md flex items-center justify-center transition-colors disabled:opacity-40"
                              style={{ background: isHw ? "rgba(255,68,0,0.15)" : "rgba(147,51,234,0.15)", color: itemAccent }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              if (item.frameCustomization) {
                                removeCustomItem(item.productId, item.frameCustomization);
                              } else {
                                removeItem(item.productId, item.selectedColor, item.selectedSize);
                              }
                            }}
                            className="p-1 rounded-md transition-colors hover:bg-red-500/15"
                            style={{ color: "#fca5a5" }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-4 border-t space-y-3" style={{ borderColor: T?.border ?? "var(--border)" }}>
                  {/* Coupon */}
                  {couponCode ? (
                    <div>
                      <div className="flex items-center justify-between px-3 py-2 rounded-lg"
                        style={{ background: T ? `${T.accent}15` : "rgba(251,191,36,0.1)", border: T ? `1px solid ${T.accent}40` : "1px solid rgba(251,191,36,0.3)" }}>
                        <div className="flex items-center gap-2">
                          <Tag size={14} style={{ color: T?.accent ?? "var(--gold-400)" }} />
                          <span className="text-sm font-semibold" style={{ color: T?.accent ?? "var(--gold-400)" }}>{couponCode}</span>
                        </div>
                        <button onClick={removeCoupon} className="text-xs hover:text-red-400 transition-colors" style={{ color: T?.textSecondary ?? "var(--text-muted)" }}>Remove</button>
                      </div>
                      {couponCategories.length > 0 && (
                        <p className="text-[10px] mt-1.5 px-1" style={{ color: T?.textSecondary ?? "var(--text-muted)" }}>
                          Eligible categories: {couponCategories.join(", ")}
                          <br />Eligible subtotal: {formatPrice(getEligibleSubtotal())}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                        placeholder="Coupon code"
                        className="input text-sm py-2.5"
                        style={T ? { borderColor: T.border, background: T.cardBg, color: T.text } : {}}
                      />
                      <button onClick={handleApplyCoupon} disabled={couponLoading}
                        className="text-sm py-2.5 px-3 whitespace-nowrap rounded-lg transition-colors disabled:opacity-50"
                        style={T ? { background: T.accent, color: "#fff" } : { border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                  )}

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between" style={{ color: T?.textSecondary ?? "var(--text-secondary)" }}>
                      <span>Subtotal</span>
                      <span>{formatPrice(getSubtotal())}</span>
                    </div>
                    {getDiscount() > 0 && (
                      <div className="flex justify-between" style={{ color: T?.accent ?? "var(--gold-400)" }}>
                        <span>Discount</span>
                        <span>− {formatPrice(getDiscount())}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-base pt-2 border-t" style={{ borderColor: T?.border ?? "var(--border)" }}>
                      <span style={{ color: T?.text ?? "inherit" }}>Total</span>
                      <span style={T ? { color: T.accent } : {}} className={T ? "" : "gradient-text"}>{formatPrice(getTotal())}</span>
                    </div>
                  </div>

                  <Link href="/checkout" onClick={() => setCartOpen(false)}
                    className="w-full justify-center gap-2 inline-flex items-center py-3 rounded-lg font-semibold transition-all"
                    style={T ? { background: `linear-gradient(135deg, ${T.accent}, #D32F2F)`, color: "#fff" } : { border: "1px solid var(--border)", color: "var(--text-primary)" }}>
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
