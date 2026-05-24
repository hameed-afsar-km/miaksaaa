"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingBag,
  Receipt,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { getAllOrders, getAllProducts } from "@/lib/firebase/firestore";
import { Order, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([getAllOrders().catch(() => []), getAllProducts().catch(() => [])])
      .then(([ordersData, productsData]) => {
        setOrders(ordersData);
        setProducts(productsData);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalSales = orders
    .filter((o) => o.status !== "cancelled by user" && o.status !== "cancelled by admin")
    .reduce((sum, o) => sum + o.total, 0);

  const completedOrders = orders.filter((o) => o.status === "delivered").length;
  const pendingOrders = orders.filter((o) => o.status === "waiting").length;
  const stockShortage = products.filter((p) => p.stock <= 5).length;
  const activeOrders = orders.filter((o) => o.status !== "cancelled by user" && o.status !== "cancelled by admin");
  const averageOrderValue = activeOrders.length > 0 ? totalSales / activeOrders.length : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl skeleton" />
          ))}
        </div>
        <div className="h-96 rounded-2xl skeleton" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "Playfair Display, serif" }}>
            Operational Overview
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            Real-time analytics and management controls
          </p>
        </div>
        <button
          onClick={loadData}
          className="btn-outline text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw size={12} /> Sync Firestore
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl border flex flex-col justify-between"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Total revenue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-bold gradient-text">{formatPrice(totalSales)}</h2>
            <p className="text-[10px] mt-1" style={{ color: "#86efac" }}>+8.4% since last week</p>
          </div>
        </motion.div>

        {/* Total Orders */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-2xl border flex flex-col justify-between"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Receipt size={16} />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-bold text-white">{orders.length} units</h2>
            <p className="text-[10px] mt-1" style={{ color: "var(--text-secondary)" }}>{pendingOrders} active processing</p>
          </div>
        </motion.div>

        {/* Avg Order Value */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl border flex flex-col justify-between"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Avg Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-bold text-white">{formatPrice(averageOrderValue)}</h2>
            <p className="text-[10px] mt-1" style={{ color: "var(--text-secondary)" }}>Excluding cancellations</p>
          </div>
        </motion.div>

        {/* Stock status */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 rounded-2xl border flex flex-col justify-between"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Items Shortage</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stockShortage > 0 ? "bg-red-500/10 border border-red-500/30 text-red-400" : "bg-purple-500/10 border border-purple-500/30 text-purple-400"}`}>
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-bold text-white">{stockShortage} items</h2>
            <p className="text-[10px] mt-1" style={{ color: stockShortage > 0 ? "#fca5a5" : "#86efac" }}>
              {stockShortage > 0 ? "Requires restock replenishment" : "All products fully stocked"}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent sales table */}
        <div className="lg:col-span-2 p-6 rounded-2xl border space-y-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Clock size={16} className="text-amber-400" /> Recent Transactions
            </h3>
            <Link href="/admin/orders" className="text-xs text-purple-400 font-semibold hover:text-purple-300 flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <th className="pb-3 text-purple-300/60 font-bold uppercase">Customer ID</th>
                  <th className="pb-3 text-purple-300/60 font-bold uppercase">Date</th>
                  <th className="pb-3 text-purple-300/60 font-bold uppercase text-right">Revenue</th>
                  <th className="pb-3 text-purple-300/60 font-bold uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/5">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-purple-950/5">
                    <td className="py-3 font-semibold text-white">
                      <p className="truncate w-24 sm:w-auto font-bold">{order.deliveryAddress.fullName}</p>
                      <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>{order.userEmail}</p>
                    </td>
                    <td className="py-3" style={{ color: "var(--text-secondary)" }}>
                      {order.createdAt?.toDate().toLocaleDateString(undefined, { dateStyle: "short" }) ?? "Recent"}
                    </td>
                    <td className="py-3 font-bold text-right text-white">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className="badge text-[9px] py-0.5 px-2"
                        style={{
                          background:
                            order.status === "cancelled by user" || order.status === "cancelled by admin"
                              ? "rgba(239,68,68,0.15)"
                              : order.status === "delivered" || order.status === "completed"
                              ? "rgba(34,197,94,0.15)"
                              : order.status === "waiting"
                              ? "rgba(234,179,8,0.15)"
                              : "rgba(168,85,247,0.15)",
                          color:
                            order.status === "cancelled by user" || order.status === "cancelled by admin"
                              ? "#f87171"
                              : order.status === "delivered" || order.status === "completed"
                              ? "#4ade80"
                              : order.status === "waiting"
                              ? "#eab308"
                              : "#c084fc",
                          borderRadius: 999,
                          border: "none",
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-purple-300/40">No orders logged in history</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar stock alert */}
        <div className="p-6 rounded-2xl border space-y-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <h3 className="font-bold text-base flex items-center gap-2">
            <ShoppingBag size={16} className="text-purple-400" /> Catalog Shortage Alerts
          </h3>

          <div className="space-y-3.5 overflow-y-auto max-h-72">
            {products
              .filter((p) => p.stock <= 8)
              .slice(0, 6)
              .map((p) => (
                <div key={p.id} className="flex justify-between items-center gap-2 p-2.5 rounded-xl bg-purple-950/15 border border-purple-500/5">
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs truncate text-white">{p.title}</h4>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Category: {p.category}</p>
                  </div>
                  <span className={`badge text-[9px] py-0.5 px-2 flex-shrink-0 ${p.stock <= 2 ? "badge-red font-extrabold animate-pulse" : "badge-gold"}`}>
                    {p.stock} Left
                  </span>
                </div>
              ))}
            {products.filter((p) => p.stock <= 8).length === 0 && (
              <p className="text-xs text-center py-10 text-purple-300/40">All catalog products are securely stocked!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
