import { create } from "zustand";
import { User as FirebaseUser } from "firebase/auth";
import { User, UserRole } from "@/types";

interface AuthState {
  firebaseUser: FirebaseUser | null;
  userData: User | null;
  role: UserRole | null;
  loading: boolean;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setUserData: (userData: User | null) => void;
  setRole: (role: UserRole | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  userData: null,
  role: null,
  loading: true,
  setFirebaseUser: (user) => set({ firebaseUser: user }),
  setUserData: (userData) => set({ userData }),
  setRole: (role) => set({ role }),
  setLoading: (loading) => set({ loading }),
  reset: () =>
    set({ firebaseUser: null, userData: null, role: null, loading: false }),
}));
