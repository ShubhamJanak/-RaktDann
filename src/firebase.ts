import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyBaUTzJDsw_ugrUawgb7Bm8s9PLqiV8NSk",
  authDomain: "blood-directory-5feba.firebaseapp.com",
  projectId: "blood-directory-5feba",
  storageBucket: "blood-directory-5feba.firebasestorage.app",
  messagingSenderId: "542905254459",
  appId: "1:542905254459:web:d6b2563c5c18898b44521e",
  measurementId: "G-8GYV7WNN7T"
};

// Initialize Firebase App instance safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export { collection, getDocs, addDoc, updateDoc, deleteDoc, doc };
