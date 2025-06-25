/**
 * Utilidad para el seguimiento de eventos con Google Analytics 4
 */

/**
 * Verifica si Google Analytics está disponible
 * @returns {boolean} - True si GA está disponible
 */
export const isGAAvailable = () => {
  return typeof window !== 'undefined' && window.gtag;
};

/**
 * Envía un evento personalizado a Google Analytics 4
 * @param {string} eventName - Nombre del evento
 * @param {Object} [eventParams={}] - Parámetros adicionales del evento
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (isGAAvailable()) {
    window.gtag('event', eventName, {
      ...eventParams,
      'event_callback': () => {},
      'event_timeout': 500
    });
  } else {
    console.warn('Google Analytics no está disponible');    
  }
};

/**
 * Registra la reproducción de audio
 * @param {string} trackName - Nombre de la pista o programa
 * @param {string} [action='play'] - Acción (play/pause/stop)
 */
export const trackAudioPlay = (trackName, action = 'play') => {
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
export const trackPlayerInteraction = (element, action) => {
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
export const trackSearch = (searchTerm, searchType = 'general') => {
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
export const trackPageView = (pagePath, pageTitle) => {
  if (isGAAvailable()) {
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
 * @param {Object} [additionalInfo] - Información adicional
 */
export const trackError = (error, fatal = false, additionalInfo = {}) => {
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
export const trackNewsletterSignup = (method = 'form') => {
  trackEvent('newsletter_signup', {
    event_category: 'engagement',
    event_label: 'Newsletter Subscription',
    method: method
  });
};

// Inicialización de Google Analytics
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  
  // Configuración adicional
  window.gtag('js', new Date());
  window.gtag('config', 'G-Y5MCPQ9LWJ', {
    'anonymize_ip': true,
    'cookie_domain': window.location.hostname,
    'cookie_flags': 'SameSite=None;Secure',
    'send_page_view': true
  });
}
