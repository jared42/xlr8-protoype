import {
  doc, getDoc, setDoc, updateDoc, onSnapshot,
  collection, addDoc, query, orderBy, limit,
  serverTimestamp, type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';

// ---- shape of the user profile document ----
export interface UserProfile {
  uid: string;
  email: string;
  membershipStatus: 'active' | 'paused' | 'cancelled' | 'none';
  membershipPlan: 'annual' | 'monthly' | 'none';
  protocol: string[];       // product IDs
  cadence: 30 | 60 | 90;   // days
  lastShipmentDate: string | null; // ISO date
  createdAt: any;
}

// ---- shape of a spend-log entry ----
export interface SpendEntry {
  id?: string;
  date: string;
  shipmentTotal: number;
  items: { productId: string; memberPrice: number }[];
  createdAt: any;
}

// ---- user profile ----

export async function ensureProfile(
  uid: string,
  email: string,
): Promise<UserProfile> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as UserProfile;

  const profile: UserProfile = {
    uid,
    email,
    membershipStatus: 'none',
    membershipPlan: 'none',
    protocol: ['bpc', 'tesa', 'bac'],
    cadence: 30,
    lastShipmentDate: null,
    createdAt: serverTimestamp(),
  };
  await setDoc(ref, profile);
  return profile;
}

export function subscribeProfile(
  uid: string,
  cb: (p: UserProfile) => void,
): Unsubscribe {
  return onSnapshot(doc(db, 'users', uid), snap => {
    if (snap.exists()) cb(snap.data() as UserProfile);
  });
}

export async function updateProtocol(uid: string, protocol: string[]) {
  await updateDoc(doc(db, 'users', uid), { protocol });
}

export async function updateCadence(uid: string, cadence: 30 | 60 | 90) {
  await updateDoc(doc(db, 'users', uid), { cadence });
}

// ---- spend log ----

export function subscribeSpendLog(
  uid: string,
  cb: (entries: SpendEntry[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'users', uid, 'spendLog'),
    orderBy('createdAt', 'desc'),
    limit(20),
  );
  return onSnapshot(q, snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as SpendEntry))),
  );
}

export async function addSpendEntry(uid: string, entry: Omit<SpendEntry, 'id' | 'createdAt'>) {
  await addDoc(collection(db, 'users', uid, 'spendLog'), {
    ...entry,
    createdAt: serverTimestamp(),
  });
}
