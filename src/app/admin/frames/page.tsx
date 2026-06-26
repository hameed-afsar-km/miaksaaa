"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, Save, X, Search, Eye, EyeOff, Frame as FrameIcon,
} from "lucide-react";
import {
  getAllFrameProducts,
  addFrameProduct,
  updateFrameProduct,
  deleteFrameProduct,
  getAllFramePositions,
  getAllFrameBackgrounds,
  getAllFrameSizes,
} from "@/lib/firebase/firestore";
import { FrameProduct, FramePosition, FrameBackground, FrameSize } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";
import { ImageUploadZone } from "@/components/admin/ImageUploadZone";

export default function AdminFrameProductsPage() {
  const [frameProducts, setFrameProducts] = useState<FrameProduct[]>([]);
  const [positions, setPositions] = useState<FramePosition[]>([]);
  const [backgrounds, setBackgrounds] = useState<FrameBackground[]>([]);
  const [sizes, setSizes] = useState<FrameSize[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<FrameProduct> | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      getAllFrameProducts().catch(() => []),
      getAllFramePositions().catch(() => []),
      getAllFrameBackgrounds().catch(() => []),
      getAllFrameSizes().catch(() => []),
    ]).then(([fp, pos, bg, sz]) => {
      setFrameProducts(fp);
      setPositions(pos);
      setBackgrounds(bg);
      setSizes(sz);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing({
      title: "", description: "", images: [""], basePrice: 0,
      stock: 1, isVisible: true, isFeatured: false,
      enabledPositionIds: [], enabledBackgroundIds: [], enabledSizeIds: [],
    });
    setFormOpen(true);
  };

  const openEdit = (p: FrameProduct) => {
    setEditing({ ...p });
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this frame product?")) return;
    try {
      await deleteFrameProduct(id);
      toast.success("Frame deleted");
      load();
    } catch { toast.error("Failed to delete"); }
  };

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !editing.title) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const data: any = {
        title: editing.title,
        description: editing.description ?? "",
        images: (editing.images ?? []).filter((u) => u.trim()),
        basePrice: Number(editing.basePrice),
        discountedPrice: editing.discountedPrice ? Number(editing.discountedPrice) : null,
        stock: Number(editing.stock),
        isVisible: !!editing.isVisible,
        isFeatured: !!editing.isFeatured,
        enabledPositionIds: editing.enabledPositionIds ?? [],
        enabledBackgroundIds: editing.enabledBackgroundIds ?? [],
        enabledSizeIds: editing.enabledSizeIds ?? [],
      };

      if (editing.id) {
        await updateFrameProduct(editing.id, data);
        toast.success("Frame updated");
      } else {
        await addFrameProduct(data);
        toast.success("Frame created");
      }
      setFormOpen(false);
      setEditing(null);
      load();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const filtered = frameProducts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "Playfair Display, serif" }}>
            Frame Products
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            Manage custom frame designs
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary text-xs px-5 py-2.5 flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> New Frame
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/40" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search frames..." className="input pl-11 text-sm" />
      </div>

      <div className="rounded-3xl border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                <th className="p-4 text-purple-300/60 font-bold uppercase">Frame</th>
                <th className="p-4 text-purple-300/60 font-bold uppercase text-right">Base Price</th>
                <th className="p-4 text-purple-300/60 font-bold uppercase text-center">Stock</th>
                <th className="p-4 text-purple-300/60 font-bold uppercase text-center">Positions</th>
                <th className="p-4 text-purple-300/60 font-bold uppercase text-center">BGs</th>
                <th className="p-4 text-purple-300/60 font-bold uppercase text-center">Sizes</th>
                <th className="p-4 text-purple-300/60 font-bold uppercase text-center">Live</th>
                <th className="p-4 text-purple-300/60 font-bold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/5">
              {filtered.map((fp) => (
                <tr key={fp.id} className="hover:bg-purple-950/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-950/20 border border-purple-500/10 overflow-hidden relative flex-shrink-0">
                        {fp.images[0] && <Image src={fp.images[0]} alt={fp.title} fill className="object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-white truncate max-w-[200px]">{fp.title}</h4>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-bold text-white">
                    {formatPrice(fp.discountedPrice ?? fp.basePrice)}
                  </td>
                  <td className="p-4 text-center font-bold">{fp.stock}</td>
                  <td className="p-4 text-center" style={{ color: "var(--text-muted)" }}>{fp.enabledPositionIds?.length ?? 0}</td>
                  <td className="p-4 text-center" style={{ color: "var(--text-muted)" }}>{fp.enabledBackgroundIds?.length ?? 0}</td>
                  <td className="p-4 text-center" style={{ color: "var(--text-muted)" }}>{fp.enabledSizeIds?.length ?? 0}</td>
                  <td className="p-4 text-center">
                    {fp.isVisible ? <Eye size={14} style={{ color: "#4ade80" }} /> : <EyeOff size={14} style={{ color: "#fca5a5" }} />}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(fp)} className="btn-ghost p-2 rounded-lg text-purple-300">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDelete(fp.id)} className="btn-ghost p-2 rounded-lg text-red-400">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="p-10 text-center text-purple-300/40">No frame products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Drawer */}
      <AnimatePresence>
        {formOpen && editing && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setFormOpen(false)} className="absolute inset-0 bg-black" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="relative w-full max-w-xl h-full bg-[#120a24] border-l border-purple-500/25 shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: "var(--border)" }}>
                  <h3 className="text-lg font-black gradient-text" style={{ fontFamily: "Playfair Display, serif" }}>
                    {editing.id ? "Edit Frame" : "New Frame"}
                  </h3>
                  <button onClick={() => setFormOpen(false)} className="p-1.5 rounded-lg text-purple-300/60 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Title</label>
                    <input type="text" required value={editing.title || ""}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      className="input text-xs py-2" placeholder="Modern Display Frame" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Description</label>
                    <textarea rows={3} value={editing.description || ""}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      className="input text-xs resize-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Base Price (₹)</label>
                      <input type="number" required value={editing.basePrice ?? ""}
                        onChange={(e) => setEditing({ ...editing, basePrice: Number(e.target.value) })}
                        className="input text-xs py-2" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Discounted Price (₹)</label>
                      <input type="number" value={editing.discountedPrice ?? ""}
                        onChange={(e) => setEditing({ ...editing, discountedPrice: e.target.value ? Number(e.target.value) : undefined })}
                        className="input text-xs py-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Stock</label>
                      <input type="number" value={editing.stock ?? ""}
                        onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })}
                        className="input text-xs py-2" min="0" />
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editing.isVisible ?? true}
                          onChange={(e) => setEditing({ ...editing, isVisible: e.target.checked })}
                          className="w-4 h-4 accent-purple-500" />
                        <span className="text-xs font-bold">Visible on site</span>
                      </label>
                    </div>
                  </div>

                  {/* Images */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Frame Images</label>
                    <ImageUploadZone images={editing.images ?? []}
                      onChange={(imgs) => setEditing({ ...editing, images: imgs })} />
                  </div>

                  {/* Positions */}
                  <div className="p-4 rounded-2xl border" style={{ background: "rgba(147,51,234,0.03)", borderColor: "var(--border)" }}>
                    <h5 className="text-xs font-bold text-white mb-2">Available Positions</h5>
                    {positions.length === 0 ? (
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        No positions defined. Create them in the Positions section first.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {positions.map((pos) => (
                          <label key={pos.id} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all"
                            style={{
                              background: (editing.enabledPositionIds ?? []).includes(pos.id) ? "rgba(147,51,234,0.15)" : "rgba(255,255,255,0.03)",
                              border: "1px solid",
                              borderColor: (editing.enabledPositionIds ?? []).includes(pos.id) ? "rgba(147,51,234,0.4)" : "var(--border)",
                            }}>
                            <input type="checkbox" checked={(editing.enabledPositionIds ?? []).includes(pos.id)}
                              onChange={() => setEditing({ ...editing, enabledPositionIds: toggleArray(editing.enabledPositionIds ?? [], pos.id) })}
                              className="w-3.5 h-3.5 accent-purple-500" />
                            <span className="text-xs font-bold">{pos.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Backgrounds */}
                  <div className="p-4 rounded-2xl border" style={{ background: "rgba(147,51,234,0.03)", borderColor: "var(--border)" }}>
                    <h5 className="text-xs font-bold text-white mb-2">Available Backgrounds</h5>
                    {backgrounds.length === 0 ? (
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        No backgrounds defined. Create them in the Backgrounds section first.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {backgrounds.map((bg) => (
                          <label key={bg.id} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all"
                            style={{
                              background: (editing.enabledBackgroundIds ?? []).includes(bg.id) ? "rgba(147,51,234,0.15)" : "rgba(255,255,255,0.03)",
                              border: "1px solid",
                              borderColor: (editing.enabledBackgroundIds ?? []).includes(bg.id) ? "rgba(147,51,234,0.4)" : "var(--border)",
                            }}>
                            <input type="checkbox" checked={(editing.enabledBackgroundIds ?? []).includes(bg.id)}
                              onChange={() => setEditing({ ...editing, enabledBackgroundIds: toggleArray(editing.enabledBackgroundIds ?? [], bg.id) })}
                              className="w-3.5 h-3.5 accent-purple-500" />
                            <span className="text-xs font-bold">{bg.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sizes */}
                  <div className="p-4 rounded-2xl border" style={{ background: "rgba(147,51,234,0.03)", borderColor: "var(--border)" }}>
                    <h5 className="text-xs font-bold text-white mb-2">Available Sizes</h5>
                    {sizes.length === 0 ? (
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        No sizes defined. Create them in the Sizes section first.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {sizes.map((sz) => (
                          <label key={sz.id} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all"
                            style={{
                              background: (editing.enabledSizeIds ?? []).includes(sz.id) ? "rgba(147,51,234,0.15)" : "rgba(255,255,255,0.03)",
                              border: "1px solid",
                              borderColor: (editing.enabledSizeIds ?? []).includes(sz.id) ? "rgba(147,51,234,0.4)" : "var(--border)",
                            }}>
                            <input type="checkbox" checked={(editing.enabledSizeIds ?? []).includes(sz.id)}
                              onChange={() => setEditing({ ...editing, enabledSizeIds: toggleArray(editing.enabledSizeIds ?? [], sz.id) })}
                              className="w-3.5 h-3.5 accent-purple-500" />
                            <span className="text-xs font-bold">{sz.label} ({sz.width}×{sz.height})</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </form>
              </div>

              <div className="flex gap-3 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <button type="button" onClick={() => setFormOpen(false)}
                  className="btn-outline flex-1 py-3 text-xs justify-center cursor-pointer">Cancel</button>
                <button type="button" onClick={handleSubmit} disabled={saving}
                  className="btn-primary flex-1 py-3 text-xs justify-center gap-1.5 cursor-pointer">
                  <Save size={14} /> {saving ? "Saving..." : "Save Frame"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
