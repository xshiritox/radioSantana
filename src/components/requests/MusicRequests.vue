<script setup lang="ts">
import { ref, computed } from 'vue';
import { MusicalNoteIcon, HeartIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';
import BaseButton from '../common/BaseButton.vue';
import { useMusicRequests } from '../../composables/useMusicRequests';

const { requests, isLoading, error, submitRequest } = useMusicRequests();

const newRequest = ref({
  track: '',
  artist: '',
  requester: '',
  message: ''
});

const showSuccessMessage = ref(false);

const isFormValid = computed(() => {
  return newRequest.value.track.trim() && 
         newRequest.value.artist.trim() && 
         newRequest.value.requester.trim();
});

const handleSubmitRequest = async () => {
  if (!isFormValid.value || isLoading.value) return;

  const success = await submitRequest(
    newRequest.value.track,
    newRequest.value.artist,
    newRequest.value.requester,
    newRequest.value.message
  );

  if (success) {
    // Reset form
    newRequest.value = {
      track: '',
      artist: '',
      requester: '',
      message: ''
    };
    
    // Show success message
    showSuccessMessage.value = true;
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  }
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

      <!-- Error Message -->
      <div v-if="error" class="bg-red-600 text-white p-3 rounded-lg mb-4 flex items-center space-x-2">
        <ExclamationTriangleIcon class="h-5 w-5" />
        <span class="text-sm">{{ error }}</span>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccessMessage" class="bg-green-600 text-white p-3 rounded-lg mb-4 flex items-center space-x-2">
        <CheckCircleIcon class="h-5 w-5" />
        <span class="text-sm">¡Petición enviada exitosamente!</span>
      </div>

      <form @submit.prevent="handleSubmitRequest" class="space-y-4">
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
              :disabled="isLoading"
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
              :disabled="isLoading"
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
            :disabled="isLoading"
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
            :disabled="isLoading"
          ></textarea>
        </div>

        <BaseButton 
          type="submit" 
          variant="primary" 
          size="lg"
          :loading="isLoading"
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
        <!-- Loading state -->
        <div v-if="isLoading && requests.length === 0" class="text-center py-8">
          <div class="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full mx-auto"></div>
          <p class="text-silver-400 text-sm mt-2">Cargando peticiones...</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="requests.length === 0" class="text-center py-8">
          <MusicalNoteIcon class="h-16 w-16 text-silver-400 mx-auto mb-4" />
          <p class="text-silver-400">¡Sé el primero en pedir una canción!</p>
        </div>

        <!-- Requests list -->
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