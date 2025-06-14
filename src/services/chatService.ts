import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  Timestamp 
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
    try {
      await addDoc(this.messagesCollection, {
        username: username.trim(),
        message: message.trim(),
        type,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('No se pudo enviar el mensaje');
    }
  }

  // Escuchar mensajes en tiempo real
  subscribeToMessages(callback: (messages: ChatMessage[]) => void): () => void {
    const q = query(
      this.messagesCollection, 
      orderBy('timestamp', 'desc'), 
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const messages: ChatMessage[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
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
      });

      // Reverse to show oldest first
      callback(messages.reverse());
    }, (error) => {
      console.error('Error listening to messages:', error);
    });
  }

  // Enviar mensaje del sistema
  async sendSystemMessage(message: string): Promise<void> {
    return this.sendMessage('Sistema', message, 'system');
  }

  // Enviar mensaje del DJ
  async sendDJMessage(djName: string, message: string): Promise<void> {
    return this.sendMessage(djName, message, 'dj');
  }
}

export const chatService = ChatService.getInstance();