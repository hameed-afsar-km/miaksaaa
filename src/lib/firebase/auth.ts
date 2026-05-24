import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "./config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

/** Sign in with Google popup and create user doc if new */
export async function signInWithGoogle(): Promise<User> {
  await setPersistence(auth, browserLocalPersistence);
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Create user document if it doesn't exist
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: "user",
        createdAt: serverTimestamp(),
        address: null,
        phone: null,
      });
    }
  } catch (err) {
    console.warn("User Firestore initialization skipped due to permissions or latency:", err);
  }

  return user;
}

/** Sign in with Email and Password */
export async function signInWithEmail(email: string, password: string): Promise<User> {
  await setPersistence(auth, browserLocalPersistence);
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

/** Register with Email, Password, and Display Name */
export async function registerWithEmail(email: string, password: string, displayName: string): Promise<User> {
  await setPersistence(auth, browserLocalPersistence);
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;

  // Update display name in Firebase Auth
  await updateProfile(user, {
    displayName,
    photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
  });

  // Create user document in Firestore
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName,
      email,
      photoURL: user.photoURL,
      role: "user",
      createdAt: serverTimestamp(),
      address: null,
      phone: null,
    });
  } catch (err) {
    console.warn("User register Firestore initialization skipped due to permissions:", err);
  }

  return user;
}

/** Sign out current user */
export async function logOut(): Promise<void> {
  await signOut(auth);
}

/** Subscribe to auth state changes */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/** Check if user has admin role in Firestore OR matches the super admin email from env */
export async function checkIsAdmin(uid: string, email?: string | null): Promise<boolean> {
  // Super-admin shortcut: env-pinned email always grants access
  const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
  if (superAdminEmail && email && email.toLowerCase() === superAdminEmail.toLowerCase()) {
    return true;
  }
  try {
    const adminRef = doc(db, "admins", uid);
    const snap = await getDoc(adminRef);
    return snap.exists();
  } catch (err) {
    console.warn("Admin check failed or permission blocked. Treating as non-admin:", err);
    return false;
  }
}

