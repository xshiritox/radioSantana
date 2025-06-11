<script setup lang="ts">
import { ref, computed } from 'vue';
import { MusicalNoteIcon, HeartIcon } from '@heroicons/vue/24/outline';
import BaseButton from '../common/BaseButton.vue';
import type { MusicRequest } from '../../types/radio';

const requests = ref<MusicRequest[]>([]); // Lista vacía para nuevas peticiones

const newRequest = ref({
  track: '',
  artist: '',
  requester: '',
  message: ''
});

const isFormValid = computed(() => {
  return newRequest.value.track.trim() && 
         newRequest.value.artist.trim() && 
         newRequest.value.requester.trim();
});

const submitRequest = () => {
  if (!isFormValid.value) return;

  const request: MusicRequest = {
    id: Date.now().toString(),
    track: newRequest.value.track.trim(),
    artist: newRequest.value.artist.trim(),
    requester: newRequest.value.requester.trim(),
    message: newRequest.value.message.trim() || undefined,
    timestamp: new Date(),
    status: 'pending'
  };

  requests.value.unshift(request);
  
  // Reset form
  newRequest.value = {
    track: '',
    artist: '',
    requester: '',
    message: ''
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'text-yellow-400 bg-yellow-400/20';
    case 'approved': return 'text-green-400 bg-green-400/20';
    case 'played': return 'text-blue-400 bg-blue-400/20';
    default: return 'text-silver-400 bg-silver-400/20';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Pendiente';
    case 'approved': return 'Aprobada';
    case 'played': return 'Reproducida';
    default: return 'Desconocido';
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'Hace un momento';
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days}d`;
};
</script>

<template>
  <div class="space-y-6">
    <!-- Request Form -->
    <div class="bg-gradient-to-br from-silver-900 to-silver-800 rounded-2xl p-6 shadow-2xl">
      <div class="flex items-center space-x-3 mb-6">
        <div class="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center">
          <MusicalNoteIcon class="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 class="text-2xl font-bold text-white">Pedir Música</h3>
          <p class="text-silver-300">Solicita tu canción favorita</p>
        </div>
      </div>

      <form @submit.prevent="submitRequest" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-silver-300 mb-2">
              Canción *
            </label>
            <input
              v-model="newRequest.track"
              type="text"
              required
              placeholder="Nombre de la canción"
              class="w-full px-4 py-3 bg-silver-800 border border-silver-600 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-silver-300 mb-2">
              Artista *
            </label>
            <input
              v-model="newRequest.artist"
              type="text"
              required
              placeholder="Nombre del artista"
              class="w-full px-4 py-3 bg-silver-800 border border-silver-600 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-silver-300 mb-2">
            Tu nombre *
          </label>
          <input
            v-model="newRequest.requester"
            type="text"
            required
            placeholder="¿Cómo te llamas?"
            class="w-full px-4 py-3 bg-silver-800 border border-silver-600 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-silver-300 mb-2">
            Mensaje (opcional)
          </label>
          <textarea
            v-model="newRequest.message"
            rows="3"
            placeholder="¿Algún mensaje especial?"
            class="w-full px-4 py-3 bg-silver-800 border border-silver-600 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 resize-none"
          ></textarea>
        </div>

        <BaseButton 
          type="submit" 
          variant="primary" 
          size="lg"
          :disabled="!isFormValid"
          class="w-full"
        >
          <MusicalNoteIcon class="h-5 w-5 mr-2" />
          Enviar Petición
        </BaseButton>
      </form>
    </div>

    <!-- Recent Requests -->
    <div class="bg-gradient-to-br from-silver-900 to-silver-800 rounded-2xl p-6 shadow-2xl">
      <h3 class="text-2xl font-bold text-white mb-6 flex items-center">
        <HeartIcon class="h-7 w-7 mr-3 text-gold-400" />
        Peticiones Recientes
      </h3>

      <div class="space-y-4">
        <div
          v-for="request in requests"
          :key="request.id"
          class="bg-silver-800 rounded-xl p-4 hover:bg-silver-700 transition-all duration-200 border border-silver-600"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3 mb-2">
                <h4 class="text-lg font-semibold text-white truncate">
                  {{ request.track }}
                </h4>
                <span 
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="getStatusColor(request.status)"
                >
                  {{ getStatusText(request.status) }}
                </span>
              </div>
              
              <p class="text-silver-300 mb-1">
                Por <span class="font-medium text-gold-400">{{ request.artist }}</span>
              </p>
              
              <div class="flex items-center space-x-4 text-sm text-silver-400">
                <span>Pedida por {{ request.requester }}</span>
                <span>{{ formatTimeAgo(request.timestamp) }}</span>
              </div>
              
              <p v-if="request.message" class="text-silver-300 text-sm mt-2 italic">
                "{{ request.message }}"
              </p>
            </div>
            
            <div class="ml-4">
              <div class="w-16 h-16 bg-gold-gradient rounded-lg flex items-center justify-center shadow-lg">
                <MusicalNoteIcon class="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <p class="text-silver-400 text-sm">
          Las peticiones son revisadas por nuestros DJs y se reproducirán según disponibilidad
        </p>
      </div>
    </div>
  </div>
</template>