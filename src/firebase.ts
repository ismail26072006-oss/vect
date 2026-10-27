import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore,
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCFos2Ud6M6ZZH_zTzkG1veUyOIYv2Mrz0",
  authDomain: "gen-lang-client-0572632351.firebaseapp.com",
  projectId: "gen-lang-client-0572632351",
  storageBucket: "gen-lang-client-0572632351.firebasestorage.app",
  messagingSenderId: "233516665045",
  appId: "1:233516665045:web:be87b063c443df563fba5c"
};

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Custom Database ID provisioned by Firebase
export const FIRESTORE_DB_ID = "ai-studio-android-remixtug-1fa2b7c0-a8a6-4ab4-bbd7-5cb0cefbb93c";

// Initialize Firestore (with fallback)
let firestoreInstance;
try {
  firestoreInstance = getFirestore(app, FIRESTORE_DB_ID);
} catch (e) {
  try {
    firestoreInstance = getFirestore(app);
  } catch (err) {
    console.warn("Firestore initialization fallback:", err);
  }
}

export const db = firestoreInstance || getFirestore(app);

export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
};
