import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin";
import {
  getPteroConfig,
  createPteroUser,
  createPteroServer,
} from "@/lib/pterodactyl";
import { generatePassword, generateServerId } from "@/lib/utils";
import { Panel } from "@/types";

const RATE_LIMIT_MAP = new Map<string, number[]>();

function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = RATE_LIMIT_MAP.get(key) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);
  if (recent.length >= maxRequests) return false;
  recent.push(now);
  RATE_LIMIT_MAP.set(key, recent);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, ram, disk, cpu, type, deviceId, authToken } = body;

    if (!username || !email || !ram || !disk || !cpu || !type) {
      return NextResponse.json({ error: "Field wajib diisi" }, { status: 400 });
    }

    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      return NextResponse.json(
        { error: "Username tidak valid (hanya huruf kecil, angka, underscore, 3-20 karakter)" },
        { status: 400 }
      );
    }

    const config = await getPteroConfig();

    if (config.maintenanceMode) {
      return NextResponse.json({ error: "Sistem sedang maintenance, coba lagi nanti" }, { status: 503 });
    }

    const db = getAdminDb();
    let ownerId: string | null = null;

    if (type === "premium") {
      if (!authToken) {
        return NextResponse.json({ error: "Token autentikasi diperlukan" }, { status: 401 });
      }
      try {
        const adminAuth = getAdminAuth();
        const decoded = await adminAuth.verifyIdToken(authToken);
        ownerId = decoded.uid;

        const userDoc = await db.collection("users").doc(ownerId).get();
        const adminDoc = await db.collection("admins").doc(ownerId).get();
        const resellerDoc = await db.collection("reseller").doc(ownerId).get();

        if (!userDoc.exists && !adminDoc.exists && !resellerDoc.exists) {
          return NextResponse.json({ error: "Akun tidak ditemukan" }, { status: 403 });
        }

        const userData = userDoc.data();
        if (userData && userData.role !== "premium" && !adminDoc.exists && !resellerDoc.exists) {
          return NextResponse.json({ error: "Akun premium diperlukan" }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
      }
    } else if (type === "free") {
      if (!deviceId) {
        return NextResponse.json({ error: "Device ID diperlukan" }, { status: 400 });
      }

      const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
      const rateLimitKey = `free:${deviceId}:${ip}`;

      if (!checkRateLimit(rateLimitKey, 3, 24 * 60 * 60 * 1000)) {
        return NextResponse.json(
          { error: "Terlalu banyak percobaan. Coba lagi dalam 24 jam." },
          { status: 429 }
        );
      }

      const deviceQuery = await db
        .collection("panels")
        .where("deviceId", "==", deviceId)
        .where("type", "==", "free")
        .get();

      const freePanelLimit = config.freePanelLimit || 3;
      if (deviceQuery.size >= freePanelLimit) {
        return NextResponse.json(
          { error: `Batas free panel (${freePanelLimit}) sudah tercapai. Upgrade ke premium!` },
          { status: 429 }
        );
      }

      const effectiveRam = Math.min(ram, config.freeRamLimit || 4096);
      const effectiveCpu = Math.min(cpu, config.freeCpuLimit || 100);
      const effectiveDisk = Math.min(disk, config.freeDiskLimit || 10240);
      body.ram = effectiveRam;
      body.cpu = effectiveCpu;
      body.disk = effectiveDisk;
    }

    const existingUser = await db
      .collection("panels")
      .where("username", "==", username)
      .limit(1)
      .get();
    if (!existingUser.empty) {
      return NextResponse.json({ error: "Username sudah digunakan" }, { status: 409 });
    }

    const password = generatePassword(12);
    const serverId = generateServerId();

    const pteroUser = await createPteroUser(config, {
      username,
      email,
      firstName: username,
      lastName: "User",
      password,
    });

    const pteroServer = await createPteroServer(config, {
      userId: pteroUser.attributes.id,
      serverName: `${username}-${serverId}`,
      ram: body.ram || ram,
      disk: body.disk || disk,
      cpu: body.cpu || cpu,
      isPremium: type === "premium",
    });

    const panelData: Omit<Panel, "id"> = {
      serverId: pteroServer.attributes.identifier,
      pteroUserId: pteroUser.attributes.id,
      username,
      email,
      password,
      domain: config.PTERO_DOMAIN,
      ram: body.ram || ram,
      disk: body.disk || disk,
      cpu: body.cpu || cpu,
      status: "active",
      type,
      ownerId: ownerId || undefined,
      deviceId: type === "free" ? deviceId : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const panelRef = await db.collection("panels").add(panelData);

    await db.collection("activity").add({
      action: `Panel "${username}" berhasil dibuat (${type})`,
      deviceId: deviceId || null,
      userId: ownerId || null,
      createdAt: new Date().toISOString(),
    });

    if (ownerId) {
      const userRef = db.collection("users").doc(ownerId);
      const userSnap = await userRef.get();
      if (userSnap.exists) {
        const current = userSnap.data()?.panelCount || 0;
        await userRef.update({ panelCount: current + 1 });
      }
    }

    const panel: Panel = { id: panelRef.id, ...panelData };
    return NextResponse.json({ success: true, panel }, { status: 201 });
  } catch (error: unknown) {
    console.error("Create panel error:", error);
    const err = error as { response?: { data?: unknown }; message?: string };
    const pterodactylError = err.response?.data;
    return NextResponse.json(
      { error: "Gagal membuat panel", details: pterodactylError || err.message },
      { status: 500 }
    );
  }
}
