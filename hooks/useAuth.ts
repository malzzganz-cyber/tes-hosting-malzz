"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/types";

export function useAuth() {
  const { firebaseUser, userData, role, loading, setFirebaseUser, setUserData, setRole, setLoading, reset } =
    useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setFirebaseUser(user);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUserData(userData);
            setRole(userData.role);
          } else {
            const adminDoc = await getDoc(doc(db, "admins", user.uid));
            if (adminDoc.exists()) {
              setRole("admin");
              setUserData({ ...adminDoc.data(), role: "admin" } as User);
            } else {
              const resellerDoc = await getDoc(doc(db, "reseller", user.uid));
              if (resellerDoc.exists()) {
                setRole("reseller");
                setUserData({ ...resellerDoc.data(), role: "reseller" } as User);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        reset();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { firebaseUser, userData, role, loading };
}
