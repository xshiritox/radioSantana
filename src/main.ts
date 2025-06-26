import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import { trackPageView, trackError, isGAAvailable } from './utils/analytics'

// Configuración de rutas
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Tus rutas aquí
  ],
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// Inicialización de la aplicación
const app = createApp(App)
const head = createHead()

// Usar plugins
app.use(head)
app.use(router)

// Seguimiento de navegación
router.afterEach((to) => {
  // Usar setTimeout para asegurar que el título de la página se haya actualizado
  setTimeout(() => {
    trackPageView(to.path, document.title)
  }, 100)
  
  // Devolver la ruta para cumplir con el tipo de retorno esperado
  return true;
})

// Manejador global de errores
/**
 * @param {unknown} err - El error que ocurrió
 * @param {any} _instance - La instancia del componente donde ocurrió el error
 * @param {string} _info - Información adicional sobre el error
 */
function handleError(err, _instance, _info) {
  console.error('Global error:', err, _info)
  
  // Registrar el error en Google Analytics
  const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
  const errorStack = err instanceof Error ? err.stack : ''
  
  trackError(
    errorMessage,
    false, // No fatal
    {
      component: _instance?.$options?.name || 'Unknown',
      info: _info,
      stack: errorStack
    }
  )
  
  // Aquí podrías redirigir a una página de error o mostrar una notificación
  // router.push('/error')
}

app.config.errorHandler = handleError

// Manejar errores no capturados
window.addEventListener('error', (event) => {
  trackError(
    event.message,
    true, // Fatal
    {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    }
  )
})

// Manejar promesas rechazadas no manejadas
window.addEventListener('unhandledrejection', (event) => {
  const message = event.reason?.message || 'Unhandled promise rejection'
  trackError(
    message,
    false,
    {
      reason: event.reason,
      type: 'unhandledrejection'
    }
  )
})

// Verificar si Google Analytics está disponible
if (isGAAvailable()) {
  console.log('Google Analytics está configurado correctamente')
} else {
  console.warn('Google Analytics no está disponible')
}

// Montar la aplicación
app.mount('#app')

// Registrar evento de carga de la aplicación
if (isGAAvailable()) {
  window.gtag('event', 'app_loaded', {
    event_category: 'engagement',
    event_label: 'Aplicación cargada',
    value: 1
  })
}