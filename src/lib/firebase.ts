import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  Firestore,
  serverTimestamp
} from 'firebase/firestore';
import { UserProfile, DailyUsage, BookmarkItem, SubscriptionRecord, SiteSettings } from '../types';
import { firebaseClientConfig, firestoreDatabaseId } from './firebaseConfig';

// Check whether legitimate credentials exist
export const isFirebaseConfigured = Boolean(
  firebaseClientConfig.apiKey &&
  firebaseClientConfig.apiKey !== 'MY_FIREBASE_API_KEY' &&
  firebaseClientConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseClientConfig) : getApp();
    auth = getAuth(app);
    // Support custom named database ID if provisioned, or default
    db = firestoreDatabaseId && firestoreDatabaseId !== '(default)'
      ? getFirestore(app, firestoreDatabaseId)
      : getFirestore(app);
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
  }
}

// ----------------------------------------------------
// LOCAL FALLBACK STORAGE FOR PREVIEWS WITHOUT FIREBASE
// ----------------------------------------------------
const LOCAL_USER_KEY = 'toolverse_auth_user';
const LOCAL_BOOKMARKS_KEY = 'toolverse_cloud_bookmarks';
const LOCAL_USAGE_KEY = 'toolverse_cloud_usage';

const getTodayKey = () => new Date().toISOString().split('T')[0];

export interface AuthUserState {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  plan: 'free' | 'pro';
  createdAt: string;
}

// ----------------------------------------------------
// AUTHENTICATION APIs
// ----------------------------------------------------

export async function loginWithGoogle(): Promise<AuthUserState> {
  if (isFirebaseConfigured && auth) {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const u = cred.user;
    const profile: AuthUserState = {
      uid: u.uid,
      email: u.email || 'user@toolverse.ai',
      displayName: u.displayName || u.email?.split('@')[0] || 'ToolVerse Member',
      photoURL: u.photoURL || undefined,
      plan: 'free',
      createdAt: new Date().toISOString(),
    };
    await syncUserProfileToFirestore(profile);
    return profile;
  }

  // Graceful simulated Google OAuth for development preview
  const demoProfile: AuthUserState = {
    uid: 'google_user_' + Math.random().toString(36).substring(2, 9),
    email: 'google.account@toolverse.ai',
    displayName: 'Google Member',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    plan: 'free',
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoProfile));
  return demoProfile;
}

export async function loginWithEmail(email: string, pass: string): Promise<AuthUserState> {
  if (isFirebaseConfigured && auth) {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const u = cred.user;
    const existing = await fetchUserProfile(u.uid);
    if (existing) {
      return {
        uid: existing.uid,
        email: existing.email,
        displayName: existing.displayName,
        photoURL: existing.photoURL,
        plan: existing.plan,
        createdAt: existing.createdAt,
      };
    }
    const profile: AuthUserState = {
      uid: u.uid,
      email: u.email || email,
      displayName: u.displayName || email.split('@')[0],
      plan: 'free',
      createdAt: new Date().toISOString(),
    };
    await syncUserProfileToFirestore(profile);
    return profile;
  }

  // Local fallback
  const demoProfile: AuthUserState = {
    uid: 'email_user_' + Math.random().toString(36).substring(2, 9),
    email: email.trim(),
    displayName: email.split('@')[0],
    plan: email.includes('admin') || email === 'soulversepk@gmail.com' ? 'pro' : 'free',
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoProfile));
  return demoProfile;
}

export async function registerWithEmail(email: string, pass: string, displayName?: string): Promise<AuthUserState> {
  if (isFirebaseConfigured && auth) {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const u = cred.user;
    const profile: AuthUserState = {
      uid: u.uid,
      email: u.email || email,
      displayName: displayName || email.split('@')[0],
      plan: 'free',
      createdAt: new Date().toISOString(),
    };
    await syncUserProfileToFirestore(profile);
    return profile;
  }

  const demoProfile: AuthUserState = {
    uid: 'user_' + Math.random().toString(36).substring(2, 9),
    email: email.trim(),
    displayName: displayName?.trim() || email.split('@')[0],
    plan: 'free',
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoProfile));
  return demoProfile;
}

export async function sendPasswordReset(email: string): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await fbSendPasswordResetEmail(auth, email);
    return;
  }
  // Local fallback notification
  return new Promise((resolve) => setTimeout(resolve, 600));
}

export async function logoutUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
  localStorage.removeItem(LOCAL_USER_KEY);
}

export function subscribeToAuthState(callback: (user: AuthUserState | null) => void): () => void {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, async (u: FirebaseUser | null) => {
      if (!u) {
        callback(null);
        return;
      }
      const remote = await fetchUserProfile(u.uid);
      if (remote) {
        callback({
          uid: remote.uid,
          email: remote.email,
          displayName: remote.displayName,
          photoURL: remote.photoURL,
          plan: remote.plan,
          createdAt: remote.createdAt,
        });
      } else {
        callback({
          uid: u.uid,
          email: u.email || 'user@toolverse.ai',
          displayName: u.displayName || u.email?.split('@')[0] || 'User',
          photoURL: u.photoURL || undefined,
          plan: 'free',
          createdAt: new Date().toISOString(),
        });
      }
    });
  }

  // Local storage listener
  const stored = localStorage.getItem(LOCAL_USER_KEY);
  if (stored) {
    try {
      callback(JSON.parse(stored));
    } catch {
      callback(null);
    }
  } else {
    callback(null);
  }
  return () => {};
}

