import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

export function getFirebaseApp() {
  if (getApps().length === 0) {
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    } as const;

    if (Object.values(config).some((v) => !v)) {
      return null; // Not configured yet
    }

    initializeApp(config);
  }
  return true;
}

export function getFirebaseServices(): { auth: Auth; db: Firestore; storage: FirebaseStorage } | null {
  const ok = getFirebaseApp();
  if (!ok) return null;
  return {
    auth: getAuth(),
    db: getFirestore(),
    storage: getStorage(),
  };
}

export async function signInWithGooglePopup(): Promise<void> {
  const services = getFirebaseServices();
  if (!services) throw new Error('Firebase not configured');
  const provider = new GoogleAuthProvider();
  await signInWithPopup(services.auth, provider);
}

export function isFirebaseConfigured(): boolean {
  return !!getFirebaseApp();
}