<script setup lang="ts">
const socialLinks = [
  { name: 'Facebook', url: '#', icon: '📘' },
  { name: 'Instagram', url: '#', icon: '📷' },
  { name: 'Twitter', url: '#', icon: '🐦' },
  { name: 'YouTube', url: '#', icon: '📺' },
  { name: 'WhatsApp', url: 'https://wa.me/573106035384?text=Hola%20vengo%20desde%20Radio%20Santana', icon: '💬' }
];

const contactInfo = {
  phone: '+57 310 603584 / +53 53547990',
  email: 'radiosantana.nm@gmail.com',
  address: 'Colombia'
};
</script>

<template>
  <footer class="bg-gradient-to-b from-silver-900 to-black text-white">
    <div class="container mx-auto px-4 py-12">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Radio Info -->
        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gold-gradient rounded-full flex items-center justify-center">
              <span class="text-xl font-bold">📻</span>
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
          <div class="space-y-3 text-sm">
            <div class="flex items-center space-x-2">
              <span>📞</span>
              <a :href="`tel:${contactInfo.phone}`" class="text-silver-300 hover:text-gold-400 transition-colors">
                {{ contactInfo.phone }}
              </a>
            </div>
            <div class="flex items-center space-x-2">
              <span>✉️</span>
              <a :href="`mailto:${contactInfo.email}`" class="text-silver-300 hover:text-gold-400 transition-colors">
                {{ contactInfo.email }}
              </a>
            </div>
            <div class="flex items-start space-x-2">
              <span>📍</span>
              <span class="text-silver-300">{{ contactInfo.address }}</span>
            </div>
          </div>
        </div>

        <!-- Social Media -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-gold-400">Síguenos</h4>
          <div class="flex flex-wrap gap-3">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              class="w-10 h-10 bg-silver-800 hover:bg-gold-gradient rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
              :title="social.name"
            >
              <span class="text-lg">{{ social.icon }}</span>
            </a>
          </div>
          <p class="text-xs text-silver-400">
            Mantente conectado con nosotros en todas nuestras redes sociales
          </p>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-silver-800 mt-8 pt-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p class="text-sm text-silver-400">
            © {{ new Date().getFullYear() }} RadioVirtual Santana. Todos los derechos reservados.
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