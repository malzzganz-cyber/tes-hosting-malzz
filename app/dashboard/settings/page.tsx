"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, User, Mail, Shield, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DashboardSettingsPage() {
  const { firebaseUser, userData, role } = useAuthStore();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(userData?.displayName || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!firebaseUser || !displayName) return;
    setSaving(true);
    try {
      await updateProfile(firebaseUser, { displayName });
      await updateDoc(doc(db, "users", firebaseUser.uid), { displayName });
      toast.success("Profil berhasil diperbarui!");
    } catch {
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Berhasil logout");
    router.push("/");
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-malzz-textDark flex items-center gap-2">
          <Settings className="w-6 h-6 text-malzz-blue" /> Pengaturan Akun
        </h1>
        <p className="text-sm text-malzz-textMid mt-1">Kelola informasi akun Anda</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-gradient-blue-purple flex items-center justify-center text-white text-xl font-bold shadow-glass-blue">
            {userData?.displayName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-semibold text-malzz-textDark">{userData?.displayName}</p>
            <p className="text-sm text-malzz-textLight">{userData?.email}</p>
            <Badge variant={role === "premium" || role === "admin" ? "purple" : "default"} className="mt-1 capitalize">
              {role}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Nama Tampilan"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
          />
          <Input
            label="Email"
            value={userData?.email || ""}
            disabled
            leftIcon={<Mail className="w-4 h-4" />}
            helperText="Email tidak bisa diubah"
          />
          <div className="flex items-center justify-between p-4 bg-malzz-grayLight rounded-2xl">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-malzz-blue" />
              <div>
                <p className="text-sm font-medium text-malzz-textDark">Tipe Akun</p>
                <p className="text-xs text-malzz-textLight capitalize">{role} account</p>
              </div>
            </div>
            <Badge variant={role === "premium" || role === "admin" ? "purple" : "default"} className="capitalize">
              {role}
            </Badge>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <Button onClick={handleSave} loading={saving} fullWidth>
            Simpan Perubahan
          </Button>
          <Button onClick={handleLogout} variant="danger" fullWidth>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-3xl p-6">
        <h2 className="font-semibold text-malzz-textDark mb-4">Statistik Akun</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-malzz-blueLight rounded-2xl text-center">
            <p className="text-2xl font-bold text-malzz-blue">{userData?.panelCount || 0}</p>
            <p className="text-xs text-malzz-textLight mt-1">Panel Dibuat</p>
          </div>
          <div className="p-4 bg-malzz-lavender rounded-2xl text-center">
            <p className="text-2xl font-bold text-malzz-purple">
              {userData?.maxPanels === 999 ? "∞" : userData?.maxPanels || 0}
            </p>
            <p className="text-xs text-malzz-textLight mt-1">Limit Panel</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
