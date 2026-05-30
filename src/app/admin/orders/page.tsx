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
  Package,
  Trash2,
  Download,
  AlertTriangle,
} from "lucide-react";
import { getAllOrders, updateOrderStatus, deleteOrder, deleteAllOrders } from "@/lib/firebase/firestore";
import { Order, OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const ALL_STATUSES: OrderStatus[] = [
  "waiting",
  "shipped",
  "delivered",
  "cancelled by user",
  "cancelled by admin",
];

const STATUS_FILTERS = ["all", ...ALL_STATUSES] as const;
type FilterKey = (typeof STATUS_FILTERS)[number];

function getStatusStyle(status: OrderStatus) {
  switch (status) {
    case "waiting":
      return { bg: "rgba(234,179,8,0.15)", color: "#eab308", dot: "#eab308" };
    case "shipped":
      return { bg: "rgba(99,102,241,0.15)", color: "#818cf8", dot: "#818cf8" };
    case "delivered":
      return { bg: "rgba(34,197,94,0.15)", color: "#4ade80", dot: "#4ade80" };
    case "cancelled by user":
      return { bg: "rgba(239,68,68,0.15)", color: "#f87171", dot: "#f87171" };
    case "cancelled by admin":
      return { bg: "rgba(239,68,68,0.2)", color: "#ef4444", dot: "#ef4444" };
    default:
      return { bg: "rgba(168,85,247,0.15)", color: "#c084fc", dot: "#c084fc" };
  }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

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
      toast.success(`Order status updated to: ${newStatus}`);
      loadOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm("Delete this order permanently?")) return;
    try {
      await deleteOrder(orderId);
      toast.success("Order deleted");
      loadOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order");
    }
  };

  const handleClearLog = async () => {
    if (!confirm("Delete ALL orders permanently? This cannot be undone.")) return;
    try {
      await deleteAllOrders();
      toast.success("All orders cleared");
      loadOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear orders");
    }
  };

  const handleDownloadCSV = () => {
    const rows = [["Order #", "Customer", "Phone", "Place", "Items", "Qty", "Total", "Status", "Date"]];
    for (const o of orders) {
      const itemStr = o.items.map((i) => i.title).join("; ");
      const qtyStr = o.items.map((i) => i.quantity).join("; ");
      rows.push([
        `#${o.id.slice(-8).toUpperCase()}`,
        o.deliveryAddress.fullName,
        o.deliveryAddress.phone,
        `${o.deliveryAddress.city}, ${o.deliveryAddress.state}`,
        itemStr,
        qtyStr,
        formatPrice(o.total),
        o.status,
        o.createdAt?.toDate().toLocaleDateString() ?? "",
      ]);
    }
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  const filtered =
    activeFilter === "all" ? orders : orders.filter((o) => o.status === activeFilter);

  // Count per status for tab badges
  const countFor = (f: FilterKey) =>
    f === "all" ? orders.length : orders.filter((o) => o.status === f).length;

  if (loading && orders.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 w-full skeleton rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black gradient-text">Fulfillment Registry</h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            Manage, approve, and track all customer orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="btn-outline text-xs px-4 py-2 gap-1.5 cursor-pointer"
          >
            <Download size={14} /> CSV
          </button>
          <button
            onClick={handleClearLog}
            className="btn-outline text-xs px-4 py-2 gap-1.5 cursor-pointer"
            style={{ borderColor: "rgba(239,68,68,0.3)", color: "#f87171" }}
          >
            <Trash2 size={14} /> Clear Log
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const isActive = activeFilter === f;
          const count = countFor(f);
          const style = f !== "all" ? getStatusStyle(f as OrderStatus) : null;

          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={
                isActive
                  ? {
                      background: style ? style.bg : "rgba(168,85,247,0.2)",
                      color: style ? style.color : "#c084fc",
                      border: `1px solid ${style ? style.color + "55" : "rgba(168,85,247,0.4)"}`,
                    }
                  : {
                      background: "var(--bg-surface)",
                      color: "var(--text-muted)",
                      border: "1px solid var(--border)",
                    }
              }
            >
              {style && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: style.dot }}
                />
              )}
              {f === "all" ? "All Orders" : capitalize(f)}
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-black"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((order) => {
            const isUpdating = updatingId === order.id;
            const statusStyle = getStatusStyle(order.status);
            const isCancelled =
              order.status === "cancelled by user" || order.status === "cancelled by admin";

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-6 rounded-3xl border space-y-4 transition-all hover:border-purple-500/30"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                {/* Card Top */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-500/10 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-sm text-white">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      {/* Status badge */}
                      <span
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: statusStyle.bg, color: statusStyle.color }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: statusStyle.dot }}
                        />
                        {capitalize(order.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-purple-300/40">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {order.createdAt?.toDate().toLocaleDateString(undefined, { dateStyle: "medium" }) ?? "Recent"}
                      </span>
                      <span>•</span>
                      <span>
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </span>
                      <span>•</span>
                      <span className="text-purple-200 normal-case">{order.userEmail}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right sm:mr-4">
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        Total
                      </p>
                      <p className="text-sm font-bold text-white">{formatPrice(order.total)}</p>
                    </div>

                    {/* Status Dropdown — disabled for cancelled orders */}
                    <div className="relative">
                      <select
                        value={order.status}
                        disabled={isUpdating || isCancelled}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="input text-xs py-2 pr-8 appearance-none cursor-pointer border-purple-500/20 bg-purple-950/20 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ minWidth: 150 }}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s} style={{ background: "var(--bg-card)" }}>
                            {capitalize(s)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={12}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-purple-300"
                      />
                    </div>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="p-2 rounded-lg transition-colors cursor-pointer"
                      style={{ color: "rgba(239,68,68,0.6)" }}
                      title="Delete order"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Items row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  {/* Product list */}
                  <div className="md:col-span-2 space-y-2">
                    <h4 className="font-bold text-[10px] uppercase tracking-wider text-purple-300/40 mb-2">
                      Ordered Items
                    </h4>
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {order.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex justify-between items-center gap-2 p-2 rounded-xl bg-purple-950/10"
                        >
                          <span className="font-semibold text-white truncate max-w-[200px]">
                            {item.title}
                          </span>
                          <div className="text-right flex-shrink-0">
                            <span style={{ color: "var(--text-secondary)" }}>
                              Qty: {item.quantity}
                            </span>
                            <span className="font-bold ml-3 text-purple-200">
                              {formatPrice((item.discountedPrice ?? item.price) * item.quantity)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping address */}
                  <div
                    className="p-4 rounded-2xl space-y-3"
                    style={{
                      background: "rgba(147,51,234,0.02)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <h4 className="font-bold text-[10px] uppercase tracking-wider text-amber-400">
                      Delivery Address
                    </h4>
                    <div className="space-y-1 text-purple-200">
                      <p className="font-bold flex items-center gap-1 text-white">
                        <User size={11} className="text-amber-400" />
                        {order.deliveryAddress.fullName}
                      </p>
                      <p className="flex items-start gap-1">
                        <MapPin size={11} className="text-purple-400 mt-0.5" />
                        {order.deliveryAddress.addressLine1}
                      </p>
                      {order.deliveryAddress.addressLine2 && (
                        <p className="ml-3.5">{order.deliveryAddress.addressLine2}</p>
                      )}
                      <p className="ml-3.5">
                        {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
                        {order.deliveryAddress.postalCode}
                      </p>
                      <p className="ml-3.5">Tel: {order.deliveryAddress.phone}</p>
                    </div>
                    {order.location && (
                      <a
                        href={`https://maps.google.com/?q=${order.location.lat},${order.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 border-t border-purple-500/5 pt-2 w-full mt-2"
                      >
                        <ExternalLink size={10} /> View on Google Maps
                      </a>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="p-3 rounded-xl flex items-start gap-2 bg-purple-950/20 border border-purple-900/40 text-purple-300 text-[11px] leading-relaxed">
                    <Info size={13} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Notes: &quot;{order.notes}&quot;</span>
                  </div>
                )}

                {/* Cancelled info */}
                {isCancelled && (
                  <div
                    className="flex items-center gap-2 p-3 rounded-xl text-[11px]"
                    style={{
                      background: "rgba(239,68,68,0.07)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      color: "#f87171",
                    }}
                  >
                    <XCircle size={13} className="flex-shrink-0" />
                    <span>
                      {order.status === "cancelled by user"
                        ? "Customer cancelled this order. Stock has been restored."
                        : "You (admin) cancelled this order. Stock has been restored."}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div
            className="p-20 border rounded-3xl text-center"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <Package size={40} className="mx-auto mb-3 opacity-20" />
            <p className="font-semibold text-sm">
              {activeFilter === "all" ? "No orders yet" : `No orders with status "${activeFilter}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
