"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Server, Shield, Users, CheckCircle, ArrowRight, Star, Clock, Globe } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

const features = [
  {
    icon: Zap,
    title: "Instant Deploy",
    desc: "Panel siap dalam hitungan detik, langsung bisa digunakan",
    color: "text-malzz-blue",
    bg: "bg-malzz-blueLight",
  },
  {
    icon: Shield,
    title: "Aman & Terpercaya",
    desc: "Sistem keamanan berlapis dengan Firebase Auth",
    color: "text-malzz-purple",
    bg: "bg-malzz-lavender",
  },
  {
    icon: Server,
    title: "Pterodactyl Powered",
    desc: "Berbasis Pterodactyl panel yang powerful dan reliable",
    color: "text-orange-400",
    bg: "bg-malzz-peachLight",
  },
  {
    icon: Globe,
    title: "99.9% Uptime",
    desc: "Server kami dijamin selalu online dan stabil",
    color: "text-green-500",
    bg: "bg-green-50",
  },
];

const plans = [
  {
    name: "Free",
    price: "Gratis",
    desc: "Untuk mencoba layanan kami",
    features: [
      "RAM hingga 4GB",
      "CPU max 100%",
      "1 Panel",
      "Cooldown 24 jam",
      "Wajib join WhatsApp",
    ],
    cta: "Buat Free Panel",
    href: "/free",
    gradient: "from-gray-50 to-gray-100",
    badge: null,
  },
  {
    name: "Premium",
    price: "Hubungi Admin",
    desc: "Untuk kebutuhan profesional",
    features: [
      "RAM Unlimited",
      "CPU Unlimited",
      "Create panel unlimited",
      "No cooldown",
      "Priority support",
      "Panel manajemen",
    ],
    cta: "Upgrade Premium",
    href: "/premium",
    gradient: "from-malzz-blueLight via-malzz-lavender to-malzz-peachLight",
    badge: "Popular",
  },
  {
    name: "Reseller",
    price: "Hubungi Admin",
    desc: "Untuk bisnis hosting",
    features: [
      "Create premium user",
      "Manage user",
      "Dashboard reseller",
      "Komisi menarik",
      "Full support",
    ],
    cta: "Jadi Reseller",
    href: "/premium",
    gradient: "from-malzz-lavender to-purple-50",
    badge: null,
  },
];

const testimonials = [
  { name: "Ahmad R.", role: "Developer", text: "Malzz Hosting sangat mudah digunakan, panel langsung jadi dalam detik!", stars: 5 },
  { name: "Siti M.", role: "Student", text: "Free panel cukup untuk project kampus saya. Highly recommended!", stars: 5 },
  { name: "Budi S.", role: "Indie Dev", text: "Premium plan worth it banget, RAM unlimited bikin project lancar.", stars: 5 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-pastel">
      <Navbar />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-malzz-blue/8 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-malzz-purple/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-malzz-peach/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <section className="relative pt-36 pb-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium text-malzz-blue border border-malzz-blue/20 mb-8 shadow-glass">
              <Zap className="w-4 h-4" />
              <span>Platform hosting panel terbaik di Indonesia</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-malzz-textDark mb-6 leading-tight tracking-tight"
          >
            Buat Panel{" "}
            <span className="gradient-text">Pterodactyl</span>
            <br />
            Dalam Detik
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-malzz-textMid max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Platform hosting premium dengan teknologi terdepan. Dapatkan panel
            server Pterodactyl Anda secara instan — gratis atau premium sesuai
            kebutuhan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/free"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-blue-purple text-white font-semibold rounded-2xl hover:opacity-90 transition-all shadow-glass-blue text-base"
            >
              <Zap className="w-5 h-5" />
              Coba Gratis Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/premium"
              className="flex items-center gap-2 px-8 py-4 glass text-malzz-textDark font-semibold rounded-2xl hover:bg-white/90 transition-all shadow-glass text-base border border-gray-200"
            >
              Upgrade Premium
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-6 mt-10 text-sm text-malzz-textLight"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Tanpa kartu kredit</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-malzz-blue" />
              <span>Setup instan</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-malzz-purple" />
              <span>1000+ pengguna aktif</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-malzz-textDark mb-4">
              Kenapa Malzz Hosting?
            </h2>
            <p className="text-malzz-textMid max-w-xl mx-auto">
              Kami menghadirkan pengalaman hosting terbaik dengan teknologi modern
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-hover rounded-2xl p-6 text-center"
              >
                <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-4 ${f.bg}`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-malzz-textDark mb-2">{f.title}</h3>
                <p className="text-sm text-malzz-textMid leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-malzz-textDark mb-4">
              Pilih Paket yang Tepat
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative glass rounded-3xl p-7 border border-white/60 shadow-glass hover:shadow-glass-lg transition-all duration-300 bg-gradient-to-br ${plan.gradient}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 right-6 px-4 py-1 bg-gradient-blue-purple text-white text-xs font-bold rounded-full shadow-glass-blue">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-malzz-textDark mb-1">{plan.name}</h3>
                  <p className="text-2xl font-extrabold gradient-text">{plan.price}</p>
                  <p className="text-sm text-malzz-textLight mt-1">{plan.desc}</p>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-malzz-textMid">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-blue-purple text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm shadow-glass-blue"
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-malzz-textDark mb-4">
              Apa Kata Pengguna Kami
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-malzz-textMid mb-4 leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold text-malzz-textDark">{t.name}</p>
                  <p className="text-xs text-malzz-textLight">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 shadow-glass-lg"
          >
            <h2 className="text-3xl font-bold text-malzz-textDark mb-4">
              Siap Membuat Panel Pertamamu?
            </h2>
            <p className="text-malzz-textMid mb-8">
              Bergabunglah dengan ribuan pengguna yang sudah mempercayai Malzz Hosting
            </p>
            <Link
              href="/free"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-blue-purple text-white font-semibold rounded-2xl hover:opacity-90 transition-all shadow-glass-blue"
            >
              <Zap className="w-5 h-5" />
              Mulai Gratis Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-10 px-4 border-t border-gray-100 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-xl bg-gradient-blue-purple flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-malzz-textDark">
              Malzz<span className="gradient-text">Hosting</span>
            </span>
          </div>
          <p className="text-sm text-malzz-textLight">
            © 2024 Malzz Hosting. Seluruh hak dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
