"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserCog, Plus, Trash2, Search, Eye, EyeOff } from "lucide-react";
import { collection, onSnapshot, orderBy, query, addDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Reseller } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TableSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatDate, generatePassword } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

export default function AdminResellersPage() {
  const { firebaseUser } = useAuthStore();
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ email: "", displayName: "", maxUsers: "50" });
  const [showPass, setShowPass] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const q = query(collection(db, "reseller"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setResellers(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as Reseller)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = resellers.filter(
    (r) =>
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.displayName) { toast.error("Isi semua field"); return; }
    setCreating(true);
    const password = generatePassword(12);
    setNewPassword(password);
    try {
      const token = await firebaseUser?.getIdToken();
      await axios.post("/api/admin/create-reseller", { ...form, password }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Reseller berhasil dibuat!");
      setForm({ email: "", displayName: "", maxUsers: "50" });
      setShowForm(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || "Gagal membuat reseller");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (r: Reseller) => {
    if (!confirm(`Hapus reseller ${r.displayName}?`)) return;
    try {
      await deleteDoc(doc(db, "reseller", r.uid));
      toast.success("Reseller dihapus");
    } catch {
      toast.error("Gagal menghapus reseller");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-malzz-textDark flex items-center gap-2">
            <UserCog className="w-6 h-6 text-malzz-blue" /> Manajemen Reseller
          </h1>
          <p className="text-sm text-malzz-textMid mt-1">{resellers.length} reseller terdaftar</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          {showForm ? "Batal" : "Tambah Reseller"}
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-7"
        >
          <h2 className="font-semibold text-malzz-textDark mb-5">Buat Akun Reseller</h2>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Nama Lengkap"
              placeholder="Nama reseller"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Max Users"
              type="number"
              min="1"
              value={form.maxUsers}
              onChange={(e) => setForm({ ...form, maxUsers: e.target.value })}
            />
            <div className="sm:col-span-3">
              <Button type="submit" loading={creating} fullWidth>
                Buat Akun Reseller
              </Button>
            </div>
          </form>
          {newPassword && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <p className="text-sm font-semibold text-green-700 mb-1">Akun berhasil dibuat!</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-green-600">Password: </p>
                <code className="text-sm font-mono bg-white px-2 py-0.5 rounded border">
                  {showPass ? newPassword : "••••••••••••"}
                </code>
                <button onClick={() => setShowPass(!showPass)} className="text-green-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-green-500 mt-1">Simpan password ini, tidak akan ditampilkan lagi!</p>
            </div>
          )}
        </motion.div>
      )}

      <div className="glass-card rounded-3xl p-6">
        <div className="mb-4">
          <Input
            placeholder="Cari reseller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        {loading ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <UserCog className="w-10 h-10 text-malzz-textLight mx-auto mb-3" />
            <p className="text-sm text-malzz-textMid">Belum ada reseller</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((r, i) => (
              <motion.div
                key={r.uid}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-4 bg-malzz-grayLight rounded-2xl hover:bg-white transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-peach-purple flex items-center justify-center text-white font-bold text-sm">
                    {r.displayName?.charAt(0)?.toUpperCase() || "R"}
                  </div>
                  <div>
                    <p className="font-semibold text-malzz-textDark text-sm">{r.displayName}</p>
                    <p className="text-xs text-malzz-textLight">{r.email}</p>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-4 text-xs text-malzz-textLight">
                  <span>{r.currentUsers || 0}/{r.maxUsers} users</span>
                  <span>{formatDate(r.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={r.isActive ? "success" : "error"}>
                    {r.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                  <button
                    onClick={() => handleDelete(r)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-malzz-textLight hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
