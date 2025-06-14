import { ref, onMounted, onUnmounted } from 'vue';
import { chatService } from '../services/chatService';
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
    if (!name.trim()) return false;
    
    try {
      username.value = name.trim();
      isLoggedIn.value = true;
      isConnected.value = true;
      
      // Enviar mensaje de bienvenida
      await chatService.sendSystemMessage(`¡${username.value} se ha unido al chat!`);
      
      return true;
    } catch (err) {
      error.value = 'Error al conectar al chat';
      console.error('Error logging in:', err);
      return false;
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