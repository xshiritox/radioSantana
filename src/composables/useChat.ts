import { ref, onMounted, onUnmounted } from 'vue';
import { chatService } from '../services/chatService';
import { auth } from '../config/firebase';
import { signInAnonymously } from 'firebase/auth';
import type { ChatMessage } from '../types/radio';

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
      console.log('Intentando autenticación anónima...');
      
      // Iniciar sesión anónimamente
      const userCredential = await signInAnonymously(auth);
      console.log('Autenticación exitosa:', userCredential);
      
      // Configurar el nombre de usuario
      username.value = name.trim();
      isLoggedIn.value = true;
      isConnected.value = true;
      
      // Enviar mensaje de bienvenida
      await chatService.sendSystemMessage(`¡${username.value} se ha unido al chat!`);
      
      return true;
    } catch (err: any) {
      console.error('Error en login:', {
        code: err.code,
        message: err.message,
        fullError: err
      });
      
      if (err.code === 'auth/admin-restricted-operation') {
        error.value = 'Error de configuración: La autenticación anónima no está habilitada en Firebase';
      } else if (err.code === 'auth/network-request-failed') {
        error.value = 'Error de red: No se pudo conectar al servidor';
      } else {
        error.value = 'Error al conectar al chat: ' + (err.message || 'Error desconocido');
      }
      
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
      // Suscribirse a los mensajes en tiempo real
      unsubscribe = chatService.subscribeToMessages((newMessages) => {
        messages.value = newMessages;
        isConnected.value = true;
      });
    } catch (err) {
      error.value = 'Error al conectar con el chat';
      console.error('Error initializing chat:', err);
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