"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Info,
  XCircle,
  Truck,
  AlertCircle,
  Tag,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { getUserOrders, updateOrderStatus } from "@/lib/firebase/firestore";
import { Order, OrderStatus, CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const STATUS_STEPS: OrderStatus[] = ["waiting", "shipped", "delivered"];

function getStatusStyle(status: OrderStatus) {
  switch (status) {
    case "waiting":
      return { bg: "rgba(234,179,8,0.15)", color: "#eab308", label: "Waiting" };
    case "shipped":
      return { bg: "rgba(99,102,241,0.15)", color: "#818cf8", label: "Shipped" };
    case "delivered":
      return { bg: "rgba(34,197,94,0.15)", color: "#4ade80", label: "Delivered" };
    case "cancelled by user":
      return { bg: "rgba(239,68,68,0.15)", color: "#f87171", label: "Cancelled by you" };
    case "cancelled by admin":
      return { bg: "rgba(239,68,68,0.2)", color: "#ef4444", label: "Cancelled by store" };
    default:
      return { bg: "rgba(168,85,247,0.15)", color: "#c084fc", label: status };
  }
}

function StatusIcon({ status }: { status: OrderStatus }) {
  switch (status) {
    case "waiting":     return <Clock size={13} />;
    case "shipped":     return <Truck size={13} />;
    case "delivered":   return <CheckCircle size={13} />;
    case "cancelled by user":
    case "cancelled by admin": return <XCircle size={13} />;
    default:            return <AlertCircle size={13} />;
  }
}

function OrderItemRow({
  item,
  orderId,
  dateStr,
  orderStatus,
  isExpanded,
  onToggle,
}: {
  item: CartItem;
  orderId: string;
  dateStr: string;
  orderStatus: OrderStatus;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const style = getStatusStyle(orderStatus);
  const lineTotal = (item.discountedPrice ?? item.price) * item.quantity;

  return (
    <div
      onClick={onToggle}
      className="flex items-center gap-3 md:gap-4 p-3 md:p-4 cursor-pointer hover:bg-purple-950/8 transition-colors select-none border-b border-purple-500/5 last:border-b-0"
    >
      {/* Image */}
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-purple-950/20 relative flex-shrink-0 shadow-sm">
        <Image src={item.image || "/placeholder.jpg"} alt={item.title} fill className="object-cover" sizes="64px" />
      </div>

      {/* Middle: Name, Date, Order ID */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm md:text-base font-black text-white leading-tight truncate">
          {item.title}
        </h3>
        <p className="text-[10px] md:text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
          {dateStr}
        </p>
        <p className="text-[9px] md:text-[10px] mt-0.5 font-mono tracking-wider" style={{ color: "var(--text-muted)" }}>
          #{orderId.slice(-8).toUpperCase()}
        </p>
        {item.selectedColor || item.selectedSize ? (
          <p className="text-[9px] mt-0.5" style={{ color: "var(--purple-400)" }}>
            {[item.selectedColor, item.selectedSize].filter(Boolean).join(" · ")}
            <span className="ml-1.5" style={{ color: "var(--text-muted)" }}>×{item.quantity}</span>
          </p>
        ) : (
          <p className="text-[9px] mt-0.5" style={{ color: "var(--text-muted)" }}>×{item.quantity}</p>
        )}
      </div>

      {/* Right: Total, Status, Chevron */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <div className="text-right">
          <p className="text-xs md:text-sm font-bold gradient-text">{formatPrice(lineTotal)}</p>
        </div>
        <span
          className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
          style={{ background: style.bg, color: style.color }}
        >
          <StatusIcon status={orderStatus} />
          {style.label}
        </span>
        <div className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isExpanded ? "rgba(168,85,247,0.2)" : "rgba(168,85,247,0.08)",
            color: "var(--purple-300)",
          }}
        >
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const cancellingRef = useRef<string | null>(null);

  const loadOrders = useCallback(() => {
    if (!user) return;
    setLoading(true);
    getUserOrders(user.uid)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/orders");
      return;
    }
    if (user) loadOrders();
  }, [user, authLoading, router, loadOrders]);

  function isCancelledStatus(status: OrderStatus) {
    return status === "cancelled by user" || status === "cancelled by admin";
  }

  function getStepIndex(status: OrderStatus) {
    return STATUS_STEPS.indexOf(status);
  }

  function toggleExpand(id: string) {
    setExpandedOrder(expandedOrder === id ? null : id);
  }

  async function handleCancel(orderId: string) {
    if (cancellingRef.current) return;
    cancellingRef.current = orderId;
    try {
      await updateOrderStatus(orderId, "cancelled by user");
      toast.success("Order cancelled successfully.");
      loadOrders();
    } catch {
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      cancellingRef.current = null;
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="w-10 h-10 rounded-full border-4 border-t-purple-500 border-purple-900/30 animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container-lg py-20 flex flex-col items-center gap-6 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)" }}
        >
          <Package size={36} style={{ color: "var(--purple-400)" }} />
        </div>
        <h1 className="text-3xl font-black gradient-text">No Orders Yet</h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "420px" }}>
          You haven&apos;t placed any orders yet. Explore our catalog and find something you love.
        </p>
        <Link href="/products" className="btn-primary px-8">
          Discover Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="container-lg py-10">
      <h1 className="text-3xl font-black gradient-text mb-2">My Orders</h1>
      <p className="text-xs mb-8" style={{ color: "var(--text-muted)" }}>
        {orders.length} order{orders.length !== 1 ? "s" : ""} found
      </p>

      <div className="space-y-5">
        {orders.map((order, index) => {
          const isExpanded = expandedOrder === order.id;
          const cancelled = isCancelledStatus(order.status);
          const currentStep = getStepIndex(order.status);
          const style = getStatusStyle(order.status);
          const isCancelling = cancellingRef.current === order.id;
          const canCancel = order.status === "waiting";
          const dateStr = order.createdAt?.toDate
            ? order.createdAt.toDate().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
            : "Recent";
          const itemCount = order.items.length;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl overflow-hidden"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              {/* Batch header */}
              <div
                className="px-3 md:px-5 py-2.5 flex items-center justify-between gap-3 border-b"
                style={{ background: "rgba(168,85,247,0.04)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(168,85,247,0.12)" }}>
                    <Tag size={12} style={{ color: "var(--purple-400)" }} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block truncate">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                      {itemCount} item{itemCount !== 1 ? "s" : ""} · {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canCancel && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCancel(order.id); }}
                      disabled={isCancelling}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap"
                      style={{
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        color: "#f87171",
                      }}
                    >
                      {isCancelling ? (
                        <span className="w-2.5 h-2.5 border-2 border-t-red-400 border-red-900/30 rounded-full animate-spin inline-block" />
                      ) : (
                        <XCircle size={10} />
                      )}
                      {isCancelling ? "..." : "Cancel"}
                    </button>
                  )}
                  <span
                    className="inline-flex sm:hidden items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: style.bg, color: style.color }}
                  >
                    <StatusIcon status={order.status} />
                  </span>
                </div>
              </div>

              {/* Item rows */}
              {order.items.map((item, itemIdx) => (
                <OrderItemRow
                  key={`${order.id}-${item.productId}-${item.selectedColor ?? ""}-${item.selectedSize ?? ""}-${itemIdx}`}
                  item={item}
                  orderId={order.id}
                  dateStr={dateStr}
                  orderStatus={order.status}
                  isExpanded={isExpanded}
                  onToggle={() => toggleExpand(order.id)}
                />
              ))}

              {/* Expanded Details (per order) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="p-4 md:p-6 space-y-5">
                      {/* Cancelled notice */}
                      {cancelled && (
                        <div
                          className="flex items-center gap-3 p-4 rounded-2xl"
                          style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}
                        >
                          <XCircle size={18} className="text-red-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-red-300">Order Cancelled</p>
                            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                              {order.status === "cancelled by user"
                                ? "You cancelled this order. Stock has been restored."
                                : "This order was cancelled by the store. Please contact support if you have questions."}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Progress tracker */}
                      {!cancelled && (
                        <div className="py-3 border-b" style={{ borderColor: "var(--border)" }}>
                          <h4 className="text-xs uppercase font-bold tracking-widest mb-5" style={{ color: "var(--text-secondary)" }}>
                            Order Progress
                          </h4>
                          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center relative">
                            <div className="hidden sm:block absolute left-4 right-4 top-4 h-0.5 bg-purple-950 -z-10" />
                            <div
                              className="hidden sm:block absolute left-4 top-4 h-0.5 bg-gradient-to-r from-purple-500 to-amber-400 -z-10 transition-all duration-500"
                              style={{ width: currentStep >= 0 ? `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` : "0%" }}
                            />
                            {STATUS_STEPS.map((step, idx) => {
                              const isActive = idx <= currentStep;
                              const isCompleted = idx < currentStep;
                              return (
                                <div key={step} className="flex sm:flex-col items-center gap-3 sm:gap-2 relative z-10 w-full sm:w-auto">
                                  <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                      isCompleted
                                        ? "bg-amber-400 text-black border border-amber-400 shadow-lg"
                                        : isActive
                                        ? "bg-purple-600 text-white border border-purple-400 shadow-lg"
                                        : "bg-purple-950/40 text-purple-300 border border-purple-900"
                                    }`}
                                  >
                                    {isCompleted ? <CheckCircle size={15} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                                  </div>
                                  <span className={`text-xs font-semibold capitalize ${isActive ? "text-white" : "text-purple-300/40"}`}>
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Order summary */}
                      <div className="py-2 border-b" style={{ borderColor: "var(--border)" }}>
                        <h4 className="text-xs uppercase font-bold tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
                          Order Summary
                        </h4>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span style={{ color: "var(--text-muted)" }}>Subtotal ({order.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                            <span style={{ color: "var(--text-secondary)" }}>{formatPrice(order.subtotal)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between">
                              <span style={{ color: "var(--text-muted)" }}>
                                Discount{order.couponCode ? ` (${order.couponCode})` : ""}
                              </span>
                              <span className="text-green-400">-{formatPrice(order.discount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between pt-1.5 border-t border-purple-500/10 mt-1.5">
                            <span className="font-bold text-white">Total</span>
                            <span className="font-bold gradient-text">{formatPrice(order.total)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: "var(--text-muted)" }}>Payment</span>
                            <span className="font-medium" style={{ color: "var(--purple-300)" }}>
                              {order.paymentMethod === "Online" ? "Online Payment" : "Cash on Delivery"}
                            </span>
                          </div>
                          {(order.items.some((i) => i.selectedColor) || order.items.some((i) => i.selectedSize)) && (
                            <div className="flex justify-between">
                              <span style={{ color: "var(--text-muted)" }}>Variants</span>
                              <span style={{ color: "var(--text-secondary)" }}>
                                {order.items.map((i) => [i.selectedColor, i.selectedSize].filter(Boolean).join(" ")).filter(Boolean).join(", ") || "—"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Address & notes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                        <div className="space-y-2">
                          <h4 className="text-xs uppercase font-bold tracking-widest" style={{ color: "var(--text-secondary)" }}>
                            Delivery Address
                          </h4>
                          <div className="flex items-start gap-2 text-purple-200">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400" />
                            <div>
                              <p className="font-bold text-white">{order.deliveryAddress.fullName}</p>
                              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{order.deliveryAddress.addressLine1}</p>
                              {order.deliveryAddress.addressLine2 && (
                                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{order.deliveryAddress.addressLine2}</p>
                              )}
                              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                                {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
                                {order.deliveryAddress.postalCode}
                              </p>
                              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Phone: {order.deliveryAddress.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-xs uppercase font-bold tracking-widest" style={{ color: "var(--text-secondary)" }}>
                            Notes
                          </h4>
                          {order.notes ? (
                            <div
                              className="p-3 rounded-xl flex items-start gap-2"
                              style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.2)" }}
                            >
                              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-purple-400" />
                              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>&quot;{order.notes}&quot;</p>
                            </div>
                          ) : (
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>No notes</p>
                          )}
                          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                            Order placed on {dateStr}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
