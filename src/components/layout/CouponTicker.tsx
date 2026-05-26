"use client";
import { useState, useEffect } from "react";
import { getAvailableCoupons } from "@/lib/firebase/firestore";
import { Coupon } from "@/lib/types";

export function CouponTicker() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    getAvailableCoupons()
      .then(setCoupons)
      .catch(console.error);
  }, []);

  if (coupons.length === 0) return null;

  return (
    <div className="sticky top-[88px] lg:top-[80px] z-40 bg-black border-y-2 border-white overflow-hidden h-10 flex items-center">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...coupons, ...coupons].map((c, i) => (
          <span key={`${c.id}-${i}`} className="inline-flex items-center px-6 text-sm font-medium text-white">
            <span className="font-bold tracking-wider">{c.code}</span>
            {c.description && (
              <span className="ml-2 text-white/70">— {c.description}</span>
            )}
            <span className="ml-6 text-white/30">//</span>
          </span>
        ))}
      </div>
    </div>
  );
}
