"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Category } from "@/lib/types";
import { Tag } from "lucide-react";

const DEFAULT_CATEGORIES = [
  { id: "1", name: "Fashion",      slug: "fashion",      isActive: true },
  { id: "2", name: "Electronics",  slug: "electronics",  isActive: true },
  { id: "3", name: "Beauty",       slug: "beauty",       isActive: true },
  { id: "4", name: "Home & Living",slug: "home",         isActive: true },
  { id: "5", name: "Sports",       slug: "sports",       isActive: true },
  { id: "6", name: "Accessories",  slug: "accessories",  isActive: true },
];

export function CategoriesSection({ categories }: { categories: Category[] }) {
  const displayCats = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <section className="section-padding">
      <div className="container-lg">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-black mb-8 text-center"
        >
          <span className="gradient-text">Shop by Category</span>
        </motion.h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {displayCats.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl card text-center group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: "linear-gradient(135deg,rgba(147,51,234,0.15),rgba(251,191,36,0.08))",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Tag size={20} className="text-amber-400" />
                </div>
                <span className="text-xs font-semibold leading-tight" style={{ color: "var(--text-secondary)" }}>
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
