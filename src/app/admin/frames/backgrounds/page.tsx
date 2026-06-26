"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { getAllFrameBackgrounds, saveFrameBackground, deleteFrameBackground } from "@/lib/firebase/firestore";
import { FrameBackground } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminFrameBackgroundsPage() {
  const [items, setItems] = useState<FrameBackground[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<FrameBackground> | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getAllFrameBackgrounds().then(setItems).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing({ label: "", imageUrl: "", priceAdjustment: 0, isActive: true });
    setFormOpen(true);
  };

  const openEdit = (item: FrameBackground) => {
    setEditing({ ...item });
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this background?")) return;
    try { await deleteFrameBackground(id); toast.success("Deleted"); load(); }
    catch { toast.error("Failed"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !editing.label || !editing.imageUrl) { toast.error("Label and image required"); return; }
    setSaving(true);
    try {
      await saveFrameBackground(editing.id ?? null, editing as Omit<FrameBackground, "id">);
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
            Frame Backgrounds
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            Upload background images for custom frames
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary text-xs px-5 py-2.5 flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> New Background
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border overflow-hidden group"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div className="aspect-video relative bg-purple-950/20">
              <Image src={item.imageUrl} alt={item.label} fill className="object-cover" />
              {!item.isActive && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-xs font-bold text-red-400">INACTIVE</span>
                </div>
              )}
            </div>
            <div className="p-3 space-y-2">
              <h4 className="text-sm font-bold text-white">{item.label}</h4>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {item.priceAdjustment > 0 ? `+${formatPrice(item.priceAdjustment)}` : "No premium"}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(item)} className="btn-ghost p-1.5 rounded-lg text-purple-300"><Edit2 size={12} /></button>
                  <button onClick={() => handleDelete(item.id)} className="btn-ghost p-1.5 rounded-lg text-red-400"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-3 text-center py-20 text-purple-300/40">No backgrounds defined</div>
        )}
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
                <h3 className="text-lg font-black gradient-text">{editing.id ? "Edit Background" : "New Background"}</h3>
                <button onClick={() => setFormOpen(false)} className="p-1.5 rounded-lg text-purple-300/60"><X size={18} /></button>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Label</label>
                  <input type="text" required value={editing.label || ""}
                    onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                    className="input text-xs py-2" placeholder="Carbon Fiber" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Image URL</label>
                  <input type="text" required value={editing.imageUrl || ""}
                    onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                    className="input text-xs py-2" placeholder="https://..." />
                  {editing.imageUrl && (
                    <div className="mt-2 aspect-video rounded-lg overflow-hidden relative bg-purple-950/20">
                      <Image src={editing.imageUrl} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
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
                  <Save size={14} /> {saving ? "Saving..." : "Save Background"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
