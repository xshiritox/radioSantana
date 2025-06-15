import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  Timestamp,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { ChatMessage } from '../types/radio';

export class ChatService {
  private static instance: ChatService;
  private messagesCollection = collection(db, 'chatMessages');

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Enviar mensaje al chat
  async sendMessage(username: string, message: string, type: 'user' | 'dj' | 'system' = 'user'): Promise<void> {
    if (!username || !message) {
      throw new Error('Nombre de usuario o mensaje inválido');
    }

    try {
      const docRef = await addDoc(this.messagesCollection, {
        username: username.trim(),
        message: message.trim(),
        type,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });
      
      console.log('Mensaje enviado con ID:', docRef.id);
    } catch (error) {
      const errorMessage = this.getFirebaseErrorMessage(error as FirestoreError, 'enviar mensaje');
      console.error('Error al enviar mensaje:', {
        error,
        timestamp: new Date().toISOString(),
        username: username.substring(0, 3) + '...', // No registrar el nombre completo por privacidad
        messageLength: message.length,
        type
      });
      throw new Error(`Error al enviar mensaje: ${errorMessage}`);
    }
  }

  // Escuchar mensajes en tiempo real
  subscribeToMessages(callback: (messages: ChatMessage[]) => void): () => void {
    console.log('Iniciando suscripción a mensajes...');
    
    const q = query(
      this.messagesCollection, 
      orderBy('timestamp', 'desc'), 
      limit(50)
    );

    try {
      const unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
          console.log(`Recibida actualización de ${snapshot.size} mensajes`);
          const messages: ChatMessage[] = [];
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            try {
              const message: ChatMessage = {
                id: doc.id,
                username: data.username,
                message: data.message,
                type: data.type || 'user',
                timestamp: data.timestamp instanceof Timestamp 
                  ? data.timestamp.toDate() 
                  : new Date(data.createdAt || Date.now())
              };
              messages.push(message);
            } catch (e) {
              console.error('Error procesando mensaje:', {
                docId: doc.id,
                error: e,
                data: data
              });
            }
          });

          // Reverse to show oldest first
          callback(messages.reverse());
        },
        (error: FirestoreError) => {
          const errorInfo = this.getFirebaseErrorDetails(error);
          console.error('Error en la suscripción a mensajes:', {
            code: error.code,
            message: error.message,
            ...errorInfo,
            timestamp: new Date().toISOString()
          });
          
          // Intentar reconectar después de un retraso
          if (this.shouldRetry(error)) {
            console.log('Intentando reconectar en 5 segundos...');
            setTimeout(() => {
              console.log('Reconectando...');
              this.subscribeToMessages(callback);
            }, 5000);
          }
        }
      );

      // Devolver función para cancelar la suscripción
      return () => {
        console.log('Cancelando suscripción a mensajes...');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error al suscribirse a mensajes:', {
        error,
        timestamp: new Date().toISOString()
      });
      throw new Error('No se pudo establecer la conexión con el chat');
    }
  }

  // Enviar mensaje del sistema
  async sendSystemMessage(message: string): Promise<void> {
    return this.sendMessage('Sistema', message, 'system');
  }

  // Enviar mensaje del DJ
  async sendDJMessage(djName: string, message: string): Promise<void> {
    return this.sendMessage(djName, message, 'dj');
  }

  // Determina si se debe reintentar la conexión basado en el error
  private shouldRetry(error: FirestoreError): boolean {
    const retryableErrors = [
      'unavailable',
      'resource-exhausted',
      'internal',
      'deadline-exceeded',
      'aborted'
    ];
    
    return retryableErrors.some(code => error.code.includes(code));
  }

  // Obtiene detalles adicionales del error de Firebase
  private getFirebaseErrorDetails(error: FirestoreError) {
    const details: Record<string, any> = {
      code: error.code,
      message: error.message,
      name: error.name,
      stack: error.stack
    };

    // Agregar información específica según el tipo de error
    if (error.code === 'permission-denied') {
      details.suggestion = 'Verifica las reglas de seguridad de Firestore';
    } else if (error.code === 'unauthenticated') {
      details.suggestion = 'El usuario no está autenticado correctamente';
    } else if (error.code === 'unavailable') {
      details.suggestion = 'El servicio no está disponible. Verifica tu conexión a internet';
    }

    return details;
  }

  // Obtiene un mensaje de error amigable
  private getFirebaseErrorMessage(error: FirestoreError, action: string): string {
    const errorMap: Record<string, string> = {
      'permission-denied': `No tienes permiso para ${action}.`,
      'unauthenticated': `Debes iniciar sesión para ${action}.`,
      'not-found': `El recurso solicitado no se encontró.`,
      'already-exists': 'El recurso que intentas crear ya existe.',
      'resource-exhausted': 'Se ha excedido la cuota de la base de datos.',
      'failed-precondition': 'La operación no se pudo completar en el estado actual.',
      'aborted': 'La operación fue cancelada.',
      'out-of-range': 'La operación está fuera del rango válido.',
      'unimplemented': 'La operación no está implementada o no es compatible.',
      'internal': 'Error interno del servidor.',
      'unavailable': 'El servicio no está disponible. Por favor, verifica tu conexión a internet.',
      'data-loss': 'Se ha producido una pérdida de datos o corrupción.',
      'deadline-exceeded': 'Tiempo de espera agotado. Por favor, inténtalo de nuevo.'
    };

    return errorMap[error.code] || `Error al ${action}: ${error.message}`;
  }
}

export const chatService = ChatService.getInstance();