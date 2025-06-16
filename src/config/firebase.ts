import { initializeApp, type FirebaseApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence, 
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

// Analytics placeholder - will be initialized in the browser context
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize analytics as null by default
let analytics: any = null;

// Analytics functions
export const logAnalyticsEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  try {
    window.gtag('event', eventName, eventParams);
  } catch (error) {
    console.error('Error logging analytics event:', error);
  }
};

// Initialize analytics if in browser
if (typeof window !== 'undefined') {
  try {
    // Add Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${firebaseConfig.measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: any[]) {
      window.dataLayer.push(args);
    };
    
    window.gtag('js', new Date());
    window.gtag('config', firebaseConfig.measurementId, {
      send_page_view: true
    });
    
    console.log('Google Analytics initialized successfully');
    
    // Set up auth state tracking
    auth.onAuthStateChanged((user: any) => {
      if (user) {
        // Set user ID for analytics
        window.gtag('set', 'user_properties', {
          user_id: user.uid,
          email: user.email || '',
          email_verified: user.emailVerified,
          last_login: new Date().toISOString(),
          account_created: user.metadata?.creationTime || new Date().toISOString(),
          last_sign_in: user.metadata?.lastSignInTime || new Date().toISOString()
        });
        
        // Log login event with additional context
        logAnalyticsEvent('login', {
          method: user.providerData?.[0]?.providerId || 'email',
          email: user.email || '',
          is_new_user: user.metadata?.creationTime === user.metadata?.lastSignInTime
        });
        
        // Log page view after login
        logAnalyticsEvent('page_view');
      } else {
        // User signed out
        logAnalyticsEvent('logout');
        
        // Reset user ID in analytics
        window.gtag('set', 'user_properties', {
          user_id: null,
          email: null,
          email_verified: null,
          last_login: null
        });
      }
    });
    
    // Log page views on route changes if using a router
    if (window.location) {
      logAnalyticsEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
      
      // Optional: Listen for route changes if using a SPA router
      window.addEventListener('popstate', () => {
        logAnalyticsEvent('page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: window.location.pathname
        });
      });
    }
    
  } catch (error) {
    console.error('Error initializing Analytics:', error);
  }
} else if (typeof window !== 'undefined') {
  console.warn('Google Analytics not initialized - missing measurementId in firebaseConfig');
}

export { 
  app, 
  db, 
  auth, 
  analytics,
  checkFirestoreConnection, 
  checkAuthConnection
};

// Configurar persistencia al inicio
async function initializePersistence() {
  try {
    // Primero configuramos la persistencia de Auth
    await setPersistence(auth, browserLocalPersistence);
    
    // Verificamos si estamos en un entorno de navegador
    if (typeof window === 'undefined') {
      console.log('Entorno sin navegador, omitiendo persistencia de Firestore');
      return;
    }

    // Verificar si ya hay una instancia de Firestore con persistencia habilitada
    if (window.indexedDB) {
      try {
        // Intentar limpiar datos antiguos si existen
        const dbs = await window.indexedDB.databases();
        const firestoreDB = dbs.find(db => db && db.name && db.name.includes('firestore'));
        
        if (firestoreDB && firestoreDB.name) {
          console.log('Limpiando caché de Firestore...');
          await window.indexedDB.deleteDatabase(firestoreDB.name);
        }
      } catch (cleanupError) {
        console.warn('No se pudo limpiar el caché de Firestore:', cleanupError);
      }
    }

    // Configurar la persistencia de Firestore con manejo de errores mejorado
    try {
      await enableIndexedDbPersistence(db, {
        forceOwnership: true
      });
      console.log('Persistencia de Firestore habilitada correctamente');
    } catch (error: any) {
      if (error.code === 'failed-precondition') {
        // Múltiples pestañas abiertas
        console.warn('Persistencia de Firestore no disponible en múltiples pestañas');
      } else if (error.code === 'unimplemented') {
        // Navegador no compatible
        console.warn('El navegador actual no soporta la persistencia de Firestore');
      } else if (error.code === 'failed-precondition') {
        // Datos de versión anterior
        console.warn('Datos de Firestore de una versión anterior. Se usará el modo sin persistencia.');
      } else {
        console.warn('Error al habilitar persistencia de Firestore:', error);
      }
    }
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

// Configurar monitoreo de conexión
if (typeof window !== 'undefined') {
  // Monitorear estado de autenticación
  auth.onAuthStateChanged((user) => {
    console.log('Estado de autenticación cambiado:', user ? 'Usuario autenticado' : 'No autenticado');
    if (user) {
      console.log('Usuario:', user.email);
    }
  });

  // Monitorear estado de conexión
  import('firebase/database')
    .then(({ getDatabase, ref, onValue }) => {
      const dbRef = ref(getDatabase(app), '.info/connected');
      onValue(dbRef, (snap) => {
        console.log('Estado de conexión a Firebase:', snap.val() ? 'Conectado' : 'Desconectado');
      });
    })
    .catch(console.error);
}

export default app;