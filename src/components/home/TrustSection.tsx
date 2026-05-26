"use client";
import { motion } from "framer-motion";
import { Shield, Truck, RefreshCw, Headphones, CreditCard, Star } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Truck,       title: "Free Delivery",    desc: "On orders above ₹499",         accent: "#a855f7" },
  { icon: Shield,      title: "Secure Payments",  desc: "100% safe & protected",         accent: "#22c55e" },
  { icon: RefreshCw,   title: "Easy Returns",     desc: "7-day hassle-free return",      accent: "#ec4899" },
  { icon: Headphones,  title: "24/7 Support",     desc: "Always here to help you",       accent: "#eab308" },
  { icon: CreditCard,  title: "Cash On Delivery", desc: "Pay when you receive it",       accent: "#3b82f6" },
  { icon: Star,        title: "Premium Quality",  desc: "Curated luxury products",       accent: "#f97316" },
];

export function TrustSection() {
  return (
    <section className="py-14 md:py-16 relative overflow-hidden bg-[#0a0614]">
      {/* Dynamic ambient lights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-purple-900/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-900/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact Centered Header */}
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-purple-400 mb-2"
          >
            Our Commitment
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-white"
          >
            Why Choose{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              MIAKSAAA
            </span>
            ?
          </motion.h2>
        </div>

        {/* Compact Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc, accent }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="group relative p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
            >
              {/* Radial glow on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle 90px at 50% 50%, ${accent}0d, transparent 80%)`
                }}
              />
              
              {/* Top border glow edge */}
              <div 
                className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent 15%, ${accent}60 50%, transparent 85%)`
                }}
              />

              <div className="flex items-center gap-4 relative z-10">
                {/* Minimalist Icon Bubble */}
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: `${accent}0d`,
                    border: `1px solid ${accent}22`,
                  }}
                >
                  <Icon
                    size={18}
                    style={{ color: accent }}
                    className="transition-transform duration-500 group-hover:rotate-[360deg]"
                  />
                </div>

                {/* Text Section */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-sm tracking-wide transition-colors">
                    {title}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-normal">
                    {desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
