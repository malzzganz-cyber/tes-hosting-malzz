"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Server, Search, Trash2, ExternalLink, RefreshCw, Plus } from "lucide-react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Panel } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CreatePanelForm } from "@/components/forms/CreatePanelForm";
import { SuccessModal } from "@/components/modals/SuccessModal";
import { useSettings } from "@/hooks/useSettings";
import { TableSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminPanelsPage() {
  const { firebaseUser } = useAuthStore();
  const { settings } = useSettings();
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "free" | "premium">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createdPanel, setCreatedPanel] = useState<Panel | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "panels"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPanels(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Panel)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = panels.filter((p) => {
    const matchSearch =
      p.username.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.type === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = async (panel: Panel) => {
    if (!confirm(`Hapus panel "${panel.username}"?`)) return;
    setDeletingId(panel.id);
    try {
      const token = await firebaseUser?.getIdToken();
      await axios.delete(`/api/panel/${panel.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Panel dihapus");
    } catch {
      toast.error("Gagal menghapus panel");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSuccess = (panel: Panel) => {
    setCreatedPanel(panel);
    setShowSuccess(true);
    setShowCreate(false);
  };

  const freePanels = panels.filter((p) => p.type === "free").length;
  const premiumPanels = panels.filter((p) => p.type === "premium").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-malzz-textDark flex items-center gap-2">
            <Server className="w-6 h-6 text-malzz-blue" /> Manajemen Panel
          </h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-malzz-textLight">
            <span>Total: <strong className="text-malzz-textDark">{panels.length}</strong></span>
            <span>Free: <strong className="text-malzz-blue">{freePanels}</strong></span>
            <span>Premium: <strong className="text-malzz-purple">{premiumPanels}</strong></span>
          </div>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <Plus className="w-4 h-4" />
          {showCreate ? "Batal" : "Buat Panel"}
        </Button>
      </div>

      {showCreate && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-7"
        >
          <h2 className="font-semibold text-malzz-textDark mb-5">Buat Panel Baru (Admin)</h2>
          <CreatePanelForm type="premium" settings={settings} onSuccess={handleSuccess} />
        </motion.div>
      )}

      <div className="glass-card rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1">
            <Input
              placeholder="Cari panel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            {(["all", "free", "premium"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? "bg-malzz-blue text-white"
                    : "bg-malzz-grayLight text-malzz-textMid hover:bg-malzz-blueLight"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="md" onClick={() => setLoading(true)}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {loading ? (
          <TableSkeleton rows={8} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Server className="w-10 h-10 text-malzz-textLight mx-auto mb-3" />
            <p className="text-sm text-malzz-textMid">Panel tidak ditemukan</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((panel, i) => (
              <motion.div
                key={panel.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-center justify-between p-4 bg-malzz-grayLight rounded-2xl hover:bg-white transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-blue-purple flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {panel.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-malzz-textDark">{panel.username}</p>
                      <Badge variant={panel.type === "premium" ? "purple" : "default"} className="text-xs">{panel.type}</Badge>
                    </div>
                    <p className="text-xs text-malzz-textLight">{panel.email}</p>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-6 text-xs text-malzz-textLight">
                  <span>{panel.ram}MB RAM</span>
                  <span>{panel.disk}MB Disk</span>
                  <span>{formatDate(panel.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={panel.status === "active" ? "success" : "error"}>{panel.status}</Badge>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => window.open(panel.domain, "_blank")}
                      className="p-1.5 rounded-lg hover:bg-malzz-blueLight text-malzz-textLight hover:text-malzz-blue transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(panel)}
                      disabled={deletingId === panel.id}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-malzz-textLight hover:text-red-500 transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} panel={createdPanel} />
    </div>
  );
}
