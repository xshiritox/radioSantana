import emailjs from '@emailjs/browser';

// Configuración de EmailJS
const CONFIG = {
  USER_ID: 'gHaYxSJNOajSY4Y93',
  SERVICE_ID: 'service_v46fivp',
  TEMPLATE_ID: 'template_33aglcw',
  ADMIN_EMAIL: 'radiosantana.nm@gmail.com'
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
}

interface EmailResponse {
  status: number;
  text: string;
  details?: {
    adminEmail: string;
    userEmail: string;
  };
}

export const emailjsSend = async (data: EmailData): Promise<EmailResponse> => {
  try {
    console.log('=== PRUEBA DE ENVÍO SIMPLIFICADA ===');
    
    // Validación básica
    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      throw new Error('Por favor completa todos los campos');
    }

    // 1. Enviar correo al administrador
    const adminParams = {
      to_email: CONFIG.ADMIN_EMAIL,
      to_name: 'Administrador',
      from_name: data.name,
      from_email: data.email,
      message: data.message,
      subject: `Nuevo mensaje de ${data.name}`,
      reply_to: data.email
    };

    console.log('📤 Enviando correo al administrador:', {
      to: CONFIG.ADMIN_EMAIL,
      from: data.email
    });

    // 2. Enviar correo de confirmación al remitente
    const userParams = {
      to_email: data.email,
      to_name: data.name,
      from_name: 'Radio Santana',
      from_email: CONFIG.ADMIN_EMAIL,
      message: `Hola ${data.name},\n\nHemos recibido tu mensaje:\n\n"${data.message}"\n\nNos pondremos en contacto contigo pronto.\n\nAtentamente,\nEl equipo de Radio Santana`,
      subject: 'Gracias por contactar a Radio Santana',
      reply_to: CONFIG.ADMIN_EMAIL
    };

    console.log('📤 Enviando correo de confirmación a:', data.email);

    // 3. Enviar ambos correos en paralelo
    const [adminResponse, userResponse] = await Promise.all([
      emailjs.send(
        CONFIG.SERVICE_ID,
        CONFIG.TEMPLATE_ID,
        adminParams,
        CONFIG.USER_ID
      ),
      emailjs.send(
        CONFIG.SERVICE_ID,
        CONFIG.TEMPLATE_ID,
        userParams,
        CONFIG.USER_ID
      )
    ]);

    console.log('✅ Correos enviados exitosamente:', {
      admin: { status: adminResponse.status },
      user: { status: userResponse.status }
    });

    // Devolvemos la respuesta del correo al administrador como respuesta principal
    return {
      status: adminResponse.status,
      text: 'Mensaje enviado correctamente',
      details: {
        adminEmail: adminResponse.status === 200 ? 'Enviado' : 'Error',
        userEmail: userResponse.status === 200 ? 'Enviado' : 'Error'
      }
    };
    
  } catch (error: any) {
    console.error('❌ ERROR DETALLADO:', {
      name: error?.name,
      message: error?.message,
      status: error?.status,
      response: error?.response,
      error: JSON.stringify(error)
    });
    
    // Mensajes de error específicos
    let userMessage = 'Error al enviar el mensaje';
    
    if (error?.status === 422) {
      userMessage = 'Error de validación. Por favor, verifica que todos los campos sean correctos.';
      
      // Verificar si hay detalles de validación en la respuesta
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
}
