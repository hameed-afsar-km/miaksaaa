import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Luxury Products | MIAKSAAA",
  description:
    "Browse the full catalog of premium luxury fashion, accessories, and exclusive collections available at MIAKSAAA.",
  keywords: [
    "MIAKSAAA Products",
    "MIAKSAAA Catalog",
    "Luxury Fashion Online",
    "Premium Accessories",
    "MIAKSAAA Store",
  ],
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Shop All Luxury Products | MIAKSAAA",
    description:
      "Browse the full catalog of premium luxury fashion, accessories, and exclusive collections available at MIAKSAAA.",
    url: "/products",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
