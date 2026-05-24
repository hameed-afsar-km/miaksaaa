"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Store,
  DollarSign,
  Zap,
  Save,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { getStoreSettings, updateStoreSettings } from "@/lib/firebase/firestore";
import { StoreSettings } from "@/lib/types";
import toast from "react-hot-toast";
import { Timestamp } from "firebase/firestore";

export default function AdminSettingsPage() {
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
      await updateStoreSettings(settings);
      toast.success("Web settings calibrated successfully! ⚙️");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update store settings");
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
          Web Calibrations
        </h1>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          Calibrate store statuses, flash reductions, and base configurations
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="max-w-2xl space-y-6">
        {/* Core settings */}
        <div
          className="p-6 rounded-3xl border space-y-5"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <h2 className="text-base font-bold flex items-center gap-2 text-white">
            <Store size={16} className="text-purple-400" /> Operational Statuses
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Store Availability (Open/Closed)</h4>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>shoppers can explore and check out items</p>
              </div>
              <input
                type="checkbox"
                checked={settings.isOpen}
                onChange={(e) => setSettings({ ...settings, isOpen: e.target.checked })}
                className="w-4 h-4 cursor-pointer accent-purple-500"
              />
            </div>

            <div className="flex items-center justify-between border-t border-purple-500/5 pt-3">
              <div>
                <h4 className="text-xs font-bold text-white">VIP Delivery Dispatch</h4>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Enables complimentary premium delivery processing</p>
              </div>
              <input
                type="checkbox"
                checked={settings.deliveryAvailable}
                onChange={(e) => setSettings({ ...settings, deliveryAvailable: e.target.checked })}
                className="w-4 h-4 cursor-pointer accent-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Currency & Colors */}
        <div
          className="p-6 rounded-3xl border space-y-5"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <h2 className="text-base font-bold flex items-center gap-2 text-white">
            <DollarSign size={16} className="text-amber-400" /> Base Configurations
          </h2>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Base Currency Code</label>
              <input
                type="text"
                required
                value={settings.currency || "INR"}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value.toUpperCase() })}
                className="input text-xs py-2"
                placeholder="INR"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Currency Symbol</label>
              <input
                type="text"
                required
                value={settings.currencySymbol || "₹"}
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="input text-xs py-2"
                placeholder="₹"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">System Accent Color</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={settings.accentColor || "#9333ea"}
                  onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                  className="w-10 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-xs text-white">{settings.accentColor}</span>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Store Logo URL</label>
              <input
                type="text"
                value={settings.logoUrl || ""}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                className="input text-xs py-2"
                placeholder="https://... (Leave blank to use default M logo)"
              />
            </div>
          </div>
        </div>

        {/* Flash Sale System */}
        <div
          className="p-6 rounded-3xl border space-y-5"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <h2 className="text-base font-bold flex items-center gap-2 text-white">
            <Zap size={16} className="text-red-400" /> Flash Reductions Manager
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Global Flash Reductions</h4>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Enables countdown clocks and hot banners</p>
              </div>
              <input
                type="checkbox"
                checked={settings.flashSaleActive}
                onChange={(e) => setSettings({ ...settings, flashSaleActive: e.target.checked })}
                className="w-4 h-4 cursor-pointer accent-purple-500"
              />
            </div>

            {settings.flashSaleActive && (
              <div className="border-t border-purple-500/5 pt-3 text-xs">
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Reductions End Schedule</label>
                <input
                  type="datetime-local"
                  value={
                    settings.flashSaleEndsAt
                      ? new Date(settings.flashSaleEndsAt.toDate().getTime() - new Date().getTimezoneOffset() * 60000)
                        .toISOString()
                        .slice(0, 16)
                      : ""
                  }
                  onChange={(e) => {
                    if (!e.target.value) {
                      setSettings({ ...settings, flashSaleEndsAt: null });
                    } else {
                      const dateObj = new Date(e.target.value);
                      setSettings({
                        ...settings,
                        flashSaleEndsAt: Timestamp.fromDate(dateObj),
                      });
                    }
                  }}
                  className="input text-xs py-2 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full py-3.5 text-xs justify-center gap-1.5 cursor-pointer font-bold"
        >
          <Save size={14} /> {saving ? "Saving Calibrations..." : "Commit Calibrations"}
        </button>
      </form>
    </div>
  );
}
