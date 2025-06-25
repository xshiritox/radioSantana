<script setup lang="ts">
import { ref } from 'vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const menuItems = [
  { name: 'Inicio', href: '#home' },
  { name: 'Programación', href: '#shows' },
  { name: 'Chat', href: '#chat' },
  { name: 'Peticiones', href: '#requests' },
  { name: 'Noticias', href: '#news' },
  { name: 'Contacto', href: '#contact' }
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
            <div class="relative group">
              <!-- Glow effect container -->
              <div class="absolute -inset-1 bg-gradient-to-r from-gold-400 to-gold-200 rounded-full opacity-70 blur-[6px] group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <!-- Main logo container -->
              <div class="relative w-12 h-12 rounded-full bg-gradient-to-r from-gold-400 via-gold-300 to-gold-200 flex items-center justify-center shadow-lg">
                <img 
                  src="/src/assets/logo.webp" 
                  alt="Logo RadioVirtual Santana" 
                  class="w-10 h-10 object-cover rounded-full transition-all duration-500 group-hover:scale-110"
                />
                
                <!-- Inner glow on hover -->
                <div class="absolute inset-0 rounded-full border border-white/20 group-hover:border-gold-100/50 transition-all duration-500"></div>
              </div>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gold-400 via-gold-300 to-gold-200 bg-clip-text text-transparent">
              RadioVirtual Santana
            </h1>
              <p class="text-sm font-medium tracking-wider">
                <span class="text-silver-300/80">Project:</span> 
                <span class="relative inline-block group">
                  <span class="relative z-10 font-bold bg-gradient-to-r from-white to-silver-200 bg-clip-text text-transparent">
                    N<span class="text-gold-300">&</span>M
                  </span>
                  <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-200 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </p>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-1">
          <a
            v-for="(item, index) in menuItems"
            :key="item.name"
            :href="item.href"
            class="relative px-6 py-3 text-silver-200 hover:text-white font-medium text-sm uppercase tracking-wider group overflow-hidden"
            :style="`transition-delay: ${index * 50}ms`"
          >
            <span class="relative z-10 flex items-center">
              <span class="relative">
                {{ item.name }}
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-200 transition-all duration-500 group-hover:w-full"></span>
              </span>
            </span>
            
            <!-- Efecto de fondo con gradiente que se desliza -->
            <span class="absolute inset-0 bg-gradient-to-r from-gold-500/0 via-gold-500/10 to-gold-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-0"></span>
            
            <!-- Efecto de destello al pasar el ratón -->
            <span class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);"></span>
            
            <!-- Efecto de borde inferior con gradiente -->
            <span class="absolute bottom-0 left-1/2 w-0 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent transition-all duration-500 group-hover:w-4/5 group-hover:left-[10%]"></span>
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
      class="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-silver-900/98 to-silver-900/90 backdrop-blur-xl shadow-2xl z-50 border-t border-silver-700/30"
    >
      <nav class="container mx-auto px-4 py-4">
        <div class="space-y-3">
          <a
            v-for="(item, index) in menuItems"
            :key="item.name"
            :href="item.href"
            @click="toggleMobileMenu"
            class="group relative block px-6 py-4 text-base font-medium text-silver-200 hover:text-white rounded-xl overflow-hidden transition-all duration-300"
            :style="`transition-delay: ${index * 50}ms`"
          >
            <span class="relative z-10 flex items-center">
              <span class="relative">
                {{ item.name }}
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-200 transition-all duration-500 group-hover:w-full"></span>
              </span>
            </span>
            
            <!-- Efecto de fondo con gradiente -->
            <span class="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-gold-500/10 to-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            
            <!-- Efecto de borde con gradiente -->
            <span class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent group-hover:via-gold-400 transition-all duration-500"></span>
            
            <!-- Indicador de selección -->
            <span class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold-400 rounded-r-full transform -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"></span>
          </a>
        </div>
      </nav>
    </div>
  </header>
</template>