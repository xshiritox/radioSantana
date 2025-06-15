<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAdminNews } from '../../composables/useAdminNews';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  CheckIcon, 
  XMarkIcon 
} from '@heroicons/vue/24/outline';
import BaseButton from '../common/BaseButton.vue';
import type { NewsItem } from '../../types/radio';

const { news, isLoading, error, addNews, updateNews, deleteNews } = useAdminNews();

const showForm = ref(false);
const editingNews = ref<NewsItem | null>(null);

const formData = reactive({
  title: '',
  content: '',
  author: '',
  category: '',
  imageUrl: ''
});

const categoryOptions = [
  'Radio', 'Eventos', 'Tecnología', 'Música', 'Entretenimiento', 'General'
];

const resetForm = () => {
  formData.title = '';
  formData.content = '';
  formData.author = '';
  formData.category = '';
  formData.imageUrl = '';
  editingNews.value = null;
  showForm.value = false;
};

const openAddForm = () => {
  resetForm();
  formData.author = 'Equipo RadioVirtual Santana';
  showForm.value = true;
};

const openEditForm = (newsItem: NewsItem) => {
  editingNews.value = newsItem;
  formData.title = newsItem.title;
  formData.content = newsItem.content;
  formData.author = newsItem.author;
  formData.category = newsItem.category;
  formData.imageUrl = newsItem.imageUrl || '';
  showForm.value = true;
};

const handleSubmit = async () => {
  if (!formData.title || !formData.content || !formData.author || !formData.category) {
    return;
  }

  const newsData = {
    title: formData.title,
    content: formData.content,
    author: formData.author,
    category: formData.category,
    imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=300&h=300&fit=crop&crop=faces'
  };

  let success = false;
  if (editingNews.value) {
    success = await updateNews(editingNews.value.id, newsData);
  } else {
    success = await addNews(newsData);
  }

  if (success) {
    resetForm();
  }
};

const handleDelete = async (newsId: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
    await deleteNews(newsId);
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-2xl font-bold text-white">Gestión de Noticias</h3>
      <BaseButton @click="openAddForm" variant="primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Agregar Noticia
      </BaseButton>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-600 text-white p-4 rounded-lg">
      {{ error }}
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="bg-silver-800 rounded-xl p-6 border border-silver-600">
      <div class="flex items-center justify-between mb-6">
        <h4 class="text-xl font-semibold text-white">
          {{ editingNews ? 'Editar Noticia' : 'Nueva Noticia' }}
        </h4>
        <button @click="resetForm" class="text-silver-400 hover:text-white">
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-silver-300 mb-2">
            Título *
          </label>
          <input
            v-model="formData.title"
            type="text"
            required
            class="w-full px-4 py-2 bg-silver-700 border border-silver-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-silver-300 mb-2">
            Contenido *
          </label>
          <textarea
            v-model="formData.content"
            rows="6"
            required
            class="w-full px-4 py-2 bg-silver-700 border border-silver-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-silver-300 mb-2">
              Autor *
            </label>
            <input
              v-model="formData.author"
              type="text"
              required
              class="w-full px-4 py-2 bg-silver-700 border border-silver-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-silver-300 mb-2">
              Categoría *
            </label>
            <select
              v-model="formData.category"
              required
              class="w-full px-4 py-2 bg-silver-700 border border-silver-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">Seleccionar categoría</option>
              <option v-for="category in categoryOptions" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-silver-300 mb-2">
            URL de Imagen
          </label>
          <input
            v-model="formData.imageUrl"
            type="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            class="w-full px-4 py-2 bg-silver-700 border border-silver-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div class="flex space-x-3">
          <BaseButton 
            type="submit" 
            variant="primary" 
            :loading="isLoading"
            :disabled="!formData.title || !formData.content || !formData.author || !formData.category"
          >
            <CheckIcon class="h-5 w-5 mr-2" />
            {{ editingNews ? 'Actualizar' : 'Publicar' }}
          </BaseButton>
          <BaseButton @click="resetForm" variant="outline">
            Cancelar
          </BaseButton>
        </div>
      </form>
    </div>

    <!-- News List -->
    <div class="space-y-4">
      <div
        v-for="article in news"
        :key="article.id"
        class="bg-silver-800 rounded-xl p-4 border border-silver-600"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-start space-x-4 mb-3">
              <img 
                :src="article.imageUrl" 
                :alt="article.title"
                class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-1">
                  <h5 class="text-lg font-semibold text-white truncate">{{ article.title }}</h5>
                  <span class="px-2 py-1 bg-gold-500 text-white rounded-full text-xs whitespace-nowrap">
                    {{ article.category }}
                  </span>
                </div>
                <p class="text-silver-300 text-sm line-clamp-2">{{ article.content }}</p>
                <div class="flex items-center space-x-4 text-xs text-silver-400 mt-2">
                  <span>Por {{ article.author }}</span>
                  <span>{{ formatDate(article.publishedAt) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex space-x-2 ml-4">
            <button
              @click="openEditForm(article)"
              class="p-2 text-silver-400 hover:text-gold-400 transition-colors"
            >
              <PencilIcon class="h-5 w-5" />
            </button>
            <button
              @click="handleDelete(article.id)"
              class="p-2 text-silver-400 hover:text-red-400 transition-colors"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="news.length === 0" class="text-center py-8">
        <p class="text-silver-400">No hay noticias publicadas</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>