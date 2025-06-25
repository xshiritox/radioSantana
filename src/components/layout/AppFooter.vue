<script setup lang="ts">
// Import Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css';

const socialLinks = [
  { 
    name: 'WhatsApp', 
    url: 'https://wa.me/573106035384?text=Hola%20vengo%20desde%20Radio%20Santana', 
    icon: 'fab fa-whatsapp',
    bgColor: 'hover:bg-green-500',
    textColor: 'text-green-400',
    text: 'WhatsApp'
  },
  { 
    name: 'Instagram', 
    url: '#', 
    icon: 'fab fa-instagram',
    bgColor: 'hover:bg-pink-600',
    textColor: 'text-pink-400',
    text: 'Instagram'
  },
  { 
    name: 'Facebook', 
    url: '#', 
    icon: 'fab fa-facebook-f',
    bgColor: 'hover:bg-blue-600',
    textColor: 'text-blue-400',
    text: 'Facebook'
  }
];

const contactInfo = {
  phone: '+57 310 603584',
  email: 'radiosantana.nm@gmail.com',
  address: 'Colombia'
};
</script>

<template>
  <footer class="bg-gradient-to-b from-silver-900 to-black text-white">
    <div class="container mx-auto px-4 py-12">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <!-- Radio Info -->
        <div class="space-y-4 lg:col-span-2 md:col-span-2">
          <div class="flex items-center space-x-3">
            <div class="relative group">
              <!-- Glow effect container -->
              <div class="absolute -inset-0.5 bg-gradient-to-r from-gold-400 to-gold-200 rounded-full opacity-50 blur-[4px] group-hover:opacity-70 transition-opacity duration-300"></div>
              
              <!-- Main logo container -->
              <div class="relative w-10 h-10 rounded-full overflow-hidden border border-gold-300 shadow">
                <img 
                  src="/src/assets/logo.webp" 
                  alt="Logo RadioVirtual Santana" 
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>
            <h3 class="text-xl font-bold text-white">
              RadioVirtual Santana
            </h3>
          </div>
          <p class="text-silver-300 text-sm leading-relaxed">
            La forma + fresca de escuchar radio. 
            Música variada, noticias y entretenimiento para toda la familia.
          </p>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-sm text-green-400 font-medium">On Air</span>
          </div>
        </div>

        <!-- Quick Links & Contact Container -->
        <div class="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <!-- Quick Links -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-gold-400">Enlaces Rápidos</h4>
            <ul class="space-y-2">
              <li>
                <a href="#home" class="text-silver-300 hover:text-gold-400 transition-colors text-sm">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#shows" class="text-silver-300 hover:text-gold-400 transition-colors text-sm">
                  Programación
                </a>
              </li>
              <li>
                <a href="#chat" class="text-silver-300 hover:text-gold-400 transition-colors text-sm">
                  Chat en Vivo
                </a>
              </li>
              <li>
                <a href="#requests" class="text-silver-300 hover:text-gold-400 transition-colors text-sm">
                  Peticiones Musicales
                </a>
              </li>
              <li>
                <a href="#news" class="text-silver-300 hover:text-gold-400 transition-colors text-sm">
                  Noticias
                </a>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-gold-400">Contacto</h4>
            <ul class="space-y-3">
              <li class="flex items-start space-x-3">
                <i class="fas fa-phone mt-1 text-gold-400"></i>
                <a :href="`tel:${contactInfo.phone}`" class="text-silver-300 hover:text-gold-400 transition-colors text-sm">
                  {{ contactInfo.phone }}
                </a>
              </li>
              <li class="flex items-start space-x-3">
                <i class="fas fa-envelope mt-1 text-gold-400"></i>
                <a :href="`mailto:${contactInfo.email}`" class="text-silver-300 hover:text-gold-400 transition-colors text-sm break-all">
                  {{ contactInfo.email }}
                </a>
              </li>
              <li class="flex items-start space-x-3">
                <i class="fas fa-map-marker-alt mt-1 text-gold-400"></i>
                <span class="text-silver-300 text-sm">
                  {{ contactInfo.address }}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Social Media Section -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-gold-400">Síguenos</h4>
          <div class="space-y-3">
            <a 
              v-for="social in socialLinks" 
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-2 px-3 py-2 rounded-md bg-silver-800/20 hover:bg-opacity-100 transition-all duration-200 group text-sm"
              :class="[social.bgColor, social.textColor]"
            >
              <div class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                <i :class="social.icon" class="text-xs"></i>
              </div>
              <div class="font-medium">
                {{ social.text }}
              </div>
            </a>
          </div>
        </div>

      </div>
      <!-- Bottom Bar -->
      <div class="border-t border-silver-800 mt-8 pt-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p class="text-sm text-silver-400">
            {{ new Date().getFullYear() }} RadioVirtual Santana. Todos los derechos reservados.
          </p>
          <div class="flex items-center space-x-6 text-xs text-silver-400">
            <a href="#" class="hover:text-gold-400 transition-colors">Política de Privacidad</a>
            <a href="#" class="hover:text-gold-400 transition-colors">Términos de Uso</a>
            <a href="#" class="hover:text-gold-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>