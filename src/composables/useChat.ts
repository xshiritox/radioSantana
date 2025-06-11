import { ref, nextTick } from 'vue';
import type { ChatMessage } from '../types/radio';

export function useChat() {
  const messages = ref<ChatMessage[]>([]);
  const isConnected = ref(false);
  const username = ref('');
  const isLoggedIn = ref(false);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    messages.value.push(newMessage);
    
    // Keep only last 100 messages
    if (messages.value.length > 100) {
      messages.value = messages.value.slice(-100);
    }
    
    // Auto scroll to bottom
    nextTick(() => {
      const chatContainer = document.getElementById('chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    });
  };

  const sendMessage = (content: string) => {
    if (!content.trim() || !isLoggedIn.value) return;
    
    addMessage({
      username: username.value,
      message: content.trim(),
      type: 'user'
    });
  };

  const login = (name: string) => {
    if (!name.trim()) return false;
    
    username.value = name.trim();
    isLoggedIn.value = true;
    isConnected.value = true;
    
    // Add welcome message
    addMessage({
      username: 'Sistema',
      message: `¡Bienvenido ${username.value} a RadioOnline Santana!`,
      type: 'system'
    });
    
    return true;
  };

  const logout = () => {
    isLoggedIn.value = false;
    isConnected.value = false;
    username.value = '';
  };

  // Simulate some activity
  const simulateActivity = () => {
    const sampleMessages = [
      { username: 'DJ-Santana', message: '¡Gracias por sintonizarnos!', type: 'dj' as const },
      { username: 'Público', message: 'Excelente música', type: 'user' as const },
      { username: 'MusicLover', message: 'Más música!', type: 'user' as const },
      { username: 'Sistema', message: 'Nuevos oyentes conectados', type: 'system' as const }
    ];

    setInterval(() => {
      if (Math.random() > 0.7) {
        const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        addMessage(randomMessage);
      }
    }, 15000);
  };

  // Initialize with some sample messages
  const initializeChat = () => {
    addMessage({
      username: 'Sistema',
      message: 'Bienvenidos al chat de RadioOnline Santana',
      type: 'system'
    });
    
    simulateActivity();
  };

  return {
    messages,
    isConnected,
    username,
    isLoggedIn,
    addMessage,
    sendMessage,
    login,
    logout,
    initializeChat
  };
}