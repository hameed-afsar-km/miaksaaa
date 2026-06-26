"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { getAllFrameSizes, saveFrameSize, deleteFrameSize } from "@/lib/firebase/firestore";
import { FrameSize } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminFrameSizesPage() {
  const [items, setItems] = useState<FrameSize[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<FrameSize> | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getAllFrameSizes().then(setItems).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing({ label: "", width: 8, height: 10, priceAdjustment: 0, isActive: true });
    setFormOpen(true);
  };

  const openEdit = (item: FrameSize) => {
    setEditing({ ...item });
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this size?")) return;
    try { await deleteFrameSize(id); toast.success("Deleted"); load(); }
    catch { toast.error("Failed"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !editing.label) { toast.error("Label required"); return; }
    setSaving(true);
    try {
      await saveFrameSize(editing.id ?? null, editing as Omit<FrameSize, "id">);
      toast.success(editing.id ? "Updated" : "Created");
      setFormOpen(false);
      setEditing(null);
      load();
    } catch { toast.error("Failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "Playfair Display, serif" }}>
            Frame Sizes
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            Define available dimensions for custom frames
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary text-xs px-5 py-2.5 flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> New Size
        </button>
      </div>

      <div className="rounded-3xl border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              <th className="p-4 text-purple-300/60 font-bold uppercase">Label</th>
              <th className="p-4 text-purple-300/60 font-bold uppercase text-center">Width (in)</th>
              <th className="p-4 text-purple-300/60 font-bold uppercase text-center">Height (in)</th>
              <th className="p-4 text-purple-300/60 font-bold uppercase text-right">Premium</th>
              <th className="p-4 text-purple-300/60 font-bold uppercase text-center">Active</th>
              <th className="p-4 text-purple-300/60 font-bold uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/5">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-purple-950/5">
                <td className="p-4 font-bold text-white">{item.label}</td>
                <td className="p-4 text-center">{item.width}"</td>
                <td className="p-4 text-center">{item.height}"</td>
                <td className="p-4 text-right font-bold">
                  {item.priceAdjustment > 0 ? formatPrice(item.priceAdjustment) : <span style={{ color: "var(--text-muted)" }}>—</span>}
                </td>
                <td className="p-4 text-center">
                  <span className={item.isActive ? "text-green-400" : "text-red-400"}>{item.isActive ? "Yes" : "No"}</span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="btn-ghost p-2 rounded-lg text-purple-300"><Edit2 size={13} /></button>
                    <button onClick={() => handleDelete(item.id)} className="btn-ghost p-2 rounded-lg text-red-400"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center text-purple-300/40">No sizes defined</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {formOpen && editing && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setFormOpen(false)} className="absolute inset-0 bg-black" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="relative w-full max-w-lg h-full bg-[#120a24] border-l border-purple-500/25 p-6 overflow-y-auto">
              <div className="flex justify-between items-center border-b pb-3 mb-6" style={{ borderColor: "var(--border)" }}>
                <h3 className="text-lg font-black gradient-text">{editing.id ? "Edit Size" : "New Size"}</h3>
                <button onClick={() => setFormOpen(false)} className="p-1.5 rounded-lg text-purple-300/60"><X size={18} /></button>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Label</label>
                  <input type="text" required value={editing.label || ""}
                    onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                    className="input text-xs py-2" placeholder="8x10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Width (inches)</label>
                    <input type="number" required value={editing.width ?? 8} min={1}
                      onChange={(e) => setEditing({ ...editing, width: Number(e.target.value) })}
                      className="input text-xs py-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Height (inches)</label>
                    <input type="number" required value={editing.height ?? 10} min={1}
                      onChange={(e) => setEditing({ ...editing, height: Number(e.target.value) })}
                      className="input text-xs py-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Price Premium (₹)</label>
                  <input type="number" value={editing.priceAdjustment ?? 0} min={0}
                    onChange={(e) => setEditing({ ...editing, priceAdjustment: Number(e.target.value) })}
                    className="input text-xs py-2" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input type="checkbox" checked={editing.isActive ?? true}
                    onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                    className="w-4 h-4 accent-purple-500" />
                  <span className="text-xs font-bold">Active</span>
                </label>
                <button type="submit" disabled={saving}
                  className="btn-primary w-full justify-center gap-1.5 text-xs py-3 mt-4">
                  <Save size={14} /> {saving ? "Saving..." : "Save Size"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
