import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // connectFirestoreEmulator removido porque no se usa
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

// Deshabilitar emulador para usar Firebase en la nube
// Si necesitas usar el emulador local, comenta este bloque y descomenta el siguiente

/*
// Conectar al emulador local (solo para desarrollo)
if (import.meta.env.DEV && !import.meta.env.VITE_FIREBASE_EMULATOR_CONNECTED) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    // Set flag to prevent multiple connections
    (import.meta.env as any).VITE_FIREBASE_EMULATOR_CONNECTED = true;
  } catch (error) {
    console.log('Firebase emulator not connected:', error);
  }
}
*/

export default app;