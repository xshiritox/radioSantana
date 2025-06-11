<script setup lang="ts">
import { ref } from 'vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const menuItems = [
  { name: 'Inicio', href: '#home', icon: '🏠' },
  { name: 'Programación', href: '#shows', icon: '📻' },
  { name: 'Chat', href: '#chat', icon: '💬' },
  { name: 'Peticiones', href: '#requests', icon: '🎵' },
  { name: 'Noticias', href: '#news', icon: '📰' },
  { name: 'Contacto', href: '#contact', icon: '📞' }
];
</script>

<template>
  <header class="relative">
    <!-- Main Header -->
    <div class="bg-gradient-to-r from-silver-900 via-silver-800 to-silver-900 shadow-2xl">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center shadow-lg">
              <img src="/src/assets/logo.jpg" alt="Logo RadioOnline Santana" class="w-10 h-10 object-cover rounded-full" />
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gold-gradient bg-clip-text text-transparent">
                RadioOnline Santana
              </h1>
              <p class="text-sm text-silver-300">Tu música, tu radio</p>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-1">
            <a
              v-for="item in menuItems"
              :key="item.name"
              :href="item.href"
              class="px-4 py-2 rounded-lg text-silver-100 hover:bg-gold-gradient hover:text-white transition-all duration-200 transform hover:scale-105"
            >
              <span class="mr-2">{{ item.icon }}</span>
              {{ item.name }}
            </a>
          </nav>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg text-silver-100 hover:bg-gold-600 transition-colors"
          >
            <Bars3Icon v-if="!isMobileMenuOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden absolute top-full left-0 right-0 bg-silver-900 shadow-2xl z-50 border-t border-silver-700"
    >
      <nav class="container mx-auto px-4 py-4">
        <a
          v-for="item in menuItems"
          :key="item.name"
          :href="item.href"
          @click="toggleMobileMenu"
          class="flex items-center px-4 py-3 rounded-lg text-silver-100 hover:bg-gold-gradient hover:text-white transition-all duration-200 mb-2"
        >
          <span class="mr-3 text-xl">{{ item.icon }}</span>
          {{ item.name }}
        </a>
      </nav>
    </div>
  </header>
</template>