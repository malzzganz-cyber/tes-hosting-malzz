"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Server, Plus, ExternalLink, Trash2, Search, MemoryStick, Cpu, HardDrive, Copy, Check
} from "lucide-react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { Panel } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CreatePanelForm } from "@/components/forms/CreatePanelForm";
import { SuccessModal } from "@/components/modals/SuccessModal";
import { useSettings } from "@/hooks/useSettings";
import { formatDate } from "@/lib/utils";
import { TableSkeleton } from "@/components/ui/LoadingSkeleton";
import axios from "axios";
import toast from "react-hot-toast";

export default function PanelsPage() {
  const { firebaseUser } = useAuthStore();
  const { settings } = useSettings();
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createdPanel, setCreatedPanel] = useState<Panel | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseUser) return;
    const q = query(
      collection(db, "panels"),
      where("ownerId", "==", firebaseUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setPanels(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Panel)));
      setLoading(false);
    });
    return () => unsub();
  }, [firebaseUser]);

  const filtered = panels.filter(
    (p) =>
      p.username.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSuccess = (panel: Panel) => {
    setCreatedPanel(panel);
    setShowSuccess(true);
    setShowCreate(false);
  };

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

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Disalin!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-malzz-textDark">Panel Saya</h1>
          <p className="text-sm text-malzz-textMid mt-1">{panels.length} panel terdaftar</p>
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
          <h2 className="font-semibold text-malzz-textDark mb-5">Buat Panel Baru</h2>
          <CreatePanelForm type="premium" settings={settings} onSuccess={handleSuccess} />
        </motion.div>
      )}

      <div className="glass-card rounded-3xl p-6">
        <div className="mb-4">
          <Input
            placeholder="Cari panel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {loading ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Server className="w-10 h-10 text-malzz-textLight mx-auto mb-3" />
            <p className="text-sm text-malzz-textMid">
              {search ? "Panel tidak ditemukan" : "Belum ada panel"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((panel, i) => (
              <motion.div
                key={panel.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-4 bg-malzz-grayLight rounded-2xl hover:bg-white transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-blue-purple flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {panel.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-malzz-textDark text-sm">{panel.username}</p>
                        <Badge variant={panel.type === "premium" ? "purple" : "default"} className="text-xs">
                          {panel.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-malzz-textLight">{panel.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={panel.status === "active" ? "success" : "error"}>
                      {panel.status}
                    </Badge>
                    <button
                      onClick={() => handleCopy(panel.password, `pwd-${panel.id}`)}
                      className="p-1.5 rounded-lg hover:bg-malzz-blueLight text-malzz-textLight hover:text-malzz-blue transition-colors"
                      title="Salin password"
                    >
                      {copiedId === `pwd-${panel.id}` ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
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

                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-4 gap-3 text-xs text-malzz-textLight">
                  <span className="flex items-center gap-1">
                    <MemoryStick className="w-3 h-3 text-malzz-blue" /> {panel.ram} MB RAM
                  </span>
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-malzz-purple" /> {panel.cpu === 0 ? "∞" : `${panel.cpu}%`} CPU
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-orange-400" /> {panel.disk} MB Disk
                  </span>
                  <span>{formatDate(panel.createdAt)}</span>
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
