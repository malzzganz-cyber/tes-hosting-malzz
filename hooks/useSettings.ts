"use client";

import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSettingsStore } from "@/store/settingsStore";
import { PteroSettings } from "@/types";

export function useSettings() {
  const { settings, loading, setSettings, setLoading } = useSettingsStore();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, "settings", "pterodactyl"),
      (doc) => {
        if (doc.exists()) {
          setSettings(doc.data() as PteroSettings);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching settings:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { settings, loading };
}
