import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  try {
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);
    const db = getAdminDb();

    const adminDoc = await db.collection("admins").doc(decoded.uid).get();
    if (!adminDoc.exists) {
      return NextResponse.json({ error: "Hanya admin yang bisa membuat reseller" }, { status: 403 });
    }

    const body = await req.json();
    const { email, displayName, password, maxUsers } = body;

    if (!email || !displayName || !password) {
      return NextResponse.json({ error: "Field wajib diisi" }, { status: 400 });
    }

    const newUser = await adminAuth.createUser({ email, password, displayName });

    await db.collection("reseller").doc(newUser.uid).set({
      uid: newUser.uid,
      email,
      displayName,
      createdBy: decoded.uid,
      maxUsers: parseInt(maxUsers) || 50,
      currentUsers: 0,
      createdAt: new Date().toISOString(),
      isActive: true,
    });

    await db.collection("activity").add({
      action: `Reseller baru "${displayName}" dibuat oleh admin`,
      userId: decoded.uid,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, uid: newUser.uid });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (err.code === "auth/email-already-exists") {
      return NextResponse.json({ error: "Email sudah digunakan" }, { status: 409 });
    }
    return NextResponse.json({ error: "Gagal membuat reseller", details: err.message }, { status: 500 });
  }
}
