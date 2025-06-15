import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

// Configuración de Firebase para producción
const firebaseConfig = {
  apiKey: "AIzaSyCdKhRlNZ_dFrEfRFWBPfKFNDyVaDHA8Jc",
  authDomain: "radiosantananm-cda61.firebaseapp.com",
  databaseURL: "https://radiosantananm-cda61-default-rtdb.firebaseio.com",
  projectId: "radiosantananm-cda61",
  storageBucket: "radiosantananm-cda61.appspot.com",
  messagingSenderId: "969499423409",
  appId: "1:969499423409:web:39d81d4686017371df2890"
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

// Inicializar Firebase (evitar múltiples inicializaciones)
const app = !getApps().length ? initializeApp(config) : getApp();

// Inicializar Firestore
export const db = getFirestore(app);

// Inicializar Auth
export const auth = getAuth(app);

// Configurar persistencia de autenticación
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error configurando persistencia:', error);
});

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

// Función para inicializar la persistencia
const initializePersistence = async () => {
  try {
    // Habilitar persistencia de Firestore
    await enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Múltiples pestañas abiertas, la persistencia solo puede estar habilitada en una pestaña a la vez.');
      } else if (err.code === 'unimplemented') {
        console.warn('El navegador actual no admite todas las funciones necesarias para habilitar la persistencia.');
      } else {
        console.error('Error al habilitar la persistencia:', err);
      }
    });
    
    // Configurar persistencia de autenticación
    await setPersistence(auth, browserLocalPersistence);
    
    console.log('Persistencia configurada correctamente');
  } catch (error) {
    console.error('Error al configurar la persistencia:', error);
  }
};

// Inicializar persistencia al cargar la aplicación
initializePersistence().catch(console.error);

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