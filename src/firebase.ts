import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "replace_me",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "replace_me",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "replace_me",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "replace_me",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "replace_me",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "replace_me",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
