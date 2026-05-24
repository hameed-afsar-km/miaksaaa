"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Save,
  X,
  Search,
  Filter,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllCategoriesAdmin,
} from "@/lib/firebase/firestore";
import { Product, Category } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";
import { ImageUploadZone } from "@/components/admin/ImageUploadZone";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [customCategoryActive, setCustomCategoryActive] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    Promise.all([
      getAllProducts().catch(() => []),
      getAllCategoriesAdmin().catch(() => []),
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData);
        setCategoriesList(categoriesData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateForm = () => {
    setEditingProduct({
      title: "",
      description: "",
      price: 0,
      discountedPrice: undefined,
      images: [""],
      category: categoriesList[0]?.name || "",
      tags: [],
      stock: 10,
      isFeatured: false,
      isNew: true,
      isHot: false,
      isOnSale: false,
      isVisible: true,
      rating: 5,
      reviewCount: 1,
    });
    setCustomCategoryActive(categoriesList.length === 0);
    setFormOpen(true);
  };

  const openEditForm = (p: Product) => {
    setEditingProduct(p);
    const isCustom = p.category && !categoriesList.some(c => c.name.toLowerCase() === p.category.toLowerCase());
    setCustomCategoryActive(isCustom || categoriesList.length === 0);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you absolutely sure you want to delete this luxury item?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product vaporized successfully");
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.title || !editingProduct.category) {
      toast.error("Title and Category are required!");
      return;
    }

    // Filter empty image URLs
    const cleanedImages = (editingProduct.images ?? []).filter((url) => url.trim() !== "");
    if (cleanedImages.length === 0) {
      toast.error("Add at least one valid image URL!");
      return;
    }

    setSaving(true);
    try {
      const submitData = {
        title: editingProduct.title,
        description: editingProduct.description ?? "",
        price: Number(editingProduct.price),
        discountedPrice: editingProduct.discountedPrice ? Number(editingProduct.discountedPrice) : undefined,
        images: cleanedImages,
        category: editingProduct.category,
        tags: editingProduct.tags ?? [],
        stock: Number(editingProduct.stock),
        isFeatured: !!editingProduct.isFeatured,
        isNew: !!editingProduct.isNew,
        isHot: !!editingProduct.isHot,
        isOnSale: !!editingProduct.isOnSale,
        isVisible: !!editingProduct.isVisible,
        rating: Number(editingProduct.rating ?? 5),
        reviewCount: Number(editingProduct.reviewCount ?? 1),
      };

      if (editingProduct.id) {
        await updateProduct(editingProduct.id, submitData);
        toast.success("Luxury product polished successfully");
      } else {
        await addProduct(submitData);
        toast.success("New luxury product created");
      }
      setFormOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product details");
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

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
            Product Catalog
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            List, update, and manage your premium product entries
          </p>
        </div>
        <button onClick={openCreateForm} className="btn-primary text-xs px-5 py-2.5 flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Introduce Product
        </button>
      </div>

      {/* Control bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter catalog by name or category..."
          className="input pl-11 text-sm"
        />
      </div>

      {/* Products table */}
      <div className="rounded-3xl border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                <th className="p-4 text-purple-300/60 font-bold uppercase">Product info</th>
                <th className="p-4 text-purple-300/60 font-bold uppercase">Category</th>
                <th className="p-4 text-purple-300/60 font-bold uppercase text-right">Price</th>
                <th className="p-4 text-purple-300/60 font-bold uppercase text-center">Stock</th>
                <th className="p-4 text-purple-300/60 font-bold uppercase text-center">Flags</th>
                <th className="p-4 text-purple-300/60 font-bold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/5">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-purple-950/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-950/20 border border-purple-500/10 overflow-hidden relative flex-shrink-0">
                        {product.images[0] && (
                          <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-white truncate max-w-[200px]">{product.title}</h4>
                        <span className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>ID: #{product.id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-purple-200 font-semibold">{product.category}</td>
                  <td className="p-4 text-right">
                    <p className="font-bold text-white">{formatPrice(product.discountedPrice ?? product.price)}</p>
                    {product.discountedPrice && (
                      <p className="text-[10px] line-through" style={{ color: "var(--text-muted)" }}>{formatPrice(product.price)}</p>
                    )}
                  </td>
                  <td className="p-4 text-center font-bold">
                    <span className={`px-2 py-0.5 rounded ${product.stock <= 5 ? "bg-red-500/10 text-red-300" : "bg-purple-500/10 text-purple-200"}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-1.5 flex-wrap max-w-[150px] mx-auto">
                      {product.isFeatured && <span className="badge badge-gold text-[8px] py-0.5 px-1.5 font-bold">Featured</span>}
                      {product.isNew && <span className="badge badge-purple text-[8px] py-0.5 px-1.5 font-bold">New</span>}
                      {product.isHot && <span className="badge badge-red text-[8px] py-0.5 px-1.5 font-bold">Hot</span>}
                      {product.isVisible ? (
                        <span className="badge badge-green text-[8px] py-0.5 px-1.5 font-bold flex items-center gap-0.5"><Eye size={8} /> Live</span>
                      ) : (
                        <span className="badge badge-red text-[8px] py-0.5 px-1.5 font-bold flex items-center gap-0.5"><EyeOff size={8} /> Hidden</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditForm(product)} className="btn-ghost p-2 rounded-lg text-purple-300">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="btn-ghost p-2 rounded-lg text-red-400 hover:text-red-300">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-purple-300/40">No matching products found in catalog</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide drawer CRUD Form */}
      <AnimatePresence>
        {formOpen && editingProduct && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setFormOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="relative w-full max-w-xl h-full bg-[#120a24] border-l border-purple-500/25 shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: "var(--border)" }}>
                  <h3 className="text-lg font-black gradient-text" style={{ fontFamily: "Playfair Display, serif" }}>
                    {editingProduct.id ? "Edit Luxury Product" : "Introduce Luxury Product"}
                  </h3>
                  <button onClick={() => setFormOpen(false)} className="p-1.5 rounded-lg text-purple-300/60 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <form className="space-y-4" onSubmit={handleFormSubmit}>
                  {/* Title & Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.title || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                        className="input text-xs py-2"
                        placeholder="Luxury leather tote"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Category</label>
                      {!customCategoryActive ? (
                        <select
                          value={editingProduct.category || ""}
                          onChange={(e) => {
                            if (e.target.value === "__custom__") {
                              setCustomCategoryActive(true);
                              setEditingProduct({ ...editingProduct, category: "" });
                            } else {
                              setEditingProduct({ ...editingProduct, category: e.target.value });
                            }
                          }}
                          className="input text-xs py-2 appearance-none cursor-pointer pr-8"
                          style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                        >
                          <option value="" disabled style={{ backgroundColor: "#120a24" }}>Select Category...</option>
                          {categoriesList.map((cat) => (
                            <option key={cat.id} value={cat.name} style={{ backgroundColor: "#120a24" }}>
                              {cat.name}
                            </option>
                          ))}
                          <option value="__custom__" style={{ backgroundColor: "#120a24", color: "var(--gold-400)", fontWeight: "bold" }}>
                            + Add custom category...
                          </option>
                        </select>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={editingProduct.category || ""}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            className="input text-xs py-2 flex-1"
                            placeholder="Type custom category..."
                          />
                          {categoriesList.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setCustomCategoryActive(false);
                                setEditingProduct({ ...editingProduct, category: categoriesList[0]?.name || "" });
                              }}
                              className="px-3 border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-purple-300 text-[10px] font-bold rounded-xl"
                            >
                              List
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Stock Units</label>
                      <input
                        type="number"
                        required
                        value={editingProduct.stock ?? 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                        className="input text-xs py-2"
                        placeholder="10"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="input text-xs resize-none"
                      placeholder="Crafted with pure full-grain Italian leather..."
                    />
                  </div>

                  {/* Price breakdown */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Original Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={editingProduct.price ?? 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="input text-xs py-2"
                        placeholder="12000"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Discounted Price (₹)</label>
                      <input
                        type="number"
                        value={editingProduct.discountedPrice ?? ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            discountedPrice: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        className="input text-xs py-2"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  {/* Display tags */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Tags (Comma separated)</label>
                    <input
                      type="text"
                      value={(editingProduct.tags ?? []).join(", ")}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      className="input text-xs py-2"
                      placeholder="leather, premium, black"
                    />
                  </div>

                  {/* Product Images Drag & Drop / Upload */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">
                      Product Images
                    </label>
                    <ImageUploadZone
                      images={editingProduct.images ?? []}
                      onChange={(newImages) =>
                        setEditingProduct({ ...editingProduct, images: newImages })
                      }
                    />
                  </div>

                  {/* Flag Toggles */}
                  <div className="p-4 rounded-2xl space-y-3.5 border" style={{ background: "rgba(147,51,234,0.03)", borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-white">Live Visibility</h5>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Visible to public shoppers</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={editingProduct.isVisible ?? true}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isVisible: e.target.checked })}
                        className="w-4 h-4 cursor-pointer accent-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-purple-500/5 pt-3">
                      <div>
                        <h5 className="text-xs font-bold text-white">Featured Luxury</h5>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Show on home page grid</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={editingProduct.isFeatured ?? false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                        className="w-4 h-4 cursor-pointer accent-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-purple-500/5 pt-3">
                      <div>
                        <h5 className="text-xs font-bold text-white">New Arrivals</h5>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Affix premium 'New' tag</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={editingProduct.isNew ?? true}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                        className="w-4 h-4 cursor-pointer accent-purple-500"
                      />
                    </div>
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
                  {saving ? "Saving Changes..." : "Commit Item"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
