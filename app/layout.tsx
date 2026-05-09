import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Malzz Hosting — Premium Pterodactyl Panel",
  description:
    "Platform hosting premium dengan panel Pterodactyl terbaik. Buat panel server Anda sekarang dengan mudah dan cepat.",
  keywords: ["hosting", "pterodactyl", "panel", "server", "malzz"],
  openGraph: {
    title: "Malzz Hosting",
    description: "Platform hosting premium dengan panel Pterodactyl terbaik.",
    siteName: "Malzz Hosting",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(108,158,255,0.15)",
                borderRadius: "12px",
                color: "#1A1A2E",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow: "0 8px 32px rgba(108,158,255,0.12)",
              },
              success: {
                iconTheme: { primary: "#6C9EFF", secondary: "#fff" },
              },
              error: {
                iconTheme: { primary: "#FF6B6B", secondary: "#fff" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
