<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useChat } from '../../composables/useChat';
import { PaperAirplaneIcon, UserIcon } from '@heroicons/vue/24/outline';
import BaseButton from '../common/BaseButton.vue';

const { 
  messages, 
  isLoggedIn, 
  username, 
  sendMessage, 
  login, 
  logout, 
  initializeChat 
} = useChat();

const newMessage = ref('');
const loginName = ref('');

const handleSendMessage = () => {
  if (newMessage.value.trim()) {
    sendMessage(newMessage.value);
    newMessage.value = '';
  }
};

const handleLogin = () => {
  if (loginName.value.trim()) {
    login(loginName.value);
    loginName.value = '';
  }
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const getMessageTypeClass = (type: string) => {
  switch (type) {
    case 'dj':
      return 'bg-gold-600 text-white';
    case 'system':
      return 'bg-blue-600 text-white';
    default:
      return 'bg-silver-700 text-silver-100';
  }
};

onMounted(() => {
  initializeChat();
});
</script>

<template>
  <div class="bg-gradient-to-br from-silver-900 to-silver-800 rounded-2xl shadow-2xl overflow-hidden">
    <!-- Chat Header -->
    <div class="bg-gradient-to-r from-gold-600 to-gold-500 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span class="text-xl">💬</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">Chat En Vivo</h3>
            <p class="text-white/80 text-sm">{{ messages.length }} mensajes</p>
          </div>
        </div>
        <div v-if="isLoggedIn" class="flex items-center space-x-2">
          <span class="text-white/90 text-sm">{{ username }}</span>
          <button 
            @click="logout"
            class="text-white/80 hover:text-white text-sm underline"
          >
            Salir
          </button>
        </div>
      </div>
    </div>

    <!-- Login Form (if not logged in) -->
    <div v-if="!isLoggedIn" class="p-6">
      <div class="text-center space-y-4">
        <UserIcon class="h-16 w-16 text-silver-400 mx-auto" />
        <h4 class="text-xl font-semibold text-white">Únete al Chat</h4>
        <p class="text-silver-300">Ingresa tu nombre para participar en la conversación</p>
        
        <div class="flex space-x-2">
          <input
            v-model="loginName"
            @keyup.enter="handleLogin"
            type="text"
            placeholder="Tu nombre..."
            class="flex-1 px-4 py-2 bg-silver-800 border border-silver-600 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            maxlength="20"
          />
          <BaseButton @click="handleLogin" variant="primary">
            Entrar
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Chat Interface (if logged in) -->
    <div v-else class="flex flex-col h-96">
      <!-- Messages Area -->
      <div 
        id="chat-messages"
        class="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-silver-600 scrollbar-track-silver-800"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex flex-col space-y-1"
        >
          <div class="flex items-center space-x-2">
            <span 
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="getMessageTypeClass(message.type)"
            >
              {{ message.username }}
            </span>
            <span class="text-xs text-silver-400">
              {{ formatTime(message.timestamp) }}
            </span>
          </div>
          <p class="text-silver-100 text-sm pl-4 leading-relaxed">
            {{ message.message }}
          </p>
        </div>
      </div>

      <!-- Message Input -->
      <div class="p-4 border-t border-silver-700">
        <div class="flex space-x-2">
          <input
            v-model="newMessage"
            @keyup.enter="handleSendMessage"
            type="text"
            placeholder="Escribe tu mensaje..."
            class="flex-1 px-4 py-2 bg-silver-800 border border-silver-600 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            maxlength="200"
          />
          <BaseButton 
            @click="handleSendMessage" 
            variant="primary" 
            :icon="true"
            :disabled="!newMessage.trim()"
          >
            <PaperAirplaneIcon class="h-5 w-5" />
          </BaseButton>
        </div>
        <p class="text-xs text-silver-400 mt-2">
          {{ newMessage.length }}/200 caracteres
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-silver-600::-webkit-scrollbar-thumb {
  background-color: #475569;
}

.scrollbar-track-silver-800::-webkit-scrollbar-track {
  background-color: #1e293b;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background-color: #1e293b;
}

::-webkit-scrollbar-thumb {
  background-color: #475569;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #64748b;
}
</style>