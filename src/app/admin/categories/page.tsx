"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { getAllCategoriesAdmin, saveCategory, deleteCategory } from "@/lib/firebase/firestore";
import { Category } from "@/lib/types";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadCategories = () => {
    setLoading(true);
    getAllCategoriesAdmin()
      .then((data) => setCategories(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateForm = () => {
    setEditingCategory({
      name: "",
      slug: "",
      icon: "default",
      isActive: true,
      store: "miaksaaa",
    });
    setFormOpen(true);
  };

  const openEditForm = (c: Category) => {
    setEditingCategory(c);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Category?")) return;
    try {
      await deleteCategory(id);
      toast.success("Category vaporized successfully");
      loadCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!editingCategory.name || !editingCategory.slug) {
      toast.error("Name and Slug are required!");
      return;
    }

    setSaving(true);
    try {
      const submitData = {
        name: editingCategory.name,
        slug: editingCategory.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        icon: "default",
        isActive: !!editingCategory.isActive,
        store: editingCategory.store || "miaksaaa",
      };

      await saveCategory(editingCategory.id ?? null, submitData);
      toast.success("Category saved successfully!");
      setFormOpen(false);
      setEditingCategory(null);
      loadCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save category");
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
          <h1 className="text-3xl font-black gradient-text">
            Categories
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            List, update, and manage your product categories
          </p>
        </div>
        <button onClick={openCreateForm} className="btn-primary text-xs px-5 py-2.5 flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Add Category
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl border flex flex-col justify-between"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-purple-900/20 border border-purple-500/20">
                  <Tag size={18} className="text-amber-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{category.name}</h4>
                  <p className="text-xs text-purple-300/60">/{category.slug}</p>
                </div>
              </div>

                  <div className="flex items-center gap-2 text-xs border-t border-purple-500/5 pt-3">
                    <span className={`badge text-[9px] py-0.5 px-2 ${category.isActive ? "badge-green" : "badge-red"}`}>
                      {category.isActive ? "Live" : "Inactive"}
                    </span>
                    {(category.store || "miaksaaa") !== "all" && (
                      <span
                        className="badge text-[9px] py-0.5 px-2 font-bold"
                        style={{
                          background: (category.store || "miaksaaa") === "hotwheels" ? "rgba(255,68,0,0.15)" : "rgba(147,51,234,0.15)",
                          color: (category.store || "miaksaaa") === "hotwheels" ? "#FF6600" : "#a78bfa",
                        }}
                      >
                        {(category.store || "miaksaaa") === "hotwheels" ? "Hotwheels" : "MIAKSAAA"}
                      </span>
                    )}
                    {(category.store || "miaksaaa") === "all" && (
                      <span className="badge text-[9px] py-0.5 px-2 font-bold" style={{ background: "rgba(96,165,250,0.15)", color: "#60a5fa" }}>Both</span>
                    )}
                  </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-purple-500/5 pt-3 mt-4">
              <button onClick={() => openEditForm(category)} className="btn-ghost p-2 rounded-lg text-purple-300">
                <Edit2 size={13} />
              </button>
              <button onClick={() => handleDelete(category.id)} className="btn-ghost p-2 rounded-lg text-red-400">
                <Trash2 size={13} />
              </button>
            </div>
          </motion.div>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full p-20 border rounded-3xl text-center text-purple-300/40" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <Tag size={40} className="mx-auto text-purple-950 mb-3" />
            <p className="font-semibold text-sm">No Categories exist</p>
          </div>
        )}
      </div>

      {/* Drawer Form Modal */}
      <AnimatePresence>
        {formOpen && editingCategory && (
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
                  <h3 className="text-lg font-black gradient-text">
                    {editingCategory.id ? "Edit Category" : "Create Category"}
                  </h3>
                  <button onClick={() => setFormOpen(false)} className="p-1.5 rounded-lg text-purple-300/60 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <form className="space-y-4" onSubmit={handleFormSubmit}>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Category Name</label>
                    <input
                      type="text"
                      required
                      value={editingCategory.name || ""}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, "-");
                        setEditingCategory({ ...editingCategory, name, slug: editingCategory.id ? editingCategory.slug : slug });
                      }}
                      className="input text-xs py-2"
                      placeholder="e.g. Fashion"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Slug URL</label>
                    <input
                      type="text"
                      required
                      value={editingCategory.slug || ""}
                      onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                      className="input text-xs py-2"
                      placeholder="e.g. fashion"
                    />
                  </div>


                  {/* Store Assignment */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Store</label>
                    <div className="flex gap-2">
                      {(["miaksaaa", "hotwheels", "all"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setEditingCategory({ ...editingCategory, store: s })}
                          className={`flex-1 p-2.5 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer ${
                            (editingCategory.store || "miaksaaa") === s
                              ? s === "hotwheels"
                                ? "border-amber-500 bg-amber-500/10 text-amber-400"
                                : "border-purple-500 bg-purple-500/10 text-purple-300"
                              : "border-transparent bg-purple-950/20 opacity-60 hover:opacity-100 text-purple-400"
                          }`}
                        >
                          {s === "all" ? "Both" : s === "miaksaaa" ? "MIAKSAAA" : "Hotwheels"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className="p-4 rounded-2xl flex items-center justify-between border" style={{ background: "rgba(147,51,234,0.03)", borderColor: "var(--border)" }}>
                    <div>
                      <h5 className="text-xs font-bold text-white">Live Visibility</h5>
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Visible on homepage and shop</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={editingCategory.isActive ?? true}
                      onChange={(e) => setEditingCategory({ ...editingCategory, isActive: e.target.checked })}
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
                  {saving ? "Deploying..." : "Commit Category"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
