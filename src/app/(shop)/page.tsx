import { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickSliderSection } from "@/components/home/QuickSliderSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { TrustSection } from "@/components/home/TrustSection";
import { getActiveBanners, getFeaturedProducts, getNewArrivals, getHotProducts, getCategories } from "@/lib/firebase/firestore";

export const metadata: Metadata = {
  title: "MIAKSAAA — Premium Luxury Store",
  description: "Discover premium products at MIAKSAAA — your luxury shopping destination.",
};

export const revalidate = 60;

export default async function HomePage() {
  const [banners, featured, newArrivals, hot, categories] = await Promise.all([
    getActiveBanners().catch(() => []),
    getFeaturedProducts().catch(() => []),
    getNewArrivals().catch(() => []),
    getHotProducts().catch(() => []),
    getCategories().catch(() => []),
  ]);

  return (
    <>
      <HeroSection banners={banners} />
      <QuickSliderSection products={featured} />
      <CategoriesSection categories={categories} />
      <FeaturedSection title="Featured Products" products={featured} />
      <FlashSaleSection products={hot} />
      <FeaturedSection title="New Arrivals" products={newArrivals} badge="New" />
      <TrustSection />
    </>
  );
}
