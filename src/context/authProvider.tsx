import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { ReactNode } from "react";
import { auth } from "../config/firebase";
import { AuthContext } from "./auth-context";
import authService from "../services/authService";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      await authService.createUserIfNotExists();
      await authService.loadUserRole();
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}