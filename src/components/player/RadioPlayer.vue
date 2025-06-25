<script setup lang="ts">
import { useRadioPlayer } from '../../composables/useRadioPlayer';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon 
} from '@heroicons/vue/24/solid';
import BaseButton from '../common/BaseButton.vue';

const { 
  isPlaying, 
  isLoading, 
  // volume, 
  isMuted, 
  formattedVolume, 
  currentTrack, 
  radioStats, 
  togglePlay, 
  setVolume, 
  toggleMute 
} = useRadioPlayer();

const handleVolumeChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  setVolume(parseFloat(target.value) / 100);
};
</script>

<template>
  <div class="bg-gradient-to-br from-silver-900 via-silver-800 to-silver-900 rounded-2xl shadow-2xl p-6 border border-silver-700">
    <!-- Player Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div class="relative group">
          <!-- Contenedor del efecto de brillo -->
          <div class="absolute -inset-0.5 bg-gradient-to-r from-gold-400 to-gold-200 rounded-full opacity-60 blur-[4px] group-hover:opacity-80 transition-opacity duration-300"></div>
          
          <!-- Contenedor principal del logo -->
          <div class="relative w-12 h-12 rounded-full overflow-hidden border border-gold-300 shadow-lg">
            <img 
              src="/src/assets/logo.webp" 
              alt="Logo RadioVirtual Santana" 
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-white">
            RadioVirtual Santana
          </h3>
          <div class="flex items-center space-x-2 mt-2">
            <div class="flex items-center space-x-1">
              <span class="text-gold-400">🎧</span>
              <span class="text-silver-300 text-base">{{ radioStats.listeners }} oyentes</span>
            </div>
            <div class="flex items-center space-x-1">
              <span class="text-gold-400">🎵</span>
              <span class="text-silver-300 text-base">{{ radioStats.bitrate }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span class="text-sm text-green-400 font-medium">Reproduciendo</span>
      </div>
    </div>

    <!-- Current Track Info -->
    <div v-if="currentTrack" class="mb-6">
      <div class="flex items-center space-x-4">
        <div class="relative">
          <img 
            :src="currentTrack.coverUrl" 
            :alt="`${currentTrack.title} - ${currentTrack.artist}`"
            class="w-16 h-16 rounded-xl object-cover shadow-lg"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-lg font-semibold text-white truncate">{{ currentTrack.title }}</h4>
          <p class="text-silver-300 truncate">{{ currentTrack.artist }}</p>
          <p v-if="currentTrack.album" class="text-silver-400 text-sm truncate">{{ currentTrack.album }}</p>
        </div>
      </div>
    </div>

    <!-- Player Controls -->
    <div class="space-y-4">
      <!-- Play/Pause Button -->
      <div class="flex justify-center">
        <BaseButton
          @click="togglePlay"
          variant="primary"
          size="lg"
          :loading="isLoading"
          :icon="true"
          class="w-14 h-14 rounded-full bg-gold-gradient shadow-2xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 animate-pulse-slow flex items-center justify-center"
        >
          <PlayIcon v-if="!isPlaying && !isLoading" class="h-6 w-6" />
          <PauseIcon v-else-if="isPlaying" class="h-6 w-6" />
        </BaseButton>
      </div>

      <!-- Volume Control -->
      <div class="flex items-center space-x-3">
        <button 
          @click="toggleMute"
          class="p-2 rounded-lg text-silver-300 hover:text-gold-400 hover:bg-silver-800 transition-all duration-200"
        >
          <SpeakerWaveIcon v-if="!isMuted" class="h-5 w-5" />
          <SpeakerXMarkIcon v-else class="h-5 w-5" />
        </button>
        
        <div class="flex-1 relative">
          <input
            type="range"
            min="0"
            max="100"
            :value="formattedVolume"
            @input="handleVolumeChange"
            class="w-full h-2 bg-silver-700 rounded-lg appearance-none cursor-pointer slider"
            :class="{ 'opacity-50': isMuted }"
          />
          <div 
            class="absolute top-0 left-0 h-2 bg-gold-gradient rounded-lg pointer-events-none transition-all duration-200"
            :style="{ width: `${formattedVolume}%` }"
          ></div>
        </div>
        
        <span class="text-sm text-silver-300 w-10 text-right">{{ formattedVolume }}%</span>
      </div>
    </div>

    <!-- Radio Stats -->
    <div class="mt-6 pt-4 border-t border-silver-700">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-2xl font-bold text-gold-400">{{ radioStats.listeners }}</p>
          <p class="text-xs text-silver-400">Oyentes</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-gold-400">{{ radioStats.bitrate }}</p>
          <p class="text-xs text-silver-400">Calidad</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-gold-400">24/7</p>
          <p class="text-xs text-silver-400">En línea</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700 0%, #DAA520 50%, #B8860B 100%);
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700 0%, #DAA520 50%, #B8860B 100%);
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
</style>