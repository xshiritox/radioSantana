import { ref } from 'vue';
import type { Show } from '../types/radio';

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
      imageUrl: 'https://images.pexels.com/photos/3784221/pexels-photo-3784221.jpeg?auto=compress&cs=tinysrgb&w=300'
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
      imageUrl: 'https://indiehoy.com/wp-content/uploads/2023/05/disco-min.jpg'
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
      imageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'
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