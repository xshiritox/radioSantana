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
          <div class="relative mx-auto w-48 h-48 group">
            <!-- Efecto de aura exterior pulsante -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/40 via-yellow-300/40 to-amber-600/40 blur-xl opacity-80 animate-pulse-slow group-hover:opacity-100 group-hover:blur-2xl transition-all duration-1000"></div>
            
            <!-- Anillos concéntricos animados -->
            <div class="absolute inset-0 rounded-full border-2 border-amber-400/30 animate-ping-slow opacity-0 group-hover:opacity-70 transition-all duration-1000"></div>
            <div class="absolute inset-0 rounded-full border border-amber-300/20 animate-ping-slower opacity-0 group-hover:opacity-50 transition-all duration-1500" style="animation-delay: 0.3s"></div>
            
            <!-- Contenedor principal con gradiente metálico */ -->
            <div class="relative w-full h-full rounded-full bg-gradient-to-br from-amber-300 via-yellow-300 to-amber-500 p-1.5 shadow-[0_0_30px_rgba(251,191,36,0.3)] group-hover:shadow-[0_0_60px_rgba(251,191,36,0.6)] transition-all duration-700">
              <div class="relative w-full h-full rounded-full overflow-hidden">
                <img 
                  src="/src/assets/logo.webp" 
                  alt="Logo RadioVirtual Santana" 
                  class="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-3"
                />
                <!-- Efecto de brillo dinámico */ -->
                <div class="absolute inset-0 bg-gradient-to-tr from-white/50 via-transparent to-amber-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <!-- Partículas de luz */ -->
                <div class="absolute top-2 right-2 w-2 h-2 bg-yellow-200 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float" style="animation-delay: 0.2s"></div>
                <div class="absolute bottom-2 left-2 w-1.5 h-1.5 bg-amber-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float" style="animation-duration: 3s; animation-delay: 0.4s"></div>
              </div>
              
              <!-- Resplandor interior con borde brillante */ -->
              <div class="absolute inset-0 rounded-full border-2 border-amber-300/30 group-hover:border-amber-200/60 shadow-[inset_0_0_40px_rgba(251,191,36,0.3)] group-hover:shadow-[inset_0_0_60px_rgba(251,191,36,0.6)] transition-all duration-700"></div>
              
              <!-- Efecto de destellos */ -->
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-200 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping-slow transition-all duration-700"></div>
              <div class="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-amber-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping-slower transition-all duration-1000" style="animation-delay: 0.3s"></div>
            </div>
            
            <!-- Efecto de partículas exteriores */ -->
            <div class="absolute -top-3 -right-3 w-2 h-2 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float transition-all duration-1000" style="animation-delay: 0.2s"></div>
            <div class="absolute -bottom-3 -left-3 w-1.5 h-1.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float transition-all duration-1200" style="animation-duration: 4s; animation-delay: 0.4s"></div>
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float transition-all duration-1500" style="animation-duration: 5s; animation-delay: 0.6s"></div>
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
        <p class="text-xl md:text-3xl font-medium mb-8 leading-relaxed">
          <span class="text-white">
            La forma <span class="text-silver-300 font-bold text-3xl md:text-4xl">+</span> fresca de escuchar radio
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
  </section>
</template>

<style scoped>
/* Animaciones personalizadas */
@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes ping-slower {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) scale(1.1);
    opacity: 0.7;
  }
}

.animate-ping-slow {
  animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-ping-slower {
  animation: ping-slower 4s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.w-128 {
  width: 32rem;
}
.h-128 {
  height: 32rem;
}
</style>  