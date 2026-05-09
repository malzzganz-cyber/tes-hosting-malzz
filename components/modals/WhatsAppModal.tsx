"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { setJoinedWhatsApp } from "@/lib/utils";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoined: () => void;
  whatsappLink: string;
}

export function WhatsAppModal({ isOpen, onClose, onJoined, whatsappLink }: WhatsAppModalProps) {
  const handleJoined = () => {
    setJoinedWhatsApp();
    onJoined();
    onClose();
  };

  const handleOpen = () => {
    window.open(whatsappLink, "_blank");
  };

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
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-glass-lg max-w-sm w-full overflow-hidden"
          >
            <div className="relative p-8 text-center">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-gray-100 text-malzz-textLight transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg mb-6"
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.div>

              <h2 className="text-xl font-bold text-malzz-textDark mb-2">
                Gabung WhatsApp Channel
              </h2>
              <p className="text-sm text-malzz-textMid mb-6 leading-relaxed">
                Untuk mendapatkan akses free panel, kamu perlu join channel WhatsApp Malzz Hosting terlebih dahulu.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleOpen}
                  variant="primary"
                  fullWidth
                  className="bg-green-500 hover:bg-green-600 shadow-none"
                >
                  <ExternalLink className="w-4 h-4" />
                  Buka WhatsApp Channel
                </Button>

                <Button
                  onClick={handleJoined}
                  variant="secondary"
                  fullWidth
                >
                  <CheckCircle className="w-4 h-4" />
                  Sudah Join, Lanjutkan
                </Button>
              </div>

              <p className="text-xs text-malzz-textLight mt-4">
                Pastikan kamu sudah join sebelum melanjutkan
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