// ----------------------------------------------------
// FIRESTORE COLLECTIONS & DATA ARCHITECTURE
// Collections: 'users', 'usage', 'bookmarks', 'subscriptions', 'siteSettings'
// ----------------------------------------------------

export async function syncUserProfileToFirestore(user: AuthUserState): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL || null,
          plan: user.plan,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Could not sync user profile to Firestore:', err);
    }
  }
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (err) {
      console.warn('Error reading user profile from Firestore:', err);
    }
  }
  const stored = localStorage.getItem(LOCAL_USER_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.uid === uid) return parsed as UserProfile;
    } catch {}
  }
  return null;
}

export const getUserProfile = fetchUserProfile;

export async function updateUserProfileDoc(uid: string, data: Partial<UserProfile>): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, 'users', uid);
      await updateDoc(ref, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Could not update profile doc in Firestore:', err);
    }
  }
  const stored = localStorage.getItem(LOCAL_USER_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.uid === uid) {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ ...parsed, ...data }));
      }
    } catch {}
  }
}

export async function getDailyUsage(uid: string): Promise<DailyUsage> {
  const today = getTodayKey();
  const docId = `${uid}_${today}`;

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'usage', docId));
      if (snap.exists()) {
        return snap.data() as DailyUsage;
      }
    } catch (err) {
      console.warn('Error reading usage from Firestore:', err);
    }
  }

  // Fallback to local storage
  const stored = localStorage.getItem(`${LOCAL_USAGE_KEY}_${docId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }

  return {
    uid,
    date: today,
    generationsUsed: 0,
    generationsLimit: 10,
    updatedAt: new Date().toISOString(),
  };
}

export async function incrementDailyUsage(uid: string): Promise<DailyUsage> {
  const today = getTodayKey();
  const docId = `${uid}_${today}`;
  const current = await getDailyUsage(uid);
  const updated: DailyUsage = {
    uid,
    date: today,
    generationsUsed: current.generationsUsed + 1,
    generationsLimit: current.generationsLimit,
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'usage', docId), updated, { merge: true });
    } catch (err) {
      console.warn('Failed writing usage to Firestore:', err);
    }
  }

  localStorage.setItem(`${LOCAL_USAGE_KEY}_${docId}`, JSON.stringify(updated));
  return updated;
}

// Bookmarks management
export async function fetchUserBookmarks(uid: string): Promise<BookmarkItem[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'bookmarks'), where('uid', '==', uid));
      const snap = await getDocs(q);
      const items: BookmarkItem[] = [];
      snap.forEach((d) => items.push({ id: d.id, ...(d.data() as any) }));
      return items;
    } catch (err) {
      console.warn('Error fetching bookmarks from Firestore:', err);
    }
  }

  const stored = localStorage.getItem(`${LOCAL_BOOKMARKS_KEY}_${uid}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return [];
}

export async function addBookmark(uid: string, item: Omit<BookmarkItem, 'id' | 'uid' | 'createdAt'>): Promise<BookmarkItem> {
  const newBookmark: BookmarkItem = {
    id: 'bm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    uid,
    itemId: item.itemId,
    itemType: item.itemType,
    title: item.title,
    path: item.path,
    category: item.category,
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'bookmarks', newBookmark.id), newBookmark);
    } catch (err) {
      console.warn('Error adding bookmark in Firestore:', err);
    }
  }

  const list = await fetchUserBookmarks(uid);
  const updated = [newBookmark, ...list.filter((b) => b.itemId !== item.itemId)];
  localStorage.setItem(`${LOCAL_BOOKMARKS_KEY}_${uid}`, JSON.stringify(updated));
  return newBookmark;
}

export async function removeBookmark(uid: string, bookmarkIdOrItemId: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'bookmarks', bookmarkIdOrItemId));
    } catch (err) {
      console.warn('Error deleting bookmark from Firestore:', err);
    }
  }

  const list = await fetchUserBookmarks(uid);
  const filtered = list.filter((b) => b.id !== bookmarkIdOrItemId && b.itemId !== bookmarkIdOrItemId);
  localStorage.setItem(`${LOCAL_BOOKMARKS_KEY}_${uid}`, JSON.stringify(filtered));
}

export async function fetchUserSubscription(uid: string): Promise<SubscriptionRecord> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'subscriptions', uid));
      if (snap.exists()) {
        return snap.data() as SubscriptionRecord;
      }
    } catch (err) {
      console.warn('Error fetching subscription:', err);
    }
  }

  return {
    uid,
    plan: 'free',
    status: 'active',
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'siteSettings', 'global'));
      if (snap.exists()) {
        return snap.data() as SiteSettings;
      }
    } catch {}
  }

  return {
    maintenanceMode: false,
    freeDailyAiLimit: 10,
    announcementBanner: {
      enabled: true,
      text: '🚀 ToolVerse AI 2.0 Live — Faster Processing, High-Resolution PDF rasterization, and Enterprise Privacy.',
    },
  };
}
