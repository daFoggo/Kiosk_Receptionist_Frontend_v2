export interface IAIContextState {
  isPlaying: boolean;
  currentVideo: string;
  currentTranscript: string;
}

export interface IAIContextValue extends IAIContextState {
  speak: (englishText: string, koreanText: string, videoSrc?: string) => Promise<void>;
  stopSpeaking: () => void;
  updateDefaultVideo: (videoSrc: string) => void;
}

export interface IAIProviderProps {
  children: React.ReactNode;
  defaultVideo?: string;
}
