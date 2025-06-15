<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAdminShows } from '../../composables/useAdminShows';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  CheckIcon, 
  XMarkIcon 
} from '@heroicons/vue/24/outline';
import BaseButton from '../common/BaseButton.vue';
import type { Show } from '../../types/radio';

const { shows, isLoading, error, addShow, updateShow, deleteShow } = useAdminShows();

const showForm = ref(false);
const editingShow = ref<Show | null>(null);

const formData = reactive({
  name: '',
  host: '',
  description: '',
  startTime: '',
  endTime: '',
  days: [] as string[],
  imageUrl: ''
});

const daysOptions = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
];

const resetForm = () => {
  formData.name = '';
  formData.host = '';
  formData.description = '';
  formData.startTime = '';
  formData.endTime = '';
  formData.days = [];
  formData.imageUrl = '';
  editingShow.value = null;
  showForm.value = false;
};

const openAddForm = () => {
  resetForm();
  showForm.value = true;
};

const openEditForm = (show: Show) => {
  editingShow.value = show;
  formData.name = show.name;
  formData.host = show.host;
  formData.description = show.description;
  formData.startTime = show.startTime;
  formData.endTime = show.endTime;
  formData.days = [...show.days];
  formData.imageUrl = show.imageUrl || '';
  showForm.value = true;
};

const handleSubmit = async () => {
  if (!formData.name || !formData.host || !formData.startTime || !formData.endTime || formData.days.length === 0) {
    return;
  }

  const showData = {
    name: formData.name,
    host: formData.host,
    description: formData.description,
    startTime: formData.startTime,
    endTime: formData.endTime,
    days: formData.days,
    isLive: false,
    imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=300&h=300&fit=crop&crop=faces'
  };

  let success = false;
  if (editingShow.value) {
    success = await updateShow(editingShow.value.id, showData);
  } else {
    success = await addShow(showData);
  }

  if (success) {
    resetForm();
  }
};

const handleDelete = async (showId: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar este programa?')) {
    await deleteShow(showId);
  }
};

const toggleDay = (day: string) => {
  const index = formData.days.indexOf(day);
  if (index > -1) {
    formData.days.splice(index, 1);
  } else {
    formData.days.push(day);
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-2xl font-bold text-white">Gestión de Programación</h3>
      <BaseButton @click="openAddForm" variant="primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Agregar Programa
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
          {{ editingShow ? 'Editar Programa' : 'Nuevo Programa' }}
        </h4>
        <button @click="resetForm" class="text-silver-400 hover:text-white">
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-silver-300 mb-2">
              Nombre del Programa *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-2 bg-silver-700 border border-silver-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-silver-300 mb-2">
              Presentador *
            </label>
            <input
              v-model="formData.host"
              type="text"
              required
              class="w-full px-4 py-2 bg-silver-700 border border-silver-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-silver-300 mb-2">
            Descripción
          </label>
          <textarea
            v-model="formData.description"
            rows="3"
            class="w-full px-4 py-2 bg-silver-700 border border-silver-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-silver-300 mb-2">
              Hora de Inicio *
            </label>
            <input
              v-model="formData.startTime"
              type="time"
              required
              class="w-full px-4 py-2 bg-silver-700 border border-silver-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-silver-300 mb-2">
              Hora de Fin *
            </label>
            <input
              v-model="formData.endTime"
              type="time"
              required
              class="w-full px-4 py-2 bg-silver-700 border border-silver-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-silver-300 mb-2">
            Días de la Semana *
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="day in daysOptions"
              :key="day"
              type="button"
              @click="toggleDay(day)"
              class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
              :class="[
                formData.days.includes(day)
                  ? 'bg-gold-500 text-white'
                  : 'bg-silver-700 text-silver-300 hover:bg-silver-600'
              ]"
            >
              {{ day }}
            </button>
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
            :disabled="!formData.name || !formData.host || !formData.startTime || !formData.endTime || formData.days.length === 0"
          >
            <CheckIcon class="h-5 w-5 mr-2" />
            {{ editingShow ? 'Actualizar' : 'Crear' }}
          </BaseButton>
          <BaseButton @click="resetForm" variant="outline">
            Cancelar
          </BaseButton>
        </div>
      </form>
    </div>

    <!-- Shows List -->
    <div class="space-y-4">
      <div
        v-for="show in shows"
        :key="show.id"
        class="bg-silver-800 rounded-xl p-4 border border-silver-600"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <img 
                :src="show.imageUrl" 
                :alt="show.name"
                class="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h5 class="text-lg font-semibold text-white">{{ show.name }}</h5>
                <p class="text-silver-300">Con {{ show.host }}</p>
              </div>
            </div>
            <p class="text-silver-400 text-sm mb-2">{{ show.description }}</p>
            <div class="flex items-center space-x-4 text-sm text-silver-400">
              <span>{{ show.startTime }} - {{ show.endTime }}</span>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="day in show.days"
                  :key="day"
                  class="px-2 py-1 bg-gold-500 text-white rounded-full text-xs"
                >
                  {{ day.slice(0, 3) }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex space-x-2 ml-4">
            <button
              @click="openEditForm(show)"
              class="p-2 text-silver-400 hover:text-gold-400 transition-colors"
            >
              <PencilIcon class="h-5 w-5" />
            </button>
            <button
              @click="handleDelete(show.id)"
              class="p-2 text-silver-400 hover:text-red-400 transition-colors"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="shows.length === 0" class="text-center py-8">
        <p class="text-silver-400">No hay programas configurados</p>
      </div>
    </div>
  </div>
</template>