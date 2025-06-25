declare module './analytics' {
  /**
   * Verifica si Google Analytics está disponible
   */
  export function isGAAvailable(): boolean;

  /**
   * Envía un evento personalizado a Google Analytics 4
   * @param eventName - Nombre del evento
   * @param eventParams - Parámetros adicionales del evento
   */
  export function trackEvent(
    eventName: string,
    eventParams?: Record<string, any>
  ): void;

  /**
   * Registra la reproducción de audio
   * @param trackName - Nombre de la pista o programa
   * @param action - Acción (play/pause/stop)
   */
  export function trackAudioPlay(
    trackName: string,
    action?: 'play' | 'pause' | 'stop'
  ): void;

  /**
   * Registra la interacción con el reproductor
   * @param element - Elemento con el que se interactuó
   * @param action - Acción realizada (click, play, pause, etc.)
   */
  export function trackPlayerInteraction(
    element: string,
    action: string
  ): void;

  /**
   * Registra una búsqueda en el sitio
   * @param searchTerm - Término de búsqueda
   * @param searchType - Tipo de búsqueda
   */
  export function trackSearch(
    searchTerm: string,
    searchType?: string
  ): void;

  /**
   * Registra una navegación entre páginas
   * @param pagePath - Ruta de la página
   * @param pageTitle - Título de la página
   */
  export function trackPageView(
    pagePath: string,
    pageTitle?: string
  ): void;

  /**
   * Registra un error en la aplicación
   * @param error - Mensaje de error
   * @param fatal - Si el error es fatal
   * @param additionalInfo - Información adicional
   */
  export function trackError(
    error: string,
    fatal?: boolean,
    additionalInfo?: Record<string, any>
  ): void;

  /**
   * Registra la suscripción al boletín
   * @param method - Método de suscripción
   */
  export function trackNewsletterSignup(
    method?: string
  ): void;
}

// Extender la interfaz Window con gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
