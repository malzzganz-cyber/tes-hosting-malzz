"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check, CheckCheck, Trash2, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { collection, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Notification } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const typeIcon = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const typeVariant: Record<string, "default" | "success" | "warning" | "error"> = {
  info: "default",
  success: "success",
  warning: "warning",
  error: "error",
};

export default function NotificationsPage() {
  const { role } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("targetRole", "in", [role, "all"]),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notification)));
      setLoading(false);
    });
    return () => unsub();
  }, [role]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = async (notif: Notification) => {
    await updateDoc(doc(db, "notifications", notif.id), { isRead: true });
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => updateDoc(doc(db, "notifications", n.id), { isRead: true })));
    toast.success("Semua notifikasi ditandai dibaca");
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "notifications", id));
    toast.success("Notifikasi dihapus");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-malzz-textDark flex items-center gap-2">
            <Bell className="w-6 h-6 text-malzz-blue" />
            Notifikasi
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-malzz-blue text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-malzz-textMid mt-1">{notifications.length} notifikasi</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="w-4 h-4" />
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />
          ))
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-3xl">
            <Bell className="w-10 h-10 text-malzz-textLight mx-auto mb-3" />
            <p className="text-sm text-malzz-textMid">Tidak ada notifikasi</p>
          </div>
        ) : (
          notifications.map((notif, i) => {
            const Icon = typeIcon[notif.type];
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-start gap-4 p-4 rounded-2xl transition-all group ${
                  notif.isRead ? "bg-malzz-grayLight" : "bg-white shadow-card border border-malzz-blue/10"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.type === "success" ? "bg-green-50" :
                  notif.type === "warning" ? "bg-amber-50" :
                  notif.type === "error" ? "bg-red-50" : "bg-malzz-blueLight"
                }`}>
                  <Icon className={`w-5 h-5 ${
                    notif.type === "success" ? "text-green-500" :
                    notif.type === "warning" ? "text-amber-500" :
                    notif.type === "error" ? "text-red-500" : "text-malzz-blue"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-malzz-textDark">{notif.title}</p>
                    <Badge variant={typeVariant[notif.type]} className="text-xs capitalize">{notif.type}</Badge>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-malzz-blue" />
                    )}
                  </div>
                  <p className="text-sm text-malzz-textMid leading-relaxed">{notif.message}</p>
                  <p className="text-xs text-malzz-textLight mt-1.5">{formatDate(notif.createdAt)}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkRead(notif)}
                      className="p-1.5 rounded-lg hover:bg-malzz-blueLight text-malzz-textLight hover:text-malzz-blue transition-colors"
                      title="Tandai dibaca"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-malzz-textLight hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
