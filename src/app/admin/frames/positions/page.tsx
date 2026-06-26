"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { getAllFramePositions, saveFramePosition, deleteFramePosition } from "@/lib/firebase/firestore";
import { FramePosition } from "@/lib/types";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminFramePositionsPage() {
  const [items, setItems] = useState<FramePosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<FramePosition> | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getAllFramePositions().then(setItems).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing({ label: "", x: 50, y: 40, rotation: 0, carScale: 0.5, isActive: true });
    setFormOpen(true);
  };

  const openEdit = (item: FramePosition) => {
    setEditing({ ...item });
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this position?")) return;
    try { await deleteFramePosition(id); toast.success("Deleted"); load(); }
    catch { toast.error("Failed"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !editing.label) { toast.error("Label required"); return; }
    setSaving(true);
    try {
      await saveFramePosition(editing.id ?? null, editing as Omit<FramePosition, "id">);
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
            Frame Positions
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            Define car placement presets (X%, Y%, rotation, scale)
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary text-xs px-5 py-2.5 flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> New Position
        </button>
      </div>

      <div className="rounded-3xl border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              <th className="p-4 text-purple-300/60 font-bold uppercase">Label</th>
              <th className="p-4 text-purple-300/60 font-bold uppercase text-center">X%</th>
              <th className="p-4 text-purple-300/60 font-bold uppercase text-center">Y%</th>
              <th className="p-4 text-purple-300/60 font-bold uppercase text-center">Rotation</th>
              <th className="p-4 text-purple-300/60 font-bold uppercase text-center">Car Scale</th>
              <th className="p-4 text-purple-300/60 font-bold uppercase text-center">Active</th>
              <th className="p-4 text-purple-300/60 font-bold uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/5">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-purple-950/5">
                <td className="p-4 font-bold text-white">{item.label}</td>
                <td className="p-4 text-center">{item.x}%</td>
                <td className="p-4 text-center">{item.y}%</td>
                <td className="p-4 text-center">{item.rotation}°</td>
                <td className="p-4 text-center">{item.carScale}</td>
                <td className="p-4 text-center">
                  <span className={item.isActive ? "text-green-400" : "text-red-400"}>
                    {item.isActive ? "Yes" : "No"}
                  </span>
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
              <tr><td colSpan={7} className="p-10 text-center text-purple-300/40">No positions defined</td></tr>
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
                <h3 className="text-lg font-black gradient-text">{editing.id ? "Edit Position" : "New Position"}</h3>
                <button onClick={() => setFormOpen(false)} className="p-1.5 rounded-lg text-purple-300/60"><X size={18} /></button>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Label</label>
                  <input type="text" required value={editing.label || ""}
                    onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                    className="input text-xs py-2" placeholder="Center Display" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">X Position (%)</label>
                    <input type="number" value={editing.x ?? 50} min={0} max={100}
                      onChange={(e) => setEditing({ ...editing, x: Number(e.target.value) })}
                      className="input text-xs py-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Y Position (%)</label>
                    <input type="number" value={editing.y ?? 40} min={0} max={100}
                      onChange={(e) => setEditing({ ...editing, y: Number(e.target.value) })}
                      className="input text-xs py-2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Rotation (degrees)</label>
                    <input type="number" value={editing.rotation ?? 0} min={-180} max={180}
                      onChange={(e) => setEditing({ ...editing, rotation: Number(e.target.value) })}
                      className="input text-xs py-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Car Scale (0.1–1)</label>
                    <input type="number" value={editing.carScale ?? 0.5} min={0.1} max={1} step={0.05}
                      onChange={(e) => setEditing({ ...editing, carScale: Number(e.target.value) })}
                      className="input text-xs py-2" />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input type="checkbox" checked={editing.isActive ?? true}
                    onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                    className="w-4 h-4 accent-purple-500" />
                  <span className="text-xs font-bold">Active</span>
                </label>
                <button type="submit" disabled={saving}
                  className="btn-primary w-full justify-center gap-1.5 text-xs py-3 mt-4">
                  <Save size={14} /> {saving ? "Saving..." : "Save Position"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
