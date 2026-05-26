"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, User, CreditCard, ChevronLeft, Calendar, ArrowRight, ShieldCheck, Tag, Check, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import { getAvailableCoupons, validateCoupon, placeOrder } from "@/lib/firebase/firestore";
import { Coupon } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const {
    items, clearCart, getSubtotal, getDiscount, getTotal, couponCode,
  } = useCartStore();

  function updateField(field: string, value: string) {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

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
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Online">("Online");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { applyCoupon, removeCoupon } = useCartStore();

  // Delivery charge: free above ₹499, else ₹80
  const subtotalAfterDiscount = Math.max(0, getSubtotal() - getDiscount());
  const deliveryCharge = subtotalAfterDiscount >= 499 ? 0 : 49;
  const orderTotal = subtotalAfterDiscount + deliveryCharge;

  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(true);

  useEffect(() => {
    getAvailableCoupons()
      .then(setAvailableCoupons)
      .catch(console.error)
      .finally(() => setCouponsLoading(false));
  }, []);

  async function handleApplyCoupon(c: Coupon) {
    const result = await validateCoupon(c.code, getSubtotal(), user?.uid);
    if (!result.valid || !result.coupon) {
      toast.error(result.message || "This coupon cannot be applied");
      return;
    }
    applyCoupon(c.code, c.discount, c.type, c.categories);
    toast.success(`Coupon "${c.code}" applied!`);
  }

  function handleRemoveCoupon() {
    removeCoupon();
    toast.success("Coupon removed");
  }

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

  async function reverseGeocode(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        { headers: { "User-Agent": "MIAKSAAA/1.0" } }
      );
      if (!res.ok) return;
      const data = await res.json();
      const addr = data.address || {};
      setAddress((prev) => ({
        ...prev,
        city: addr.city || addr.town || addr.village || addr.county || prev.city,
        state: addr.state || prev.state,
        postalCode: addr.postcode || prev.postalCode,
        country: addr.country || prev.country,
        addressLine1: addr.road
          ? `${addr.house_number ? addr.house_number + ", " : ""}${addr.road}`
          : prev.addressLine1,
      }));
      toast.success("Address fields auto-filled from location!");
    } catch {
      // reverse geocode failed silently — user can fill manually
    }
  }

  function captureLocation(highAccuracy: boolean) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        toast.success("Delivery coordinates captured! 📍");
        reverseGeocode(latitude, longitude);
        setFetchingLocation(false);
      },
      (err) => {
        console.error("Geolocation error:", err.code, err.message);
        if (err.code === 1) {
          toast.error("Location permission denied. Please allow location access in your browser settings.");
          setFetchingLocation(false);
        } else if (err.code === 2 && highAccuracy) {
          captureLocation(false);
        } else if (err.code === 3 && highAccuracy) {
          captureLocation(false);
        } else {
          toast.error(err.code === 2
            ? "Location unavailable. Try entering manually."
            : "Location request timed out. Try again or enter manually."
          );
          setFetchingLocation(false);
        }
      },
      {
        enableHighAccuracy: highAccuracy,
        timeout: highAccuracy ? 10000 : 8000,
        maximumAge: highAccuracy ? 0 : 120000,
      }
    );
  }

  async function getGeolocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setFetchingLocation(true);
    captureLocation(true);
  }

  function validateFields() {
    const errors: Record<string, string> = {};
    if (!address.fullName.trim()) errors.fullName = "Please enter your full name";
    if (!address.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(address.phone.trim())) errors.phone = "Enter a valid 10-digit phone number";
    if (!address.addressLine1.trim()) errors.addressLine1 = "Please enter your address";
    if (!address.city.trim()) errors.city = "City is required";
    if (!address.state.trim()) errors.state = "State is required";
    if (!address.postalCode.trim()) errors.postalCode = "Postal code is required";
    else if (!/^\d{6}$/.test(address.postalCode.trim())) errors.postalCode = "Enter a valid 6-digit postal code";
    if (!address.country.trim()) errors.country = "Country is required";
    return errors;
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

    const errors = validateFields();
    setFieldErrors(errors);
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstField = document.querySelector<HTMLElement>(`[name="${errorKeys[0]}"]`);
      firstField?.scrollIntoView({ behavior: "smooth", block: "center" });
      firstField?.focus();
      return;
    }

    if (paymentMethod === "Online") {
      sessionStorage.setItem("online-payment-data", JSON.stringify({
        userId: user.uid,
        userEmail: user.email || "",
        items,
        subtotal: getSubtotal(),
        discount: getDiscount(),
        couponCode: couponCode || "",
        total: orderTotal,
        deliveryAddress: address,
        coords,
        notes,
      }));
      router.push("/online-payment");
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
          {/* Validation error banner */}
          {Object.keys(fieldErrors).length > 0 && (
            <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background: "rgba(239,68,68,0.8)" }}>
                {Object.keys(fieldErrors).length}
              </div>
              <div>
                <p className="text-sm font-bold text-red-400">Please complete all required fields</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Fill in the highlighted fields below to proceed with your order
                </p>
              </div>
            </div>
          )}

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
                    name="fullName"
                    value={address.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className={`input pl-11 text-sm ${fieldErrors.fullName ? "border-red-500" : ""}`}
                    placeholder="Enter full name"
                  />
                  {fieldErrors.fullName && <p className="text-red-400 text-xs mt-1">{fieldErrors.fullName}</p>}
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
                    name="phone"
                    value={address.phone}
                    onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className={`input pl-11 text-sm ${fieldErrors.phone ? "border-red-500" : ""}`}
                    placeholder="Enter 10-digit number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    title="Enter a valid 10-digit phone number"
                  />
                  {fieldErrors.phone && <p className="text-red-400 text-xs mt-1">{fieldErrors.phone}</p>}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Address Line 1
                </label>
                <input
                  type="text"
                  required
                  name="addressLine1"
                  value={address.addressLine1}
                  onChange={(e) => updateField("addressLine1", e.target.value)}
                  className={`input text-sm ${fieldErrors.addressLine1 ? "border-red-500" : ""}`}
                  placeholder="House No, Street, Apartment Name"
                />
                {fieldErrors.addressLine1 && <p className="text-red-400 text-xs mt-1">{fieldErrors.addressLine1}</p>}
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
                  name="city"
                  value={address.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className={`input text-sm ${fieldErrors.city ? "border-red-500" : ""}`}
                  placeholder="City"
                />
                {fieldErrors.city && <p className="text-red-400 text-xs mt-1">{fieldErrors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  State
                </label>
                <input
                  type="text"
                  required
                  name="state"
                  value={address.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  className={`input text-sm ${fieldErrors.state ? "border-red-500" : ""}`}
                  placeholder="State"
                />
                {fieldErrors.state && <p className="text-red-400 text-xs mt-1">{fieldErrors.state}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  name="postalCode"
                  value={address.postalCode}
                  onChange={(e) => updateField("postalCode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className={`input text-sm ${fieldErrors.postalCode ? "border-red-500" : ""}`}
                  placeholder="6-digit ZIP code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  title="Enter a valid 6-digit postal code"
                />
                {fieldErrors.postalCode && <p className="text-red-400 text-xs mt-1">{fieldErrors.postalCode}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Country
                </label>
                <input
                  type="text"
                  required
                  name="country"
                  value={address.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  className={`input text-sm ${fieldErrors.country ? "border-red-500" : ""}`}
                  placeholder="Country"
                />
                {fieldErrors.country && <p className="text-red-400 text-xs mt-1">{fieldErrors.country}</p>}
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

            {/* COD — Coming Soon */}
            <div className="p-4 rounded-xl flex items-center justify-between opacity-50 cursor-not-allowed"
              style={{ background: "rgba(251,191,36,0.03)", border: "1px solid var(--border)" }}>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                  Cash on Delivery (COD)
                  <span className="badge badge-gold text-[9px] py-0.5 px-2">Coming Soon</span>
                </h4>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Pay with cash upon safe delivery of your order</p>
              </div>
              <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: "rgba(251,191,36,0.3)" }} />
            </div>

            {/* Online Payment — QR */}
            <div
              onClick={() => setPaymentMethod("Online")}
              className="p-4 rounded-xl flex items-center justify-between transition-all cursor-pointer"
              style={{
                background: paymentMethod === "Online" ? "rgba(147,51,234,0.08)" : "rgba(147,51,234,0.03)",
                border: paymentMethod === "Online" ? "1px solid rgba(147,51,234,0.5)" : "1px solid var(--border)",
              }}
            >
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5">
                  QR Online Payment
                  <span className="badge badge-purple text-[9px] py-0.5 px-2">Active</span>
                </h4>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                  Scan the QR code using any UPI app to complete payment
                </p>
              </div>
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{
                borderColor: paymentMethod === "Online" ? "rgb(147,51,234)" : "rgba(147,51,234,0.3)",
              }}>
                {paymentMethod === "Online" && (
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgb(147,51,234)" }} />
                )}
              </div>
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
          {/* Available Offers */}
          {!couponsLoading && availableCoupons.length > 0 && (
            <div className="p-6 rounded-3xl space-y-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <Tag size={14} className="text-amber-400" /> Available Offers
              </h3>
              <div className="space-y-2">
                {availableCoupons.map((c) => {
                  const isApplied = couponCode === c.code;
                  return (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all"
                      style={{
                        background: isApplied ? "rgba(147,51,234,0.1)" : "rgba(255,255,255,0.02)",
                        border: isApplied ? "1px solid rgba(147,51,234,0.4)" : "1px solid rgba(255,255,255,0.04)",
                      }}
                      onClick={() => isApplied ? handleRemoveCoupon() : handleApplyCoupon(c)}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isApplied ? "bg-purple-500/20" : "bg-amber-500/10"}`}>
                        {isApplied ? <Check size={14} className="text-purple-400" /> : <Tag size={14} className="text-amber-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black font-mono tracking-wider text-white">{c.code}</span>
                          <span className="text-[10px] font-bold text-emerald-400">
                            {c.type === "percent" ? `${c.discount}% OFF` : `₹${c.discount} OFF`}
                          </span>
                        </div>
                        {c.minOrder > 0 && (
                          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                            Min. order ₹{c.minOrder}
                          </p>
                        )}
                      </div>
                      {isApplied && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveCoupon(); }}
                          className="p-1 rounded-full hover:bg-white/5 transition-colors"
                        >
                          <X size={12} className="text-red-400" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Add ₹{499 - subtotalAfterDiscount} more for free delivery</p>
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
