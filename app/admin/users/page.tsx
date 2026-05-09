"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Trash2, UserCheck, UserX, Crown } from "lucide-react";
import { collection, onSnapshot, orderBy, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TableSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "premium" | "free">("all");

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as User)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.displayName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.role === filter;
    return matchSearch && matchFilter;
  });

  const handleToggleActive = async (user: User) => {
    try {
      await updateDoc(doc(db, "users", user.uid), { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? "dinonaktifkan" : "diaktifkan"}`);
    } catch {
      toast.error("Gagal mengupdate user");
    }
  };

  const handleUpgrade = async (user: User) => {
    if (!confirm(`Upgrade ${user.displayName} ke Premium?`)) return;
    try {
      await updateDoc(doc(db, "users", user.uid), { role: "premium", maxPanels: 999 });
      toast.success("User diupgrade ke premium");
    } catch {
      toast.error("Gagal upgrade user");
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Hapus user ${user.displayName}?`)) return;
    try {
      await deleteDoc(doc(db, "users", user.uid));
      toast.success("User dihapus");
    } catch {
      toast.error("Gagal menghapus user");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-malzz-textDark flex items-center gap-2">
          <Users className="w-6 h-6 text-malzz-blue" /> Manajemen User
        </h1>
        <p className="text-sm text-malzz-textMid mt-1">{users.length} user terdaftar</p>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1">
            <Input
              placeholder="Cari user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            {(["all", "premium", "free"] as const).map((f) => (
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
        </div>

        {loading ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-malzz-textLight mx-auto mb-3" />
            <p className="text-sm text-malzz-textMid">User tidak ditemukan</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((user, i) => (
              <motion.div
                key={user.uid}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-4 bg-malzz-grayLight rounded-2xl hover:bg-white transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-blue-purple flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {user.displayName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-malzz-textDark text-sm">{user.displayName}</p>
                      {!user.isActive && <Badge variant="error" className="text-xs">Nonaktif</Badge>}
                    </div>
                    <p className="text-xs text-malzz-textLight">{user.email}</p>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-3 text-xs text-malzz-textLight">
                  <span>{user.panelCount || 0} panel</span>
                  <span>{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.role === "premium" ? "purple" : "default"} className="capitalize">
                    {user.role}
                  </Badge>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {user.role !== "premium" && (
                      <button
                        onClick={() => handleUpgrade(user)}
                        className="p-1.5 rounded-lg hover:bg-malzz-lavender text-malzz-textLight hover:text-malzz-purple transition-colors"
                        title="Upgrade Premium"
                      >
                        <Crown className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleActive(user)}
                      className="p-1.5 rounded-lg hover:bg-amber-50 text-malzz-textLight hover:text-amber-500 transition-colors"
                    >
                      {user.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
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
      </div>
    </div>
  );
}
