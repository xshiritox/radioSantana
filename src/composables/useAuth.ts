import { ref, onMounted } from 'vue';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';

export function useAuth() {
  const user = ref<User | null>(null);
  const isAdmin = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Lista de emails de administradores
  const adminEmails = [
    'admin@radiosantana.com',
    'radiosantana.nm@gmail.com',
    'dj@radiosantana.com'
  ];

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Verificar si es admin
      if (adminEmails.includes(userCredential.user.email || '')) {
        isAdmin.value = true;
        return true;
      } else {
        await signOut(auth);
        error.value = 'No tienes permisos de administrador';
        return false;
      }
    } catch (err: any) {
      console.error('Error en login:', err);
      
      switch (err.code) {
        case 'auth/user-not-found':
          error.value = 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          error.value = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          error.value = 'Email inválido';
          break;
        case 'auth/too-many-requests':
          error.value = 'Demasiados intentos. Intenta más tarde';
          break;
        default:
          error.value = 'Error al iniciar sesión';
      }
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      isAdmin.value = false;
      user.value = null;
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  onMounted(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser;
      isAdmin.value = firebaseUser ? adminEmails.includes(firebaseUser.email || '') : false;
    });
  });

  return {
    user,
    isAdmin,
    isLoading,
    error,
    login,
    logout
  };
}