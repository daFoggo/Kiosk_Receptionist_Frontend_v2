import {
  IAIContextState,
  IAIContextValue,
  IAIProviderProps,
} from "@/models/AISpeechContext/type";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";

const defaultState: IAIContextState = {
  isPlaying: false,
  currentVideo: "",
  currentTranscript: "",
};

const AISpeechContext = createContext<IAIContextValue | undefined>(undefined);
const DEFAULT_WELCOME_MESSAGE =
  "Chào mừng quý khách đến với Viện khoa học Kĩ thuật Bưu điện";

export const AISpeechProvider: React.FC<IAIProviderProps> = ({
  children,
  defaultVideo = "/src/assets/videos/default.mp4",
}) => {
  const [state, setState] = useState<IAIContextState>({
    ...defaultState,
    currentVideo: defaultVideo,
  });

  const speechSynthesis = window.speechSynthesis;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const getVietnameseVoice = useCallback(() => {
    const voices = speechSynthesis.getVoices();
    console.log(voices);
    const vietnameseVoice = voices.find(
      (voice) =>
        voice.lang.includes("vi-VN") &&
        voice.name.toLowerCase().includes("female")
    );
    return vietnameseVoice || null;
  }, [speechSynthesis]);

  const stopSpeaking = useCallback(() => {
    if (utteranceRef.current) {
      speechSynthesis.cancel();
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      currentTranscript: "",
    }));
  }, [speechSynthesis]);

  const speak = useCallback(
    async (text: string, videoSrc?: string) => {
      // stop current speak
      stopSpeaking();

      // update state
      setState((prev) => ({
        ...prev,
        isPlaying: true,
        currentTranscript: text,
        currentVideo: videoSrc || prev.currentVideo,
      }));

      // speech config
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";

      // Get and set Vietnamese voice
      const vietnameseVoice = getVietnameseVoice();
      if (vietnameseVoice) {
        utterance.voice = vietnameseVoice;
      } else {
        console.warn("Vietnamese female voice not found, using default voice");
      }

      // Adjust speech parameters for clearer Vietnamese pronunciation
      utterance.rate = 0.9; // Slightly slower for better clarity
      utterance.pitch = 1.2; // Slightly higher pitch for female voice
      utterance.volume = 1.0;

      utteranceRef.current = utterance;

      // handle end speech
      utterance.onend = () => {
        setState((prev) => ({
          ...prev,
          isPlaying: false,
        }));
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      };

      // Error handling for speech synthesis
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        stopSpeaking();
      };

      // start speech
      speechSynthesis.speak(utterance);

      // start video
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error("Error playing video:", error);
        }
      }
    },
    [speechSynthesis, stopSpeaking, getVietnameseVoice]
  );

  const updateDefaultVideo = useCallback((videoSrc: string) => {
    setState((prev) => ({
      ...prev,
      currentVideo: videoSrc,
    }));
  }, []);

  const value: IAIContextValue = {
    ...state,
    speak,
    stopSpeaking,
    updateDefaultVideo,
  };

  return (
    <AISpeechContext.Provider value={value}>
      <video
        ref={videoRef}
        src={state.currentVideo}
        style={{ display: "none" }}
        loop
      />
      {children}
    </AISpeechContext.Provider>
  );
};

export const useAISpeech = () => {
  const context = useContext(AISpeechContext);
  if (context === undefined) {
    throw new Error("useAISpeech must be used within an AISpeechProvider");
  }
  return context;
};
