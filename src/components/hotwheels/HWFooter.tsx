"use client";
import Link from "next/link";
import { Flame, Instagram, MessageCircle, Phone, Mail } from "lucide-react";

const CONTACT_LINKS = [
  {
    label: "WhatsApp",
    sublabel: "Chat with us",
    href: "https://wa.me/917292070080",
    icon: MessageCircle,
    accent: "#4ade80",
  },
  {
    label: "+91 72920 70080",
    sublabel: "Call us directly",
    href: "tel:+917292070080",
    icon: Phone,
    accent: "#FF6600",
  },
  {
    label: "miaksaa1989@gmail.com",
    sublabel: "Drop us a mail",
    href: "mailto:miaksaa1989@gmail.com",
    icon: Mail,
    accent: "#FFD600",
  },
  {
    label: "@miaksaaa_collections",
    sublabel: "Follow on Instagram",
    href: "https://www.instagram.com/miaksaaa_collections/",
    icon: Instagram,
    accent: "#f472b6",
  },
];

export function HWFooter() {
  return (
    <footer className="relative mt-20 pb-24 md:pb-0 overflow-hidden" style={{ background: "#0D0200" }}>
      {/* Flame border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,68,0,0.6) 30%, rgba(255,214,0,0.5) 50%, rgba(255,68,0,0.6) 70%, transparent 100%)",
        }}
      />

      {/* Subtle flame grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,68,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,68,0,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container-lg relative z-10">
        {/* Brand */}
        <div className="flex flex-col items-center text-center pt-16 pb-10">
          <Link href="/hotwheels" className="group inline-block">
            <div className="h-[2px] w-16 mx-auto mb-5 rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, #FF4400, #FFD600, transparent)" }}
            />
            <div className="flex items-center gap-3 justify-center">
              <Flame size={32} style={{ color: "#FF4400" }} />
              <h2 className="text-4xl md:text-6xl font-black tracking-widest select-none"
                style={{
                  fontFamily: "Impact, sans-serif",
                  color: "#FF4400",
                  textShadow: "0 0 40px rgba(255,68,0,0.3)",
                  letterSpacing: "0.05em",
                }}
              >
                MIAKSAAA
              </h2>
              <Flame size={32} style={{ color: "#FFD600" }} />
            </div>
            <p className="text-[11px] tracking-[0.35em] uppercase font-medium mt-3" style={{ color: "#cc9980" }}>
              Hot Wheels Division
            </p>
          </Link>
        </div>

        {/* Divider */}
        <div className="h-px my-2" style={{ background: "linear-gradient(90deg, transparent, rgba(255,68,0,0.25), transparent)" }} />

        {/* Contact Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-10">
          {CONTACT_LINKS.map(({ label, sublabel, href, icon: Icon, accent }) => (
            <a key={href} href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex flex-col items-center text-center gap-3 px-4 py-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderColor: "rgba(255,68,0,0.12)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${accent}15`;
                e.currentTarget.style.borderColor = `${accent}40`;
                e.currentTarget.style.boxShadow = `0 8px 32px ${accent}28`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.borderColor = "rgba(255,68,0,0.12)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                style={{ background: "rgba(255,68,0,0.1)", border: "1px solid rgba(255,68,0,0.2)" }}>
                <Icon size={18} style={{ color: "#FF6600" }} />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0 w-full">
                <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: "#cc9980" }}>{sublabel}</span>
                <span className="text-xs font-semibold leading-tight truncate" style={{ color: "#FFE0CC" }}>{label}</span>
              </div>
            </a>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 py-6 border-t" style={{ borderColor: "rgba(255,68,0,0.1)" }}>
          <Link href="/hotwheels/products" className="text-xs font-semibold hover:text-[#FF6600] transition-colors" style={{ color: "#cc9980" }}>
            Collectibles
          </Link>
          <Link href="/hotwheels/frames" className="text-xs font-semibold hover:text-[#FF6600] transition-colors" style={{ color: "#cc9980" }}>
            Custom Frames
          </Link>
          <Link href="/" className="text-xs font-semibold hover:text-[#FF6600] transition-colors" style={{ color: "#cc9980" }}>
            Main Store
          </Link>
        </div>

        {/* Copyright */}
        <div className="py-5 flex items-center justify-center">
          <p className="text-[11px] tracking-widest uppercase font-medium" style={{ color: "#cc9980" }}>
            © {new Date().getFullYear()} MIAKSAAA — Hot Wheels Division
          </p>
        </div>
      </div>
    </footer>
  );
}
