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
    const isAdmin = adminDoc.exists;

    const panelsSnap = await db.collection("panels").get();
    const panels = panelsSnap.docs.map((d) => d.data());

    const stats = {
      total: panels.length,
      free: panels.filter((p) => p.type === "free").length,
      premium: panels.filter((p) => p.type === "premium").length,
      active: panels.filter((p) => p.status === "active").length,
      ...(isAdmin
        ? {
            totalUsers: (await db.collection("users").get()).size,
            totalResellers: (await db.collection("reseller").get()).size,
            totalAdmins: (await db.collection("admins").get()).size,
          }
        : {}),
    };

    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
