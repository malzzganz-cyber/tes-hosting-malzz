"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Server, Zap, Plus, ExternalLink, Trash2, MemoryStick, Cpu, HardDrive, Clock } from "lucide-react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { Panel } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { CreatePanelForm } from "@/components/forms/CreatePanelForm";
import { SuccessModal } from "@/components/modals/SuccessModal";
import { useSettings } from "@/hooks/useSettings";
import { formatDate } from "@/lib/utils";
import { TableSkeleton } from "@/components/ui/LoadingSkeleton";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function DashboardPage() {
  const { firebaseUser, userData, role } = useAuthStore();
  const { settings } = useSettings();
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createdPanel, setCreatedPanel] = useState<Panel | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseUser) return;
    const q = query(
      collection(db, "panels"),
      where("ownerId", "==", firebaseUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Panel));
      setPanels(data);
      setLoading(false);
    });
    return () => unsub();
  }, [firebaseUser]);

  const handleSuccess = (panel: Panel) => {
    setCreatedPanel(panel);
    setShowSuccess(true);
    setShowCreate(false);
  };

  const handleDelete = async (panel: Panel) => {
    if (!confirm(`Hapus panel "${panel.username}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeletingId(panel.id);
    try {
      const token = await firebaseUser?.getIdToken();
      await axios.delete(`/api/panel/${panel.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Panel berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus panel");
    } finally {
      setDeletingId(null);
    }
  };

  const activeCount = panels.filter((p) => p.status === "active").length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-malzz-textDark">
            Halo, {userData?.displayName || "User"} 👋
          </h1>
          <p className="text-sm text-malzz-textMid mt-1">
            Kelola panel Pterodactyl Anda dari sini
          </p>
        </div>
        {!showCreate && (
          <Button onClick={() => setShowCreate(true)} size="md">
            <Plus className="w-4 h-4" />
            Buat Panel
          </Button>
        )}
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Panel" value={panels.length} icon={Server} delay={0} />
        <StatCard title="Panel Aktif" value={activeCount} icon={Zap} iconColor="text-green-500" iconBg="bg-green-50" delay={0.05} />
        <StatCard title="Tipe Akun" value={role || "premium"} icon={Zap} iconColor="text-malzz-purple" iconBg="bg-malzz-lavender" delay={0.1} />
        <StatCard
          title="Limit Panel"
          value={`${panels.length}/${userData?.maxPanels === 999 ? "∞" : userData?.maxPanels || 10}`}
          icon={Server}
          iconColor="text-orange-400"
          iconBg="bg-malzz-peachLight"
          delay={0.15}
        />
      </div>

      {showCreate && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-7 shadow-glass"
        >
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-malzz-blue" />
              <h2 className="font-semibold text-malzz-textDark">Buat Panel Baru</h2>
            </div>
            <button
              onClick={() => setShowCreate(false)}
              className="text-malzz-textLight hover:text-malzz-textDark text-sm"
            >
              Batal
            </button>
          </div>
          <CreatePanelForm
            type="premium"
            settings={settings}
            authToken={undefined}
            onSuccess={handleSuccess}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-3xl p-6 shadow-glass"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-malzz-textDark flex items-center gap-2">
            <Server className="w-5 h-5 text-malzz-blue" />
            Panel Saya
          </h2>
          <Link href="/dashboard/panels" className="text-xs text-malzz-blue font-medium hover:underline">
            Lihat semua
          </Link>
        </div>

        {loading ? (
          <TableSkeleton rows={3} />
        ) : panels.length === 0 ? (
          <div className="text-center py-12">
            <Server className="w-10 h-10 text-malzz-textLight mx-auto mb-3" />
            <p className="text-sm text-malzz-textMid mb-3">Belum ada panel</p>
            <Button onClick={() => setShowCreate(true)} size="sm">
              <Plus className="w-4 h-4" />
              Buat Panel Pertama
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {panels.slice(0, 5).map((panel) => (
              <motion.div
                key={panel.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-malzz-grayLight rounded-2xl hover:bg-white transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-blue-purple flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {panel.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-malzz-textDark text-sm">{panel.username}</p>
                    <p className="text-xs text-malzz-textLight truncate max-w-[180px]">{panel.email}</p>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-4 text-xs text-malzz-textLight">
                  <span className="flex items-center gap-1">
                    <MemoryStick className="w-3 h-3" /> {panel.ram}MB
                  </span>
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> {panel.cpu === 0 ? "∞" : `${panel.cpu}%`}
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3" /> {panel.disk}MB
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={panel.status === "active" ? "success" : panel.status === "suspended" ? "error" : "warning"}>
                    {panel.status}
                  </Badge>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => window.open(panel.domain, "_blank")}
                      className="p-1.5 rounded-lg hover:bg-malzz-blueLight text-malzz-textLight hover:text-malzz-blue transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(panel)}
                      disabled={deletingId === panel.id}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-malzz-textLight hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        panel={createdPanel}
      />
    </div>
  );
}
