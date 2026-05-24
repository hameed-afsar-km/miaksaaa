"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { placeOrder } from "@/lib/firebase/firestore";
import { formatPrice } from "@/lib/utils";
import { CartItem, DeliveryAddress } from "@/lib/types";
import toast from "react-hot-toast";

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

export default function OnlinePaymentPage() {
  const router = useRouter();
  const { clearCart } = useCartStore();

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [showModal, setShowModal] = useState(true);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [status, setStatus] = useState<"pending" | "completed" | "expired">("pending");
  const [submitting, setSubmitting] = useState(false);
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

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  async function handleDone() {
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
      toast.success("Payment successful! Order placed. 🍾");
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
                . Once the payment is verified by the seller, you will be intimated and your goodies will be delivered. Thank You
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

      {/* QR full-screen background + bottom controls */}
      {!showModal && status === "pending" && (
        <div className="fixed inset-0">
          <Image src="/qr.png" alt="Payment QR Code" fill className="object-cover" priority />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-5 pb-12 px-4"
            style={{
              background: "linear-gradient(transparent, rgba(0,0,0,0.7) 40%)",
              paddingTop: "6rem",
            }}>
            <div className="flex items-center gap-3 px-6 py-3 rounded-full"
              style={{
                background: timeLeft <= 60 ? "rgba(239,68,68,0.25)" : "rgba(0,0,0,0.55)",
                border: `1px solid ${timeLeft <= 60 ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.15)"}`,
                backdropFilter: "blur(8px)",
              }}>
              <Clock size={18} style={{ color: timeLeft <= 60 ? "#ef4444" : "white" }} />
              <span className="font-mono text-xl font-bold text-white">
                {formatTime(timeLeft)}
              </span>
            </div>

            <button
              onClick={handleDone}
              disabled={submitting}
              className="btn-primary w-full max-w-sm py-4 text-lg gap-2 cursor-pointer"
            >
              {submitting ? (
                "Processing..."
              ) : (
                <>
                  <CheckCircle size={20} />
                  Done - Payment Completed
                </>
              )}
            </button>

            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Cart
            </button>
          </div>
        </div>
      )}

      {/* Success State */}
      {status === "completed" && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
            <CheckCircle size={40} style={{ color: "#22c55e" }} />
          </div>
          <h2 className="text-2xl font-black gradient-text" style={{ fontFamily: "Playfair Display,serif" }}>
            Payment Successful!
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Thank you for your purchase! Your order has been placed and is now being reviewed by our team.
            You will be notified once the payment is verified and your goodies are on the way.
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
            Payment Not Completed
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
