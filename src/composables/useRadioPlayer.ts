import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Track, RadioStats } from '../types/radio';
import radioSong from '../assets/RadioVirtualSantana.mp3';

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

  // Usar el archivo local de música
  const streamUrl = ref(radioSong);

  const formattedVolume = computed(() => Math.round(volume.value * 100));

  const initializePlayer = () => {
    audio.value = new Audio();
    audio.value.crossOrigin = 'anonymous';
    audio.value.preload = 'auto';
    audio.value.loop = false; // Desactivar la reproducción en bucle
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
    // Configurar una pista de ejemplo para mostrar en el reproductor
    currentTrack.value = {
      id: '1',
      title: 'Radio Santana',
      artist: 'En Vivo',
      album: 'Radio Online',
      duration: 0,
      isPlaying: false,
      startTime: new Date(),
      coverUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=300&h=300&fit=crop&crop=faces'
    };
    
    // Actualizar estadísticas simuladas
    radioStats.value = {
      listeners: 1,
      bitrate: '128 kbps',
      genre: 'Variado',
      website: 'radiosantana.nm@gmail.com'
    };
  });

  const play = async () => {
    if (!audio.value) return;
    
    try {
      isLoading.value = true;
      // Solo establecer el src si no está ya establecido
      if (!audio.value.src || audio.value.src !== streamUrl.value) {
        audio.value.src = streamUrl.value;
      }
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



  // Simulate current track updates (replace with real API calls)
  const updateCurrentTrack = () => {
    // No necesitamos actualizar la pista actual para el archivo local
    currentTrack.value = {
      id: Date.now().toString(),
      title: 'Canción:',
      artist: 'Artista:',
      album: 'Álbum:',
      duration: 210,
      isPlaying: isPlaying.value,
      startTime: new Date(),
      coverUrl: 'https://i.pinimg.com/736x/aa/01/87/aa01874732f0d42fabc17c0b1c5af3c5.jpg'
    };
  };

  const updateRadioStats = async () => {
    try {
      // Siempre mostrar 1 oyente (el usuario actual)
      radioStats.value.listeners = 1;
      radioStats.value.bitrate = '128kbps';
      radioStats.value.genre = 'Variado';
    } catch (error) {
      console.error('Error al obtener datos de streaming:', error);
      // En caso de error, establecer 1 oyente por defecto
      radioStats.value.listeners = 1;
    }
  };

  onMounted(() => {
    initializePlayer();
    updateCurrentTrack();
    updateRadioStats(); // Establecer las estadísticas iniciales
    
    // Limpiar al desmontar
    onUnmounted(() => {
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