import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact MIAKSAAA",
  description:
    "Contact MIAKSAAA — reach us via WhatsApp, phone, email or Instagram.",
  alternates: {
    canonical: "https://miaksaaa.vercel.app/contact",
  },
  openGraph: {
    type: "website",
    siteName: "MIAKSAAA",
    title: "Contact MIAKSAAA",
    description:
      "Contact MIAKSAAA — reach us via WhatsApp, phone, email or Instagram.",
    url: "https://miaksaaa.vercel.app/contact",
  },
  twitter: {
    card: "summary",
    title: "Contact MIAKSAAA",
    description:
      "Contact MIAKSAAA — reach us via WhatsApp, phone, email or Instagram.",
  },
};

export default function ContactPage() {
  return (
    <div className="container-lg py-12 md:py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
        Contact MIAKSAAA
      </h1>
      <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
        Reach MIAKSAAA through the official contact channels below.
      </p>

      <div className="mt-8 grid gap-4">
        <a
          href="https://wa.me/917292070080"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl border flex flex-col"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(147,51,234,0.12)" }}
        >
          <span className="text-xs uppercase tracking-widest font-bold" style={{ color: "var(--text-muted)" }}>WhatsApp</span>
          <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>wa.me/917292070080</span>
        </a>
        <a
          href="tel:+917292070080"
          className="p-4 rounded-2xl border flex flex-col"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(147,51,234,0.12)" }}
        >
          <span className="text-xs uppercase tracking-widest font-bold" style={{ color: "var(--text-muted)" }}>Phone</span>
          <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>+91 72920 70080</span>
        </a>
        <a
          href="mailto:miaksaa1989@gmail.com"
          className="p-4 rounded-2xl border flex flex-col"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(147,51,234,0.12)" }}
        >
          <span className="text-xs uppercase tracking-widest font-bold" style={{ color: "var(--text-muted)" }}>Email</span>
          <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>miaksaa1989@gmail.com</span>
        </a>
        <a
          href="https://www.instagram.com/miaksaaa_collections/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl border flex flex-col"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(147,51,234,0.12)" }}
        >
          <span className="text-xs uppercase tracking-widest font-bold" style={{ color: "var(--text-muted)" }}>Instagram</span>
          <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>@miaksaaa_collections</span>
        </a>
      </div>

      <p className="mt-8 text-sm" style={{ color: "var(--text-muted)" }}>
        Official website:{" "}
        <a href="https://miaksaaa.vercel.app/" className="underline underline-offset-4" style={{ color: "var(--purple-400)" }}>
          https://miaksaaa.vercel.app/
        </a>
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact MIAKSAAA",
            url: "https://miaksaaa.vercel.app/contact",
            isPartOf: { "@id": "https://miaksaaa.vercel.app/#website" },
          }),
        }}
      />
    </div>
  );
}
