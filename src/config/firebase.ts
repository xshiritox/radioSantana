import { initializeApp, type FirebaseApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  type Firestore,
  doc, // Used for creating document references
  onSnapshot,
  type DocumentSnapshot,
  type Unsubscribe
} from 'firebase/firestore';
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence, 
  type Auth,
  onAuthStateChanged
} from 'firebase/auth';

// Configuración de Firebase para producción
const firebaseConfig = {
  apiKey: "AIzaSyCdKhRlNZ_dFrEfRFWBPfKFNDyVaDHA8Jc",
  authDomain: "radiosantananm-cda61.firebaseapp.com",
  databaseURL: "https://radiosantananm-cda61-default-rtdb.firebaseio.com",
  projectId: "radiosantananm-cda61",
  storageBucket: "radiosantananm-cda61.appspot.com",
  messagingSenderId: "969499423409",
  appId: "1:969499423409:web:39d81d4686017371df2890",
  measurementId: "G-NPFSJNBSJ8"
};

// Usar siempre la configuración de producción
const config = firebaseConfig;

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
  app = getApps().length === 0 ? initializeApp(config) : getApp();
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize Firestore with improved error handling
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

// Analytics initialization is now handled in the exports section

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
        (_doc: DocumentSnapshot) => {  // Using _doc to indicate intentionally unused parameter
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
      () => {  // Using empty param since we don't need the user object here
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

// Analytics deshabilitado por solicitud del usuario

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

    // Intentar una operación simple de Firestore
    const { getDocs, collection, query, limit } = await import('firebase/firestore');
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
  auth.onAuthStateChanged((user) => {
    console.log('Estado de autenticación cambiado:', user ? 'Usuario autenticado' : 'No autenticado');
    if (user) {
      console.log('Usuario:', user.email);
    }
  });
}

export default app;