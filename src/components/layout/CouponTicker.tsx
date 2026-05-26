"use client";
import { useRef, useState, useEffect } from "react";
import { getAvailableCoupons } from "@/lib/firebase/firestore";
import { Coupon } from "@/lib/types";
import gsap from "gsap";
import { Sparkles } from "lucide-react";

export function CouponTicker() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    getAvailableCoupons()
      .then(setCoupons)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (coupons.length === 0 || !trackRef.current) return;

    animRef.current = gsap.to(trackRef.current, {
      xPercent: -50,
      duration: 45,
      ease: "none",
      repeat: -1,
    });

    return () => {
      animRef.current?.kill();
    };
  }, [coupons]);

  if (coupons.length === 0) return null;

  return (
    <div 
      className="sticky top-0 z-50 overflow-hidden h-12 flex items-center"
      style={{
        background: "linear-gradient(90deg, rgba(147,51,234,0.15), rgba(251,191,36,0.08), rgba(147,51,234,0.15))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(147,51,234,0.2)",
      }}
    >
      {/* Left fade gradient */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none z-10"
        style={{
          background: "linear-gradient(90deg, rgba(147,51,234,0.15) 0%, transparent 100%)",
          backdropFilter: "blur(16px)",
        }}
      />

      {/* Scrolling track */}
      <div ref={trackRef} className="flex whitespace-nowrap">
        {[...coupons, ...coupons].map((c, i) => (
          <div key={`${c.id}-${i}`} className="inline-flex items-center gap-2 px-8 shrink-0">
            <Sparkles size={14} style={{ color: "var(--purple-300)" }} className="flex-shrink-0" />
            <span className="font-bold tracking-wider text-sm text-white">{c.code}</span>
            {c.description && (
              <span className="text-xs text-white/50 ml-2">{c.description}</span>
            )}
            <span className="text-white/30 mx-4">•</span>
          </div>
        ))}
      </div>

      {/* Right fade gradient */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-10"
        style={{
          background: "linear-gradient(270deg, rgba(147,51,234,0.15) 0%, transparent 100%)",
          backdropFilter: "blur(16px)",
        }}
      />
    </div>
  );
}
