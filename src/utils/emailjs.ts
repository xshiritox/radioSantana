import emailjs from '@emailjs/browser';

// Configuración de EmailJS
const CONFIG = {
  USER_ID: 'gHaYxSJNOajSY4Y93',
  SERVICE_ID: 'service_v46fivp',
  TEMPLATE_ID: 'template_33aglcw',
  REPLY_TEMPLATE_ID: 'template_yycqecn',
  ADMIN_EMAIL: 'radiosantana.nm@gmail.com',
  ADMIN_NAME: 'Radio Santana',
  REPLY_EMAIL: 'radiosantana.nm@gmail.com'
};

// Inicializar EmailJS
try {
  emailjs.init(CONFIG.USER_ID);
  console.log('✅ EmailJS inicializado correctamente');
} catch (error) {
  console.error('❌ Error al inicializar EmailJS:', error);
  throw new Error('Error al inicializar el servicio de correo');
}

interface EmailData {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

interface EmailResponse {
  status: number;
  text: string;
  message?: string;
  details?: {
    adminEmail?: string;
    userEmail?: string;
  };
}

export const emailjsSend = async (data: EmailData): Promise<EmailResponse> => {
  try {
    console.log('Iniciando envío de correo...');
    console.log('Datos recibidos:', JSON.stringify(data, null, 2));
    
    // Validación básica
    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      throw new Error('Por favor completa todos los campos');
    }

    const nombreLimpio = data.name.trim();
    const emailLimpio = data.email.trim();
    const mensajeLimpio = data.message.trim();

    // 1. Enviar correo al administrador
    const adminParams = {
      to_email: CONFIG.ADMIN_EMAIL,
      to_name: CONFIG.ADMIN_NAME,
      from_name: nombreLimpio,
      from_email: emailLimpio,
      reply_to: emailLimpio,
      subject: `Mensaje de contacto de ${nombreLimpio}`,
      message: mensajeLimpio,
      name: nombreLimpio,
      email: emailLimpio
    };

    console.log('Enviando correo al administrador...');
    await emailjs.send(
      CONFIG.SERVICE_ID,
      CONFIG.TEMPLATE_ID,
      adminParams,
      CONFIG.USER_ID
    );
    console.log('✅ Correo al administrador enviado');

    // 2. Enviar confirmación al usuario (usando la misma plantilla que para el admin)
    try {
      console.log('Enviando correo de confirmación...');
      
      // Parámetros mínimos y necesarios
      const confirmParams = {
        to_email: emailLimpio,  // Asegurarse de que sea un string simple
        to_name: nombreLimpio,
        from_name: 'Radio Santana',
        from_email: CONFIG.ADMIN_EMAIL,
        reply_to: CONFIG.ADMIN_EMAIL,
        subject: 'Confirmación de recepción',
        message: `Hola ${nombreLimpio},\n\nHemos recibido tu mensaje y te responderemos a la brevedad.\n\nSaludos,\nEl equipo de Radio Santana`,
        // Campos adicionales que podrían ser necesarios
        name: nombreLimpio,
        email: emailLimpio
      };
      
      console.log('Parámetros de confirmación:', JSON.stringify(confirmParams, null, 2));
      
      // Usar el mismo template_id que para el admin para simplificar
      const response = await emailjs.send(
        CONFIG.SERVICE_ID,
        CONFIG.TEMPLATE_ID,  // Usar la misma plantilla que funciona para el admin
        confirmParams,
        CONFIG.USER_ID
      );
      
      console.log('✅ Correo de confirmación enviado exitosamente:', response);
      
    } catch (error: any) {
      console.warn('⚠️ No se pudo enviar el correo de confirmación, pero el mensaje principal se envió correctamente');
      console.error('Detalles del error de confirmación:', {
        status: error?.status,
        message: error?.message,
        response: error?.response,
        fullError: error
      });
    }

    return {
      status: 200,
      text: 'Mensaje enviado correctamente',
      message: 'Hemos recibido tu mensaje. Te responderemos a la brevedad.'
    };

  } catch (error: any) {
    console.error('❌ Error al enviar el correo:', error);
    
    let userMessage = 'No se pudo enviar el mensaje. Por favor, inténtalo de nuevo más tarde.';
    
    if (error?.status === 422) {
      userMessage = 'Error de validación. Por favor, verifica que todos los campos sean correctos.';
      
      if (error?.response) {
        console.error('Detalles de validación:', error.response);
      }
    } else if (error?.message?.includes('Failed to fetch')) {
      userMessage = 'Error de conexión. Verifica tu conexión a internet.';
    } else if (error?.message) {
      userMessage = error.message;
    }
    
    throw new Error(userMessage);
  }
};
