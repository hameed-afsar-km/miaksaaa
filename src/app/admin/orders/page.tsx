"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Receipt,
  Calendar,
  User,
  MapPin,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  Info,
} from "lucide-react";
import { getAllOrders, updateOrderStatus } from "@/lib/firebase/firestore";
import { Order, OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = () => {
    setLoading(true);
    getAllOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Fulfillment updated: ${newStatus.toUpperCase()}`);
      loadOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-full skeleton" />
        <div className="h-96 w-full skeleton" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "Playfair Display, serif" }}>
          Fulfillment Registry
        </h1>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          Track orders, adjust statuses, and manage customer shipments
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const isUpdating = updatingId === order.id;

          return (
            <div
              key={order.id}
              className="p-6 rounded-3xl border space-y-4 transition-all hover:border-purple-500/30"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              {/* Card Top */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-500/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-white">#{order.id.slice(-8).toUpperCase()}</span>
                    <span className={`badge text-[9px] py-0.5 px-2 ${
                      order.status === "cancelled" ? "badge-red" :
                      order.status === "delivered" ? "badge-green" : "badge-purple"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-purple-300/40">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {order.createdAt?.toDate().toLocaleDateString(undefined, { dateStyle: "medium" }) ?? "Recent"}</span>
                    <span>•</span>
                    <span>{order.items.length} premium item{order.items.length > 1 ? "s" : ""}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right sm:mr-4">
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Total Paid</p>
                    <p className="text-sm font-bold text-white">{formatPrice(order.total)}</p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="relative">
                    <select
                      value={order.status}
                      disabled={isUpdating}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="input text-xs py-2 pr-8 appearance-none cursor-pointer border-purple-500/20 bg-purple-950/20"
                      style={{ minWidth: 130 }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} style={{ background: "var(--bg-card)" }}>
                          {s.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-purple-300" />
                  </div>
                </div>
              </div>

              {/* Items row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Product specifics */}
                <div className="md:col-span-2 space-y-2">
                  <h4 className="font-bold text-[10px] uppercase tracking-wider text-purple-300/40 mb-2">Ordered Luxuries</h4>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center gap-2 p-2 rounded-xl bg-purple-950/10">
                        <span className="font-semibold text-white truncate max-w-[200px]">{item.title}</span>
                        <div className="text-right flex-shrink-0">
                          <span style={{ color: "var(--text-secondary)" }}>Qty: {item.quantity}</span>
                          <span className="font-bold ml-3 text-purple-200">{formatPrice((item.discountedPrice ?? item.price) * item.quantity)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping specs */}
                <div className="p-4 rounded-2xl space-y-3" style={{ background: "rgba(147,51,234,0.02)", border: "1px solid var(--border)" }}>
                  <h4 className="font-bold text-[10px] uppercase tracking-wider text-amber-400">Delivery Address</h4>
                  <div className="space-y-1 text-purple-200">
                    <p className="font-bold flex items-center gap-1 text-white"><User size={11} className="text-amber-400" /> {order.deliveryAddress.fullName}</p>
                    <p className="flex items-start gap-1"><MapPin size={11} className="text-purple-400 mt-0.5" /> {order.deliveryAddress.addressLine1}</p>
                    {order.deliveryAddress.addressLine2 && <p className="ml-3.5">{order.deliveryAddress.addressLine2}</p>}
                    <p className="ml-3.5">{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.postalCode}</p>
                    <p className="ml-3.5">Tel: {order.deliveryAddress.phone}</p>
                  </div>
                  {order.location && (
                    <a
                      href={`https://maps.google.com/?q=${order.location.lat},${order.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 border-t border-purple-500/5 pt-2 w-full mt-2"
                    >
                      <ExternalLink size={10} /> View Smart Pin Location GPS Map
                    </a>
                  )}
                </div>
              </div>

              {/* Notes block */}
              {order.notes && (
                <div className="p-3 rounded-xl flex items-start gap-2 bg-purple-950/20 border border-purple-900/40 text-purple-300 text-[11px] leading-relaxed">
                  <Info size={13} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>Notes: "{order.notes}"</span>
                </div>
              )}
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="p-20 border rounded-3xl text-center text-purple-300/40" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <Receipt size={40} className="mx-auto text-purple-950 mb-3" />
            <p className="font-semibold text-sm">Fulfillment registry is empty</p>
          </div>
        )}
      </div>
    </div>
  );
}
