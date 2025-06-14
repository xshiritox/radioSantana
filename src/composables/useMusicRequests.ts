import { ref, onMounted, onUnmounted } from 'vue';
import { musicRequestService } from '../services/musicRequestService';
import type { MusicRequest } from '../types/radio';

export function useMusicRequests() {
  const requests = ref<MusicRequest[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  let unsubscribe: (() => void) | null = null;

  const submitRequest = async (
    track: string, 
    artist: string, 
    requester: string, 
    message?: string
  ): Promise<boolean> => {
    if (!track.trim() || !artist.trim() || !requester.trim()) {
      error.value = 'Todos los campos obligatorios deben estar completos';
      return false;
    }
    
    try {
      isLoading.value = true;
      error.value = null;
      
      await musicRequestService.submitRequest(
        track.trim(), 
        artist.trim(), 
        requester.trim(), 
        message?.trim()
      );
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al enviar petición';
      console.error('Error submitting request:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const updateRequestStatus = async (requestId: string, status: 'pending' | 'approved' | 'played'): Promise<boolean> => {
    try {
      await musicRequestService.updateRequestStatus(requestId, status);
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar petición';
      console.error('Error updating request:', err);
      return false;
    }
  };

  const initializeRequests = () => {
    try {
      // Suscribirse a las peticiones en tiempo real
      unsubscribe = musicRequestService.subscribeToRequests((newRequests) => {
        requests.value = newRequests;
      });
    } catch (err) {
      error.value = 'Error al conectar con las peticiones';
      console.error('Error initializing requests:', err);
    }
  };

  onMounted(() => {
    initializeRequests();
  });

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  return {
    requests,
    isLoading,
    error,
    submitRequest,
    updateRequestStatus,
    initializeRequests
  };
}