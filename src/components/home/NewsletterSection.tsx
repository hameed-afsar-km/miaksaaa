"use client";
import { motion } from "framer-motion";
import { Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    toast.success("You're subscribed! 🎉");
  }

  return (
    <section className="section-padding">
      <div className="container-lg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-14 text-center"
          style={{
            background: "linear-gradient(135deg,rgba(147,51,234,0.15) 0%,rgba(251,191,36,0.06) 100%)",
            border: "1px solid rgba(147,51,234,0.25)",
          }}
        >
          {/* Glow orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full opacity-20 blur-2xl"
              style={{ background: "radial-gradient(circle,rgba(147,51,234,0.8),transparent)" }} />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-15 blur-2xl"
              style={{ background: "radial-gradient(circle,rgba(251,191,36,0.7),transparent)" }} />
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#9333ea,#7e22ce)", boxShadow: "0 0 24px rgba(147,51,234,0.5)" }}>
                <Mail size={24} className="text-white" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ fontFamily: "Playfair Display,serif" }}>
              <span className="gradient-text">Stay in the Loop</span>
            </h2>
            <p className="text-sm md:text-base mb-8 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
              Subscribe for exclusive deals, new arrivals, and luxury insider access.
            </p>

            {!done ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input flex-1 text-sm"
                />
                <button type="submit" className="btn-gold whitespace-nowrap">
                  <Sparkles size={15} /> Subscribe
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl"
                style={{ background: "rgba(147,51,234,0.2)", border: "1px solid rgba(147,51,234,0.4)", color: "var(--purple-300)" }}
              >
                <Sparkles size={16} /> You're on the list — thank you!
              </motion.div>
            )}

            <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
