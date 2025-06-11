<script setup lang="ts">
import { onMounted } from 'vue';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
import HeroSection from './components/hero/HeroSection.vue';
import RadioPlayer from './components/player/RadioPlayer.vue';
import ShowSchedule from './components/shows/ShowSchedule.vue';
import LiveChat from './components/chat/LiveChat.vue';
import MusicRequests from './components/requests/MusicRequests.vue';
import NewsSection from './components/news/NewsSection.vue';

// Smooth scroll behavior for navigation links
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
      e.preventDefault();
      const id = target.getAttribute('href')?.substring(1);
      const element = document.getElementById(id!);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-silver-950 via-silver-900 to-black">
    <!-- Header -->
    <AppHeader />

    <!-- Hero Section -->
    <section id="home">
      <HeroSection />
    </section>

    <!-- Main Content -->
    <main class="relative z-10">
      <!-- Radio Player Section -->
      <section class="py-16 px-4">
        <div class="container mx-auto max-w-4xl">
          <RadioPlayer />
        </div>
      </section>

      <!-- Shows Section -->
      <section id="shows" class="py-16 px-4 bg-black/20">
        <div class="container mx-auto max-w-6xl">
          <div class="text-center mb-12">
            <h2 class="text-4xl md:text-5xl font-bold mb-4">
              <span class="bg-gold-gradient bg-clip-text text-transparent">Programación</span>
            </h2>
            <p class="text-xl text-silver-300">Conoce nuestros programas y horarios</p>
          </div>
          <ShowSchedule />
        </div>
      </section>

      <!-- Interactive Section -->
      <section class="py-16 px-4">
        <div class="container mx-auto max-w-7xl">
          <div class="text-center mb-12">
            <h2 class="text-4xl md:text-5xl font-bold mb-4">
              <span class="bg-gold-gradient bg-clip-text text-transparent">Interactúa</span>
            </h2>
            <p class="text-xl text-silver-300">Chatea y pide tu música favorita</p>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Chat Section -->
            <div id="chat">
              <LiveChat />
            </div>
            
            <!-- Music Requests Section -->
            <div id="requests">
              <MusicRequests />
            </div>
          </div>
        </div>
      </section>

      <!-- News Section -->
      <section id="news" class="py-16 px-4 bg-black/20">
        <div class="container mx-auto max-w-6xl">
          <div class="text-center mb-12">
            <h2 class="text-4xl md:text-5xl font-bold mb-4">
              <span class="bg-gold-gradient bg-clip-text text-transparent">Noticias</span>
            </h2>
            <p class="text-xl text-silver-300">Mantente al día con las últimas novedades</p>
          </div>
          <NewsSection />
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="py-16 px-4">
        <div class="container mx-auto max-w-4xl">
          <div class="text-center mb-12">
            <h2 class="text-4xl md:text-5xl font-bold mb-4">
              <span class="bg-gold-gradient bg-clip-text text-transparent">Contacto</span>
            </h2>
            <p class="text-xl text-silver-300">Ponte en contacto con nosotros</p>
          </div>
          
          <div class="bg-gradient-to-br from-silver-900 to-silver-800 rounded-2xl p-8 shadow-2xl">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Contact Info -->
              <div class="space-y-6">
                <h3 class="text-2xl font-bold text-white mb-6">Información de Contacto</h3>
                
                <div class="space-y-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center">
                      <span class="text-xl">📞</span>
                    </div>
                    <div>
                      <p class="text-silver-300 text-sm">Teléfono</p>
                      <p class="text-white font-semibold">+57 310 603584</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center">
                      <span class="text-xl">✉️</span>
                    </div>
                    <div>
                      <p class="text-silver-300 text-sm">Email</p>
                      <p class="text-white font-semibold">radiosantana.nm@gmail.com</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center">
                      <span class="text-xl">📍</span>
                    </div>
                    <div>
                      <p class="text-silver-300 text-sm">Dirección</p>
                      <p class="text-white font-semibold">Colombia<br></p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Contact Form -->
              <div>
                <h3 class="text-2xl font-bold text-white mb-6">Envíanos un Mensaje</h3>
                <form class="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      class="w-full px-4 py-3 bg-silver-800 border border-silver-600 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Tu email"
                      class="w-full px-4 py-3 bg-silver-800 border border-silver-600 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <textarea
                      rows="4"
                      placeholder="Tu mensaje"
                      class="w-full px-4 py-3 bg-silver-800 border border-silver-600 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    class="w-full px-6 py-3 bg-gold-gradient text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    Enviar Mensaje
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}

* {
  box-sizing: border-box;
}
</style>