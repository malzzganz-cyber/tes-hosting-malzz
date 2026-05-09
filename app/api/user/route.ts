import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
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
    if (adminDoc.exists) {
      return NextResponse.json({ uid: decoded.uid, role: "admin", ...adminDoc.data() });
    }

    const resellerDoc = await db.collection("reseller").doc(decoded.uid).get();
    if (resellerDoc.exists) {
      return NextResponse.json({ uid: decoded.uid, role: "reseller", ...resellerDoc.data() });
    }

    const userDoc = await db.collection("users").doc(decoded.uid).get();
    if (userDoc.exists) {
      return NextResponse.json({ uid: decoded.uid, ...userDoc.data() });
    }

    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.slice(7);
  try {
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);
    const db = getAdminDb();
    const body = await req.json();
    const allowedFields = ["displayName"];
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }
    await db.collection("users").doc(decoded.uid).update(updateData);
    if (updateData.displayName) {
      await adminAuth.updateUser(decoded.uid, { displayName: updateData.displayName as string });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gagal update user" }, { status: 500 });
  }
}
