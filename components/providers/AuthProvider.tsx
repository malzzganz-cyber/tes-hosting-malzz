"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setFirebaseUser, setUserData, setRole, setLoading, reset } =
    useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setFirebaseUser(user);
        try {
          const adminDoc = await getDoc(doc(db, "admins", user.uid));
          if (adminDoc.exists()) {
            setRole("admin");
            setUserData({
              uid: user.uid,
              email: user.email || "",
              displayName: user.displayName || "Admin",
              role: "admin",
              createdAt: adminDoc.data().createdAt || new Date().toISOString(),
              panelCount: 0,
              maxPanels: 999,
              isActive: true,
            });
          } else {
            const resellerDoc = await getDoc(doc(db, "reseller", user.uid));
            if (resellerDoc.exists()) {
              setRole("reseller");
              setUserData({
                uid: user.uid,
                email: user.email || "",
                displayName: resellerDoc.data().displayName || "Reseller",
                role: "reseller",
                createdAt: resellerDoc.data().createdAt,
                panelCount: 0,
                maxPanels: 999,
                isActive: resellerDoc.data().isActive,
              });
            } else {
              const userDoc = await getDoc(doc(db, "users", user.uid));
              if (userDoc.exists()) {
                const userData = userDoc.data() as User;
                setUserData(userData);
                setRole(userData.role);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      } else {
        reset();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
