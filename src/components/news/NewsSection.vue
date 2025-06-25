<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { NewspaperIcon, CalendarIcon, UserIcon } from '@heroicons/vue/24/outline';
import type { NewsItem } from '../../types/radio';

// Importar imagen por defecto
import defaultNewsImage from '../../assets/logo.webp';

const news = ref<NewsItem[]>([]);
const isLoading = ref(false);

let unsubscribe: (() => void) | null = null;

// Estado para manejar el error
const error = ref<string | null>(null);

// Función para procesar los documentos de Firestore
const processNewsDocuments = (docs: any[]): NewsItem[] => {
  return docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || 'Sin título',
      content: data.content || '',
      author: data.author || 'Anónimo',
      publishedAt: data.publishedAt?.toDate?.() || new Date(),
      category: data.category || 'General',
      imageUrl: data.imageUrl || defaultNewsImage
    };
  });
};

// Suscripción en tiempo real a las noticias
const subscribeToNews = () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    const newsCollection = collection(db, 'news');
    const q = query(
      newsCollection, 
      orderBy('publishedAt', 'desc'), 
      limit(10)
    );
    
    // Suscripción en tiempo real
    unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        try {
          const newsList = processNewsDocuments(querySnapshot.docs);
          news.value = newsList;
          error.value = null;
        } catch (err) {
          console.error('Error procesando noticias:', err);
          error.value = 'Error al procesar las noticias';
          news.value = [];
        } finally {
          isLoading.value = false;
        }
      },
      (firebaseError) => {
        console.error('Error en la suscripción:', firebaseError);
        error.value = 'No se pudieron cargar las noticias. Intenta recargar la página.';
        news.value = [];
        isLoading.value = false;
      }
    );
    
    // Limpiar el error después de 5 segundos
    if (error.value) {
      setTimeout(() => {
        error.value = null;
      }, 5000);
    }
    
  } catch (err) {
    console.error('Error en la suscripción a noticias:', err);
    error.value = 'Error al suscribirse a las noticias';
    news.value = [];
    isLoading.value = false;
  }
};

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

onMounted(() => {
  subscribeToNews();
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
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
        <p class="text-silver-300">Lo último de RadioVirtual Santana</p>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div v-if="error" class="bg-red-500/20 border-l-4 border-red-500 text-red-100 p-4 mb-6 rounded-r-lg">
      <div class="flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <p class="font-medium">{{ error }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full mx-auto"></div>
      <p class="text-silver-400 text-sm mt-2">Cargando noticias...</p>
    </div>

    <!-- Featured News -->
    <div v-else-if="news.length > 0" class="mb-8">
      <div class="bg-gradient-to-r from-gold-600 to-gold-500 rounded-2xl p-6 text-white shadow-xl">
        <div class="flex flex-col md:flex-row md:items-center md:space-x-6">
          <div class="md:w-1/3 mb-4 md:mb-0">
            <div class="w-full h-full rounded-xl shadow-lg overflow-hidden">
              <img 
                :src="news[0].imageUrl" 
                :alt="news[0].title"
                class="w-full h-full object-cover object-center"
                style="width: 100%; height: 100%; object-fit: cover;"
                loading="lazy"
              />
            </div>
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
            <div class="w-full h-full rounded-lg shadow-md group-hover:shadow-lg overflow-hidden">
              <img 
                :src="article.imageUrl" 
                :alt="article.title"
                class="w-full h-full object-cover object-center"
                style="width: 100%; height: 100%; object-fit: cover;"
                loading="lazy"
              />
            </div>
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

    <!-- Empty State -->
    <div v-if="news.length === 0 && !isLoading" class="text-center py-8">
      <NewspaperIcon class="h-16 w-16 text-silver-400 mx-auto mb-4" />
      <p class="text-silver-400">No hay noticias disponibles</p>
    </div>

    <!-- Load More Button -->
    <div v-if="news.length > 0" class="mt-8 text-center">
      <button class="px-6 py-3 bg-gold-gradient text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200">
        Ver Más Noticias
      </button>
    </div>
  </div>
</template>