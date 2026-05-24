"use client";
import { motion } from "framer-motion";
import { Shield, Truck, RefreshCw, Headphones, CreditCard, Star } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Truck,        title: "Free Delivery",     desc: "On orders above ₹999" },
  { icon: Shield,       title: "Secure Payments",   desc: "100% safe & protected" },
  { icon: RefreshCw,    title: "Easy Returns",      desc: "7-day return policy" },
  { icon: Headphones,   title: "24/7 Support",      desc: "Always here for you" },
  { icon: CreditCard,   title: "Cash On Delivery",  desc: "Pay when you receive" },
  { icon: Star,         title: "Premium Quality",   desc: "Curated luxury products" },
];

export function TrustSection() {
  return (
    <section className="section-padding">
      <div className="container-lg">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-black text-center mb-10"
          style={{ fontFamily: "Playfair Display,serif" }}
        >
          <span className="gradient-text">Why Choose MIAKSAAA?</span>
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center text-center p-4 rounded-2xl card gap-3"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,rgba(147,51,234,0.2),rgba(251,191,36,0.1))",
                  border: "1px solid var(--border)",
                }}
              >
                <Icon size={22} style={{ color: "var(--purple-400)" }} />
              </div>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
