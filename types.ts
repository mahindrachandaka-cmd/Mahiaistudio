
export type AppModule = 
  | 'EDUCATION' | 'HEALTH' | 'AGRICULTURE' | 'ENVIRONMENT' | 'SAFETY' | 'CREATOR' 
  | 'THINKING' | 'SIMULATOR' | 'PLAYGROUND' | 'ETHICS'
  | 'META_COGNITION' | 'PERSPECTIVES' | 'CAUSAL_LAB' | 'TIME_AWARE'
  | 'DOCTOR' | 'DASHBOARD' | 'PROFILE'
  | 'IMAGE_GEN' | 'VOICE_GEN';

export interface UserProfile {
  name: string;
  role: 'student' | 'teacher' | 'farmer' | 'parent' | 'guest';
  language: 'English' | 'Telugu' | 'Bilingual';
  isGuest: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  reasoning?: string;
  confidence?: number;
  timestamp: Date;
}

export interface HistoryItem {
  id: string;
  module: AppModule;
  title: string;
  description: string;
  date: string;
}
