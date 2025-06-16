<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuth } from '../../composables/useAuth';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/vue/24/outline';
import BaseButton from '../common/BaseButton.vue';

const { isAdmin, isLoading, error, login } = useAuth();

const isLoginVisible = ref(false);
const showPassword = ref(false);

const formData = reactive({
  email: '',
  password: ''
});

const toggleLogin = () => {
  isLoginVisible.value = !isLoginVisible.value;
  if (!isLoginVisible.value) {
    // Reset form when closing
    formData.email = '';
    formData.password = '';
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  if (!formData.email.trim() || !formData.password.trim()) {
    return;
  }

  const success = await login(formData.email, formData.password);
  if (success) {
    toggleLogin();
    formData.email = '';
    formData.password = '';
  }
};
</script>

<template>
  <div class="flex flex-col items-center space-y-4">
    <!-- Botón para mostrar/ocultar login -->
    <button
      v-if="!isAdmin"
      @click="toggleLogin"
      class="w-full px-4 py-2 rounded-lg bg-gold-gradient text-black hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
    >
      <UserIcon class="h-5 w-5" />
      <span>{{ isLoginVisible ? 'Ocultar Login' : 'Admin Login' }}</span>
    </button>

    <!-- Admin Status -->
    <div v-if="isAdmin" class="w-full p-4 bg-green-600 rounded-lg text-white text-center">
      <div class="flex items-center justify-center space-x-2">
        <UserIcon class="h-5 w-5" />
        <span class="font-medium">Sesión de Administrador Activa</span>
      </div>
      <p class="text-sm text-green-100 mt-1">Panel de administración disponible</p>
    </div>

    <!-- Panel de login -->
    <div
      v-if="isLoginVisible && !isAdmin"
      class="bg-black/70 rounded-2xl p-6 w-full max-w-md backdrop-blur-sm border border-silver-700"
    >
      <h2 class="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center space-x-2">
        <LockClosedIcon class="h-6 w-6" />
        <span>Panel de Administración</span>
      </h2>
      
      <!-- Error Message -->
      <div v-if="error" class="bg-red-600 text-white p-3 rounded-lg mb-4 text-sm">
        {{ error }}
      </div>
      
      <!-- Formulario de login -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-silver-300 mb-2">
            Email de Administrador
          </label>
          <div class="relative">
            <input
              v-model="formData.email"
              type="email"
              id="email"
              required
              class="w-full px-4 py-3 pl-10 rounded-lg bg-silver-800 border border-silver-700 focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-silver-400"
              placeholder="Usuario / Correo Electronico"
              :disabled="isLoading"
            />
            <UserIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-silver-400" />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-silver-300 mb-2">
            Contraseña
          </label>
          <div class="relative">
            <input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              required
              class="w-full px-4 py-3 pl-10 pr-10 rounded-lg bg-silver-800 border border-silver-700 focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-silver-400"
              placeholder="••••••••"
              :disabled="isLoading"
            />
            <LockClosedIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-silver-400" />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-silver-400 hover:text-silver-300"
              :disabled="isLoading"
            >
              <EyeIcon v-if="!showPassword" class="h-5 w-5" />
              <EyeSlashIcon v-else class="h-5 w-5" />
            </button>
          </div>
        </div>

        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="isLoading"
          :disabled="!formData.email.trim() || !formData.password.trim()"
          class="w-full"
        >
          <LockClosedIcon class="h-5 w-5 mr-2" />
          Iniciar Sesión
        </BaseButton>
      </form>

      <div class="mt-4 p-3 bg-silver-800 rounded-lg">
        <p class="text-xs text-silver-400 text-center">
          Solo administradores autorizados pueden acceder a este panel
        </p>
      </div>
    </div>
  </div>
</template>