import { ref, onMounted, onUnmounted } from 'vue';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Show } from '../types/radio';

export function useAdminShows() {
  const shows = ref<Show[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  let unsubscribe: (() => void) | null = null;
  const showsCollection = collection(db, 'shows');

  const addShow = async (showData: Omit<Show, 'id'>): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;
      
      await addDoc(showsCollection, {
        ...showData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al agregar programa';
      console.error('Error adding show:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const updateShow = async (showId: string, showData: Partial<Show>): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const showRef = doc(showsCollection, showId);
      await updateDoc(showRef, {
        ...showData,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar programa';
      console.error('Error updating show:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteShow = async (showId: string): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const showRef = doc(showsCollection, showId);
      await deleteDoc(showRef);
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar programa';
      console.error('Error deleting show:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const subscribeToShows = () => {
    const q = query(showsCollection, orderBy('startTime', 'asc'));
    
    unsubscribe = onSnapshot(q, (snapshot) => {
      const showsList: Show[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        showsList.push({
          id: doc.id,
          name: data.name,
          host: data.host,
          description: data.description,
          startTime: data.startTime,
          endTime: data.endTime,
          days: data.days,
          isLive: data.isLive || false,
          imageUrl: data.imageUrl
        });
      });
      
      shows.value = showsList;
    }, (err) => {
      error.value = 'Error al cargar programas';
      console.error('Error listening to shows:', err);
    });
  };

  onMounted(() => {
    subscribeToShows();
  });

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  return {
    shows,
    isLoading,
    error,
    addShow,
    updateShow,
    deleteShow,
    subscribeToShows
  };
}