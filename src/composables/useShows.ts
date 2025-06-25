import { ref, onMounted, onUnmounted } from 'vue';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Show } from '../types/radio';

// Importar imagen por defecto
import defaultShowImage from '../assets/logo.webp';

export function useShows() {
  const shows = ref<Show[]>([]);
  const currentShow = ref<Show | null>(null);
  const isLoading = ref(false);
  
  let unsubscribe: (() => void) | null = null;

  const subscribeToShows = () => {
    try {
      isLoading.value = true;
      const showsCollection = collection(db, 'shows');
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
            imageUrl: data.imageUrl || defaultShowImage
          });
        });
        
        // Asignar los shows obtenidos de Firebase
        shows.value = showsList;
        isLoading.value = false;
      }, (error) => {
        console.error('Error listening to shows:', error);
        // En caso de error, dejar el array vacío
        shows.value = [];
        isLoading.value = false;
      });
    } catch (error) {
      console.error('Error setting up shows subscription:', error);
      shows.value = [];
      isLoading.value = false;
    }
  };

  const getCurrentShow = () => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('es-ES', { weekday: 'long' });
    const currentTime = now.toTimeString().slice(0, 5);

    const dayMapping: { [key: string]: string } = {
      'monday': 'Lunes',
      'tuesday': 'Martes',
      'wednesday': 'Miércoles',
      'thursday': 'Jueves',
      'friday': 'Viernes',
      'saturday': 'Sábado',
      'sunday': 'Domingo'
    };

    const spanishDay = dayMapping[currentDay.toLowerCase()] || currentDay;

    currentShow.value = shows.value.find(show => 
      show.days.includes(spanishDay) &&
      currentTime >= show.startTime &&
      currentTime <= show.endTime
    ) || null;

    return currentShow.value;
  };

  const getUpcomingShows = () => {
    return shows.value.slice(0, 3);
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
    currentShow,
    isLoading,
    getCurrentShow,
    getUpcomingShows,
    subscribeToShows
  };
}