import { ref, onMounted, onUnmounted } from 'vue';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Show } from '../types/radio';

// Importar imágenes por defecto
import new1 from '../assets/new1.jpg';
import pro2 from '../assets/pro2.jpg';
import pro3 from '../assets/pro3.jpg';

export function useShows() {
  const shows = ref<Show[]>([]);
  const currentShow = ref<Show | null>(null);
  const isLoading = ref(false);
  
  let unsubscribe: (() => void) | null = null;

  // Shows por defecto (fallback)
  const defaultShows: Show[] = [
    {
      id: '1',
      name: 'Música del Momento',
      host: 'Dj-Santana',
      description: 'Las canciones más populares del momento',
      startTime: '09:00',
      endTime: '12:00',
      days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      isLive: false,
      imageUrl: new1
    },
    {
      id: '2',
      name: 'Clásicos de Siempre',
      host: 'Dj-Santana',
      description: 'Los grandes éxitos que nunca pasan de moda',
      startTime: '15:00',
      endTime: '18:00',
      days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      isLive: true,
      imageUrl: pro2
    },
    {
      id: '3',
      name: 'Noche Electrónica',
      host: 'Dj-Santana',
      description: 'La mejor música electrónica para tus noches',
      startTime: '22:00',
      endTime: '2:00',
      days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      isLive: false,
      imageUrl: pro3
    }
  ];

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
            imageUrl: data.imageUrl || new1
          });
        });
        
        // Si no hay shows en Firebase, usar los por defecto
        shows.value = showsList.length > 0 ? showsList : defaultShows;
        isLoading.value = false;
      }, (error) => {
        console.error('Error listening to shows:', error);
        // En caso de error, usar shows por defecto
        shows.value = defaultShows;
        isLoading.value = false;
      });
    } catch (error) {
      console.error('Error setting up shows subscription:', error);
      shows.value = defaultShows;
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