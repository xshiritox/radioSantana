<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../../composables/useAuth';
import { 
  CogIcon, 
  NewspaperIcon, 
  CalendarIcon, 
  XMarkIcon,
  UserIcon
} from '@heroicons/vue/24/outline';
import ShowsManager from './ShowsManager.vue';
import NewsManager from './NewsManager.vue';

const { user, isAdmin, logout } = useAuth();

const activeTab = ref<'shows' | 'news'>('shows');
const isVisible = ref(false);

const togglePanel = () => {
  isVisible.value = !isVisible.value;
};

const handleLogout = async () => {
  await logout();
  isVisible.value = false;
};

const setActiveTab = (tab: 'shows' | 'news') => {
  activeTab.value = tab;
};
</script>

<template>
  <!-- Admin Panel Button -->
  <div v-if="isAdmin" class="fixed bottom-6 right-6 z-50">
    <button
      @click="togglePanel"
      class="w-14 h-14 bg-gold-gradient rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
    >
      <CogIcon v-if="!isVisible" class="h-6 w-6 text-white" />
      <XMarkIcon v-else class="h-6 w-6 text-white" />
    </button>
  </div>

  <!-- Admin Panel Modal -->
  <div
    v-if="isAdmin && isVisible"
    class="fixed inset-0 z-40 overflow-hidden"
  >
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      @click="togglePanel"
    ></div>

    <!-- Panel -->
    <div class="absolute right-0 top-0 h-full w-full max-w-4xl bg-gradient-to-br from-silver-900 to-silver-800 shadow-2xl transform transition-transform duration-300">
      <!-- Header -->
      <div class="bg-gradient-to-r from-gold-600 to-gold-500 p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <CogIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-white">Panel de Administración</h2>
              <div class="flex items-center space-x-2 text-white/80">
                <UserIcon class="h-4 w-4" />
                <span class="text-sm">{{ user?.email }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="handleLogout"
              class="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
            >
              Cerrar Sesión
            </button>
            <button
              @click="togglePanel"
              class="p-2 text-white/80 hover:text-white transition-colors"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex space-x-1 mt-6">
          <button
            @click="setActiveTab('shows')"
            class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
            :class="[
              activeTab === 'shows'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            ]"
          >
            <CalendarIcon class="h-5 w-5" />
            <span>Programación</span>
          </button>
          <button
            @click="setActiveTab('news')"
            class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
            :class="[
              activeTab === 'news'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            ]"
          >
            <NewspaperIcon class="h-5 w-5" />
            <span>Noticias</span>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 h-full overflow-y-auto pb-24">
        <ShowsManager v-if="activeTab === 'shows'" />
        <NewsManager v-if="activeTab === 'news'" />
      </div>
    </div>
  </div>
</template>