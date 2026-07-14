"use client";
import React from "react";
import { Flame, Timer } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/lib/types";
import { useEffect, useState } from "react";

function useCountdown(targetDate?: Date) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = targetDate ?? new Date(Date.now() + 24 * 3600 * 1000);
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black"
        style={{
          background: "linear-gradient(135deg,#9333ea,#7e22ce)",
          boxShadow: "0 0 16px rgba(147,51,234,0.5)",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[10px] mt-1 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{label}</span>
    </div>
  );
}

function CountdownTimer({ targetDate }: { targetDate?: Date }) {
  const { h, m, s } = useCountdown(targetDate);
  return (
    <div className="flex items-center gap-3">
      <Timer size={16} style={{ color: "var(--text-muted)" }} />
      <span className="text-sm" style={{ color: "var(--text-muted)" }}>Ends in:</span>
      <div className="flex gap-2">
        <TimeBox value={h} label="Hrs" />
        <span className="text-2xl font-black self-start mt-2" style={{ color: "var(--purple-400)" }}>:</span>
        <TimeBox value={m} label="Min" />
        <span className="text-2xl font-black self-start mt-2" style={{ color: "var(--purple-400)" }}>:</span>
        <TimeBox value={s} label="Sec" />
      </div>
    </div>
  );
}

const MemoizedProductCard = React.memo(ProductCard, (prev, next) =>
  prev.product.id === next.product.id && prev.priority === next.priority
);

export function FlashSaleSection({ products, targetDate }: { products: Product[], targetDate?: Date }) {
  if (products.length === 0) return null;

  return (
    <section className="section-padding" style={{ background: "var(--bg-card)" }} data-snap>
      <div className="container-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame size={20} style={{ color: "#ef4444" }} />
              <span className="badge badge-red">Flash Sale</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "Playfair Display,serif" }}>
              <span className="gradient-text">Hot Deals</span>
            </h2>
          </div>

          {/* Countdown — isolated from product grid re-renders */}
          <CountdownTimer targetDate={targetDate} />
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.slice(0, 8).map((p, i) => (
            <MemoizedProductCard key={p.id} product={p} index={i} priority={i < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
