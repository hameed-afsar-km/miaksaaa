import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919876543210"; // Replace with actual number
const WHATSAPP_MESSAGE = "Hi! I have a query about MIAKSAAA.";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export function Footer({ logoUrl }: { logoUrl?: string }) {
  return (
    <footer
      className="border-t mt-20 pb-24 md:pb-10"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      <div className="container-lg py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-9 h-9 object-contain" />
              ) : (
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#9333ea,#7e22ce)", boxShadow: "0 0 16px rgba(147,51,234,0.4)" }}
                >
                  <span className="text-white font-black text-sm" style={{ fontFamily: "Playfair Display,serif" }}>M</span>
                </div>
              )}
              <span className="text-xl font-black gradient-text" style={{ fontFamily: "Playfair Display,serif" }}>MIAKSAAA</span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
              Your premium luxury shopping destination. Curated collections for the discerning taste.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "https://instagram.com/miaksaaa", label: "Instagram" },
                { icon: Facebook, href: "https://facebook.com/miaksaaa", label: "Facebook" },
                { icon: Mail, href: "mailto:support@miaksaaa.com", label: "Email" },
                { icon: MessageCircle, href: WHATSAPP_LINK, label: "WhatsApp" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "rgba(147,51,234,0.15)", border: "1px solid var(--border)", color: "var(--purple-400)" }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-widest uppercase" style={{ color: "var(--gold-400)" }}>Shop</h4>
            <ul className="space-y-3">
              {["All Products", "New Arrivals", "Featured", "Flash Sale", "Categories"].map((l) => (
                <li key={l}>
                  <Link href="/products" className="text-sm transition-colors hover:text-purple-300"
                    style={{ color: "var(--text-muted)" }}>{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-widest uppercase" style={{ color: "var(--gold-400)" }}>Account</h4>
            <ul className="space-y-3">
              {[
                { label: "My Profile",  href: "/profile" },
                { label: "My Orders",   href: "/orders" },
                { label: "Wishlist",    href: "/wishlist" },
                { label: "Cart",        href: "/cart" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:text-purple-300"
                    style={{ color: "var(--text-muted)" }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-widest uppercase" style={{ color: "var(--gold-400)" }}>Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm transition-colors hover:text-green-400 group"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-green-500/20"
                    style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <MessageCircle size={14} className="text-green-400" />
                  </span>
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-2.5 text-sm transition-colors hover:text-purple-300"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(147,51,234,0.1)", border: "1px solid var(--border)" }}>
                    <Phone size={14} style={{ color: "var(--purple-400)" }} />
                  </span>
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@miaksaaa.com"
                  className="flex items-center gap-2.5 text-sm transition-colors hover:text-purple-300"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(147,51,234,0.1)", border: "1px solid var(--border)" }}>
                    <Mail size={14} style={{ color: "var(--purple-400)" }} />
                  </span>
                  support@miaksaaa.com
                </a>
              </li>
              <li className="pt-1">
                <a href="#" className="text-xs hover:text-purple-300 transition-colors" style={{ color: "var(--text-muted)" }}>Shipping Policy</a>
                {" · "}
                <a href="#" className="text-xs hover:text-purple-300 transition-colors" style={{ color: "var(--text-muted)" }}>Return Policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t"
          style={{ borderColor: "var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} MIAKSAAA. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Crafted with ❤️ for premium experience
          </p>
        </div>
      </div>
    </footer>
  );
}
