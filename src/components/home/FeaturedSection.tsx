"use client";
import { motion } from "framer-motion";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { Product } from "@/lib/types";

interface FeaturedSectionProps {
  title: string;
  products: Product[];
  badge?: string;
  loading?: boolean;
  snap?: boolean;
}

export function FeaturedSection({ title, products, badge, loading, snap = true }: FeaturedSectionProps) {
  if (!loading && products.length === 0) return null;

  return (
    <section className="section-padding" {...(snap && { "data-snap": "" })}>
      <div className="container-lg">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-2"
            >
              {badge && <span className="badge badge-gold">{badge}</span>}
              <div className="h-px w-12 rounded" style={{ background: "linear-gradient(90deg,#9333ea,transparent)" }} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              <span className="gradient-text">{title}</span>
            </motion.h2>
          </div>
          <motion.a
            href="/products"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="btn-ghost text-sm hidden sm:flex"
            style={{ color: "var(--purple-300)" }}
          >
            View All →
          </motion.a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {loading
            ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((p, i) => <ProductCard key={p.id} product={p} index={i} priority={i < 4} />)
          }
        </div>
      </div>
    </section>
  );
}
