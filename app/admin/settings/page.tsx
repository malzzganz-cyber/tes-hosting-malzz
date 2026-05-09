"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Settings, Save, Globe, Key, Server, Cpu, MemoryStick, HardDrive,
  AlertTriangle, Shield, MessageCircle, Clock, RefreshCw
} from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PteroSettings } from "@/types";
import toast from "react-hot-toast";

const defaultSettings: PteroSettings = {
  PTERO_DOMAIN: "",
  PTERO_API_KEY: "",
  PTERO_CLIENT_API: "",
  NODE_ID: "",
  EGG_ID: "",
  NEST_ID: "",
  LOCATION_ID: "",
  allocation: "",
  freeRamLimit: 4096,
  freeCpuLimit: 100,
  freeDiskLimit: 10240,
  premiumRamLimit: 0,
  maintenanceMode: false,
  freePanelLimit: 3,
  whatsappChannel: "",
  freeCooldownHours: 24,
};

interface FieldGroup {
  title: string;
  icon: React.ElementType;
  fields: Array<{
    key: keyof PteroSettings;
    label: string;
    type?: string;
    placeholder?: string;
    helperText?: string;
    isToggle?: boolean;
  }>;
}

const fieldGroups: FieldGroup[] = [
  {
    title: "Konfigurasi Pterodactyl",
    icon: Server,
    fields: [
      { key: "PTERO_DOMAIN", label: "Domain Pterodactyl", placeholder: "https://panel.example.com", helperText: "URL panel Pterodactyl tanpa trailing slash" },
      { key: "PTERO_API_KEY", label: "Application API Key", placeholder: "ptla_...", type: "password", helperText: "API key dari Admin > API" },
      { key: "PTERO_CLIENT_API", label: "Client API Key", placeholder: "ptlc_...", type: "password", helperText: "API key dari Account > API Credentials" },
    ],
  },
  {
    title: "Node & Egg Configuration",
    icon: Cpu,
    fields: [
      { key: "NODE_ID", label: "Node ID", placeholder: "1", helperText: "ID node dari Admin > Nodes" },
      { key: "EGG_ID", label: "Egg ID", placeholder: "15", helperText: "ID egg dari Admin > Nests" },
      { key: "NEST_ID", label: "Nest ID", placeholder: "5", helperText: "ID nest yang berisi egg" },
      { key: "LOCATION_ID", label: "Location ID", placeholder: "1", helperText: "ID location dari Admin > Locations" },
      { key: "allocation", label: "Default Allocation ID", placeholder: "1", helperText: "ID allocation default untuk server baru" },
    ],
  },
  {
    title: "Limit Free Panel",
    icon: Shield,
    fields: [
      { key: "freeRamLimit", label: "Max RAM Free (MB)", placeholder: "4096", type: "number", helperText: "Batas RAM untuk free panel (default: 4096)" },
      { key: "freeCpuLimit", label: "Max CPU Free (%)", placeholder: "100", type: "number", helperText: "Batas CPU untuk free panel (default: 100)" },
      { key: "freeDiskLimit", label: "Max Disk Free (MB)", placeholder: "10240", type: "number", helperText: "Batas disk untuk free panel (default: 10240)" },
      { key: "freePanelLimit", label: "Max Panel Free", placeholder: "3", type: "number", helperText: "Berapa kali user bisa buat free panel" },
      { key: "freeCooldownHours", label: "Cooldown (Jam)", placeholder: "24", type: "number", helperText: "Jeda waktu antar pembuatan free panel" },
    ],
  },
  {
    title: "Pengaturan Platform",
    icon: Globe,
    fields: [
      { key: "whatsappChannel", label: "Link WhatsApp Channel", placeholder: "https://whatsapp.com/channel/...", helperText: "Link channel WhatsApp untuk verifikasi free user" },
      { key: "maintenanceMode", label: "Mode Maintenance", isToggle: true, helperText: "Nonaktifkan pembuatan panel sementara" },
    ],
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PteroSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = await getDoc(doc(db, "settings", "pterodactyl"));
      if (docRef.exists()) {
        setSettings({ ...defaultSettings, ...docRef.data() as PteroSettings });
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "pterodactyl"), settings, { merge: true });
      toast.success("Pengaturan berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: keyof PteroSettings, value: string | number | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 text-malzz-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-malzz-textDark flex items-center gap-2">
            <Settings className="w-6 h-6 text-malzz-blue" /> Pengaturan Admin
          </h1>
          <p className="text-sm text-malzz-textMid mt-1">
            Konfigurasi Pterodactyl dan platform disimpan di Firestore
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowKeys(!showKeys)}>
            <Key className="w-4 h-4" />
            {showKeys ? "Sembunyikan" : "Tampilkan"} Keys
          </Button>
          <Button onClick={handleSave} loading={saving}>
            <Save className="w-4 h-4" />
            Simpan Semua
          </Button>
        </div>
      </div>

      {settings.maintenanceMode && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-sm font-medium text-amber-700">
            Mode maintenance aktif — pembuatan panel dinonaktifkan
          </p>
        </div>
      )}

      <div className="space-y-5">
        {fieldGroups.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.05 }}
            className="glass-card rounded-3xl p-6"
          >
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-malzz-blueLight flex items-center justify-center">
                <group.icon className="w-4 h-4 text-malzz-blue" />
              </div>
              <h2 className="font-semibold text-malzz-textDark">{group.title}</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {group.fields.map((field) => {
                if (field.isToggle) {
                  return (
                    <div key={field.key} className="sm:col-span-2 flex items-center justify-between p-4 bg-malzz-grayLight rounded-2xl">
                      <div>
                        <p className="text-sm font-medium text-malzz-textDark">{field.label}</p>
                        {field.helperText && (
                          <p className="text-xs text-malzz-textLight mt-0.5">{field.helperText}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleChange(field.key, !settings[field.key])}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                          settings[field.key] ? "bg-malzz-blue" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                            settings[field.key] ? "translate-x-6" : ""
                          }`}
                        />
                      </button>
                    </div>
                  );
                }

                const isPassword = field.type === "password";
                return (
                  <Input
                    key={field.key}
                    label={field.label}
                    type={isPassword && !showKeys ? "password" : field.type || "text"}
                    placeholder={field.placeholder}
                    value={String(settings[field.key] ?? "")}
                    onChange={(e) =>
                      handleChange(
                        field.key,
                        field.type === "number" ? Number(e.target.value) : e.target.value
                      )
                    }
                    helperText={field.helperText}
                  />
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving} size="lg">
          <Save className="w-5 h-5" />
          Simpan Semua Perubahan
        </Button>
      </div>
    </div>
  );
}
