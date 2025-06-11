import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Track, RadioStats } from '../types/radio';

export function useRadioPlayer() {
  const audio = ref<HTMLAudioElement | null>(null);
  const isPlaying = ref(false);
  const isLoading = ref(false);
  const volume = ref(0.7);
  const isMuted = ref(false);
  const currentTrack = ref<Track | null>(null);
  const radioStats = ref<RadioStats>({
    listeners: 0,
    bitrate: '?',
    genre: 'Variado',
    website: 'radiosantana.nm@gmail.com'
  });

  // Stream URL - Replace with your actual stream URL
  const streamUrl = ref('http://localhost:8000/stream');
  const statsUrl = ref('http://localhost:8000/status-json.xsl'); // URL para obtener estadísticas

  const formattedVolume = computed(() => Math.round(volume.value * 100));

  const initializePlayer = () => {
    audio.value = new Audio();
    audio.value.crossOrigin = 'anonymous';
    audio.value.preload = 'none';
    audio.value.volume = volume.value;

    audio.value.addEventListener('loadstart', () => {
      isLoading.value = true;
    });

    audio.value.addEventListener('canplay', () => {
      isLoading.value = false;
    });

    audio.value.addEventListener('play', () => {
      isPlaying.value = true;
    });

    audio.value.addEventListener('pause', () => {
      isPlaying.value = false;
    });

    audio.value.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      isLoading.value = false;
      isPlaying.value = false;
    });
  };

  onMounted(() => {
    // Iniciar la actualización periódica de estadísticas cuando el componente se monte
    fetchIcecastStats();
    const interval = setInterval(fetchIcecastStats, 5000); // Actualizar cada 5 segundos
    onUnmounted(() => clearInterval(interval));
  });

  const play = async () => {
    if (!audio.value) return;
    
    try {
      isLoading.value = true;
      audio.value.src = streamUrl.value;
      await audio.value.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      isLoading.value = false;
    }
  };

  const pause = () => {
    if (audio.value) {
      audio.value.pause();
    }
  };

  const togglePlay = () => {
    if (isPlaying.value) {
      pause();
    } else {
      play();
    }
  };

  const setVolume = (newVolume: number) => {
    volume.value = Math.max(0, Math.min(1, newVolume));
    if (audio.value) {
      audio.value.volume = volume.value;
    }
  };

  const toggleMute = () => {
    isMuted.value = !isMuted.value;
    if (audio.value) {
      audio.value.muted = isMuted.value;
    }
  };

  // Función para obtener estadísticas de Icecast
  const fetchIcecastStats = async () => {
    try {
      // Intentar obtener las estadísticas usando fetch
      const response = await fetch(statsUrl.value, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Error en la respuesta:', response.status);
        return;
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);

      // Asegurarse de que el objeto existe
      if (!data || !data.icestats || !data.icestats.source) {
        console.error('Formato de datos incorrecto');
        return;
      }

      // Buscar todas las fuentes (mountpoints)
      const sources = Array.isArray(data.icestats.source) 
        ? data.icestats.source 
        : [data.icestats.source];

      // Sumar oyentes de todos los mountpoints
      let totalListeners = 0;
      let totalBitrate = 0;
      let hasBitrate = false;

      sources.forEach(source => {
        if (source.listeners) {
          totalListeners += parseInt(source.listeners);
        }
        if (source.bitrate) {
          totalBitrate += parseInt(source.bitrate);
          hasBitrate = true;
        }
      });

      // Actualizar las estadísticas
      radioStats.value.listeners = totalListeners;
      radioStats.value.bitrate = hasBitrate ? `${totalBitrate} kbps` : '?';
      radioStats.value.genre = 'Variado'; // Puedes ajustar esto según tus necesidades

      console.log('Total oyentes:', totalListeners);

    } catch (error) {
      console.error('Error fetching Icecast stats:', error);
      // Si hay error, mantener los valores anteriores
    }
  };

  // Simulate current track updates (replace with real API calls)
  const updateCurrentTrack = () => {
    // This would typically fetch from your radio automation software API
    currentTrack.value = {
      id: Date.now().toString(),
      title: 'Canción:',
      artist: 'Artista:',
      album: 'Álbum:',
      duration: 210,
      isPlaying: isPlaying.value,
      startTime: new Date(),
      coverUrl: 'https://play-lh.googleusercontent.com/1wKUUHWoASPyJRQzd_WSXG1jXHaNGIolS9pV5-K_g3HLqGcgX4Cu6garNwXfrJrNnzq-=w240-h480'
    };
  };

  const updateRadioStats = async () => {
    try {
      // Aquí necesitarás configurar la URL correcta de tu API
      const response = await fetch('TU_URL_API_STREAMING');
      const data = await response.json();
      
      // Actualizar los datos reales
      radioStats.value.listeners = data.listeners || 0;
      radioStats.value.bitrate = data.bitrate || '128kbps';
      radioStats.value.genre = data.genre || 'Variado';
    } catch (error) {
      console.error('Error al obtener datos de streaming:', error);
      // Mantener los valores actuales en caso de error
    }
  };

  onMounted(() => {
    initializePlayer();
    updateCurrentTrack();
    updateRadioStats();
    
    // Update track info every 30 seconds
    const trackInterval = setInterval(updateCurrentTrack, 30000);
    // Update stats every 10 seconds
    const statsInterval = setInterval(updateRadioStats, 10000);

    onUnmounted(() => {
      clearInterval(trackInterval);
      clearInterval(statsInterval);
      if (audio.value) {
        audio.value.pause();
        audio.value = null;
      }
    });
  });

  return {
    isPlaying,
    isLoading,
    volume,
    isMuted,
    formattedVolume,
    currentTrack,
    radioStats,
    togglePlay,
    setVolume,
    toggleMute,
    play,
    pause
  };
}