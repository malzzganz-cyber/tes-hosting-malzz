"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Server, AlertTriangle, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { CreatePanelForm } from "@/components/forms/CreatePanelForm";
import { WhatsAppModal } from "@/components/modals/WhatsAppModal";
import { SuccessModal } from "@/components/modals/SuccessModal";
import { CooldownModal } from "@/components/modals/CooldownModal";
import { useSettings } from "@/hooks/useSettings";
import { Panel } from "@/types";
import {
  hasJoinedWhatsApp,
  getCooldownRemaining,
  getFreeCreateCount,
  formatCooldown,
} from "@/lib/utils";

export default function FreePanelPage() {
  const { settings, loading } = useSettings();
  const [showWaModal, setShowWaModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCooldown, setShowCooldown] = useState(false);
  const [createdPanel, setCreatedPanel] = useState<Panel | null>(null);
  const [cooldownMs, setCooldownMs] = useState(0);
  const [canCreate, setCanCreate] = useState(false);

  const COOLDOWN_HOURS = settings?.freeCooldownHours || 24;
  const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;
  const FREE_LIMIT = settings?.freePanelLimit || 3;

  useEffect(() => {
    const remaining = getCooldownRemaining(COOLDOWN_MS);
    const count = getFreeCreateCount();
    setCooldownMs(remaining);
    setCanCreate(remaining === 0 && count < FREE_LIMIT);
  }, [COOLDOWN_MS, FREE_LIMIT]);

  const handleCreateAttempt = () => {
    if (!hasJoinedWhatsApp()) {
      setShowWaModal(true);
      return;
    }
    const remaining = getCooldownRemaining(COOLDOWN_MS);
    if (remaining > 0) {
      setCooldownMs(remaining);
      setShowCooldown(true);
      return;
    }
    const count = getFreeCreateCount();
    if (count >= FREE_LIMIT) {
      setShowCooldown(true);
      setCooldownMs(COOLDOWN_MS);
      return;
    }
  };

  const handleSuccess = (panel: Panel) => {
    setCreatedPanel(panel);
    setShowSuccess(true);
    const remaining = getCooldownRemaining(COOLDOWN_MS);
    setCooldownMs(remaining > 0 ? remaining : COOLDOWN_MS);
    setCanCreate(false);
  };

  const handleWaJoined = () => {
    setShowWaModal(false);
    const remaining = getCooldownRemaining(COOLDOWN_MS);
    if (remaining > 0) {
      setCooldownMs(remaining);
      setShowCooldown(true);
    } else {
      setCanCreate(true);
    }
  };

  const remaining = getCooldownRemaining(COOLDOWN_MS);
  const count = getFreeCreateCount();
  const isOverLimit = count >= FREE_LIMIT;
  const isInCooldown = remaining > 0;
  const isLocked = isOverLimit || (isInCooldown && count > 0);

  return (
    <div className="min-h-screen bg-gradient-pastel">
      <Navbar />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-malzz-blue/6 rounded-full blur-3xl animate-float" />
        <div className="absolute top-60 right-10 w-64 h-64 bg-malzz-purple/6 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <main className="relative pt-28 pb-16 px-4">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-malzz-blueLight flex items-center justify-center mb-4">
              <Server className="w-7 h-7 text-malzz-blue" />
            </div>
            <h1 className="text-3xl font-bold text-malzz-textDark mb-2">
              Buat Free Panel
            </h1>
            <p className="text-malzz-textMid">
              Buat panel Pterodactyl gratis untuk mencoba layanan kami
            </p>
          </motion.div>

          {settings?.maintenanceMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-6"
            >
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-700">Mode Maintenance</p>
                <p className="text-xs text-amber-600 mt-0.5">Pembuatan panel sedang dinonaktifkan sementara</p>
              </div>
            </motion.div>
          )}

          {isInCooldown && !isOverLimit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 p-4 bg-malzz-blueLight border border-malzz-blue/20 rounded-2xl mb-6"
            >
              <Clock className="w-5 h-5 text-malzz-blue shrink-0" />
              <div>
                <p className="text-sm font-semibold text-malzz-blue">Cooldown Aktif</p>
                <p className="text-xs text-malzz-blue/70">
                  Dapat buat panel lagi dalam: {formatCooldown(remaining)}
                </p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-7 shadow-glass"
          >
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-malzz-blue" />
                <span className="text-sm font-semibold text-malzz-textDark">Free Panel</span>
              </div>
              <span className="text-xs bg-malzz-blueLight text-malzz-blue px-2.5 py-1 rounded-full font-medium">
                {count}/{FREE_LIMIT} digunakan
              </span>
            </div>

            {isLocked || settings?.maintenanceMode ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <p className="text-sm font-semibold text-malzz-textDark mb-2">
                  {settings?.maintenanceMode ? "Maintenance Mode" : isOverLimit ? "Limit Tercapai" : "Cooldown Aktif"}
                </p>
                <p className="text-xs text-malzz-textMid mb-4">
                  {settings?.maintenanceMode
                    ? "Silakan coba lagi nanti"
                    : isOverLimit
                    ? `Kamu sudah mencapai limit ${FREE_LIMIT} free panel`
                    : `Tunggu ${formatCooldown(remaining)} lagi`}
                </p>
                <a
                  href="/premium"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-blue-purple text-white text-sm font-medium rounded-xl shadow-glass-blue"
                >
                  <Zap className="w-4 h-4" />
                  Upgrade Premium
                </a>
              </div>
            ) : (
              <div onClick={!hasJoinedWhatsApp() ? () => setShowWaModal(true) : undefined}>
                <CreatePanelForm
                  type="free"
                  settings={settings}
                  onSuccess={handleSuccess}
                />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center"
          >
            <p className="text-xs text-malzz-textLight">
              Ingin akses tak terbatas?{" "}
              <a href="/premium" className="text-malzz-blue font-medium hover:underline">
                Upgrade ke Premium
              </a>
            </p>
          </motion.div>
        </div>
      </main>

      <WhatsAppModal
        isOpen={showWaModal}
        onClose={() => setShowWaModal(false)}
        onJoined={handleWaJoined}
        whatsappLink={settings?.whatsappChannel || "https://whatsapp.com/channel/malzz"}
      />
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        panel={createdPanel}
      />
      <CooldownModal
        isOpen={showCooldown}
        onClose={() => setShowCooldown(false)}
        remainingMs={cooldownMs}
      />
    </div>
  );
}
