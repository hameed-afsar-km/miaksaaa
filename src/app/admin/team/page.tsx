"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Mail,
  X,
  Search,
  Shield,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react";
import {
  getAllAdmins,
  addAdmin,
  removeAdmin,
  AdminUser,
} from "@/lib/firebase/firestore";
import { useAuthStore } from "@/lib/store/authStore";
import toast from "react-hot-toast";

export default function AdminTeamPage() {
  const { user } = useAuthStore();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const data = await getAllAdmins();
      setAdmins(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) {
      toast.error("UID is required");
      return;
    }
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setSaving(true);
    try {
      await addAdmin(uid, email, displayName, user?.uid);
      toast.success("Admin added successfully");
      setFormOpen(false);
      setUid("");
      setEmail("");
      setDisplayName("");
      loadAdmins();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add admin");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAdmin = async (uid: string) => {
    if (!confirm("Are you sure you want to remove this admin?")) return;

    try {
      await removeAdmin(uid);
      toast.success("Admin removed successfully");
      loadAdmins();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove admin");
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.email.toLowerCase().includes(search.toLowerCase()) ||
      admin.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "Playfair Display, serif" }}>
            Admin Team
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            Manage administrator access and permissions
          </p>
        </div>
        <button onClick={() => setFormOpen(true)} className="btn-primary text-xs px-5 py-2.5 flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Add Admin
        </button>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs">
          <p className="font-bold text-white mb-1">How to add a new admin:</p>
          <ol className="list-decimal list-inside space-y-1" style={{ color: "var(--text-secondary)" }}>
            <li>Create a user account in Firebase Auth (email + password)</li>
            <li>Copy their UID from Firebase Console</li>
            <li>Use the form below to add them as an admin with their UID</li>
          </ol>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or name..."
          className="input pl-11 text-sm"
        />
      </div>

      {/* Admins Table */}
      <div className="rounded-3xl border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                <th className="p-4 text-purple-300/60 font-bold uppercase">Admin Info</th>
                <th className="p-4 text-purple-300/60 font-bold uppercase">UID</th>
                <th className="p-4 text-purple-300/60 font-bold uppercase">Added</th>
                <th className="p-4 text-purple-300/60 font-bold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/5">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-purple-300/40">
                    No admins found
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.uid} className="hover:bg-purple-950/5">
                    <td className="p-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Shield size={12} className="text-purple-400" />
                          <p className="font-bold text-white">{admin.displayName || "Unnamed Admin"}</p>
                        </div>
                        <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                          <Mail size={10} /> {admin.email}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <code className="text-[10px] font-mono" style={{ color: "var(--text-secondary)" }}>
                          {admin.uid.slice(0, 12)}...
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(admin.uid);
                            setCopied(admin.uid);
                            setTimeout(() => setCopied(null), 2000);
                          }}
                          className="p-1 text-purple-400 hover:text-purple-300"
                        >
                          {copied === admin.uid ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-purple-200">
                      {admin.createdAt ? new Date(admin.createdAt.toDate()).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="p-4 text-right">
                      {user?.uid !== admin.uid && (
                        <button
                          onClick={() => handleRemoveAdmin(admin.uid)}
                          className="btn-ghost p-2 rounded-lg text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Form Modal */}
      <AnimatePresence>
        {formOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFormOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md p-6 rounded-3xl border"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
                <h3 className="text-lg font-bold text-white">Add New Admin</h3>
                <button onClick={() => setFormOpen(false)} className="p-1 text-purple-300">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-2">User UID *</label>
                  <input
                    type="text"
                    required
                    placeholder="Copy from Firebase Console"
                    className="input text-sm"
                    onChange={(e) => setUid(e.target.value)}
                    value={uid}
                  />
                  <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                    Get this from Firebase Auth Console
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@example.com"
                    className="input text-sm"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2">Display Name</label>
                  <input
                    type="text"
                    placeholder="Admin name (optional)"
                    className="input text-sm"
                    onChange={(e) => setDisplayName(e.target.value)}
                    value={displayName}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving || !uid || !email}
                  className="btn-primary w-full py-2.5 text-sm cursor-pointer font-bold"
                >
                  {saving ? "Adding..." : "Add Admin"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
