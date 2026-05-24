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

export const dynamic = "force-dynamic";

function serializeProduct(product: any) {
  if (!product) return null;
  return {
    ...product,
    createdAt: product.createdAt ? (typeof product.createdAt.toMillis === "function" ? product.createdAt.toMillis() : product.createdAt) : null,
    updatedAt: product.updatedAt ? (typeof product.updatedAt.toMillis === "function" ? product.updatedAt.toMillis() : product.updatedAt) : null,
  };
}

export default async function HomePage() {
  const [banners, featuredRaw, newArrivalsRaw, hotRaw, categories, settings] = await Promise.all([
    getActiveBanners().catch(() => []),
    getFeaturedProducts().catch(() => []),
    getNewArrivals().catch(() => []),
    getHotProducts().catch(() => []),
    getCategories().catch(() => []),
    import("@/lib/firebase/firestore").then((m) => m.getStoreSettings()).catch(() => null),
  ]);

  const featured = (featuredRaw || []).map(serializeProduct).filter(Boolean) as any[];
  const newArrivals = (newArrivalsRaw || []).map(serializeProduct).filter(Boolean) as any[];
  const hot = (hotRaw || []).map(serializeProduct).filter(Boolean) as any[];

  return (
    <>
      <HeroSection banners={banners} />
      <QuickSliderSection products={featured} />
      <CategoriesSection categories={categories} />
      <FeaturedSection title="Featured Products" products={featured} />
      {settings?.flashSaleActive && (
        <FlashSaleSection 
          products={hot} 
          targetDate={settings?.flashSaleEndsAt ? new Date(settings.flashSaleEndsAt.toMillis()) : undefined} 
        />
      )}
      <FeaturedSection title="New Arrivals" products={newArrivals} badge="New" />
      <TrustSection />
    </>
  );
}
