import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Reviews & Ratings | MIAKSAAA",
  description:
    "Read genuine customer reviews and ratings for luxury products and collectibles purchased from MIAKSAAA.",
  keywords: [
    "MIAKSAAA Reviews",
    "MIAKSAAA Customer Feedback",
    "MIAKSAAA Ratings",
    "Is MIAKSAAA Legit",
    "MIAKSAAA Experiences",
  ],
  alternates: {
    canonical: "/reviews",
  },
  openGraph: {
    title: "Customer Reviews & Ratings | MIAKSAAA",
    description:
      "Read genuine customer reviews and ratings for luxury products and collectibles purchased from MIAKSAAA.",
    url: "/reviews",
  },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
