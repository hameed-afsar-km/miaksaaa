"use client";
import { useState, useEffect } from "react";
import { Truck, Save } from "lucide-react";
import { getStoreSettings, updateStoreSettings } from "@/lib/firebase/firestore";
import { StoreSettings } from "@/lib/types";
import toast from "react-hot-toast";

export default function AdminDeliverySettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getStoreSettings()
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      await updateStoreSettings({
        deliveryCharge: settings.deliveryCharge,
        freeDeliveryThreshold: settings.freeDeliveryThreshold,
      });
      toast.success("Delivery settings updated successfully! 🚚");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update delivery settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-full skeleton" />
        <div className="h-96 w-full skeleton" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "Playfair Display, serif" }}>
          Delivery Configuration
        </h1>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          Manage delivery charges and free delivery thresholds.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="max-w-2xl space-y-6">
        <div
          className="p-6 rounded-3xl border space-y-5"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <h2 className="text-base font-bold flex items-center gap-2 text-white">
            <Truck size={16} className="text-purple-400" /> Delivery Charges
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Standard Delivery Charge</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">{settings.currencySymbol}</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={settings.deliveryCharge ?? 49}
                  onChange={(e) => setSettings({ ...settings, deliveryCharge: Number(e.target.value) })}
                  className="input text-xs py-2 pl-7"
                  placeholder="49"
                />
              </div>
              <p className="text-[10px] mt-1 text-white/40">Amount charged for orders below the threshold</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Free Delivery Threshold</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">{settings.currencySymbol}</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={settings.freeDeliveryThreshold ?? 499}
                  onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                  className="input text-xs py-2 pl-7"
                  placeholder="499"
                />
              </div>
              <p className="text-[10px] mt-1 text-white/40">Orders above this amount get free delivery</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full py-3.5 text-xs justify-center gap-1.5 cursor-pointer font-bold"
        >
          <Save size={14} /> {saving ? "Saving Changes..." : "Save Delivery Settings"}
        </button>
      </form>
    </div>
  );
}
