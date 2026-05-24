"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Category } from "@/lib/types";

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

        {/* Centered pill-style text buttons, one after another */}
        <div className="flex flex-wrap justify-center gap-3">
          {displayCats.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg,rgba(147,51,234,0.12),rgba(251,191,36,0.07))",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(147,51,234,0.5)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--purple-300)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
                }}
              >
                {cat.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
