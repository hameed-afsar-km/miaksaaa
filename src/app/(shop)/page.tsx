import { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickSliderSection } from "@/components/home/QuickSliderSection";
import { getActiveBanners, getHomepageProducts, getCategoriesByStore } from "@/lib/firebase/firestore";

const HotWheelsPromoSection = nextDynamic(() => import("@/components/home/HotWheelsPromoSection").then((m) => m.HotWheelsPromoSection), { loading: () => <div className="h-[85vh] bg-[#0a0a0a]" /> });
const CategoriesSection = nextDynamic(() => import("@/components/home/CategoriesSection").then((m) => m.CategoriesSection), { loading: () => <div className="section-padding" /> });
const FeaturedSection = nextDynamic(() => import("@/components/home/FeaturedSection").then((m) => m.FeaturedSection), { loading: () => <div className="section-padding" /> });
const FlashSaleSection = nextDynamic(() => import("@/components/home/FlashSaleSection").then((m) => m.FlashSaleSection), { loading: () => <div className="section-padding" /> });
const TrustSection = nextDynamic(() => import("@/components/home/TrustSection").then((m) => m.TrustSection), { loading: () => <div className="py-14" /> });

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
  const [banners, homepageProducts, categories, settings] = await Promise.all([
    getActiveBanners().catch(() => []),
    getHomepageProducts().catch(() => ({ featured: [], newArrivals: [], hot: [] })),
    getCategoriesByStore("miaksaaa").catch(() => []),
    import("@/lib/firebase/firestore").then((m) => m.getStoreSettings()).catch(() => null),
  ]);

  const featured = (homepageProducts.featured || []).map(serializeProduct).filter(Boolean) as any[];
  const newArrivals = (homepageProducts.newArrivals || []).map(serializeProduct).filter(Boolean) as any[];
  const hot = (homepageProducts.hot || []).map(serializeProduct).filter(Boolean) as any[];

  return (
    <>
      <HeroSection banners={banners} />
      <QuickSliderSection products={featured} />
      <HotWheelsPromoSection />
      <CategoriesSection categories={categories} />
      <FeaturedSection title="Featured Products" products={featured} snap={false} />
      {settings?.flashSaleActive && (
        <FlashSaleSection
          products={hot}
          targetDate={settings?.flashSaleEndsAt ? new Date(settings.flashSaleEndsAt.toMillis()) : undefined}
        />
      )}
      <FeaturedSection title="New Arrivals" products={newArrivals} badge="New" snap={false} />
      <TrustSection />
    </>
  );
}
