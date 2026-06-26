"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Frame, Flame, ArrowRight, ShoppingBag } from "lucide-react";
import { getVisibleFrameProducts } from "@/lib/firebase/firestore";
import { FrameProduct } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function FramesListingPage() {
  const [frames, setFrames] = useState<FrameProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVisibleFrameProducts()
      .then(setFrames)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "#0D0200", minHeight: "100vh" }}>
      <div className="container-lg py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Frame size={20} style={{ color: "#FF4400" }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#FF6600" }}>
              Custom Framing
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-3"
            style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
            FRAME YOUR <span style={{ color: "#FF4400" }}>DIE-CAST</span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#cc9980" }}>
            Choose a frame design, then customize every detail — car, position, background, and size.
            Each piece is hand-assembled.
          </p>
        </div>

        {/* Frame Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl skeleton" />
            ))}
          </div>
        ) : frames.length === 0 ? (
          <div className="text-center py-20">
            <Frame size={48} className="mx-auto mb-4" style={{ color: "rgba(255,68,0,0.3)" }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: "#FFE0CC" }}>No frame designs yet</h3>
            <p className="text-sm" style={{ color: "#cc9980" }}>Frame products will appear here once added by the admin</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frames.map((frame) => (
              <Link key={frame.id} href={`/hotwheels/frames/${frame.id}`}
                className="group block rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(145deg, #1A0500, #2A0F00)",
                  borderColor: "rgba(255,68,0,0.12)",
                }}
              >
                {/* Frame image */}
                <div className="aspect-[4/3] relative overflow-hidden bg-[#0D0200]">
                  {frame.images[0] ? (
                    <Image src={frame.images[0]} alt={frame.title} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Frame size={48} style={{ color: "rgba(255,68,0,0.2)" }} />
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <span className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0"
                      style={{
                        background: "linear-gradient(135deg, #FF4400, #D32F2F)",
                        color: "#fff",
                      }}>
                      Customize <ArrowRight size={16} />
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-bold truncate" style={{ color: "#FFE0CC" }}>{frame.title}</h3>
                  {frame.description && (
                    <p className="text-xs line-clamp-2" style={{ color: "#cc9980" }}>{frame.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-black" style={{ color: "#FF4400" }}>
                      {formatPrice(frame.discountedPrice ?? frame.basePrice)}
                    </span>
                    {frame.discountedPrice && (
                      <span className="text-xs line-through" style={{ color: "#cc9980" }}>
                        {formatPrice(frame.basePrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
