"use client";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { Product } from "@/lib/types";
import { getAllProducts } from "@/lib/firebase/firestore";
import { useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { label: "Newest First",     value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated",        value: "rating" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState(categoryParam);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(products.map((p) => p.category))].filter(Boolean);

  const filtered = products
    .filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = !category || p.category === category;
      const price = p.discountedPrice ?? p.price;
      const matchPrice = price >= priceRange[0] && price <= priceRange[1];
      return matchSearch && matchCat && matchPrice;
    })
    .sort((a, b) => {
      if (sort === "price_asc") return (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price);
      if (sort === "price_desc") return (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price);
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="container-lg py-10">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-4xl font-black gradient-text" style={{ fontFamily: "Playfair Display,serif" }}>
          {category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {loading ? "Loading…" : `${filtered.length} products found`}
        </p>
      </div>

      {/* Search + controls bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="input pl-9 text-sm"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} style={{ color: "var(--text-muted)" }} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input text-sm pr-8 appearance-none cursor-pointer"
            style={{ minWidth: 160 }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} style={{ background: "var(--bg-card)" }}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
        </div>

        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="btn-outline text-sm flex items-center gap-2"
        >
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      {/* Filter chips */}
      {filtersOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mb-6 p-4 rounded-2xl overflow-hidden"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Filter by Category</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("")}
              className={`badge text-xs py-1.5 px-3 cursor-pointer transition-all ${!category ? "badge-purple" : "badge-purple opacity-50"}`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c === category ? "" : c)}
                className={`badge text-xs py-1.5 px-3 cursor-pointer transition-all ${category === c ? "badge-gold" : "badge-purple opacity-50"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {loading
          ? [...Array(12)].map((_, i) => <ProductCardSkeleton key={i} />)
          : filtered.length > 0
            ? filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
            : (
              <div className="col-span-full py-20 text-center">
                <p className="text-4xl mb-4">🔍</p>
                <p className="font-semibold text-lg">No products found</p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Try a different search or filter</p>
                <button onClick={() => { setSearch(""); setCategory(""); }} className="btn-outline text-sm mt-4">Clear filters</button>
              </div>
            )
          }
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container-lg py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
