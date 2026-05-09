"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCooldown } from "@/lib/utils";
import Link from "next/link";

interface CooldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingMs: number;
}

export function CooldownModal({ isOpen, onClose, remainingMs }: CooldownModalProps) {
  const [remaining, setRemaining] = useState(remainingMs);

  useEffect(() => {
    if (!isOpen) return;
    setRemaining(remainingMs);
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, remainingMs]);

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
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-glass-lg max-w-sm w-full"
          >
            <div className="p-8 text-center">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-gray-100 text-malzz-textLight"
              >
                <X className="w-4 h-4" />
              </button>

              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-6"
              >
                <Clock className="w-8 h-8 text-amber-500" />
              </motion.div>

              <h2 className="text-xl font-bold text-malzz-textDark mb-2">
                Cooldown Aktif
              </h2>
              <p className="text-sm text-malzz-textMid mb-4">
                Kamu sudah membuat free panel. Tunggu sebelum bisa membuat lagi.
              </p>

              <div className="py-4 px-6 bg-amber-50 border border-amber-200 rounded-2xl mb-6">
                <p className="text-3xl font-bold text-amber-500 font-mono">
                  {formatCooldown(remaining)}
                </p>
                <p className="text-xs text-amber-400 mt-1">tersisa</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-malzz-textMid">Ingin panel tanpa batas?</p>
                <Link href="/premium">
                  <Button variant="primary" fullWidth>
                    <Zap className="w-4 h-4" />
                    Upgrade ke Premium
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
