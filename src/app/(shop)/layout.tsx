import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CouponTicker } from "@/components/layout/CouponTicker";

const SplashScreen = dynamic(() => import("@/components/layout/SplashScreen").then((m) => m.SplashScreen));

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const settings = await import("@/lib/firebase/firestore").then((m) => m.getStoreSettings()).catch(() => null);

  return (
    <>
      <SplashScreen />
      <CouponTicker />
      <Navbar logoUrl={settings?.logoUrl} />
      <CartDrawer />
      <main className="min-h-screen pb-20 md:pb-0">
        {children}
      </main>
      <Footer logoUrl={settings?.logoUrl} />
      <BottomNav />
    </>
  );
}
