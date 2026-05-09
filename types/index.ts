export type UserRole = "free" | "premium" | "reseller" | "admin";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  panelCount: number;
  maxPanels: number;
  isActive: boolean;
  resellerId?: string;
}

export interface Panel {
  id: string;
  serverId: string;
  pteroUserId: number;
  username: string;
  email: string;
  password: string;
  domain: string;
  ram: number;
  disk: number;
  cpu: number;
  status: "active" | "suspended" | "installing";
  type: "free" | "premium";
  ownerId?: string;
  deviceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
  lastLogin: string;
}

export interface Reseller {
  uid: string;
  email: string;
  displayName: string;
  createdBy: string;
  maxUsers: number;
  currentUsers: number;
  createdAt: string;
  isActive: boolean;
}

export interface Analytics {
  date: string;
  totalPanels: number;
  freePanels: number;
  premiumPanels: number;
  activeUsers: number;
  newUsers: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  targetRole?: UserRole | "all";
}

export interface ActivityLog {
  id: string;
  action: string;
  userId?: string;
  deviceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  ip?: string;
}

export interface PteroSettings {
  PTERO_DOMAIN: string;
  PTERO_API_KEY: string;
  PTERO_CLIENT_API: string;
  NODE_ID: string;
  EGG_ID: string;
  NEST_ID: string;
  LOCATION_ID: string;
  allocation: string;
  freeRamLimit: number;
  freeCpuLimit: number;
  freeDiskLimit: number;
  premiumRamLimit: number;
  maintenanceMode: boolean;
  freePanelLimit: number;
  whatsappChannel: string;
  freeCooldownHours: number;
}

export interface CreatePanelRequest {
  username: string;
  email: string;
  ram: number;
  disk: number;
  cpu: number;
  type: "free" | "premium";
  deviceId?: string;
  authToken?: string;
}

export interface CreatePanelResponse {
  success: boolean;
  panel?: Panel;
  error?: string;
}
