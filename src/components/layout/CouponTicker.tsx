"use client";
import { useState, useEffect } from "react";
import { getAvailableCoupons } from "@/lib/firebase/firestore";
import { Coupon } from "@/lib/types";
import { Sparkles, Ticket, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

export function CouponTicker() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    getAvailableCoupons()
      .then(setCoupons)
      .catch(console.error);
  }, []);

  // Ensure the list is long enough and duplicate it for a seamless loop
  const minItemsNeeded = 10;
  let baseList = [...coupons];

  if (baseList.length > 0) {
    while (baseList.length < minItemsNeeded) {
      baseList = [...baseList, ...coupons];
    }
  }
  const scrollingItems = [...baseList, ...baseList];

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied!`, {
      icon: "🎉",
      id: "coupon-copy-toast", // Prevent duplicate toasts
      style: {
        background: "var(--bg-card)",
        color: "var(--text-primary)",
        border: "1px solid var(--purple-500)",
      }
    });
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  if (coupons.length === 0) return null;

  return (
    <div
      className="sticky top-0 z-[60] overflow-hidden h-12 flex items-center select-none"
      style={{
        background: "rgba(10, 6, 20, 0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(147, 51, 234, 0.2)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Moving gradient highlighter border at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-purple-500 via-gold-400 to-purple-500 opacity-60 animate-rotate-gradient" />

      {/* Luxury fade-out mask edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none z-10"
        style={{
          background: "linear-gradient(90deg, rgba(10, 6, 20, 1) 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-10"
        style={{
          background: "linear-gradient(270deg, rgba(10, 6, 20, 1) 0%, transparent 100%)",
        }}
      />

      {/* Scrolling Track - CSS marquee replaces GSAP */}
      <div
        className="flex items-center whitespace-nowrap gap-6 pl-4"
        style={{
          animation: paused ? "none" : "marquee 50s linear infinite",
          willChange: "transform",
        }}
      >
        {scrollingItems.map((c, i) => (
          <div key={`${c.id}-${i}`} className="inline-flex items-center gap-6 shrink-0">
            {/* Elegant Divider Sparkle */}
            <div className="flex items-center opacity-40 text-purple-300 select-none">
              <Sparkles size={11} className="animate-pulse" />
            </div>

            {/* Redesigned Coupon Ticket Card */}
            <div
              onClick={() => copyToClipboard(c.code)}
              className="relative flex items-center h-8 bg-purple-950/20 hover:bg-[#1a0e38] border border-purple-500/25 hover:border-gold-400/40 rounded-lg pl-3 pr-2.5 cursor-pointer transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:shadow-[0_0_12px_rgba(251,191,36,0.18)] group active:scale-95"
            >
              {/* Notches in the sides to make it look like a ticket */}
              <div className="absolute -left-[4px] top-1/2 -translate-y-1/2 w-[7px] h-[7px] bg-[#0a0614] rounded-full border-r border-purple-500/25" />
              <div className="absolute -right-[4px] top-1/2 -translate-y-1/2 w-[7px] h-[7px] bg-[#0a0614] rounded-full border-l border-purple-500/25" />

              {/* Discount Amount */}
              <div className="flex items-center gap-1.5 z-10">
                <Ticket className="w-3.5 h-3.5 text-gold-400 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-[10px] font-black tracking-wider text-gold-400 uppercase select-none">
                  {c.type === 'percent' ? `${c.discount}% OFF` : `Flat ${formatPrice(c.discount)}`}
                </span>
              </div>

              {/* Dash separator inside the ticket */}
              <div className="h-4 border-l border-dashed border-white/20 mx-2.5 z-10" />

              {/* Code string & Copy icon */}
              <div className="flex items-center gap-1.5 z-10">
                <span className="font-mono text-[10px] font-bold text-white tracking-widest bg-white/5 px-1.5 py-0.5 rounded border border-white/10 uppercase group-hover:bg-white/10 transition-colors">
                  {c.code}
                </span>
                {c.description && (
                  <span className="text-[9px] text-white/50 max-w-[140px] truncate hidden md:inline font-medium">
                    {c.description}
                  </span>
                )}

                {/* Micro Action Button */}
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 text-purple-300 transition-colors ml-0.5">
                  {copiedCode === c.code ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 text-purple-300 group-hover:text-gold-300" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

