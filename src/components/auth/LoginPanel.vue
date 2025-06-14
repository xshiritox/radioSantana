<script setup lang="ts">
import { ref } from 'vue'

const isLoginVisible = ref(false)

const toggleLogin = () => {
  isLoginVisible.value = !isLoginVisible.value
}
</script>

<template>
  <div class="flex flex-col items-center space-y-4">
    <!-- Botón para mostrar/ocultar login -->
    <button
      @click="toggleLogin"
      class="w-full px-4 py-2 rounded-lg bg-gold-gradient text-black hover:opacity-90 transition-opacity"
    >
      {{ isLoginVisible ? 'Ocultar Login' : 'Admin Login' }}
    </button>

    <!-- Panel de login -->
    <div
      v-if="isLoginVisible"
      class="bg-black/70 rounded-2xl p-6 w-full max-w-md"
    >
      <h2 class="text-2xl font-bold text-white mb-4 text-center">
        <span class="text-white">Panel de Administración</span>
      </h2>
      
      <!-- Formulario de login -->
      <form class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-silver-300 mb-2">Usuario</label>
          <input
            type="text"
            id="username"
            class="w-full px-4 py-2 rounded-lg bg-silver-800 border border-silver-700 focus:ring-2 focus:ring-gold-gradient/50 focus:border-transparent text-white"
            placeholder="Usuario"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-silver-300 mb-2">Contraseña</label>
          <input
            type="password"
            id="password"
            class="w-full px-4 py-2 rounded-lg bg-silver-800 border border-silver-700 focus:ring-2 focus:ring-gold-gradient/50 focus:border-transparent text-white"
            placeholder="Contraseña"
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 px-4 rounded-lg bg-gold-gradient text-black hover:opacity-90 transition-opacity"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  </div>
</template>

<style>
.bg-gold-gradient {
  background: linear-gradient(45deg, #FFD700, #FFA500);
}
</style>
