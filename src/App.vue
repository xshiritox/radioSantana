<script setup lang="ts">
import { onMounted } from 'vue';
import { useHead } from '@vueuse/head';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
import HeroSection from './components/hero/HeroSection.vue';
import ContactForm from './components/contact/ContactForm.vue';
import RadioPlayer from './components/player/RadioPlayer.vue';
import ShowSchedule from './components/shows/ShowSchedule.vue';
import LiveChat from './components/chat/LiveChat.vue';
import LoginPanel from './components/auth/LoginPanel.vue';
import MusicRequests from './components/requests/MusicRequests.vue';
import NewsSection from './components/news/NewsSection.vue';
import AdminPanel from './components/admin/AdminPanel.vue';

// Configuración de metadatos SEO
useHead({
  title: 'Radio Santana',
  meta: [
    { name: 'description', content: 'Disfruta de la mejor programación musical en Radio Santana. Música en vivo, noticias y más.' },
    { name: 'keywords', content: 'radio, música, estación, en vivo, entretenimiento, Radio Santana' },
    { property: 'og:title', content: 'Radio Santana' },
    { property: 'og:description', content: 'Disfruta de la mejor programación musical en Radio Santana' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://radiosantana.netlify.app' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'robots', content: 'index, follow' },
    { name: 'author', content: 'Radio Santana' },
  ],
  link: [
    { rel: 'canonical', href: 'https://radiosantana.netlify.app' },
  ]
});

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
              <span class="bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 bg-clip-text text-transparent">Programación</span>
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
              <span class="bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 bg-clip-text text-transparent">Interactúa</span>
            </h2>
            <p class="text-xl text-silver-300">Chatea y pide tu música favorita</p>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Chat Section -->
            <div id="chat" class="space-y-4">
              <LiveChat />
              <LoginPanel />
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
              <span class="bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 bg-clip-text text-transparent">Noticias</span>
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
              <span class="bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 bg-clip-text text-transparent">Contacto</span>
            </h2>
            <p class="text-xl text-silver-300">Ponte en contacto con nosotros</p>
          </div>
          
          <div class="bg-gradient-to-br from-silver-900 to-silver-800 rounded-2xl p-8 shadow-2xl">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Contact Info -->
              <div class="space-y-6">
                <h3 class="text-2xl font-bold mb-6">
                <span class="bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 bg-clip-text text-transparent">Información de Contacto</span>
              </h3>
                
                <div class="space-y-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center">
                      <span class="text-xl">📞</span>
                    </div>
                    <div>
                      <p class="text-silver-300 text-sm">Teléfono</p>
                      <p class="text-white font-semibold">+57 310 603584 / +53 53547990</p>
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
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <AppFooter />

    <!-- Admin Panel -->
    <AdminPanel />
    
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}

* {
  box-sizing: border-box;
}

.bg-gold-gradient {
  background: linear-gradient(45deg, #FFD700, #FFA500);
}
</style>