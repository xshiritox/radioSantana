// Firebase v9+ compatibility layer
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCdKhRlNZ_dFrEfRFWBPfKFNDyVaDHA8Jc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "radiosantananm-cda61.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://radiosantananm-cda61-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "radiosantananm-cda61",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "radiosantananm-cda61.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "969499423409",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:969499423409:web:39d81d4686017371df2890",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NPFSJNBSJ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Set persistence
const initializePersistence = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log("Auth persistence initialized");
  } catch (error) {
    console.error("Error initializing auth persistence:", error);
  }
};

// Initialize persistence
initializePersistence().catch(console.error);

export { app, db, auth, initializePersistence };
