"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { Shield, AlertTriangle } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { firebaseUser, loading, role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/premium?redirect=/admin");
    }
    if (!loading && firebaseUser && role !== "admin" && role !== "reseller") {
      router.push("/dashboard");
    }
  }, [firebaseUser, loading, role, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-pastel flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-10 h-10 text-malzz-blue mx-auto mb-3 animate-pulse" />
          <p className="text-sm text-malzz-textMid">Verifikasi akses...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser || (role !== "admin" && role !== "reseller")) {
    return (
      <div className="min-h-screen bg-gradient-pastel flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-malzz-textDark">Akses Ditolak</p>
          <p className="text-xs text-malzz-textMid mt-1">Anda tidak memiliki izin untuk halaman ini</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-pastel overflow-hidden">
      <Sidebar type="admin" />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
