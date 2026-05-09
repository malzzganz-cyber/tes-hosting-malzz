import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-setup-secret");
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { email, password, displayName } = body;

    if (!email || !password || !displayName) {
      return NextResponse.json({ error: "Email, password, dan nama wajib diisi" }, { status: 400 });
    }

    const adminAuth = getAdminAuth();
    const db = getAdminDb();

    let uid: string;
    try {
      const user = await adminAuth.getUserByEmail(email);
      uid = user.uid;
    } catch {
      const newUser = await adminAuth.createUser({ email, password, displayName });
      uid = newUser.uid;
    }

    await db.collection("admins").doc(uid).set({
      uid,
      email,
      displayName,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });

    const defaultSettings = {
      PTERO_DOMAIN: "",
      PTERO_API_KEY: "",
      PTERO_CLIENT_API: "",
      NODE_ID: "1",
      EGG_ID: "15",
      NEST_ID: "5",
      LOCATION_ID: "1",
      allocation: "1",
      freeRamLimit: 4096,
      freeCpuLimit: 100,
      freeDiskLimit: 10240,
      premiumRamLimit: 0,
      maintenanceMode: false,
      freePanelLimit: 3,
      whatsappChannel: "https://whatsapp.com/channel/",
      freeCooldownHours: 24,
    };

    await db.collection("settings").doc("pterodactyl").set(defaultSettings, { merge: true });

    return NextResponse.json({
      success: true,
      message: `Admin "${displayName}" berhasil dibuat`,
      uid,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ error: "Gagal membuat admin", details: err.message }, { status: 500 });
  }
}
