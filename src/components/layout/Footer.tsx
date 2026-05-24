import Link from "next/link";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

export function Footer() {
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
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#9333ea,#7e22ce)", boxShadow: "0 0 16px rgba(147,51,234,0.4)" }}
              >
                <span className="text-white font-black text-sm" style={{ fontFamily: "Playfair Display,serif" }}>M</span>
              </div>
              <span className="text-xl font-black gradient-text" style={{ fontFamily: "Playfair Display,serif" }}>MIAKSAAA</span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
              Your premium luxury shopping destination. Curated collections for the discerning taste.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Mail, href: "#" },
              ].map(({ icon: Icon, href }) => (
                <a key={href} href={href}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "rgba(147,51,234,0.15)", border: "1px solid var(--border)", color: "var(--purple-400)" }}>
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
                { label: "My Profile",   href: "/profile" },
                { label: "My Orders",    href: "/orders" },
                { label: "Wishlist",     href: "/wishlist" },
                { label: "Cart",         href: "/cart" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:text-purple-300"
                    style={{ color: "var(--text-muted)" }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-widest uppercase" style={{ color: "var(--gold-400)" }}>Info</h4>
            <ul className="space-y-3">
              {["About Us", "Shipping Policy", "Return Policy", "Privacy Policy", "Contact Us"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm transition-colors hover:text-purple-300"
                    style={{ color: "var(--text-muted)" }}>{l}</a>
                </li>
              ))}
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
