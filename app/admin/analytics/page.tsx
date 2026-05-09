"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Server, Users, TrendingUp, Activity } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StatCard } from "@/components/ui/StatCard";
import { MalzzAreaChart } from "@/components/charts/AreaChart";
import { DonutChart } from "@/components/charts/DonutChart";

export default function AdminAnalyticsPage() {
  const [totalPanels, setTotalPanels] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [freePanels, setFreePanels] = useState(0);
  const [premiumPanels, setPremiumPanels] = useState(0);

  const generateWeeklyData = (max: number) =>
    Array.from({ length: 7 }, (_, i) => ({
      name: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][i],
      value: Math.floor(Math.random() * max) + Math.floor(max * 0.3),
      value2: Math.floor(Math.random() * (max * 0.5)) + Math.floor(max * 0.1),
    }));

  const generateMonthlyData = (max: number) =>
    Array.from({ length: 12 }, (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"][i],
      value: Math.floor(Math.random() * max) + Math.floor(max * 0.3),
      value2: Math.floor(Math.random() * (max * 0.5)) + Math.floor(max * 0.1),
    }));

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "panels"), (snap) => {
      setTotalPanels(snap.size);
      const free = snap.docs.filter((d) => d.data().type === "free").length;
      setFreePanels(free);
      setPremiumPanels(snap.size - free);
    });
    const unsub2 = onSnapshot(collection(db, "users"), (snap) => setTotalUsers(snap.size));
    return () => { unsub1(); unsub2(); };
  }, []);

  const donutData = [
    { name: "Free Panel", value: freePanels, color: "#6C9EFF" },
    { name: "Premium Panel", value: premiumPanels, color: "#B19DFF" },
  ];

  const userDonut = [
    { name: "Free User", value: Math.round(totalUsers * 0.7), color: "#6C9EFF" },
    { name: "Premium User", value: Math.round(totalUsers * 0.25), color: "#B19DFF" },
    { name: "Reseller", value: Math.round(totalUsers * 0.05), color: "#FFBDA6" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-malzz-textDark flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-malzz-blue" /> Analytics
        </h1>
        <p className="text-sm text-malzz-textMid mt-1">Statistik platform secara keseluruhan</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Panel" value={totalPanels} icon={Server} trend={{ value: 12, label: "bulan ini" }} delay={0} />
        <StatCard title="Free Panel" value={freePanels} icon={Activity} iconColor="text-malzz-blue" iconBg="bg-malzz-blueLight" delay={0.05} />
        <StatCard title="Premium Panel" value={premiumPanels} icon={TrendingUp} iconColor="text-malzz-purple" iconBg="bg-malzz-lavender" delay={0.1} />
        <StatCard title="Total Users" value={totalUsers} icon={Users} iconColor="text-orange-400" iconBg="bg-malzz-peachLight" trend={{ value: 8, label: "bulan ini" }} delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-3xl p-6">
          <h2 className="font-semibold text-malzz-textDark mb-4">Panel Dibuat per Minggu</h2>
          <MalzzAreaChart data={generateWeeklyData(30)} color="#6C9EFF" color2="#B19DFF" height={220} label="Free" label2="Premium" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card rounded-3xl p-6">
          <h2 className="font-semibold text-malzz-textDark mb-4">User Bergabung per Bulan</h2>
          <MalzzAreaChart data={generateMonthlyData(50)} color="#FFBDA6" color2="#6C9EFF" height={220} label="New Users" label2="Active" />
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-3xl p-6">
          <h2 className="font-semibold text-malzz-textDark mb-4">Distribusi Panel</h2>
          <DonutChart data={donutData} height={220} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card rounded-3xl p-6">
          <h2 className="font-semibold text-malzz-textDark mb-4">Distribusi User</h2>
          <DonutChart data={userDonut} height={220} />
        </motion.div>
      </div>
    </div>
  );
}
