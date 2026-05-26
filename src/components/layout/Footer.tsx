"use client";
import Link from "next/link";
import { Instagram, MessageCircle, Phone, Mail } from "lucide-react";

const CONTACT_LINKS = [
  {
    label: "WhatsApp",
    sublabel: "Chat with us",
    href: "https://wa.me/917292070080",
    icon: MessageCircle,
    accent: "#4ade80",
    accentBg: "rgba(74,222,128,0.08)",
    accentBorder: "rgba(74,222,128,0.2)",
  },
  {
    label: "+91 72920 70080",
    sublabel: "Call us directly",
    href: "tel:+917292070080",
    icon: Phone,
    accent: "#c084fc",
    accentBg: "rgba(192,132,252,0.08)",
    accentBorder: "rgba(192,132,252,0.2)",
  },
  {
    label: "miaksaa1989@gmail.com",
    sublabel: "Drop us a mail",
    href: "mailto:miaksaa1989@gmail.com",
    icon: Mail,
    accent: "#fbbf24",
    accentBg: "rgba(251,191,36,0.08)",
    accentBorder: "rgba(251,191,36,0.2)",
  },
  {
    label: "@miaksaaa_collections",
    sublabel: "Follow on Instagram",
    href: "https://www.instagram.com/miaksaaa_collections/",
    icon: Instagram,
    accent: "#f472b6",
    accentBg: "rgba(244,114,182,0.08)",
    accentBorder: "rgba(244,114,182,0.2)",
  },
];

export function Footer({ logoUrl }: { logoUrl?: string }) {
  return (
    <footer
      className="relative mt-20 pb-24 md:pb-0 overflow-hidden"
      style={{ background: "var(--bg-dark)" }}
    >
      {/* Top glowing border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(147,51,234,0.6) 30%, rgba(251,191,36,0.5) 50%, rgba(147,51,234,0.6) 70%, transparent 100%)",
        }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(147,51,234,1) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial purple glow at top-center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(147,51,234,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="container-lg relative z-10">

        {/* ── Brand Monument ── */}
        <div className="flex flex-col items-center text-center pt-16 pb-10">
          <Link href="/" className="group inline-block">
            <div
              className="h-[2px] w-16 mx-auto mb-5 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(147,51,234,0.8), rgba(251,191,36,0.6), transparent)",
              }}
            />
            <h2
              className="font-black gradient-text leading-none tracking-widest select-none transition-all duration-500 group-hover:tracking-[0.12em]"
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "clamp(3rem, 13vw, 9rem)",
                textShadow: "0 0 80px rgba(168,85,247,0.2)",
              }}
            >
              MIAKSAAA
            </h2>
            <p
              className="text-[11px] tracking-[0.35em] uppercase font-medium mt-3"
              style={{ color: "var(--text-muted)" }}
            >
              Fashion and Fun World
            </p>
          </Link>
        </div>

        {/* ── Divider ── */}
        <div
          className="h-px my-2"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(147,51,234,0.25), transparent)",
          }}
        />

        {/* ── Contact Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-10">
          {CONTACT_LINKS.map(({ label, sublabel, href, icon: Icon, accent, accentBg, accentBorder }) => (
            <a
              key={href}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex flex-col items-center text-center gap-3 px-4 py-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderColor: "rgba(147,51,234,0.12)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = accentBg;
                el.style.borderColor = accentBorder;
                el.style.boxShadow = `0 8px 32px ${accent}28`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "rgba(255,255,255,0.02)";
                el.style.borderColor = "rgba(147,51,234,0.12)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Icon bubble */}
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: "rgba(147,51,234,0.1)",
                  border: "1px solid rgba(147,51,234,0.2)",
                }}
              >
                <Icon size={18} style={{ color: "var(--purple-400)" }} />
              </div>

              {/* Label */}
              <div className="flex flex-col gap-0.5 min-w-0 w-full">
                <span
                  className="text-[9px] uppercase tracking-widest font-bold"
                  style={{ color: "var(--text-muted)" }}
                >
                  {sublabel}
                </span>
                <span
                  className="text-xs font-semibold leading-tight truncate"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {label}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* ── Copyright Bar ── */}
        <div
          className="py-5 flex items-center justify-center border-t"
          style={{ borderColor: "rgba(147,51,234,0.1)" }}
        >
          <p
            className="text-[11px] tracking-widest uppercase font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            © {new Date().getFullYear()} MIAKSAAA — All rights reserved
          </p>
        </div>

      </div>
    </footer>
  );
}
