"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package, Calendar, Clock, MapPin, ChevronDown, ChevronUp, ShoppingBag, CheckCircle, Info } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { getUserOrders } from "@/lib/firebase/firestore";
import { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"];

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/orders");
      return;
    }

    if (user) {
      setLoading(true);
      getUserOrders(user.uid)
        .then(setOrders)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  function getStepIndex(status: string) {
    if (status === "cancelled") return -1;
    return STATUS_STEPS.indexOf(status);
  }

  function toggleExpand(id: string) {
    setExpandedOrder(expandedOrder === id ? null : id);
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0614]">
        <div className="w-10 h-10 rounded-full border-4 border-t-purple-500 border-purple-900/30 animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container-lg py-20 flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse-glow"
          style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <Package size={36} style={{ color: "var(--purple-400)" }} />
        </div>
        <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "Playfair Display,serif" }}>
          No Luxury Orders Found
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "450px" }}>
          You haven't placed any premium orders yet. Explore our exceptional catalog and purchase your first luxury item.
        </p>
        <Link href="/products" className="btn-primary px-8">Discover Collections</Link>
      </div>
    );
  }

  return (
    <div className="container-lg py-10">
      <h1 className="text-3xl font-black gradient-text mb-8" style={{ fontFamily: "Playfair Display,serif" }}>
        My Luxury Orders
      </h1>

      <div className="space-y-4">
        {orders.map((order, index) => {
          const isExpanded = expandedOrder === order.id;
          const currentStep = getStepIndex(order.status);
          const isCancelled = order.status === "cancelled";

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
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Order ID: #{order.id.slice(-8).toUpperCase()}</span>
                  <div className="flex items-center gap-2">
                    <Calendar size={13} style={{ color: "var(--text-muted)" }} />
                    <span className="text-xs text-purple-200">
                      {order.createdAt?.toDate().toLocaleDateString(undefined, { dateStyle: "long" }) ?? "Recent"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total Price</p>
                    <p className="text-sm font-bold gradient-text">{formatPrice(order.total)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`badge text-xs py-1 px-3 ${
                      isCancelled ? "badge-red" :
                      order.status === "delivered" ? "badge-green" : "badge-purple"
                    }`}>
                      {order.status}
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
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
                      {/* Stepper tracking */}
                      {!isCancelled && (
                        <div className="py-4 border-b border-purple-500/10">
                          <h4 className="text-xs uppercase font-bold tracking-widest mb-6" style={{ color: "var(--text-secondary)" }}>Fulfillment Tracker</h4>
                          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center relative">
                            {/* Connector line */}
                            <div className="hidden sm:block absolute left-4 right-4 top-4 h-0.5 bg-purple-950 -z-10" />
                            <div
                              className="hidden sm:block absolute left-4 top-4 h-0.5 bg-gradient-to-r from-purple-500 to-amber-400 -z-10 transition-all duration-500"
                              style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                            />

                            {STATUS_STEPS.map((step, idx) => {
                              const isActive = idx <= currentStep;
                              const isCompleted = idx < currentStep;

                              return (
                                <div key={step} className="flex sm:flex-col items-center gap-3 sm:gap-2 relative z-10 w-full sm:w-auto">
                                  <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                      isCompleted ? "bg-amber-400 text-black border border-amber-400 shadow-lg glow-gold" :
                                      isActive ? "bg-purple-600 text-white border border-purple-400 shadow-lg glow-purple" :
                                      "bg-purple-950/40 text-purple-300 border border-purple-900"
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

                      {/* Items grid */}
                      <div>
                        <h4 className="text-xs uppercase font-bold tracking-widest mb-4" style={{ color: "var(--text-secondary)" }}>Purchased Luxuries</h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.productId} className="flex items-center gap-4 p-3 rounded-2xl" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-purple-950/20 relative flex-shrink-0">
                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-white">
                                  {formatPrice((item.discountedPrice ?? item.price) * item.quantity)}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                                  ({formatPrice(item.discountedPrice ?? item.price)} / unit)
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Address & delivery details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-purple-500/10 text-sm">
                        <div className="space-y-2">
                          <h4 className="text-xs uppercase font-bold tracking-widest" style={{ color: "var(--text-secondary)" }}>Shipping Coordinates</h4>
                          <div className="flex items-start gap-2 text-purple-200">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400" />
                            <div>
                              <p className="font-bold">{order.deliveryAddress.fullName}</p>
                              <p>{order.deliveryAddress.addressLine1}</p>
                              {order.deliveryAddress.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
                              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.postalCode}</p>
                              <p>Phone: {order.deliveryAddress.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-xs uppercase font-bold tracking-widest" style={{ color: "var(--text-secondary)" }}>Fulfillment Specifications</h4>
                          <div className="space-y-1.5 text-xs text-purple-200">
                            <p className="flex justify-between"><span>Payment Mode:</span> <span className="font-bold">Cash on Delivery (COD)</span></p>
                            <p className="flex justify-between"><span>Accent Priority:</span> <span className="text-amber-400 font-bold">VIP Handling</span></p>
                            {order.notes && (
                              <div className="mt-3 p-3 rounded-xl flex items-start gap-2 bg-purple-950/20 border border-purple-900 text-purple-300">
                                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                <p className="leading-relaxed">Notes: "{order.notes}"</p>
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
