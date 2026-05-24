"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  ArrowRight,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { getAllBanners, saveBanner, deleteBanner } from "@/lib/firebase/firestore";
import { Banner } from "@/lib/types";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadBanners = () => {
    setLoading(true);
    getAllBanners()
      .then((data) => {
        // Order by the order property
        setBanners(data.sort((a, b) => a.order - b.order));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openCreateForm = () => {
    setEditingBanner({
      title: "",
      subtitle: "",
      imageUrl: "",
      ctaText: "Discover Now",
      ctaLink: "/products",
      ctaColor: "#fbbf24",
      bgColor: "#120a24",
      promoTag: "",
      highlightLabel: "",
      isActive: true,
      order: banners.length + 1,
    });
    setFormOpen(true);
  };

  const openEditForm = (b: Banner) => {
    setEditingBanner(b);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Hero Banner slide?")) return;
    try {
      await deleteBanner(id);
      toast.success("Banner slide vaporized successfully");
      loadBanners();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete banner");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    if (!editingBanner.title || !editingBanner.imageUrl) {
      toast.error("Title and Image URL are required!");
      return;
    }

    setSaving(true);
    try {
      const submitData = {
        title: editingBanner.title,
        subtitle: editingBanner.subtitle ?? "",
        imageUrl: editingBanner.imageUrl,
        ctaText: editingBanner.ctaText ?? "Discover Now",
        ctaLink: editingBanner.ctaLink ?? "/products",
        ctaColor: editingBanner.ctaColor ?? "#fbbf24",
        bgColor: editingBanner.bgColor ?? "#120a24",
        promoTag: editingBanner.promoTag ?? "",
        highlightLabel: editingBanner.highlightLabel ?? "",
        isActive: !!editingBanner.isActive,
        order: Number(editingBanner.order ?? 1),
      };

      await saveBanner(editingBanner.id ?? null, submitData);
      toast.success("Hero slide saved successfully!");
      setFormOpen(false);
      setEditingBanner(null);
      loadBanners();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save banner slide");
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
            Homepage Sliders
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            List, update, and manage your premium homepage Hero slides
          </p>
        </div>
        <button onClick={openCreateForm} className="btn-primary text-xs px-5 py-2.5 flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Add Hero Slide
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl border flex flex-col justify-between overflow-hidden relative"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-purple-950/20 relative border border-purple-500/10">
                {banner.imageUrl && (
                  <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  {banner.promoTag && <span className="badge badge-gold self-start text-[8px] py-0.5 px-1.5 font-bold mb-1">{banner.promoTag}</span>}
                  <h4 className="text-sm font-bold text-white leading-tight truncate">{banner.title}</h4>
                  <p className="text-[10px] text-purple-200 truncate">{banner.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs border-t border-purple-500/5 pt-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-purple-300/40">Sequence: #{banner.order}</span>
                <span className={`badge text-[9px] py-0.5 px-2 ${banner.isActive ? "badge-green" : "badge-red"}`}>
                  {banner.isActive ? "Live" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-purple-500/5 pt-3 mt-4">
              <button onClick={() => openEditForm(banner)} className="btn-ghost p-2 rounded-lg text-purple-300">
                <Edit2 size={13} />
              </button>
              <button onClick={() => handleDelete(banner.id)} className="btn-ghost p-2 rounded-lg text-red-400">
                <Trash2 size={13} />
              </button>
            </div>
          </motion.div>
        ))}

        {banners.length === 0 && (
          <div className="col-span-full p-20 border rounded-3xl text-center text-purple-300/40" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <ImageIcon size={40} className="mx-auto text-purple-950 mb-3" />
            <p className="font-semibold text-sm">No Hero Banner slides exist</p>
          </div>
        )}
      </div>

      {/* Drawer Form Modal */}
      <AnimatePresence>
        {formOpen && editingBanner && (
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
                    {editingBanner.id ? "Edit Slide Entry" : "Create Slide Entry"}
                  </h3>
                  <button onClick={() => setFormOpen(false)} className="p-1.5 rounded-lg text-purple-300/60 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <form className="space-y-4" onSubmit={handleFormSubmit}>
                  {/* Title & Subtitle */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Headline title</label>
                    <input
                      type="text"
                      required
                      value={editingBanner.title || ""}
                      onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                      className="input text-xs py-2"
                      placeholder="SPRING EXCLUSIVES"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={editingBanner.subtitle || ""}
                      onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                      className="input text-xs py-2"
                      placeholder="Reductions of up to 40% on luxury bags"
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Slide Image URL</label>
                    <input
                      type="text"
                      required
                      value={editingBanner.imageUrl || ""}
                      onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                      className="input text-xs py-2"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>

                  {/* CTA Text & Link */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">CTA Label</label>
                      <input
                        type="text"
                        value={editingBanner.ctaText || "Discover Now"}
                        onChange={(e) => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                        className="input text-xs py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">CTA Link Route</label>
                      <input
                        type="text"
                        value={editingBanner.ctaLink || "/products"}
                        onChange={(e) => setEditingBanner({ ...editingBanner, ctaLink: e.target.value })}
                        className="input text-xs py-2"
                      />
                    </div>
                  </div>

                  {/* Sequence, Promo tags */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Sequence Order</label>
                      <input
                        type="number"
                        value={editingBanner.order ?? 1}
                        onChange={(e) => setEditingBanner({ ...editingBanner, order: Number(e.target.value) })}
                        className="input text-xs py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Promo Badge</label>
                      <input
                        type="text"
                        value={editingBanner.promoTag || ""}
                        onChange={(e) => setEditingBanner({ ...editingBanner, promoTag: e.target.value })}
                        className="input text-xs py-2"
                        placeholder="LIMITED OFFER"
                      />
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className="p-4 rounded-2xl flex items-center justify-between border" style={{ background: "rgba(147,51,234,0.03)", borderColor: "var(--border)" }}>
                    <div>
                      <h5 className="text-xs font-bold text-white">Live Visibility</h5>
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Visible on homepage main slider</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={editingBanner.isActive ?? true}
                      onChange={(e) => setEditingBanner({ ...editingBanner, isActive: e.target.checked })}
                      className="w-4 h-4 cursor-pointer accent-purple-500"
                    />
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
                  {saving ? "Deploying..." : "Commit Slide"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
