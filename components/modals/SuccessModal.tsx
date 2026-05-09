"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Copy, Check, ExternalLink, X, Server, User, Mail, HardDrive, Cpu, MemoryStick } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/types";
import toast from "react-hot-toast";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  panel: Panel | null;
}

function CopyField({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} disalin!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-malzz-grayLight rounded-xl group">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
          <Icon className="w-4 h-4 text-malzz-blue" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-malzz-textLight">{label}</p>
          <p className="text-sm font-semibold text-malzz-textDark truncate max-w-[180px]">{value}</p>
        </div>
      </div>
      <button
        onClick={handleCopy}
        className="p-2 rounded-lg hover:bg-white text-malzz-textLight hover:text-malzz-blue transition-all ml-2 shrink-0"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

export function SuccessModal({ isOpen, onClose, panel }: SuccessModalProps) {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = async () => {
    if (!panel) return;
    const text = `
=== MALZZ HOSTING - PANEL CREDENTIALS ===
Domain   : ${panel.domain}
Username : ${panel.username}
Password : ${panel.password}
Email    : ${panel.email}
RAM      : ${panel.ram} MB
CPU      : ${panel.cpu}%
Disk     : ${panel.disk} MB
==========================================
    `.trim();
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    toast.success("Semua credentials berhasil disalin!");
    setTimeout(() => setCopiedAll(false), 2000);
  };

  if (!panel) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-glass-lg max-w-md w-full overflow-hidden"
          >
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-pastel opacity-60" />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-xl hover:bg-white/80 text-malzz-textLight transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1, bounce: 0.5 }}
                  className="w-16 h-16 mx-auto rounded-2xl bg-gradient-blue-purple flex items-center justify-center shadow-glass-blue mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-malzz-textDark mb-1">
                    Yeyy panelmu sudah berhasil dibuat 🎉
                  </h2>
                  <p className="text-sm text-malzz-textMid">
                    Simpan credentials berikut dengan baik
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="px-6 pb-6 space-y-2"
              >
                <CopyField label="Domain Panel" value={panel.domain} icon={ExternalLink} />
                <CopyField label="Username" value={panel.username} icon={User} />
                <CopyField label="Password" value={panel.password} icon={Server} />
                <CopyField label="Email" value={panel.email} icon={Mail} />
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-malzz-blueLight rounded-xl text-center">
                    <MemoryStick className="w-4 h-4 text-malzz-blue mx-auto mb-1" />
                    <p className="text-xs text-malzz-textLight">RAM</p>
                    <p className="text-sm font-bold text-malzz-blue">{panel.ram} MB</p>
                  </div>
                  <div className="p-3 bg-malzz-lavender rounded-xl text-center">
                    <Cpu className="w-4 h-4 text-malzz-purple mx-auto mb-1" />
                    <p className="text-xs text-malzz-textLight">CPU</p>
                    <p className="text-sm font-bold text-malzz-purple">{panel.cpu === 0 ? "∞" : `${panel.cpu}%`}</p>
                  </div>
                  <div className="p-3 bg-malzz-peachLight rounded-xl text-center">
                    <HardDrive className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                    <p className="text-xs text-malzz-textLight">Disk</p>
                    <p className="text-sm font-bold text-orange-400">{panel.disk} MB</p>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <Button onClick={handleCopyAll} variant="primary" fullWidth>
                    {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedAll ? "Tersalin!" : "Salin Semua Credentials"}
                  </Button>
                  <Button
                    onClick={() => window.open(panel.domain, "_blank")}
                    variant="secondary"
                    fullWidth
                  >
                    <ExternalLink className="w-4 h-4" />
                    Buka Panel
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
