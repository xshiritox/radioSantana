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
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { NewsItem } from '../types/radio';

export function useAdminNews() {
  const news = ref<NewsItem[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  let unsubscribe: (() => void) | null = null;
  const newsCollection = collection(db, 'news');

  const addNews = async (newsData: Omit<NewsItem, 'id' | 'publishedAt'>): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;
      
      await addDoc(newsCollection, {
        ...newsData,
        publishedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al agregar noticia';
      console.error('Error adding news:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const updateNews = async (newsId: string, newsData: Partial<NewsItem>): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const newsRef = doc(newsCollection, newsId);
      await updateDoc(newsRef, {
        ...newsData,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar noticia';
      console.error('Error updating news:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteNews = async (newsId: string): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const newsRef = doc(newsCollection, newsId);
      await deleteDoc(newsRef);
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar noticia';
      console.error('Error deleting news:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const subscribeToNews = () => {
    const q = query(newsCollection, orderBy('publishedAt', 'desc'));
    
    unsubscribe = onSnapshot(q, (snapshot) => {
      const newsList: NewsItem[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        newsList.push({
          id: doc.id,
          title: data.title,
          content: data.content,
          author: data.author,
          publishedAt: data.publishedAt instanceof Timestamp 
            ? data.publishedAt.toDate() 
            : new Date(data.createdAt || Date.now()),
          category: data.category,
          imageUrl: data.imageUrl
        });
      });
      
      news.value = newsList;
    }, (err) => {
      error.value = 'Error al cargar noticias';
      console.error('Error listening to news:', err);
    });
  };

  onMounted(() => {
    subscribeToNews();
  });

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  return {
    news,
    isLoading,
    error,
    addNews,
    updateNews,
    deleteNews,
    subscribeToNews
  };
}