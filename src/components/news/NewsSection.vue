<script setup lang="ts">
import { ref } from 'vue';
import { NewspaperIcon, CalendarIcon, UserIcon } from '@heroicons/vue/24/outline';
import type { NewsItem } from '../../types/radio';

// Importar imágenes
import new1 from '../../assets/new1.jpg';
import new3 from '../../assets/new3.jpg';
import new4 from '../../assets/new4.jpg';

const news = ref<NewsItem[]>([
  {
    id: '1',
    title: 'Nueva Programación',
    content: 'Pronto comezaremos con nueva programación para ti',
    author: 'Equipo RadioOnline Santana',
    publishedAt: new Date('2025-06-11'), // Hoy
    category: 'Radio',
    imageUrl: new1
  },
  {
    id: '3',
    title: 'Renovación de Equipos Técnicos',
    content: 'Hemos renovado todo nuestro equipo técnico para ofrecerte la mejor calidad de sonido. Ahora transmitimos en alta definición 24/7.',
    author: 'Equipo RadioOnline Santana',
    publishedAt: new Date('22025-06-10'), // Hoy
    category: 'Tecnología',
    imageUrl: new3
  },
  {
    id: '4',
    title: 'Nuevo Chat Interactivo',
    content: 'Ya puedes interactuar con otros oyentes y con nuestros DJs a través del nuevo chat en vivo integrado en nuestra página web.',
    author: 'Equipo RadioOnline Santana',
    publishedAt: new Date('2025-06-11'), // Hoy
    category: 'Tecnología',
    imageUrl: new4
  }
]);

const formatDate = (date: Date) => {
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'radio': return 'bg-gold-500 text-white';
    case 'eventos': return 'bg-green-500 text-white';
    case 'tecnología': return 'bg-blue-500 text-white';
    default: return 'bg-silver-500 text-white';
  }
};
</script>

<template>
  <div class="bg-gradient-to-br from-silver-900 to-silver-800 rounded-2xl p-6 shadow-2xl">
    <!-- Header -->
    <div class="flex items-center space-x-3 mb-8">
      <div class="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center">
        <NewspaperIcon class="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 class="text-2xl font-bold text-white">Noticias y Actualizaciones</h3>
        <p class="text-silver-300">Lo último de RadioOnline Santana</p>
      </div>
    </div>

    <!-- Featured News -->
    <div v-if="news.length > 0" class="mb-8">
      <div class="bg-gradient-to-r from-gold-600 to-gold-500 rounded-2xl p-6 text-white shadow-xl">
        <div class="flex flex-col md:flex-row md:items-center md:space-x-6">
          <div class="md:w-1/3 mb-4 md:mb-0">
            <img 
              :src="news[0].imageUrl" 
              :alt="news[0].title"
              class="w-full h-48 md:h-32 object-cover rounded-xl shadow-lg"
            />
          </div>
          <div class="md:w-2/3">
            <div class="flex items-center space-x-2 mb-3">
              <span 
                class="px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
              >
                {{ news[0].category }}
              </span>
              <span class="text-white/80 text-sm">DESTACADO</span>
            </div>
            <h4 class="text-2xl font-bold mb-3">{{ news[0].title }}</h4>
            <p class="text-white/90 mb-4 leading-relaxed">{{ news[0].content }}</p>
            <div class="flex items-center space-x-4 text-sm text-white/80">
              <div class="flex items-center space-x-1">
                <UserIcon class="h-4 w-4" />
                <span>{{ news[0].author }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <CalendarIcon class="h-4 w-4" />
                <span>{{ formatDate(news[0].publishedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Other News -->
    <div class="space-y-6">
      <div
        v-for="article in news.slice(1)"
        :key="article.id"
        class="bg-silver-800 rounded-xl p-6 hover:bg-silver-700 transition-all duration-200 border border-silver-600 group"
      >
        <div class="flex flex-col sm:flex-row sm:space-x-4">
          <div class="sm:w-1/4 mb-4 sm:mb-0">
            <img 
              :src="article.imageUrl" 
              :alt="article.title"
              class="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
            />
          </div>
          <div class="sm:w-3/4">
            <div class="flex items-center space-x-2 mb-3">
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="getCategoryColor(article.category)"
              >
                {{ article.category }}
              </span>
            </div>
            <h5 class="text-xl font-semibold text-white mb-3 group-hover:text-gold-400 transition-colors duration-200">
              {{ article.title }}
            </h5>
            <p class="text-silver-300 mb-4 leading-relaxed">{{ article.content }}</p>
            <div class="flex items-center space-x-4 text-sm text-silver-400">
              <div class="flex items-center space-x-1">
                <UserIcon class="h-4 w-4" />
                <span>{{ article.author }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <CalendarIcon class="h-4 w-4" />
                <span>{{ formatDate(article.publishedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Load More Button -->
    <div class="mt-8 text-center">
      <button class="px-6 py-3 bg-gold-gradient text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200">
        Ver Más Noticias
      </button>
    </div>
  </div>
</template>