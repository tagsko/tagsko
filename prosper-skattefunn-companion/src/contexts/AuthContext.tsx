import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AppUser, Role } from '../types';
import { mockUsers } from '../mock/data';
import { getFirebaseServices, isFirebaseConfigured, signInWithGooglePopup } from '../services/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsMock: (role: Role) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function deriveRoleFromEmail(email?: string | null): Role {
  const adminSet = new Set((import.meta.env.VITE_ADMIN_EMAILS as string | undefined)?.split(',').map((e) => e.trim()).filter(Boolean));
  const ownerSet = new Set((import.meta.env.VITE_OWNER_EMAILS as string | undefined)?.split(',').map((e) => e.trim()).filter(Boolean));
  if (email && adminSet?.has(email)) return 'admin';
  if (email && ownerSet?.has(email)) return 'owner';
  return 'employee';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const services = getFirebaseServices();
    if (!services) return;
    const unsub = onAuthStateChanged(services.auth, (fbUser) => {
      if (!fbUser) {
        setUser(null);
        return;
      }
      const role = deriveRoleFromEmail(fbUser.email);
      const mapped: AppUser = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
        email: fbUser.email || '',
        photoURL: fbUser.photoURL || undefined,
        role,
      };
      setUser(mapped);
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async signInWithGoogle() {
      if (isFirebaseConfigured()) {
        setLoading(true);
        try {
          await signInWithGooglePopup();
        } finally {
          setLoading(false);
        }
        return;
      }
      // Mock fallback
      setLoading(true);
      await new Promise((r) => setTimeout(r, 300));
      setUser(mockUsers[1]);
      setLoading(false);
    },
    signInAsMock(role: Role) {
      const match = mockUsers.find((u) => u.role === role) ?? mockUsers[0];
      setUser(match);
    },
    async signOut() {
      if (isFirebaseConfigured()) {
        const services = getFirebaseServices();
        if (services) await firebaseSignOut(services.auth);
      }
      setUser(null);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}