"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: { value: number; label: string };
  delay?: number;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-malzz-blue",
  iconBg = "bg-malzz-blueLight",
  trend,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card-hover rounded-2xl p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBg)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-1 rounded-full",
              trend.value >= 0
                ? "text-green-600 bg-green-50"
                : "text-red-500 bg-red-50"
            )}
          >
            {trend.value >= 0 ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-malzz-textDark">{value}</p>
        <p className="text-sm font-medium text-malzz-textMid">{title}</p>
        {subtitle && (
          <p className="text-xs text-malzz-textLight">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
