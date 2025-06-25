/**
 * Utilidad para el seguimiento de eventos con Google Analytics 4
 */

// Tipos para los parámetros de eventos
type EventParams = {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: any;
};

/**
 * Verifica si Google Analytics está disponible
 * @returns {boolean} - True si GA está disponible
 */
export const isGAAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.gtag;
};

/**
 * Envía un evento personalizado a Google Analytics 4
 * @param {string} eventName - Nombre del evento
 * @param {EventParams} [eventParams={}] - Parámetros adicionales del evento
 */
export const trackEvent = (eventName: string, eventParams: EventParams = {}): void => {
  if (isGAAvailable() && window.gtag) {
    window.gtag('event', eventName, {
      ...eventParams,
      'event_callback': () => {},
      'event_timeout': 500
    });
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Analytics no está disponible');
    }
  }
};

/**
 * Registra la reproducción de audio
 * @param {string} trackName - Nombre de la pista o programa
 * @param {string} [action='play'] - Acción (play/pause/stop)
 */
export const trackAudioPlay = (trackName: string, action: 'play' | 'pause' | 'stop' = 'play'): void => {
  trackEvent('audio_play', {
    event_category: 'audio',
    event_label: trackName || 'Unknown Track',
    value: 1,
    action: action
  });
};

/**
 * Registra la interacción con el reproductor
 * @param {string} element - Elemento con el que se interactuó
 * @param {string} action - Acción realizada (click, play, pause, etc.)
 */
export const trackPlayerInteraction = (element: string, action: string): void => {
  trackEvent('player_interaction', {
    event_category: 'player',
    event_label: element,
    action: action
  });
};

/**
 * Registra una búsqueda en el sitio
 * @param {string} searchTerm - Término de búsqueda
 * @param {string} [searchType='general'] - Tipo de búsqueda
 */
export const trackSearch = (searchTerm: string, searchType: string = 'general'): void => {
  trackEvent('search', {
    search_term: searchTerm,
    search_type: searchType
  });
};

/**
 * Registra una navegación entre páginas
 * @param {string} pagePath - Ruta de la página
 * @param {string} [pageTitle] - Título de la página
 */
export const trackPageView = (pagePath: string, pageTitle?: string): void => {
  if (isGAAvailable() && window.gtag) {
    window.gtag('config', 'G-Y5MCPQ9LWJ', {
      page_path: pagePath,
      page_title: pageTitle || document.title
    });
  }
};

/**
 * Registra un error en la aplicación
 * @param {string} error - Mensaje de error
 * @param {boolean} [fatal=false] - Si el error es fatal
 * @param {Record<string, any>} [additionalInfo] - Información adicional
 */
export const trackError = (
  error: string, 
  fatal: boolean = false, 
  additionalInfo: Record<string, any> = {}
): void => {
  trackEvent('error', {
    event_category: 'error',
    event_label: error,
    fatal: fatal,
    ...additionalInfo
  });
};

/**
 * Registra la suscripción al boletín
 * @param {string} [method='form'] - Método de suscripción
 */
export const trackNewsletterSignup = (method: string = 'form'): void => {
  trackEvent('newsletter_signup', {
    event_category: 'engagement',
    event_label: 'Newsletter Subscription',
    method: method
  });
};

// Inicialización de Google Analytics
if (typeof window !== 'undefined') {
  // Asegurarse de que dataLayer exista
  window.dataLayer = window.dataLayer || [];
  
  // Definir la función gtag
  window.gtag = function() {
    if (window.dataLayer) {
      window.dataLayer.push(arguments);
    }
  };
  
  // Inicializar con la fecha actual
  window.gtag('js', new Date());
  
  // Configuración adicional
  window.gtag('config', 'G-Y5MCPQ9LWJ', {
    'anonymize_ip': true,
    'cookie_domain': window.location.hostname,
    'cookie_flags': 'SameSite=None;Secure',
    'send_page_view': true
  });
}

// Exportar el tipo para su uso en otros archivos
export type { EventParams };
