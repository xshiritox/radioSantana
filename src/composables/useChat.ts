import { ref, onMounted, onUnmounted } from 'vue';
import { chatService } from '../services/chatService';
import { auth } from '../config/firebase';
import { signInAnonymously, AuthError } from 'firebase/auth';
import type { ChatMessage } from '../types/radio';

// Nota: La interfaz ExtendedError se ha eliminado ya que no se estaba utilizando

export function useChat() {
  const messages = ref<ChatMessage[]>([]);
  const isConnected = ref(false);
  const username = ref('');
  const isLoggedIn = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  let unsubscribe: (() => void) | null = null;

  const sendMessage = async (content: string) => {
    if (!content.trim() || !isLoggedIn.value || !username.value) {
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;
      await chatService.sendMessage(username.value, content.trim());
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al enviar mensaje';
      console.error('Error sending message:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (name: string): Promise<boolean> => {
    if (!name.trim()) {
      error.value = 'Por favor ingresa un nombre';
      return false;
    }

    try {
      isLoading.value = true;
      error.value = null;
      console.log('Iniciando autenticación anónima...');

      // Validar longitud del nombre
      if (name.trim().length < 2 || name.trim().length > 20) {
        throw { code: 'invalid-name', message: 'El nombre debe tener entre 2 y 20 caracteres' };
      }

      // 1. Intentar autenticación anónima
      console.log('Paso 1/3: Iniciando autenticación...');
      const userCredential = await signInAnonymously(auth);
      console.log('Autenticación exitosa:', { userId: userCredential.user.uid });

      // 2. Configurar estado del usuario
      console.log('Paso 2/3: Configurando usuario...');
      username.value = name.trim();
      isLoggedIn.value = true;
      isConnected.value = true;

      // 3. Enviar mensaje de bienvenida
      console.log('Paso 3/3: Enviando mensaje de bienvenida...');
      await chatService.sendSystemMessage(`¡${username.value} se ha unido al chat!`);

      console.log('Proceso de login completado con éxito');
      return true;

    } catch (err: unknown) {
      const errorObj = err as AuthError | Error | { code?: string; message?: string };
      const errorCode = 'code' in errorObj ? errorObj.code : 'unknown';
      const errorMessage = errorObj.message || 'Error desconocido';

      console.error('Error en login:', {
        code: errorCode,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        ...('details' in errorObj ? { details: errorObj.details } : {})
      });

      // Mapeo de códigos de error a mensajes amigables
      const errorMessages: Record<string, string> = {
        'auth/network-request-failed': 'Error de red: No se pudo conectar al servidor. Verifica tu conexión a internet.',
        'auth/admin-restricted-operation': 'Error de configuración: La autenticación anónima no está habilitada.',
        'auth/too-many-requests': 'Demasiados intentos. Por favor, inténtalo de nuevo más tarde.',
        'invalid-name': errorMessage,
        'permission-denied': 'No tienes permiso para acceder al chat.',
        'unavailable': 'El servicio de chat no está disponible temporalmente.'
      };

      error.value = errorCode ? (errorMessages[errorCode] || `Error al conectar al chat: ${errorMessage}`) : `Error al conectar al chat: ${errorMessage}`;
      return false;

    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    isLoggedIn.value = false;
    isConnected.value = false;
    username.value = '';
    messages.value = [];
    error.value = null;
  };

  const initializeChat = () => {
    try {
      console.log('Inicializando chat...');

      // Suscribirse a los mensajes en tiempo real
      unsubscribe = chatService.subscribeToMessages((newMessages) => {
        console.log(`Recibidos ${newMessages.length} mensajes`);
        messages.value = newMessages;
        isConnected.value = true;

        // Limpiar errores si la conexión se restablece
        if (error.value && error.value.includes('conectar') || error.value?.includes('red')) {
          error.value = null;
        }
      });

      console.log('Suscripción al chat establecida correctamente');

    } catch (err) {
      const errorObj = err as Error | { code?: string; message?: string };
      const errorCode = 'code' in errorObj ? errorObj.code : 'unknown';
      const errorMessage = errorObj.message || 'Error desconocido';

      console.error('Error al inicializar el chat:', {
        code: errorCode,
        message: errorMessage,
        timestamp: new Date().toISOString()
      });

      // Mapeo de códigos de error a mensajes amigables
      const errorMessages: Record<string, string> = {
        'permission-denied': 'No tienes permiso para acceder al chat.',
        'unavailable': 'El servicio de chat no está disponible temporalmente.',
        'resource-exhausted': 'El chat ha alcanzado su límite de capacidad. Inténtalo más tarde.'
      };

      error.value = errorCode ? (errorMessages[errorCode] || 'Error al conectar con el chat. Por favor, recarga la página.') : 'Error al conectar con el chat. Por favor, recarga la página.';

      // Intentar reconectar después de un tiempo
      if (errorCode && ['unavailable', 'resource-exhausted'].includes(errorCode)) {
        console.log('Intentando reconectar en 10 segundos...');
        setTimeout(() => {
          if (isLoggedIn.value) {
            console.log('Reconectando...');
            initializeChat();
          }
        }, 10000);
      }
    }
  };

  onMounted(() => {
    initializeChat();
  });

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  return {
    messages,
    isConnected,
    username,
    isLoggedIn,
    isLoading,
    error,
    sendMessage,
    login,
    logout,
    initializeChat
  };
}