"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-pastel flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-malzz-blue/6 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-malzz-purple/6 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center glass rounded-3xl p-12 max-w-md w-full shadow-glass-lg"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-16 h-16 mx-auto rounded-2xl bg-malzz-blueLight flex items-center justify-center mb-6"
        >
          <Zap className="w-8 h-8 text-malzz-blue" />
        </motion.div>

        <h1 className="text-6xl font-bold gradient-text mb-3">404</h1>
        <h2 className="text-xl font-semibold text-malzz-textDark mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-sm text-malzz-textMid mb-8">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-blue-purple text-white font-medium rounded-xl hover:opacity-90 transition-opacity shadow-glass-blue"
          >
            <Home className="w-4 h-4" />
            Beranda
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 glass text-malzz-textDark font-medium rounded-xl border border-gray-200 hover:bg-white/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>
      </motion.div>
    </div>
  );
}
