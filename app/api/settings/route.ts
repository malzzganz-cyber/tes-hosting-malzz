import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getAdminDb();
    const settingsDoc = await db.collection("settings").doc("pterodactyl").get();
    if (!settingsDoc.exists) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 });
    }
    const data = settingsDoc.data();
    const safeData = {
      freeRamLimit: data?.freeRamLimit,
      freeCpuLimit: data?.freeCpuLimit,
      freeDiskLimit: data?.freeDiskLimit,
      freePanelLimit: data?.freePanelLimit,
      freeCooldownHours: data?.freeCooldownHours,
      maintenanceMode: data?.maintenanceMode,
      whatsappChannel: data?.whatsappChannel,
      premiumRamLimit: data?.premiumRamLimit,
    };
    return NextResponse.json(safeData);
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { getAdminAuth } = await import("@/lib/firebase-admin");
    const adminAuth = getAdminAuth();
    const token = authHeader.slice(7);
    const decoded = await adminAuth.verifyIdToken(token);

    const db = getAdminDb();
    const adminDoc = await db.collection("admins").doc(decoded.uid).get();
    if (!adminDoc.exists) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    await db.collection("settings").doc("pterodactyl").set(body, { merge: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
