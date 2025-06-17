<script setup lang="ts">
// import { useRadioPlayer } from '../../composables/useRadioPlayer';

// const { isPlaying, isLoading, togglePlay, currentTrack } = useRadioPlayer();
</script>

<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 bg-radio-gradient"></div>
    <div class="absolute inset-0 bg-black/40"></div>
    
    <!-- Animated Background Elements -->
    <div class="absolute inset-0">
      <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-silver-500/10 rounded-full blur-3xl animate-float" style="animation-delay: -2s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-gold-600/5 rounded-full blur-3xl animate-pulse-slow"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 container mx-auto px-4 text-center">
      <div class="max-w-4xl mx-auto">
        <!-- Logo/Icon -->
        <div class="mb-8">
          <div class="w-32 h-32 bg-gold-gradient rounded-full mx-auto flex items-center justify-center shadow-2xl animate-bounce-slow">
            <img src="/src/assets/logo.jpg" alt="Logo RadioVirtual Santana" class="w-28 h-28 object-cover rounded-full" />
          </div>
        </div>

        <!-- Main Title -->
        <h1 class="text-6xl md:text-8xl font-bold mb-6">
          <span class="bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 bg-clip-text text-transparent animate-pulse-slow">
            RadioVirtual
          </span>
          <br>
          <span class="bg-gradient-to-r from-silver-300 via-white to-silver-300 bg-clip-text text-transparent">
            Santana
          </span>
        </h1>

        <!-- Subtitle -->
        <p class="text-2xl md:text-3xl font-medium mb-8 leading-relaxed relative group">
          <span class="relative inline-block">
            <span class="relative z-10 bg-gradient-to-r from-white via-silver-200 to-silver-300 bg-clip-text text-transparent">
              La forma <span class="text-silver-300 font-bold text-3xl md:text-4xl relative">+</span> fresca de escuchar radio
            </span>
            <span class="absolute inset-0 bg-gradient-to-r from-silver-400 to-silver-600 rounded-full blur opacity-70 group-hover:opacity-100 transition-all duration-500"></span>
          </span>
          <br>
          <span class="relative inline-block mt-2">
            <span class="relative z-10 text-silver-300 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-silver-300 to-silver-100 animate-pulse">
              Transmitiendo
            </span>
            <span class="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-silver-400/70 to-transparent rounded-full"></span>
          </span>
        </p>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div class="text-center">
            <div class="text-3xl font-bold text-gold-400 mb-2">24/7</div>
            <div class="text-silver-300">Siempre en línea</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-gold-400 mb-2">HD</div>
            <div class="text-silver-300">Alta calidad</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-gold-400 mb-2">∞</div>
            <div class="text-silver-300">Música ilimitada</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <div class="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
        <div class="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.w-128 {
  width: 32rem;
}
.h-128 {
  height: 32rem;
}
</style>  