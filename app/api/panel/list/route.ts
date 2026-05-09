import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get("deviceId");

  const db = getAdminDb();

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const adminAuth = getAdminAuth();
      const decoded = await adminAuth.verifyIdToken(token);

      const adminDoc = await db.collection("admins").doc(decoded.uid).get();
      if (adminDoc.exists) {
        const snap = await db.collection("panels").orderBy("createdAt", "desc").get();
        const panels = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        return NextResponse.json({ panels });
      }

      const snap = await db
        .collection("panels")
        .where("ownerId", "==", decoded.uid)
        .orderBy("createdAt", "desc")
        .get();
      const panels = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return NextResponse.json({ panels });
    } catch {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
    }
  }

  if (deviceId) {
    const snap = await db
      .collection("panels")
      .where("deviceId", "==", deviceId)
      .where("type", "==", "free")
      .orderBy("createdAt", "desc")
      .get();
    const panels = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ panels });
  }

  return NextResponse.json({ error: "Autentikasi diperlukan" }, { status: 401 });
}
