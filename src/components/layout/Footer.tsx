"use client";
import Link from "next/link";
import { Instagram, MessageCircle, Phone, Mail } from "lucide-react";

const CONTACT_LINKS = [
  {
    label: "WhatsApp",
    href: "https://wa.me/917292070080",
    icon: MessageCircle,
    hoverColor: "#4ade80",
  },
  {
    label: "Phone Number",
    href: "tel:+917292070080",
    icon: Phone,
    hoverColor: "var(--purple-300)",
  },
  {
    label: "Email",
    href: "mailto:miaksaa1989@gmail.com",
    icon: Mail,
    hoverColor: "var(--purple-300)",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/miaksaaa_collections/",
    icon: Instagram,
    hoverColor: "#f472b6",
  },
];

export function Footer({ logoUrl }: { logoUrl?: string }) {
  return (
    <footer
      className="border-t mt-20 pb-24 md:pb-0"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      <div className="container-lg py-12">
        {/* Main row: brand left, contact links right */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          {/* Left — Large brand name */}
          <Link href="/" className="group shrink-0">
            <span
              className="text-5xl sm:text-6xl md:text-7xl font-black gradient-text leading-none tracking-wider block"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              MIAKSAAA
            </span>
            <span
              className="text-xs tracking-[0.22em] uppercase mt-1 block"
              style={{ color: "var(--text-muted)" }}
            >
              Fashion and Fun World
            </span>
          </Link>

          {/* Right — vertical stack of named links */}
          <div className="flex flex-col gap-4">
            {CONTACT_LINKS.map(({ label, href, icon: Icon, hoverColor }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-3 text-sm font-medium transition-colors duration-200"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = hoverColor;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
                }}
              >
                <span
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
                  style={{
                    background: "rgba(147,51,234,0.1)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Icon size={15} style={{ color: "var(--purple-400)" }} />
                </span>
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t"
          style={{ borderColor: "var(--border)" }}
        >
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
