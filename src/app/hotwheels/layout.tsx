import type { Metadata } from "next";
import { HWNavbar } from "@/components/hotwheels/HWNavbar";
import { HWFooter } from "@/components/hotwheels/HWFooter";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "Hot Wheels & Diecast Collectibles | MIAKSAAA",
  description:
    "Explore exclusive Hot Wheels diecast collectibles, rare scale models (1:64, 1:43, 1:24, 1:18), and custom handcrafted display frames at MIAKSAAA.",
  keywords: [
    "MIAKSAAA Hot Wheels",
    "Hot Wheels Collectibles",
    "Diecast Cars MIAKSAAA",
    "Custom Hot Wheels Frames",
    "Rare Diecast Models",
    "MIAKSAAA",
  ],
  alternates: {
    canonical: "/hotwheels",
  },
  openGraph: {
    title: "Hot Wheels & Diecast Collectibles | MIAKSAAA",
    description:
      "Explore exclusive Hot Wheels diecast collectibles and custom display frames at MIAKSAAA.",
    images: [{ url: "/hw_logo.png", width: 800, height: 600, alt: "MIAKSAAA Hot Wheels Collectibles" }],
  },
};

export default function HotWheelsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HWNavbar />
      <CartDrawer />
      <main className="min-h-screen pt-[71px] lg:pt-16">
        {children}
      </main>
      <HWFooter />
    </>
  );
}
