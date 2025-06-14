import { ref } from 'vue';
import type { Show } from '../types/radio';

// Importar imágenes
import new1 from '../assets/new1.jpg';
import pro2 from '../assets/pro2.jpg';
import pro3 from '../assets/pro3.jpg';

export function useShows() {
  const shows = ref<Show[]>([
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
  ]);

  const currentShow = ref<Show | null>(null);

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

  return {
    shows,
    currentShow,
    getCurrentShow,
    getUpcomingShows
  };
}