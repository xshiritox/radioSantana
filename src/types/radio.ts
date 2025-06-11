export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverUrl?: string;
  isPlaying: boolean;
  startTime: Date;
}

export interface Show {
  id: string;
  name: string;
  host: string;
  description: string;
  startTime: string;
  endTime: string;
  days: string[];
  isLive: boolean;
  imageUrl?: string;
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'system' | 'dj';
}

export interface RadioStats {
  listeners: number;
  bitrate: string;
  genre: string;
  website: string;
}

export interface MusicRequest {
  id: string;
  track: string;
  artist: string;
  requester: string;
  message?: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'played';
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
  imageUrl?: string;
  category: string;
}