"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-pastel flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center glass rounded-3xl p-12 max-w-md w-full shadow-glass-lg"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <h1 className="text-xl font-semibold text-malzz-textDark mb-2">Terjadi Kesalahan</h1>
        <p className="text-sm text-malzz-textMid mb-8">
          {error.message || "Ada sesuatu yang salah. Silakan coba lagi."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-blue-purple text-white font-medium rounded-xl hover:opacity-90 transition-opacity shadow-glass-blue"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 glass text-malzz-textDark font-medium rounded-xl border border-gray-200"
          >
            <Home className="w-4 h-4" />
            Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
