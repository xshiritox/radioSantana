// Extender la interfaz Window con propiedades personalizadas
declare global {
  interface Window {
    // Propiedades para Google Analytics
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    
    // Otras propiedades globales si son necesarias
    [key: string]: any;
  }
}

export {}; // Este archivo debe ser un módulo
