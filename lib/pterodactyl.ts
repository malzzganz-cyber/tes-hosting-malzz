import axios from "axios";
import { getAdminDb } from "./firebase-admin";

export interface PteroConfig {
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
}

export async function getPteroConfig(): Promise<PteroConfig> {
  const db = getAdminDb();
  const settingsDoc = await db.collection("settings").doc("pterodactyl").get();

  if (!settingsDoc.exists) {
    throw new Error("Pterodactyl config not found in Firestore");
  }

  return settingsDoc.data() as PteroConfig;
}

export async function createPteroUser(config: PteroConfig, data: {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}) {
  const response = await axios.post(
    `${config.PTERO_DOMAIN}/api/application/users`,
    {
      username: data.username,
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      password: data.password,
    },
    {
      headers: {
        Authorization: `Bearer ${config.PTERO_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return response.data;
}

export async function createPteroServer(config: PteroConfig, data: {
  userId: number;
  serverName: string;
  ram: number;
  disk: number;
  cpu: number;
  isPremium: boolean;
}) {
  const limits = {
    memory: data.ram,
    swap: 0,
    disk: data.disk,
    io: 500,
    cpu: data.isPremium ? 0 : Math.min(data.cpu, config.freeCpuLimit),
  };

  const response = await axios.post(
    `${config.PTERO_DOMAIN}/api/application/servers`,
    {
      name: data.serverName,
      user: data.userId,
      egg: parseInt(config.EGG_ID),
      docker_image: "ghcr.io/pterodactyl/yolks:nodejs_18",
      startup: "if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == \"1\" ]]; then git pull; fi; if [[ ! -z ${NODE_MODULE} ]]; then /usr/local/bin/npm install ${NODE_MODULE}; fi; /usr/local/bin/node {{BOT_JS_FILE}}",
      environment: {
        BOT_JS_FILE: "index.js",
        AUTO_UPDATE: "0",
        NODE_MODULE: "",
      },
      limits,
      feature_limits: {
        databases: data.isPremium ? 5 : 1,
        backups: data.isPremium ? 3 : 1,
        allocations: 1,
      },
      allocation: {
        default: parseInt(config.allocation),
      },
    },
    {
      headers: {
        Authorization: `Bearer ${config.PTERO_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return response.data;
}

export async function deletePteroServer(config: PteroConfig, serverId: string) {
  await axios.delete(
    `${config.PTERO_DOMAIN}/api/application/servers/${serverId}/force`,
    {
      headers: {
        Authorization: `Bearer ${config.PTERO_API_KEY}`,
        Accept: "application/json",
      },
    }
  );
}

export async function deletePteroUser(config: PteroConfig, userId: number) {
  await axios.delete(
    `${config.PTERO_DOMAIN}/api/application/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${config.PTERO_API_KEY}`,
        Accept: "application/json",
      },
    }
  );
}

export async function getPteroServer(config: PteroConfig, serverId: string) {
  const response = await axios.get(
    `${config.PTERO_DOMAIN}/api/application/servers/${serverId}`,
    {
      headers: {
        Authorization: `Bearer ${config.PTERO_API_KEY}`,
        Accept: "application/json",
      },
    }
  );
  return response.data;
}

export async function listPteroServers(config: PteroConfig) {
  const response = await axios.get(
    `${config.PTERO_DOMAIN}/api/application/servers`,
    {
      headers: {
        Authorization: `Bearer ${config.PTERO_API_KEY}`,
        Accept: "application/json",
      },
    }
  );
  return response.data;
}
