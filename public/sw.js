// Nombre de la caché
const CACHE_NAME = 'radio-santana-v1';

// Archivos a almacenar en caché
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/assets/logo.webp',
  '/og-image.jpg',
  '/favicon.ico',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Función para enviar eventos a Google Analytics 4
const sendGAEvent = (eventName, eventParams = {}) => {
  // Asegurarse de que gtag esté disponible
  if (typeof self.gtag === 'function') {
    self.gtag('event', eventName, {
      ...eventParams,
      'event_callback': () => {},
      'event_timeout': 500
    });
  }
};

// Estrategia de caché: Cache First, luego red
self.addEventListener('fetch', (event) => {
  // No cachear solicitudes de streaming
  if (event.request.url.includes('/stream')) {
    // Registrar evento de reproducción de audio
    if (event.request.mode === 'navigate') {
      sendGAEvent('audio_play', {
        'event_category': 'audio',
        'event_label': 'Stream Iniciado',
        'value': 1
      });
    }
    return fetch(event.request);
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devuelve la respuesta en caché o realiza la petición
        return response || fetch(event.request)
          .then((fetchResponse) => {
            // Si es una respuesta válida, la guarda en caché
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }
            
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return fetchResponse;
          });
      })
  );
});

// Limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
