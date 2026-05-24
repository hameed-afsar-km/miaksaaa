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
    label: "+91 72920 70080",
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
      className="border-t mt-20 pb-24 md:pb-0 overflow-x-hidden"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      {/* Main section: fills viewport height on desktop */}
      <div
        className="container-lg flex flex-col md:flex-row md:items-end md:justify-between gap-10 py-16 md:min-h-[29vh]"
      >
        {/* Left — LARGE brand name scaled to fill available height */}
        <Link href="/" className="group shrink-0 self-start md:self-end">
          <span
            className="font-black gradient-text leading-none tracking-wider block"
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(1.5rem, 12vw, 10rem)",
            }}
          >
            MIAKSAAA
          </span>
          <span
            className="text-xs tracking-[0.22em] uppercase mt-1 block mr-6"
            style={{ color: "var(--text-muted)" }}
          >
            Fashion and Fun World
          </span>
        </Link>

        {/* Right — vertical stack of named links, pushed to bottom */}
        <div className="flex flex-col gap-5 md:self-end md:pb-2 md:pr-4">
          {CONTACT_LINKS.map(({ label, href, icon: Icon, hoverColor }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = hoverColor;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
              }}
            >
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110 overflow-hidden"
                style={{
                  background: "rgba(147,51,234,0.1)",
                  border: "1px solid var(--border)",
                }}
              >
                <Icon size={16} style={{ color: "var(--purple-400)" }} />
              </span>
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
