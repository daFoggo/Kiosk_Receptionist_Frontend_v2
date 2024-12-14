import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  IAIContextState,
  IAIContextValue,
  IAIProviderProps,
} from "@/models/ai-speech-context";

const defaultState: IAIContextState = {
  isPlaying: false,
  currentVideo: "",
  currentTranscript: "",
};

const AISpeechContext = createContext<IAIContextValue | undefined>(undefined);

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

  const getVoiceByLanguage = useCallback(
    (lang: string) => {
      const voices = speechSynthesis.getVoices();

      if (lang === "ko-KR") {
        const sunHiVoice = voices.find(
          (voice) =>
            voice.name === "Microsoft SunHi Online (Natural) - Korean (Korea)"
        );
        console.log(sunHiVoice);
        return sunHiVoice || null;
      } else if (lang === "vi-VN") {
        const hoaiMyVoice = voices.find(
          (voice) =>
            voice.name ===
            "Microsoft HoaiMy Online (Natural) - Vietnamese (Vietnam)"
        );
        console.log(hoaiMyVoice);
        return hoaiMyVoice || null;
      }
    },
    [speechSynthesis]
  );

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
    async (englishText: string, koreanText: string, videoSrc?: string) => {
      setState((prev) => ({
        ...prev,
        isPlaying: true,
        currentTranscript: englishText,
        currentVideo: videoSrc || prev.currentVideo,
      }));

      // Create English utterance
      const englishUtterance = new SpeechSynthesisUtterance(englishText);
      englishUtterance.lang = "vi-VN";
      const englishVoice = getVoiceByLanguage("vi-VN");
      if (englishVoice) {
        englishUtterance.voice = englishVoice;
      }
      englishUtterance.rate = 0.9;
      englishUtterance.pitch = 1.0;
      englishUtterance.volume = 1.0;

      // Create Korean utterance
      const koreanUtterance = new SpeechSynthesisUtterance(koreanText);
      koreanUtterance.lang = "ko-KR";
      const koreanVoice = getVoiceByLanguage("ko-KR");
      if (koreanVoice) {
        koreanUtterance.voice = koreanVoice;
      }
      koreanUtterance.rate = 0.9;
      koreanUtterance.pitch = 1.0;
      koreanUtterance.volume = 1.0;

      // Error handling
      const handleError = (event: SpeechSynthesisErrorEvent) => {
        console.error("Speech synthesis error:", event);
        stopSpeaking();
      };

      englishUtterance.onerror = handleError;
      koreanUtterance.onerror = handleError;

      // Set up sequential speaking
      englishUtterance.onend = () => {
        // Update transcript to Korean
        setState((prev) => ({
          ...prev,
          currentTranscript: koreanText,
        }));

        // Speak Korean after English
        speechSynthesis.speak(koreanUtterance);
      };

      koreanUtterance.onend = () => {
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          currentTranscript: "",
        }));
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      };

      // Start with English speech
      speechSynthesis.speak(englishUtterance);

      // start video
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error("Error playing video:", error);
        }
      }
    },
    [speechSynthesis, stopSpeaking, getVoiceByLanguage]
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
