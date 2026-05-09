"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap, Mail, Lock, Eye, EyeOff, MessageCircle,
  ShoppingCart, Crown, CheckCircle, ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const premiumPerks = [
  "RAM unlimited, no batas",
  "CPU unlimited",
  "Create panel tanpa batas",
  "No cooldown, no spam filter",
  "Dashboard premium",
  "Support prioritas",
];

export default function PremiumPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email dan password wajib diisi");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Berhasil login!");
      router.push(redirect);
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        toast.error("Email atau password salah");
      } else {
        toast.error("Gagal login, coba lagi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-pastel">
      <Navbar />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-malzz-purple/8 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-malzz-blue/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "2.5s" }} />
      </div>

      <main className="relative pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-malzz-lavender rounded-full text-sm font-medium text-malzz-purple border border-malzz-purple/20 mb-6">
                <Crown className="w-4 h-4" />
                <span>Premium Access</span>
              </div>

              <h1 className="text-4xl font-bold text-malzz-textDark mb-4 leading-tight">
                Akses Premium<br />
                <span className="gradient-text">Tanpa Batas</span>
              </h1>

              <p className="text-malzz-textMid mb-8 leading-relaxed">
                Untuk mendapatkan akses premium, silahkan hubungi admin kami
                melalui Telegram dan dapatkan akun premium Anda.
              </p>

              <div className="space-y-3 mb-8">
                {premiumPerks.map((perk) => (
                  <div key={perk} className="flex items-center gap-3 text-sm text-malzz-textMid">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    {perk}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://t.me/malzznih"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-blue-purple text-white font-semibold rounded-xl shadow-glass-blue hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="w-5 h-5" />
                  Hubungi Admin
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="https://t.me/malzznih"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 glass text-malzz-textDark font-semibold rounded-xl shadow-glass border border-gray-200 hover:bg-white/90 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Beli Premium
                </a>
              </div>

              <p className="text-xs text-malzz-textLight mt-4">
                Admin Telegram:{" "}
                <a href="https://t.me/malzznih" className="text-malzz-blue font-medium" target="_blank" rel="noopener noreferrer">
                  t.me/malzznih
                </a>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card rounded-3xl p-8 shadow-glass"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-gradient-blue-purple flex items-center justify-center shadow-glass-blue">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-malzz-textDark">Login Premium</h2>
                  <p className="text-xs text-malzz-textLight">Masukkan akun premium kamu</p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  autoComplete="email"
                />
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:text-malzz-blue transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  autoComplete="current-password"
                />

                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                  {!loading && <Zap className="w-5 h-5" />}
                  {loading ? "Masuk..." : "Masuk ke Dashboard"}
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                <p className="text-sm text-malzz-textMid">
                  Belum punya akun premium?
                </p>
                <a
                  href="https://t.me/malzznih"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-malzz-blue hover:underline"
                >
                  <MessageCircle className="w-4 h-4" />
                  Hubungi t.me/malzznih
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
