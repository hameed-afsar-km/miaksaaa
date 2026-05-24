"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Info,
  XCircle,
  Truck,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { getUserOrders, updateOrderStatus } from "@/lib/firebase/firestore";
import { Order, OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const STATUS_STEPS: OrderStatus[] = ["waiting", "shipped", "delivered", "completed"];

function getStatusStyle(status: OrderStatus) {
  switch (status) {
    case "waiting":
      return { bg: "rgba(234,179,8,0.15)", color: "#eab308", label: "Waiting" };
    case "shipped":
      return { bg: "rgba(99,102,241,0.15)", color: "#818cf8", label: "Shipped" };
    case "delivered":
      return { bg: "rgba(34,197,94,0.15)", color: "#4ade80", label: "Delivered" };
    case "completed":
      return { bg: "rgba(34,197,94,0.2)", color: "#22c55e", label: "Completed" };
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
    case "completed":   return <CheckCircle size={13} />;
    case "cancelled by user":
    case "cancelled by admin": return <XCircle size={13} />;
    default:            return <AlertCircle size={13} />;
  }
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

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
    if (cancellingId) return;
    setCancellingId(orderId);
    try {
      await updateOrderStatus(orderId, "cancelled by user");
      toast.success("Order cancelled successfully.");
      loadOrders();
    } catch {
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      setCancellingId(null);
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

      <div className="space-y-4">
        {orders.map((order, index) => {
          const isExpanded = expandedOrder === order.id;
          const cancelled = isCancelledStatus(order.status);
          const currentStep = getStepIndex(order.status);
          const style = getStatusStyle(order.status);
          const isCancelling = cancellingId === order.id;
          const canCancel = order.status === "waiting";

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl overflow-hidden"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              {/* Collapsed Header */}
              <div
                onClick={() => toggleExpand(order.id)}
                className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-purple-950/10 transition-colors select-none"
              >
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <Calendar size={13} style={{ color: "var(--text-muted)" }} />
                    <span className="text-xs text-purple-200">
                      {order.createdAt?.toDate().toLocaleDateString(undefined, { dateStyle: "long" }) ?? "Recent"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total</p>
                    <p className="text-sm font-bold gradient-text">{formatPrice(order.total)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status badge */}
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full"
                      style={{ background: style.bg, color: style.color }}
                    >
                      <StatusIcon status={order.status} />
                      {style.label}
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="p-6 space-y-6">
                      {/* Cancel button — only for waiting orders */}
                      {canCancel && (
                        <div
                          className="flex items-center justify-between p-4 rounded-2xl"
                          style={{ background: "rgba(234,179,8,0.07)", border: "1px solid rgba(234,179,8,0.2)" }}
                        >
                          <div className="flex items-center gap-2">
                            <Clock size={15} className="text-amber-400" />
                            <div>
                              <p className="text-xs font-bold text-amber-300">Awaiting store confirmation</p>
                              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                                You can cancel this order while it&apos;s still pending.
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCancel(order.id); }}
                            disabled={isCancelling}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                            style={{
                              background: "rgba(239,68,68,0.1)",
                              border: "1px solid rgba(239,68,68,0.3)",
                              color: "#f87171",
                            }}
                          >
                            {isCancelling ? (
                              <span className="w-3.5 h-3.5 border-2 border-t-red-400 border-red-900/30 rounded-full animate-spin inline-block" />
                            ) : (
                              <XCircle size={13} />
                            )}
                            {isCancelling ? "Cancelling…" : "Cancel Order"}
                          </button>
                        </div>
                      )}

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
                        <div className="py-4 border-b border-purple-500/10">
                          <h4 className="text-xs uppercase font-bold tracking-widest mb-6" style={{ color: "var(--text-secondary)" }}>
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

                      {/* Ordered Items */}
                      <div>
                        <h4 className="text-xs uppercase font-bold tracking-widest mb-4" style={{ color: "var(--text-secondary)" }}>
                          Items Ordered
                        </h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.productId}
                              className="flex items-center gap-4 p-3 rounded-2xl"
                              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
                            >
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-purple-950/20 relative flex-shrink-0">
                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-white">
                                  {formatPrice((item.discountedPrice ?? item.price) * item.quantity)}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                                  {formatPrice(item.discountedPrice ?? item.price)} / unit
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Address & details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-purple-500/10 text-sm">
                        <div className="space-y-2">
                          <h4 className="text-xs uppercase font-bold tracking-widest" style={{ color: "var(--text-secondary)" }}>
                            Delivery Address
                          </h4>
                          <div className="flex items-start gap-2 text-purple-200">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400" />
                            <div>
                              <p className="font-bold">{order.deliveryAddress.fullName}</p>
                              <p>{order.deliveryAddress.addressLine1}</p>
                              {order.deliveryAddress.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
                              <p>
                                {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
                                {order.deliveryAddress.postalCode}
                              </p>
                              <p>Phone: {order.deliveryAddress.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-xs uppercase font-bold tracking-widest" style={{ color: "var(--text-secondary)" }}>
                            Payment & Notes
                          </h4>
                          <div className="space-y-1.5 text-xs text-purple-200">
                            <p className="flex justify-between">
                              <span>Payment:</span>
                              <span className="font-bold">Cash on Delivery (COD)</span>
                            </p>
                            {order.couponCode && (
                              <p className="flex justify-between">
                                <span>Coupon:</span>
                                <span className="font-bold text-amber-400">{order.couponCode}</span>
                              </p>
                            )}
                            {order.notes && (
                              <div
                                className="mt-3 p-3 rounded-xl flex items-start gap-2"
                                style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.2)" }}
                              >
                                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-purple-400" />
                                <p className="leading-relaxed text-purple-300">&quot;{order.notes}&quot;</p>
                              </div>
                            )}
                          </div>
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
