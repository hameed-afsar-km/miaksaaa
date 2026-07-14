import { HWNavbar } from "@/components/hotwheels/HWNavbar";
import { HWFooter } from "@/components/hotwheels/HWFooter";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function HotWheelsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HWNavbar />
      <CartDrawer />
      <main className="min-h-screen pt-[71px] lg:pt-16 pb-20 md:pb-0">
        {children}
      </main>
      <HWFooter />
    </>
  );
}
