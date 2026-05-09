"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Server,
  Users,
  Settings,
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
  Bell,
  BarChart3,
  UserCog,
  Shield,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const dashboardLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Panel Saya", href: "/dashboard/panels", icon: Server },
  { label: "Notifikasi", href: "/dashboard/notifications", icon: Bell },
  { label: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Panel", href: "/admin/panels", icon: Server },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Reseller", href: "/admin/resellers", icon: UserCog },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Pengaturan", href: "/admin/settings", icon: Settings },
];

interface SidebarProps {
  type?: "dashboard" | "admin";
}

export function Sidebar({ type = "dashboard" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { userData, role } = useAuthStore();

  const links = type === "admin" ? adminLinks : dashboardLinks;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Berhasil logout");
      window.location.href = "/";
    } catch {
      toast.error("Gagal logout");
    }
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative h-screen flex flex-col glass border-r border-white/60 shadow-glass overflow-hidden"
    >
      <div className={cn("flex items-center p-4 border-b border-gray-100/60", collapsed ? "justify-center" : "gap-3")}>
        <div className="w-8 h-8 rounded-xl bg-gradient-blue-purple flex items-center justify-center shadow-glass-blue shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-malzz-textDark whitespace-nowrap"
            >
              Malzz<span className="gradient-text">Hosting</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {type === "admin" && !collapsed && (
        <div className="mx-3 mt-3 px-3 py-2 bg-gradient-to-r from-malzz-blueLight to-malzz-lavender rounded-xl border border-malzz-blue/20">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-malzz-blue" />
            <span className="text-xs font-semibold text-malzz-blue">Admin Panel</span>
          </div>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/admin" && link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 3 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "bg-gradient-to-r from-malzz-blueLight to-malzz-lavender text-malzz-blue shadow-sm"
                    : "text-malzz-textMid hover:bg-malzz-grayLight hover:text-malzz-textDark"
                )}
              >
                <link.icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    isActive ? "text-malzz-blue" : "text-malzz-textLight group-hover:text-malzz-textDark"
                  )}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-malzz-blue"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100/60 space-y-2">
        {!collapsed && userData && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-malzz-grayLight">
            <div className="w-8 h-8 rounded-full bg-gradient-blue-purple flex items-center justify-center text-white text-xs font-bold shrink-0">
              {userData.displayName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-malzz-textDark truncate">
                {userData.displayName}
              </p>
              <p className="text-xs text-malzz-textLight capitalize">{role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-malzz-textMid hover:bg-red-50 hover:text-red-500 transition-all duration-200",
            collapsed ? "justify-center" : ""
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-malzz-blueLight transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-malzz-textMid" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-malzz-textMid" />
        )}
      </button>
    </motion.aside>
  );
}
