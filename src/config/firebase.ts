import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCdKhRlNZ_dFrEfRFWBPfKFNDyVaDHA8Jc",
  authDomain: window.location.hostname === 'localhost' 
    ? "radiosantananm-cda61.firebaseapp.com" 
    : "radiosantana.netlify.app",
  projectId: "radiosantananm-cda61",
  storageBucket: "radiosantananm-cda61.appspot.com",
  messagingSenderId: "969499423409",
  appId: "1:969499423409:web:39d81d4686017371df2890"
};

// Configuración de dominios autorizados para redirección
export const AUTH_DOMAINS = {
  PRODUCTION: 'radiosantana.netlify.app',
  FIREBASE: 'radiosantananm-cda61.firebaseapp.com'
};

// Inicializar Firebase (evitar múltiples inicializaciones)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializar Firestore
export const db = getFirestore(app);

// Inicializar Auth
export const auth = getAuth(app);

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

export default app;