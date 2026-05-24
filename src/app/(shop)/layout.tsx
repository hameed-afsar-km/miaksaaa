import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SplashScreen } from "@/components/layout/SplashScreen";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const settings = await import("@/lib/firebase/firestore").then((m) => m.getStoreSettings()).catch(() => null);

  return (
    <>
      <SplashScreen />
      <Navbar logoUrl={settings?.logoUrl} />
      <CartDrawer />
      <main className="min-h-screen pt-[88px] lg:pt-[80px] pb-20 md:pb-0">
        <div className="pt-4 md:pt-6">
          {children}
        </div>
      </main>
      <Footer logoUrl={settings?.logoUrl} />
      <BottomNav />
    </>
  );
}
