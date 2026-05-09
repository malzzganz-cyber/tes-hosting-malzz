"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Server, User, Mail, MemoryStick, HardDrive, Cpu, Zap, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PteroSettings, Panel } from "@/types";
import { getDeviceId } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";

interface CreatePanelFormProps {
  type: "free" | "premium";
  settings: PteroSettings | null;
  authToken?: string;
  onSuccess: (panel: Panel) => void;
}

export function CreatePanelForm({ type, settings, authToken, onSuccess }: CreatePanelFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    ram: type === "free" ? "512" : "1024",
    disk: type === "free" ? "1024" : "5120",
    cpu: type === "free" ? "50" : "100",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const freeRamLimit = settings?.freeRamLimit || 4096;
  const freeCpuLimit = settings?.freeCpuLimit || 100;
  const freeDiskLimit = settings?.freeDiskLimit || 10240;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.username || form.username.length < 3)
      newErrors.username = "Username minimal 3 karakter";
    if (!/^[a-z0-9_]+$/.test(form.username))
      newErrors.username = "Username hanya huruf kecil, angka, underscore";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Email tidak valid";
    const ram = parseInt(form.ram);
    if (isNaN(ram) || ram < 128)
      newErrors.ram = "RAM minimal 128 MB";
    if (type === "free" && ram > freeRamLimit)
      newErrors.ram = `Free user max RAM ${freeRamLimit} MB`;
    const disk = parseInt(form.disk);
    if (isNaN(disk) || disk < 512)
      newErrors.disk = "Disk minimal 512 MB";
    if (type === "free" && disk > freeDiskLimit)
      newErrors.disk = `Free user max Disk ${freeDiskLimit} MB`;
    const cpu = parseInt(form.cpu);
    if (isNaN(cpu) || cpu < 0)
      newErrors.cpu = "CPU tidak valid";
    if (type === "free" && cpu > freeCpuLimit)
      newErrors.cpu = `Free user max CPU ${freeCpuLimit}%`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/panel/create", {
        username: form.username,
        email: form.email,
        ram: parseInt(form.ram),
        disk: parseInt(form.disk),
        cpu: parseInt(form.cpu),
        type,
        deviceId: type === "free" ? getDeviceId() : undefined,
        authToken: authToken,
      });

      onSuccess(response.data.panel);
      toast.success("Panel berhasil dibuat!");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      const msg = err.response?.data?.error || "Gagal membuat panel";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const presets = type === "free"
    ? [
        { label: "Starter", ram: 512, disk: 2048, cpu: 50 },
        { label: "Basic", ram: 1024, disk: 5120, cpu: 75 },
        { label: "Standard", ram: 2048, disk: 8192, cpu: 100 },
      ]
    : [
        { label: "Basic", ram: 1024, disk: 5120, cpu: 100 },
        { label: "Pro", ram: 4096, disk: 20480, cpu: 200 },
        { label: "Elite", ram: 8192, disk: 51200, cpu: 400 },
      ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <Input
          label="Username"
          placeholder="contoh: malzzuser"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
          leftIcon={<User className="w-4 h-4" />}
          error={errors.username}
          helperText="Hanya huruf kecil, angka, dan underscore"
        />
        <Input
          label="Email"
          type="email"
          placeholder="email@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-malzz-textDark mb-3">
          Pilih Paket Cepat
        </label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  ram: String(preset.ram),
                  disk: String(preset.disk),
                  cpu: String(preset.cpu),
                })
              }
              className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                form.ram === String(preset.ram)
                  ? "border-malzz-blue bg-malzz-blueLight text-malzz-blue shadow-glass-blue"
                  : "border-gray-200 bg-white/60 text-malzz-textMid hover:border-malzz-blue/40 hover:bg-malzz-blueLight/50"
              }`}
            >
              <p className="text-xs font-bold">{preset.label}</p>
              <p className="text-xs mt-1 opacity-70">{preset.ram}MB RAM</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Input
          label={`RAM (MB)${type === "free" ? ` max ${freeRamLimit}` : ""}`}
          type="number"
          min="128"
          max={type === "free" ? freeRamLimit : undefined}
          value={form.ram}
          onChange={(e) => setForm({ ...form, ram: e.target.value })}
          leftIcon={<MemoryStick className="w-4 h-4" />}
          error={errors.ram}
        />
        <Input
          label={`Disk (MB)${type === "free" ? ` max ${freeDiskLimit}` : ""}`}
          type="number"
          min="512"
          max={type === "free" ? freeDiskLimit : undefined}
          value={form.disk}
          onChange={(e) => setForm({ ...form, disk: e.target.value })}
          leftIcon={<HardDrive className="w-4 h-4" />}
          error={errors.disk}
        />
        <Input
          label={`CPU (%)${type === "free" ? ` max ${freeCpuLimit}` : ""}`}
          type="number"
          min="0"
          max={type === "free" ? freeCpuLimit : undefined}
          value={form.cpu}
          onChange={(e) => setForm({ ...form, cpu: e.target.value })}
          leftIcon={<Cpu className="w-4 h-4" />}
          error={errors.cpu}
        />
      </div>

      {type === "free" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>Free panel memiliki cooldown {settings?.freeCooldownHours || 24} jam setelah dibuat. Upgrade ke premium untuk akses tanpa batas.</p>
        </motion.div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
      >
        {!loading && <Server className="w-5 h-5" />}
        {loading ? "Sedang membuat panel..." : "Buat Panel Sekarang"}
      </Button>

      {type === "premium" && (
        <p className="text-xs text-center text-malzz-textLight">
          <Zap className="w-3 h-3 inline mr-1" />
          Akun premium mendapatkan create panel unlimited
        </p>
      )}
    </form>
  );
}
