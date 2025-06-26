// Firebase v9+ modular imports
import { initializeApp, type FirebaseApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  type Firestore,
  doc,
  collection,
  query,
  limit,
  getDocs,
  onSnapshot,
  type DocumentSnapshot,
  type Unsubscribe
} from 'firebase/firestore';
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence, 
  type Auth,
  onAuthStateChanged,
  type User
} from 'firebase/auth';

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
} as const;

// Dominios autorizados
export const APP_DOMAINS = {
  PRODUCTION: 'radiosantana.netlify.app',
  LOCAL: 'localhost',
  FIREBASE: 'radiosantananm-cda61.firebaseapp.com'
};

// Configuración de dominios autorizados para redirección
export const AUTH_DOMAINS = {
  PRODUCTION: 'radiosantana.netlify.app',
  FIREBASE: 'radiosantananm-cda61.firebaseapp.com'
};

// Initialize Firebase
let app: FirebaseApp;
try {
  console.log('Initializing Firebase...');
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize Firestore// Persistence is now handled in firebase-compat.js
let db: Firestore;
try {
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
} catch (error) {
  console.error('Error initializing Firestore:', error);
  throw error;
}

// Initialize Firebase Auth with improved error handling
let auth: Auth;
try {
  auth = getAuth(app);
  console.log('Firebase Auth initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Auth:', error);
  throw error;
}

/**
 * Checks the Firestore connection status
 * @returns Promise that resolves to true if connected, false otherwise
 */
async function checkFirestoreConnection(): Promise<boolean> {
  try {
    console.log('Checking Firestore connection...');
    return await new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => {
        console.warn('Firestore connection check timed out');
        unsubscribe();
        resolve(false);
      }, 5000);

      // Using a minimal document path to check connection
      const testDoc = doc(db, '.info/serverTime');
      const unsubscribe: Unsubscribe = onSnapshot(
        testDoc,
        (_doc: DocumentSnapshot) => {
          clearTimeout(timeout);
          unsubscribe();
          console.log('Firestore connection is active');
          resolve(true);
        },
        (error: Error) => {
          clearTimeout(timeout);
          console.error('Firestore connection error:', error);
          resolve(false);
        }
      );
    });
  } catch (error) {
    console.error('Error checking Firestore connection:', error);
    return false;
  }
}

/**
 * Checks the Auth connection status
 * @returns Promise that resolves to true if connected, false otherwise
 */
function checkAuthConnection(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      () => {
        unsubscribe();
        console.log('Auth connection is active');
        resolve(true);
      },
      (error: Error) => {
        console.error('Auth connection error:', error);
        resolve(false);
      }
    );
  });
}

export { 
  app, 
  db, 
  auth,
  checkFirestoreConnection, 
  checkAuthConnection 
};

// Configurar persistencia al inicio
async function initializePersistence() {
  try {
    // Configuramos la persistencia de Auth
    await setPersistence(auth, browserLocalPersistence);
    
    // Deshabilitamos la persistencia de Firestore explícitamente
    console.log('Persistencia de Firestore deshabilitada');
    
  } catch (error) {
    console.error('Error en la inicialización de persistencia:', error);
  }
}

// Initialize persistence
initializePersistence().catch(console.error);

// Función para verificar conectividad con Firebase
export async function checkConnectivity(): Promise<boolean> {
  try {
    console.log('Verificando conectividad con Firebase...');
    console.log('Configuración actual: ', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      appId: firebaseConfig.appId
    });

    // Verificar si Firebase está inicializado
    if (!app) {
      console.error('Firebase no está inicializado');
      return false;
    }

    // Usar las importaciones ya disponibles
    const testQuery = query(collection(db, 'test'), limit(1));
    
    try {
      await getDocs(testQuery);
      console.log('Conexión con Firestore exitosa');
      return true;
    } catch (firestoreError: any) {
      // Si falla por permisos pero la conexión es exitosa, considerar como conexión exitosa
      if (firestoreError.code === 'permission-denied' || firestoreError.code === 'missing-or-insufficient-permissions') {
        console.log('Conexión exitosa, pero falta configurar los permisos de Firestore');
        return true;
      }
      console.error('Error de Firestore:', firestoreError);
      return false;
    }
  } catch (error) {
    console.error('Error de conectividad:', error);
    return false;
  }
}

// Configurar monitoreo de autenticación
if (typeof window !== 'undefined') {
  // Monitorear estado de autenticación
  onAuthStateChanged(auth, (user: User | null) => {
    console.log('Estado de autenticación cambiado:', user ? 'Usuario autenticado' : 'No autenticado');
    if (user) {
      console.log('Usuario:', user.email);
    }
  });
}

export default app;
