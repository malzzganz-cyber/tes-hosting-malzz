"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { firebaseUser, role } = useAuthStore();

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Free Panel", href: "/free" },
    { label: "Premium", href: "/premium" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4"
    >
      <div className="glass rounded-2xl px-5 py-3 shadow-glass flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-blue-purple flex items-center justify-center shadow-glass-blue group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-malzz-textDark tracking-tight">
            Malzz<span className="gradient-text">Hosting</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-malzz-textMid hover:text-malzz-textDark hover:bg-malzz-blueLight rounded-xl transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {firebaseUser ? (
            <Link
              href={role === "admin" ? "/admin" : "/dashboard"}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-blue-purple text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity shadow-glass-blue"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/premium"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-blue-purple text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity shadow-glass-blue"
            >
              <LogIn className="w-4 h-4" />
              Login Premium
            </Link>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-malzz-blueLight transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="glass rounded-2xl mt-2 p-3 shadow-glass-lg"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-malzz-textMid hover:text-malzz-textDark hover:bg-malzz-blueLight rounded-xl transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-gray-100">
              <Link
                href={firebaseUser ? (role === "admin" ? "/admin" : "/dashboard") : "/premium"}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-blue-purple text-white text-sm font-medium rounded-xl"
              >
                <LogIn className="w-4 h-4" />
                {firebaseUser ? "Dashboard" : "Login Premium"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
