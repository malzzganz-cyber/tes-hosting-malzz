import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { nanoid } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generatePassword(length = 12): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export function generateServerId(): string {
  return nanoid(8).toLowerCase();
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let deviceId = localStorage.getItem("malzz_device_id");
  if (!deviceId) {
    deviceId = nanoid(16);
    localStorage.setItem("malzz_device_id", deviceId);
  }
  return deviceId;
}

export function getFreeCreateCount(): number {
  if (typeof window === "undefined") return 0;
  const data = localStorage.getItem("malzz_free_create");
  if (!data) return 0;
  const parsed = JSON.parse(data);
  return parsed.count || 0;
}

export function incrementFreeCreate(): void {
  if (typeof window === "undefined") return;
  const data = localStorage.getItem("malzz_free_create");
  const parsed = data ? JSON.parse(data) : { count: 0, lastCreate: null };
  parsed.count = (parsed.count || 0) + 1;
  parsed.lastCreate = Date.now();
  localStorage.setItem("malzz_free_create", JSON.stringify(parsed));
}

export function getLastFreeCreateTime(): number | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("malzz_free_create");
  if (!data) return null;
  const parsed = JSON.parse(data);
  return parsed.lastCreate || null;
}

export function hasJoinedWhatsApp(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("malzz_wa_joined") === "true";
}

export function setJoinedWhatsApp(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("malzz_wa_joined", "true");
}

export function getCooldownRemaining(cooldownMs: number): number {
  const lastCreate = getLastFreeCreateTime();
  if (!lastCreate) return 0;
  const elapsed = Date.now() - lastCreate;
  const remaining = cooldownMs - elapsed;
  return remaining > 0 ? remaining : 0;
}

export function formatCooldown(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  if (hours > 0) return `${hours}j ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}d`;
  return `${seconds}d`;
}
