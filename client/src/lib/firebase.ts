import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Register user with our backend
    await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        firebaseUid: user.uid,
      }),
    });

    return user;
  } catch (error: any) {
    console.error("Error signing in with Google", error);
    if (error.code === 'auth/unauthorized-domain') {
      throw new Error("This domain is not authorized. Please add your app's domain to Firebase Console > Authentication > Settings > Authorized domains");
    }
    throw error;
  }
}

export async function signInWithGithub() {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;

    // Register user with our backend
    await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        firebaseUid: user.uid,
      }),
    });

    return user;
  } catch (error: any) {
    console.error("Error signing in with GitHub", error);
    if (error.code === 'auth/unauthorized-domain') {
      throw new Error("This domain is not authorized. Please add your app's domain to Firebase Console > Authentication > Settings > Authorized domains");
    }
    throw error;
  }
}

export function signOut() {
  return auth.signOut();
}

export { auth };