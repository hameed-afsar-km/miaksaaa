"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { placeOrder } from "@/lib/firebase/firestore";
import { formatPrice } from "@/lib/utils";
import { CartItem, DeliveryAddress } from "@/lib/types";
import toast from "react-hot-toast";

const UPI_ID = "daezar24@okicici";
const STORE_NAME = "MIAKSAAA Store";

interface PaymentData {
  userId: string;
  userEmail: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode: string;
  total: number;
  deliveryAddress: DeliveryAddress;
  coords: { lat: number; lng: number } | null;
  notes: string;
}

const TIMER_DURATION = 5 * 60;

function generateTxnRef(): string {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
}

function getGpayIntentUrl(amount: number, txnRef: string): string {
  const params = `pa=${UPI_ID}&pn=${encodeURIComponent(STORE_NAME)}&am=${amount.toFixed(2)}&cu=INR&tn=${txnRef}`;
  return `intent://pay?${params}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
}

export default function OnlinePaymentPage() {
  const router = useRouter();
  const { clearCart } = useCartStore();

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [showModal, setShowModal] = useState(true);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [status, setStatus] = useState<"pending" | "completed" | "expired">("pending");
  const [submitting, setSubmitting] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  const [txnRef] = useState(generateTxnRef);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("online-payment-data");
    if (!stored) {
      router.replace("/cart");
      return;
    }
    try {
      const data: PaymentData = JSON.parse(stored);
      if (!data.items?.length) {
        router.replace("/cart");
        return;
      }
      setPaymentData(data);
    } catch {
      router.replace("/cart");
    }
  }, [router]);

  useEffect(() => {
    if (!showModal && status === "pending" && paymentData) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setStatus("expired");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showModal, status, paymentData]);

  useEffect(() => {
    if (!showModal && status === "pending" && !qrLoaded) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      script.async = true;
      script.onload = () => setQrLoaded(true);
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) document.body.removeChild(script);
      };
    }
  }, [showModal, status, qrLoaded]);

  useEffect(() => {
    if (qrLoaded && qrContainerRef.current && paymentData) {
      qrContainerRef.current.innerHTML = "";
      const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(STORE_NAME)}&am=${paymentData.total.toFixed(2)}&cu=INR&tn=${txnRef}`;
      try {
        new (window as any).QRCode(qrContainerRef.current, {
          text: upiLink,
          width: 220,
          height: 220,
          colorDark: "#ffffff",
          colorLight: "#0a0614",
          correctLevel: (window as any).QRCode.CorrectLevel?.H || 3,
        });
      } catch {
        toast.error("Failed to generate QR code. Please refresh.");
      }
    }
  }, [qrLoaded, paymentData, txnRef]);

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  async function handleConfirmPayment() {
    if (!paymentData || submitting) return;

    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      await placeOrder(
        paymentData.userId,
        paymentData.userEmail,
        paymentData.items,
        paymentData.subtotal,
        paymentData.discount,
        paymentData.couponCode,
        paymentData.total,
        paymentData.deliveryAddress,
        paymentData.coords,
        paymentData.notes,
        "Online"
      );
      setStatus("completed");
      clearCart();
      sessionStorage.removeItem("online-payment-data");
      toast.success("Order placed successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message ?? "Failed to place order.");
      setSubmitting(false);
    }
  }

  function handleGoBack() {
    sessionStorage.removeItem("online-payment-data");
    router.replace("/cart");
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0614]">
        <div className="w-10 h-10 rounded-full border-4 border-t-purple-500 border-purple-900/30 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0614] relative">
      {/* Initial Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="max-w-md w-full p-8 rounded-3xl text-center space-y-5"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-gold)" }}
            >
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
                <Clock size={28} style={{ color: "var(--gold-400)" }} />
              </div>
              <h2 className="text-xl font-black gradient-text" style={{ fontFamily: "Playfair Display,serif" }}>
                Complete Your Payment
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Please Pay the Amount{" "}
                <span className="text-lg font-bold" style={{ color: "var(--gold-400)" }}>
                  {formatPrice(paymentData.total)}
                </span>
                {" "}via UPI. Once the payment is verified by the seller, you will be intimated and your goodies will be delivered. Thank You
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="btn-primary w-full py-3 cursor-pointer"
              >
                Proceed to Scan & Pay
              </button>
              <button
                onClick={handleGoBack}
                className="text-xs font-semibold transition-colors hover:text-white cursor-pointer"
                style={{ color: "var(--text-muted)" }}
              >
                Cancel & Return to Cart
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR full-screen overlay */}
      {!showModal && status === "pending" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#0a0614]/95 backdrop-blur-sm p-4"
        >
          {/* Timer */}
          <div className="flex items-center gap-3 px-6 py-3 rounded-full mb-6"
            style={{
              background: timeLeft <= 60 ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${timeLeft <= 60 ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
              backdropFilter: "blur(8px)",
            }}>
            <Clock size={18} style={{ color: timeLeft <= 60 ? "#ef4444" : "white" }} />
            <span className="font-mono text-xl font-bold text-white">
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* QR Code */}
          <div className="p-4 rounded-2xl mb-4" style={{ background: "#0a0614", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div ref={qrContainerRef} className="flex items-center justify-center w-[220px] h-[220px]">
              {!qrLoaded && (
                <div className="w-10 h-10 rounded-full border-4 border-t-purple-500 border-purple-900/30 animate-spin" />
              )}
            </div>
          </div>

          {/* Amount */}
          <p className="text-lg font-bold mb-1" style={{ color: "var(--gold-400)" }}>
            {formatPrice(paymentData.total)}
          </p>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            UPI ID: {UPI_ID}
          </p>

          {/* Google Pay button */}
          <a
            href={getGpayIntentUrl(paymentData.total, txnRef)}
            className="flex items-center justify-center gap-2 w-full max-w-sm py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] mb-4"
            style={{ background: "#000", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Pay with Google Pay
          </a>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmPayment}
            disabled={submitting}
            className="btn-primary w-full max-w-sm py-4 text-lg gap-2 cursor-pointer"
          >
            {submitting ? (
              "Processing..."
            ) : (
              <>
                <CheckCircle size={20} />
                I've Paid — Place Order
              </>
            )}
          </button>

          <button
            onClick={handleGoBack}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Cart
          </button>

          {/* Instructions */}
          <p className="text-[10px] mt-6 text-center max-w-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Tap "Pay with Google Pay" to open the app with the amount pre-filled, or scan the QR code with any UPI app. 
            After paying, click "I've Paid — Place Order" to confirm.
          </p>
        </motion.div>
      )}

      {/* Success State */}
      {status === "completed" && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
            <CheckCircle size={40} style={{ color: "#22c55e" }} />
          </div>
          <h2 className="text-2xl font-black gradient-text" style={{ fontFamily: "Playfair Display,serif" }}>
            Order Placed Successfully!
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Thank you for your purchase! Your order has been placed and is now being reviewed by our team.
            We will notify you once the payment is verified.
          </p>
          <button
            onClick={() => router.replace("/orders")}
            className="btn-primary px-10 py-3 cursor-pointer"
          >
            View My Orders
          </button>
        </div>
      )}

      {/* Expired State */}
      {status === "expired" && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <AlertTriangle size={40} style={{ color: "#ef4444" }} />
          </div>
          <h2 className="text-2xl font-black" style={{ color: "#ef4444", fontFamily: "Playfair Display,serif" }}>
            Payment Window Expired
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            The payment window has expired. Your order was not placed. Please try again.
          </p>
          <button
            onClick={() => router.replace("/cart")}
            className="btn-primary px-10 py-3 cursor-pointer"
          >
            Return to Cart
          </button>
        </div>
      )}
    </div>
  );
}
