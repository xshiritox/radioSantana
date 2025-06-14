import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCdKhRlNZ_dFrEfRFWBPfKFNDyVaDHA8Jc",
  authDomain: "radiosantananm-cda61.firebaseapp.com",
  projectId: "radiosantananm-cda61",
  storageBucket: "radiosantananm-cda61.appspot.com",
  messagingSenderId: "969499423409",
  appId: "1:969499423409:web:39d81d4686017371df2890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Connect to emulator in development (optional)
if (import.meta.env.DEV && !import.meta.env.VITE_FIREBASE_EMULATOR_CONNECTED) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    // Set flag to prevent multiple connections
    (import.meta.env as any).VITE_FIREBASE_EMULATOR_CONNECTED = true;
  } catch (error) {
    // Emulator already connected or not available
    console.log('Firebase emulator not connected:', error);
  }
}

export default app;