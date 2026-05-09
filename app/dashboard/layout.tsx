"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { firebaseUser, loading, role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/premium?redirect=/dashboard");
    }
  }, [firebaseUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-pastel flex items-center justify-center">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!firebaseUser) return null;

  return (
    <div className="flex h-screen bg-gradient-pastel overflow-hidden">
      <Sidebar type={role === "admin" ? "admin" : "dashboard"} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
