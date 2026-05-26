"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Percent,
  CircleDollarSign,
  Save,
  X,
  Clock,
} from "lucide-react";
import { getAllCoupons, saveCoupon, deleteCoupon, getAllCategoriesAdmin } from "@/lib/firebase/firestore";
import { Coupon, Category } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { Timestamp } from "firebase/firestore";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadCoupons = () => {
    setLoading(true);
    Promise.all([
      getAllCoupons().catch(() => [] as Coupon[]),
      getAllCategoriesAdmin().catch(() => [] as Category[]),
    ])
      .then(([couponsData, categoriesData]) => {
        setCoupons(couponsData);
        setCategories(categoriesData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const openCreateForm = () => {
    setEditingCoupon({
      code: "",
      discount: 10,
      type: "percent",
      minOrder: 1000,
      maxUses: 100,
      usedCount: 0,
      isActive: true,
      isVisible: true,
      startsAt: null,
      expiresAt: null,
      oneTimeUse: false,
      usedBy: [],
      description: "",
    });
    setFormOpen(true);
  };

  const openEditForm = (c: Coupon) => {
    setEditingCoupon(c);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteCoupon(id);
      toast.success("Coupon removed successfully");
      loadCoupons();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete coupon");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;
    if (!editingCoupon.code || !editingCoupon.discount) {
      toast.error("Code and Discount are required!");
      return;
    }

    setSaving(true);
    try {
      const submitData = {
        code: editingCoupon.code.toUpperCase().trim(),
        discount: Number(editingCoupon.discount),
        type: editingCoupon.type ?? "percent",
        minOrder: Number(editingCoupon.minOrder ?? 0),
        maxUses: Number(editingCoupon.maxUses ?? 100),
        usedCount: Number(editingCoupon.usedCount ?? 0),
        isActive: !!editingCoupon.isActive,
        isVisible: !!editingCoupon.isVisible,
        startsAt: editingCoupon.startsAt ?? null,
        description: editingCoupon.description ?? "",
        oneTimeUse: !!editingCoupon.oneTimeUse,
        usedBy: editingCoupon.usedBy ?? [],
        expiresAt: editingCoupon.expiresAt ?? null,
        categories: editingCoupon.categories ?? [],
      };

      await saveCoupon(editingCoupon.id ?? null, submitData as Omit<Coupon, "id">);
      toast.success("Coupon saved successfully!");
      setFormOpen(false);
      setEditingCoupon(null);
      loadCoupons();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save coupon details");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !formOpen) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-full skeleton" />
        <div className="h-96 w-full skeleton" />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "Playfair Display, serif" }}>
            Promotional Coupons
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            List, update, and manage your luxury store coupons and reductions
          </p>
        </div>
        <button onClick={openCreateForm} className="btn-primary text-xs px-5 py-2.5 flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Forge Coupon
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl border flex flex-col justify-between relative overflow-hidden"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            {/* Decors */}
            <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-purple-500/5 blur-md" />

            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1.5">
                  <Tag size={16} className="text-amber-400" />
                  <span className="font-black text-base text-white tracking-wider font-mono">{coupon.code}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`badge text-[9px] py-0.5 px-2 ${coupon.isActive ? "badge-green" : "badge-red"}`}>
                    {coupon.isActive ? "Active" : "Disabled"}
                  </span>
                  {coupon.isVisible !== undefined && (
                    <span
                      className="text-[9px] py-0.5 px-2 rounded font-semibold"
                      style={{
                        background: coupon.isVisible ? "rgba(96,165,250,0.2)" : "rgba(156,163,175,0.2)",
                        color: coupon.isVisible ? "#93c5fd" : "#9ca3af",
                        border: `1px solid ${coupon.isVisible ? "rgba(96,165,250,0.35)" : "rgba(156,163,175,0.2)"}`,
                      }}
                    >
                      {coupon.isVisible ? "Visible" : "Hidden"}
                    </span>
                  )}
                </div>
              </div>

              {coupon.description && (
                <p className="text-[10px] text-purple-200/60 leading-relaxed pt-0.5">{coupon.description}</p>
              )}
              <div className="border-t border-purple-500/5 pt-2 space-y-1.5 text-xs text-purple-200">
                <p className="flex justify-between">
                  <span>Reduction Value:</span>
                  <span className="font-bold text-white flex items-center gap-0.5">
                    {coupon.type === "percent" ? <Percent size={11} /> : "₹"}
                    {coupon.discount} {coupon.type === "percent" ? "Off" : ""}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Minimum Spend:</span>
                  <span className="font-semibold text-white">{formatPrice(coupon.minOrder)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Limits / Usage:</span>
                  <span className="font-semibold text-white">
                    {coupon.usedCount} / {coupon.maxUses} uses
                  </span>
                </p>
                {coupon.expiresAt && (
                  <p className="flex justify-between">
                    <span>Expiry Schedule:</span>
                    <span className="font-semibold text-red-300 flex items-center gap-1">
                      <Clock size={11} /> {coupon.expiresAt.toDate().toLocaleDateString()}
                    </span>
                  </p>
                )}
                {coupon.startsAt && (
                  <p className="flex justify-between">
                    <span>Valid From:</span>
                    <span className="font-semibold text-emerald-300 flex items-center gap-1">
                      <Calendar size={11} /> {coupon.startsAt.toDate().toLocaleDateString()}
                    </span>
                  </p>
                )}
                {coupon.categories && coupon.categories.length > 0 && (
                  <div className="pt-1.5">
                    <p className="text-[10px] mb-1" style={{ color: "var(--text-muted)" }}>Categories:</p>
                    <div className="flex flex-wrap gap-1">
                      {coupon.categories.map((cat) => (
                        <span key={cat} className="text-[9px] px-1.5 py-0.5 rounded font-semibold" style={{ background: "rgba(147,51,234,0.15)", color: "var(--purple-300)" }}>
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-purple-500/5 pt-3 mt-4">
              <button onClick={() => openEditForm(coupon)} className="btn-ghost p-2 rounded-lg text-purple-300">
                <Edit2 size={13} />
              </button>
              <button onClick={() => handleDelete(coupon.id)} className="btn-ghost p-2 rounded-lg text-red-400">
                <Trash2 size={13} />
              </button>
            </div>
          </motion.div>
        ))}

        {coupons.length === 0 && (
          <div className="col-span-full p-20 border rounded-3xl text-center text-purple-300/40" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <Tag size={40} className="mx-auto text-purple-950 mb-3" />
            <p className="font-semibold text-sm">No promotional coupon codes exist</p>
          </div>
        )}
      </div>

      {/* Drawer Form Modal */}
      <AnimatePresence>
        {formOpen && editingCoupon && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setFormOpen(false)}
              className="absolute inset-0 bg-black"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="relative w-full max-w-md h-full bg-[#120a24] border-l border-purple-500/25 shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: "var(--border)" }}>
                  <h3 className="text-lg font-black gradient-text" style={{ fontFamily: "Playfair Display, serif" }}>
                    {editingCoupon.id ? "Edit Promotion Coupon" : "Forge Promotion Coupon"}
                  </h3>
                  <button onClick={() => setFormOpen(false)} className="p-1.5 rounded-lg text-purple-300/60 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <form className="space-y-4" onSubmit={handleFormSubmit}>
                  {/* Coupon Code */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Coupon Code</label>
                    <input
                      type="text"
                      required
                      value={editingCoupon.code || ""}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                      className="input text-xs py-2 font-mono"
                      placeholder="LUXURY50, GOLDEN30..."
                    />
                  </div>

                  {/* Discount Value | Reduction Mode */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Discount Value</label>
                      <input
                        type="number"
                        required
                        value={editingCoupon.discount ?? 0}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, discount: Number(e.target.value) })}
                        className="input text-xs py-2"
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Reduction Mode</label>
                      <select
                        value={editingCoupon.type || "percent"}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, type: e.target.value as "percent" | "fixed" })}
                        className="input text-xs py-2 cursor-pointer"
                      >
                        <option value="percent" style={{ background: "var(--bg-card)" }}>Percentage (%)</option>
                        <option value="fixed" style={{ background: "var(--bg-card)" }}>Flat Price (₹)</option>
                      </select>
                    </div>
                  </div>

                  {/* Min Spend | Max System Uses */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Min Spend (₹)</label>
                      <input
                        type="number"
                        value={editingCoupon.minOrder ?? 0}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrder: Number(e.target.value) })}
                        className="input text-xs py-2"
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Max System Uses</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editingCoupon.maxUses ?? ""}
                          onChange={(e) => setEditingCoupon({ ...editingCoupon, maxUses: Number(e.target.value) })}
                          className="input text-xs py-2 flex-1"
                          placeholder="100"
                          disabled={editingCoupon.maxUses === 999999}
                        />
                        <label className="flex items-center gap-1.5 text-[9px] font-semibold whitespace-nowrap cursor-pointer" style={{ color: "var(--text-muted)" }}>
                          <input
                            type="checkbox"
                            checked={editingCoupon.maxUses === 999999}
                            onChange={(e) => setEditingCoupon({ ...editingCoupon, maxUses: e.target.checked ? 999999 : 100 })}
                            className="w-3.5 h-3.5 cursor-pointer accent-purple-500"
                          />
                          Unlimited
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Valid From */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Calendar size={11} /> Valid From (Optional)
                    </label>
                    <input
                      type="date"
                      value={
                        editingCoupon.startsAt
                          ? new Date(editingCoupon.startsAt.toDate()).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        if (!e.target.value) {
                          setEditingCoupon({ ...editingCoupon, startsAt: null });
                        } else {
                          const dateObj = new Date(e.target.value);
                          setEditingCoupon({
                            ...editingCoupon,
                            startsAt: Timestamp.fromDate(dateObj),
                          });
                        }
                      }}
                      className="input text-xs py-2 cursor-pointer"
                    />
                  </div>

                  {/* Expires On */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Calendar size={11} /> Expires On (Optional)
                    </label>
                    <input
                      type="date"
                      value={
                        editingCoupon.expiresAt
                          ? new Date(editingCoupon.expiresAt.toDate()).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        if (!e.target.value) {
                          setEditingCoupon({ ...editingCoupon, expiresAt: null });
                        } else {
                          const dateObj = new Date(e.target.value);
                          setEditingCoupon({
                            ...editingCoupon,
                            expiresAt: Timestamp.fromDate(dateObj),
                          });
                        }
                      }}
                      className="input text-xs py-2 cursor-pointer"
                    />
                  </div>

                  {/* Active Status */}
                  <div className="p-4 rounded-2xl flex items-center justify-between border" style={{ background: "rgba(147,51,234,0.03)", borderColor: "var(--border)" }}>
                    <div>
                      <h5 className="text-xs font-bold text-white">Active Status</h5>
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>shoppers can use coupon code immediately</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={editingCoupon.isActive ?? true}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, isActive: e.target.checked })}
                      className="w-4 h-4 cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Show in Offers */}
                  <div className="p-4 rounded-2xl flex items-center justify-between border" style={{ background: "rgba(147,51,234,0.03)", borderColor: "var(--border)" }}>
                    <div>
                      <h5 className="text-xs font-bold text-white">Show in Offers</h5>
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>display this coupon on the checkout page &amp; ticker bar</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={editingCoupon.isVisible ?? true}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, isVisible: e.target.checked })}
                      className="w-4 h-4 cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* One-Time Use */}
                  <div className="p-4 rounded-2xl flex items-center justify-between border" style={{ background: "rgba(147,51,234,0.03)", borderColor: "var(--border)" }}>
                    <div>
                      <h5 className="text-xs font-bold text-white">One-Time Use</h5>
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>each user can only use this coupon once</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={editingCoupon.oneTimeUse ?? false}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, oneTimeUse: e.target.checked })}
                      className="w-4 h-4 cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Restrict to Categories */}
                  <div className="p-4 rounded-2xl border" style={{ background: "rgba(147,51,234,0.03)", borderColor: "var(--border)" }}>
                    <div className="mb-2">
                      <h5 className="text-xs font-bold text-white">Restrict to Categories</h5>
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>leave empty to apply to all products</p>
                    </div>
                    {categories.length === 0 ? (
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>No categories available</p>
                    ) : (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {categories.map((cat) => {
                          const selected = (editingCoupon.categories ?? []).includes(cat.name);
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                const current = editingCoupon.categories ?? [];
                                setEditingCoupon({
                                  ...editingCoupon,
                                  categories: selected
                                    ? current.filter((c) => c !== cat.name)
                                    : [...current, cat.name],
                                });
                              }}
                              className="px-2.5 py-1 rounded-lg border text-[10px] font-semibold transition-all"
                              style={{
                                background: selected ? "rgba(147,51,234,0.25)" : "rgba(147,51,234,0.05)",
                                borderColor: selected ? "var(--purple-500)" : "var(--border)",
                                color: selected ? "var(--purple-300)" : "var(--text-muted)",
                              }}
                            >
                              {cat.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </form>
              </div>

              <div className="flex gap-3 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="btn-outline flex-1 py-3 text-xs justify-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  disabled={saving}
                  className="btn-primary flex-1 py-3 text-xs justify-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} />
                  {saving ? "Encrypting..." : "Forging Code"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
