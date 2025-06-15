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
      console.log('Iniciando proceso de login con:', email);
      isLoading.value = true;
      error.value = null;
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Credenciales válidas, usuario autenticado:', userCredential.user?.email);
      
      // Verificar si es admin
      const userEmail = userCredential.user?.email || '';
      console.log('Verificando si el usuario es admin:', userEmail);
      
      if (adminEmails.includes(userEmail)) {
        console.log('Usuario es administrador');
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
    console.log('Iniciando observador de autenticación');
    onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Cambio en el estado de autenticación:', firebaseUser?.email);
      user.value = firebaseUser;
      const isUserAdmin = firebaseUser ? adminEmails.includes(firebaseUser.email || '') : false;
      console.log('¿Usuario es administrador?', isUserAdmin);
      isAdmin.value = isUserAdmin;
    }, (error) => {
      console.error('Error en el observador de autenticación:', error);
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