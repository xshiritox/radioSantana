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
  doc,
  deleteDoc,
  getDocs
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

  // Función para eliminar solicitudes antiguas (mantener solo las 3 más recientes)
  private async cleanupOldRequests() {
    try {
      // Primero, obtener las 3 más recientes
      const recentQuery = query(
        this.requestsCollection,
        orderBy('timestamp', 'desc'),
        limit(3)
      );
      
      // Luego, obtener todas las solicitudes
      const allQuery = query(
        this.requestsCollection,
        orderBy('timestamp', 'desc')
      );
      
      const [recentSnapshot, allSnapshot] = await Promise.all([
        getDocs(recentQuery),
        getDocs(allQuery)
      ]);
      
      // Si hay más de 3 solicitudes, eliminar las más antiguas
      if (allSnapshot.size > 3) {
        const recentIds = new Set(recentSnapshot.docs.map(doc => doc.id));
        
        // Eliminar todas las que no estén en las 3 más recientes
        const deletePromises = allSnapshot.docs
          .filter(doc => !recentIds.has(doc.id))
          .map(doc => deleteDoc(doc.ref));
        
        if (deletePromises.length > 0) {
          await Promise.all(deletePromises);
          console.log(`Se eliminaron ${deletePromises.length} solicitudes antiguas`);
        }
      }
    } catch (error) {
      console.error('Error limpiando solicitudes antiguas:', error);
    }
  }

  // Enviar petición musical
  async submitRequest(
    track: string, 
    artist: string, 
    requester: string, 
    message?: string
  ): Promise<void> {
    try {
      // Agregar la nueva solicitud
      await addDoc(this.requestsCollection, {
        track: track.trim(),
        artist: artist.trim(),
        requester: requester.trim(),
        message: message?.trim() || '',
        status: 'pending',
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });
      
      // Limpiar solicitudes antiguas después de agregar una nueva
      await this.cleanupOldRequests();
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      throw new Error('No se pudo enviar la petición');
    }
  }

  // Escuchar peticiones en tiempo real (solo las 3 más recientes)
  subscribeToRequests(callback: (requests: MusicRequest[]) => void): () => void {
    const q = query(
      this.requestsCollection, 
      orderBy('timestamp', 'desc'), 
      limit(3)
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