"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, User, CreditCard, ChevronLeft, Calendar, ArrowRight, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import { placeOrder } from "@/lib/firebase/firestore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const {
    items, clearCart, getSubtotal, getDiscount, getTotal, couponCode,
  } = useCartStore();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [notes, setNotes] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Delivery charge: free above ₹999, else ₹49
  const subtotalAfterDiscount = Math.max(0, getSubtotal() - getDiscount());
  const deliveryCharge = subtotalAfterDiscount >= 999 ? 0 : 49;
  const orderTotal = subtotalAfterDiscount + deliveryCharge;

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && items.length === 0) {
      router.push("/cart");
    }
  }, [items, authLoading, router]);

  // Try to pre-fill name from auth user
  useEffect(() => {
    if (user?.displayName) {
      setAddress((prev) => ({ ...prev, fullName: user.displayName || "" }));
    }
  }, [user]);

  async function getGeolocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success("Delivery coordinates captured! 📍");
        setFetchingLocation(false);
      },
      (err) => {
        console.error(err);
        toast.error("Could not capture location. Please enter manually.");
        setFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to complete your checkout.");
      router.push(`/login?redirect=/checkout`);
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      const orderId = await placeOrder(
        user.uid,
        user.email || "",
        items,
        getSubtotal(),
        getDiscount(),
        couponCode || "",
        orderTotal,
        address,
        coords,
        notes
      );

      toast.success("Order placed successfully! 🍾");
      clearCart();
      router.push(`/orders`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message ?? "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0614]">
        <div className="w-10 h-10 rounded-full border-4 border-t-purple-500 border-purple-900/30 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-lg py-20 flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse-glow"
          style={{ background: "rgba(147,51,234,0.1)", border: "1px solid rgba(147,51,234,0.3)" }}>
          <ShieldCheck size={36} style={{ color: "var(--purple-400)" }} />
        </div>
        <h1 className="text-3xl font-black gradient-text animate-fade-in-up" style={{ fontFamily: "Playfair Display,serif" }}>
          Premium Authentication Required
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "450px" }}>
          To unlock our exclusive premium checkout experience, please sign in or register your account.
        </p>
        <Link href={`/login?redirect=/checkout`} className="btn-primary px-8">Sign In to Continue</Link>
      </div>
    );
  }

  return (
    <div className="container-lg py-10">
      {/* Back button */}
      <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6 transition-colors hover:text-white" style={{ color: "var(--text-secondary)" }}>
        <ChevronLeft size={16} /> Back to Cart
      </Link>

      <h1 className="text-3xl font-black gradient-text mb-8" style={{ fontFamily: "Playfair Display,serif" }}>
        Exclusive Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form area */}
        <form onSubmit={handleCheckout} className="lg:col-span-2 space-y-6">
          {/* Address Details */}
          <div className="p-6 rounded-3xl space-y-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MapPin size={18} style={{ color: "var(--gold-400)" }} /> Delivery Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/40" />
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="input pl-9 text-sm"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/40" />
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="input pl-9 text-sm"
                    placeholder="Enter 10-digit number"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Address Line 1
                </label>
                <input
                  type="text"
                  required
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  className="input text-sm"
                  placeholder="House No, Street, Apartment Name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={address.addressLine2}
                  onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                  className="input text-sm"
                  placeholder="Landmark, Area, Sector"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  City
                </label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="input text-sm"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  State
                </label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="input text-sm"
                  placeholder="State"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className="input text-sm"
                  placeholder="6-digit ZIP code"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Country
                </label>
                <input
                  type="text"
                  required
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="input text-sm"
                  placeholder="Country"
                />
              </div>
            </div>

            {/* Smart Location Capture */}
            <div className="pt-3 border-t border-purple-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold">Smart Pin Location</h4>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Use current GPS coordinates for extreme delivery accuracy</p>
              </div>
              <button
                type="button"
                onClick={getGeolocation}
                disabled={fetchingLocation}
                className="btn-outline text-xs py-2 px-4 whitespace-nowrap gap-1.5 self-start md:self-auto cursor-pointer"
                style={{ borderColor: coords ? "rgba(34,197,94,0.4)" : "var(--border)", color: coords ? "#86efac" : "var(--purple-300)" }}
              >
                <MapPin size={13} />
                {fetchingLocation ? "Capturing..." : coords ? "Captured Successfully" : "Capture GPS Location"}
              </button>
            </div>
          </div>

          {/* Payment & Additional details */}
          <div className="p-6 rounded-3xl space-y-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CreditCard size={18} style={{ color: "var(--gold-400)" }} /> Payment Method
            </h2>

            {/* COD — active */}
            <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: "rgba(251,191,36,0.04)", border: "1px solid var(--border-gold)" }}>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5 text-white">
                  Cash on Delivery (COD) <span className="badge badge-gold text-[9px] py-0.5 px-2">Available</span>
                </h4>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Pay with cash upon safe delivery of your order</p>
              </div>
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "var(--gold-400)" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--gold-400)" }} />
              </div>
            </div>

            {/* Online Payment — Coming Soon */}
            <div className="p-4 rounded-xl flex items-center justify-between opacity-50 cursor-not-allowed" style={{ background: "rgba(147,51,234,0.03)", border: "1px solid var(--border)" }}>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                  Online Payment (UPI / Card)
                  <span className="badge badge-purple text-[9px] py-0.5 px-2">Coming Soon</span>
                </h4>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Online payments will be available shortly</p>
              </div>
              <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: "rgba(147,51,234,0.3)" }} />
            </div>

            <div className="pt-3">
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Delivery Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="input text-sm resize-none"
                placeholder="Gate code, landmark, delivery timing preference..."
              />
            </div>
          </div>
        </form>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl space-y-5 lg:sticky lg:top-24" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 className="font-bold text-lg border-b pb-3" style={{ borderColor: "var(--border)" }}>Luxury Cart Summary</h2>

            {/* Cart items list */}
            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-purple-950/20 relative flex-shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs leading-snug truncate">{item.title}</h4>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Qty: {item.quantity}</p>
                    <p className="text-xs font-bold mt-1" style={{ color: "var(--purple-300)" }}>
                      {formatPrice((item.discountedPrice ?? item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdowns */}
            <div className="space-y-2.5 text-xs border-t pt-4" style={{ borderColor: "var(--border)" }}>
              <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                <span>Subtotal</span><span>{formatPrice(getSubtotal())}</span>
              </div>
              {getDiscount() > 0 && (
                <div className="flex justify-between" style={{ color: "var(--gold-400)" }}>
                  <span>Discount</span><span>− {formatPrice(getDiscount())}</span>
                </div>
              )}
              <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                <span>Delivery Charge</span>
                {deliveryCharge === 0
                  ? <span style={{ color: "#86efac" }}>FREE 🎉</span>
                  : <span>{formatPrice(deliveryCharge)}</span>
                }
              </div>
              {deliveryCharge > 0 && (
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Add ₹{999 - subtotalAfterDiscount} more for free delivery</p>
              )}
              <div className="flex justify-between font-black text-base border-t pt-3" style={{ borderColor: "var(--border)" }}>
                <span>Total Amount</span><span className="gradient-text text-lg">{formatPrice(orderTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={submitting}
              className="btn-primary w-full py-3.5 gap-2 cursor-pointer"
            >
              {submitting ? "Placing Luxury Order..." : "Confirm & Place Order"}
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
            <p className="text-[10px] text-center mt-3 leading-relaxed" style={{ color: "var(--text-muted)" }}>
              🔒 Luxury Security Guarantee: Your payment details and transaction data are fully protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
