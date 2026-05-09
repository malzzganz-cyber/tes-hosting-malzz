"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Server, Users, UserCog, Activity, TrendingUp, Clock, Shield } from "lucide-react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { MalzzAreaChart } from "@/components/charts/AreaChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { ActivityLog, Panel } from "@/types";
import { formatDate } from "@/lib/utils";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { useAuthStore } from "@/store/authStore";

export default function AdminDashboard() {
  const { role } = useAuthStore();
  const [totalPanels, setTotalPanels] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalResellers, setTotalResellers] = useState(0);
  const [recentPanels, setRecentPanels] = useState<Panel[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<{ name: string; value: number; value2: number }[]>([]);

  useEffect(() => {
    const unsubPanels = onSnapshot(collection(db, "panels"), (snap) => {
      setTotalPanels(snap.size);
      const panels = snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as Panel))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentPanels(panels);
      setLoading(false);
    });
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => setTotalUsers(snap.size));
    const unsubResellers = onSnapshot(collection(db, "reseller"), (snap) => setTotalResellers(snap.size));
    const unsubActivity = onSnapshot(
      query(collection(db, "activity"), orderBy("createdAt", "desc"), limit(8)),
      (snap) => setRecentActivity(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityLog)))
    );

    const now = new Date();
    const data = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      return {
        name: d.toLocaleDateString("id-ID", { weekday: "short" }),
        value: Math.floor(Math.random() * 20) + 5,
        value2: Math.floor(Math.random() * 10) + 2,
      };
    });
    setChartData(data);

    return () => {
      unsubPanels();
      unsubUsers();
      unsubResellers();
      unsubActivity();
    };
  }, []);

  const donutData = [
    { name: "Panel Free", value: Math.round(totalPanels * 0.6), color: "#6C9EFF" },
    { name: "Panel Premium", value: Math.round(totalPanels * 0.4), color: "#B19DFF" },
  ];

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-6 h-6 text-malzz-blue" />
          <h1 className="text-2xl font-bold text-malzz-textDark">Admin Dashboard</h1>
          <Badge variant={role === "admin" ? "purple" : "default"} className="capitalize">{role}</Badge>
        </div>
        <p className="text-sm text-malzz-textMid">Monitoring realtime semua aktivitas platform</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Panel" value={totalPanels} icon={Server} trend={{ value: 12, label: "minggu ini" }} delay={0} />
        <StatCard title="Total Users" value={totalUsers} icon={Users} iconColor="text-malzz-purple" iconBg="bg-malzz-lavender" trend={{ value: 8, label: "minggu ini" }} delay={0.05} />
        <StatCard title="Reseller" value={totalResellers} icon={UserCog} iconColor="text-orange-400" iconBg="bg-malzz-peachLight" delay={0.1} />
        <StatCard title="Aktivitas" value={recentActivity.length} icon={Activity} iconColor="text-green-500" iconBg="bg-green-50" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-malzz-textDark flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-malzz-blue" /> Panel Dibuat (7 Hari)
            </h2>
            <div className="flex gap-3 text-xs text-malzz-textLight">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-malzz-blue inline-block" />Free</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-malzz-purple inline-block" />Premium</span>
            </div>
          </div>
          <MalzzAreaChart data={chartData} color="#6C9EFF" color2="#B19DFF" height={200} label="Free" label2="Premium" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card rounded-3xl p-6"
        >
          <h2 className="font-semibold text-malzz-textDark mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-malzz-purple" /> Distribusi Panel
          </h2>
          <DonutChart data={donutData} height={180} />
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl p-6"
        >
          <h2 className="font-semibold text-malzz-textDark mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-malzz-blue" /> Panel Terbaru
          </h2>
          {recentPanels.length === 0 ? (
            <p className="text-sm text-malzz-textLight text-center py-6">Belum ada panel</p>
          ) : (
            <div className="space-y-2">
              {recentPanels.map((panel) => (
                <div key={panel.id} className="flex items-center justify-between p-3 bg-malzz-grayLight rounded-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-blue-purple flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {panel.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-malzz-textDark truncate">{panel.username}</p>
                      <p className="text-xs text-malzz-textLight">{panel.type}</p>
                    </div>
                  </div>
                  <Badge variant={panel.status === "active" ? "success" : "error"} className="text-xs">{panel.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-3xl p-6"
        >
          <h2 className="font-semibold text-malzz-textDark mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-malzz-purple" /> Aktivitas Terbaru
          </h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-malzz-textLight text-center py-6">Belum ada aktivitas</p>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-malzz-grayLight rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-malzz-blue mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-malzz-textDark">{log.action}</p>
                    <p className="text-xs text-malzz-textLight mt-0.5">{formatDate(log.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
