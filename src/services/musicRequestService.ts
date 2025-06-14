import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  Timestamp,
  updateDoc,
  doc 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { MusicRequest } from '../types/radio';

export class MusicRequestService {
  private static instance: MusicRequestService;
  private requestsCollection = collection(db, 'musicRequests');

  static getInstance(): MusicRequestService {
    if (!MusicRequestService.instance) {
      MusicRequestService.instance = new MusicRequestService();
    }
    return MusicRequestService.instance;
  }

  // Enviar petición musical
  async submitRequest(
    track: string, 
    artist: string, 
    requester: string, 
    message?: string
  ): Promise<void> {
    try {
      await addDoc(this.requestsCollection, {
        track: track.trim(),
        artist: artist.trim(),
        requester: requester.trim(),
        message: message?.trim() || '',
        status: 'pending',
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error submitting request:', error);
      throw new Error('No se pudo enviar la petición');
    }
  }

  // Escuchar peticiones en tiempo real
  subscribeToRequests(callback: (requests: MusicRequest[]) => void): () => void {
    const q = query(
      this.requestsCollection, 
      orderBy('timestamp', 'desc'), 
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const requests: MusicRequest[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const request: MusicRequest = {
          id: doc.id,
          track: data.track,
          artist: data.artist,
          requester: data.requester,
          message: data.message || undefined,
          status: data.status || 'pending',
          timestamp: data.timestamp instanceof Timestamp 
            ? data.timestamp.toDate() 
            : new Date(data.createdAt || Date.now())
        };
        requests.push(request);
      });

      callback(requests);
    }, (error) => {
      console.error('Error listening to requests:', error);
    });
  }

  // Actualizar estado de petición (para administradores)
  async updateRequestStatus(requestId: string, status: 'pending' | 'approved' | 'played'): Promise<void> {
    try {
      const requestRef = doc(this.requestsCollection, requestId);
      await updateDoc(requestRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating request status:', error);
      throw new Error('No se pudo actualizar el estado de la petición');
    }
  }
}

export const musicRequestService = MusicRequestService.getInstance();