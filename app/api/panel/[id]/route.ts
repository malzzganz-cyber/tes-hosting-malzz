import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin";
import { getPteroConfig, deletePteroServer, deletePteroUser, getPteroServer } from "@/lib/pterodactyl";

async function verifyAuth(req: NextRequest): Promise<{ uid: string; role: string } | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  try {
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);
    const db = getAdminDb();
    const adminDoc = await db.collection("admins").doc(decoded.uid).get();
    if (adminDoc.exists) return { uid: decoded.uid, role: "admin" };
    const resellerDoc = await db.collection("reseller").doc(decoded.uid).get();
    if (resellerDoc.exists) return { uid: decoded.uid, role: "reseller" };
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    if (userDoc.exists) return { uid: decoded.uid, role: userDoc.data()?.role || "free" };
    return { uid: decoded.uid, role: "unknown" };
  } catch {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getAdminDb();
  const panelDoc = await db.collection("panels").doc(params.id).get();
  if (!panelDoc.exists) return NextResponse.json({ error: "Panel tidak ditemukan" }, { status: 404 });

  const panel = { id: panelDoc.id, ...panelDoc.data() };

  if (user.role !== "admin" && user.role !== "reseller" && (panel as { ownerId?: string }).ownerId !== user.uid) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  try {
    const config = await getPteroConfig();
    const pteroData = await getPteroServer(config, (panel as { serverId: string }).serverId);
    return NextResponse.json({ panel, pteroData });
  } catch {
    return NextResponse.json({ panel });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getAdminDb();
  const panelDoc = await db.collection("panels").doc(params.id).get();
  if (!panelDoc.exists) return NextResponse.json({ error: "Panel tidak ditemukan" }, { status: 404 });

  const panel = panelDoc.data() as { ownerId?: string; serverId: string; pteroUserId: number };

  if (user.role !== "admin" && panel.ownerId !== user.uid) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  try {
    const config = await getPteroConfig();
    await deletePteroServer(config, panel.serverId);
    await deletePteroUser(config, panel.pteroUserId);
  } catch (err) {
    console.error("Pterodactyl delete error:", err);
  }

  await db.collection("panels").doc(params.id).delete();

  if (panel.ownerId) {
    const userRef = db.collection("users").doc(panel.ownerId);
    const userSnap = await userRef.get();
    if (userSnap.exists) {
      const count = Math.max(0, (userSnap.data()?.panelCount || 1) - 1);
      await userRef.update({ panelCount: count });
    }
  }

  await db.collection("activity").add({
    action: `Panel dihapus oleh ${user.role}`,
    userId: user.uid,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
