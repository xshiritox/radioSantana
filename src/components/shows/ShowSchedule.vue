<script setup lang="ts">
import { onMounted } from 'vue';
import { useShows } from '../../composables/useShows';

const { shows, currentShow, getCurrentShow, /* getUpcomingShows */ } = useShows();

onMounted(() => {
  getCurrentShow();
});

const isCurrentShow = (show: any) => {
  return currentShow.value?.id === show.id;
};

const formatTime = (time: string) => {
  return time;
};
</script>

<template>
  <div class="space-y-4 md:space-y-6">
    <!-- Current Show -->
    <div v-if="currentShow" class="bg-gradient-to-r from-gold-600 to-gold-500 rounded-2xl p-4 md:p-6 text-white shadow-2xl">
      <div class="flex items-center space-x-2 mb-2 md:mb-3">
        <div class="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-pulse"></div>
        <span class="text-xs md:text-sm font-medium uppercase tracking-wide">EN VIVO AHORA</span>
      </div>
      <div class="flex items-center space-x-3 md:space-x-4">
        <div class="w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-lg overflow-hidden flex-shrink-0">
          <img 
            :src="currentShow.imageUrl" 
            :alt="currentShow.name"
            class="w-full h-full"
            style="width: 100%; height: 100%; object-fit: cover;"
            loading="lazy"
          />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-xl md:text-2xl font-bold mb-1 truncate">{{ currentShow.name }}</h3>
          <p class="text-white/90 text-sm md:text-base mb-1 md:mb-2 truncate">Con {{ currentShow.host }}</p>
          <p class="text-white/80 text-xs md:text-sm">{{ formatTime(currentShow.startTime) }} - {{ formatTime(currentShow.endTime) }}</p>
        </div>
      </div>
    </div>

    <!-- All Shows Schedule -->
    <div class="bg-gradient-to-br from-silver-900 to-silver-800 rounded-2xl p-4 md:p-6 shadow-2xl">
      <h3 class="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center">
        <span class="mr-2 md:mr-3">📅</span>
        Programación Semanal
      </h3>

      <div class="space-y-3 md:space-y-4">
        <div
          v-for="show in shows"
          :key="show.id"
          class="group relative overflow-hidden rounded-xl transition-all duration-300 hover:transform hover:scale-[1.02]"
          :class="[
            isCurrentShow(show)
              ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-2xl'
              : 'bg-silver-800 hover:bg-silver-700 text-silver-100'
          ]"
        >
          <div class="p-3 md:p-4">
            <div class="flex items-start space-x-3 md:space-x-4">
              <!-- Show Image -->
              <div class="relative flex-shrink-0">
                <div class="w-14 h-14 md:w-16 md:h-16 rounded-lg shadow-lg overflow-hidden">
                  <img 
                    :src="show.imageUrl" 
                    :alt="show.name"
                    class="w-full h-full"
                    style="width: 100%; height: 100%; object-fit: cover;"
                    loading="lazy"
                  />
                </div>
                <div v-if="isCurrentShow(show)" class="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full flex items-center justify-center">
                  <div class="w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              <!-- Show Info -->
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <h4 class="text-base md:text-lg font-semibold truncate">{{ show.name }}</h4>
                  <span v-if="isCurrentShow(show)" class="px-2 py-0.5 md:py-1 bg-white/20 rounded-full text-[10px] md:text-xs font-medium whitespace-nowrap">
                    EN VIVO
                  </span>
                </div>
                <p class="text-xs md:text-sm opacity-90 mb-1 md:mb-2 truncate">Con {{ show.host }}</p>
                <p class="text-xs opacity-75 line-clamp-2 hidden sm:block">{{ show.description }}</p>
              </div>

              <!-- Schedule Info -->
              <div class="text-right flex-shrink-0 ml-auto">
                <p class="font-semibold text-base md:text-lg whitespace-nowrap">
                  {{ formatTime(show.startTime) }}
                </p>
                <p class="text-xs md:text-sm opacity-75 whitespace-nowrap">
                  {{ formatTime(show.endTime) }}
                </p>
                <div class="hidden xs:flex flex-wrap justify-end gap-1 mt-1 md:mt-2">
                  <span
                    v-for="day in show.days.slice(0, 3)"
                    :key="day"
                    class="px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[10px] md:text-xs font-medium whitespace-nowrap"
                    :class="[
                      isCurrentShow(show)
                        ? 'bg-white/20 text-white'
                        : 'bg-gold-500 text-white'
                    ]"
                  >
                    {{ day.slice(0, 3) }}
                  </span>
                  <span
                    v-if="show.days.length > 3"
                    class="px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[10px] md:text-xs font-medium whitespace-nowrap"
                    :class="[
                      isCurrentShow(show)
                        ? 'bg-white/20 text-white'
                        : 'bg-gold-500 text-white'
                    ]"
                  >
                    +{{ show.days.length - 3 }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Hover Effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-gold-600/10 to-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>