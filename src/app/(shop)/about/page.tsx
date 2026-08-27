import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About MIAKSAAA",
  description:
    "Learn more about MIAKSAAA — an online store for fashion, accessories, toys, stationery, keychains and more.",
  alternates: {
    canonical: "https://miaksaaa.vercel.app/about",
  },
  openGraph: {
    type: "website",
    siteName: "MIAKSAAA",
    title: "About MIAKSAAA",
    description:
      "Learn more about MIAKSAAA — an online store for fashion, accessories, toys, stationery, keychains and more.",
    url: "https://miaksaaa.vercel.app/about",
  },
  twitter: {
    card: "summary",
    title: "About MIAKSAAA",
    description:
      "Learn more about MIAKSAAA — an online store for fashion, accessories, toys, stationery, keychains and more.",
  },
};

export default function AboutPage() {
  return (
    <div className="container-lg py-12 md:py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
        About MIAKSAAA
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        <p>
          <strong style={{ color: "var(--text-primary)" }}>MIAKSAAA</strong> is an online store for fashion, accessories,
          toys, stationery, keychains and more.
        </p>
        <p>
          Shop MIAKSAAA for curated collections across fashion and lifestyle, including Hot Wheels diecast collectibles and
          custom display frames. Discover products at the official website:{" "}
          <a
            href="https://miaksaaa.vercel.app/"
            className="underline underline-offset-4"
            style={{ color: "var(--purple-400)" }}
          >
            https://miaksaaa.vercel.app/
          </a>
          .
        </p>
        <p>
          Browse all products: <Link href="/products" className="underline underline-offset-4" style={{ color: "var(--purple-400)" }}>Shop MIAKSAAA</Link> •
          Questions? <Link href="/contact" className="underline underline-offset-4" style={{ color: "var(--purple-400)" }}>Contact MIAKSAAA</Link>
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About MIAKSAAA",
            url: "https://miaksaaa.vercel.app/about",
            isPartOf: { "@id": "https://miaksaaa.vercel.app/#website" },
            about: { "@id": "https://miaksaaa.vercel.app/#organization" },
          }),
        }}
      />
    </div>
  );
}
