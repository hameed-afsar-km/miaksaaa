import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SplashScreen } from "@/components/layout/SplashScreen";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SplashScreen />
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen pt-16 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
