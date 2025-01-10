import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { useAISpeech } from "@/contexts/ai-speech-context";
import { memo, useEffect, useRef, useState } from "react";

const AIModel = memo(() => {
  const { currentVideo, isPlaying } = useAISpeech();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;
    setIsLoaded(false);

    const handleLoaded = () => setIsLoaded(true);
    const handleError = () => setError("Failed to load video");

    videoElement.addEventListener("loadeddata", handleLoaded);
    videoElement.addEventListener("error", handleError);
    
    try {
      videoElement.play();
    } catch (err) {
      setError("Failed to play video");
    }

    return () => {
      videoElement.pause();
      videoElement.removeEventListener("loadeddata", handleLoaded);
      videoElement.removeEventListener("error", handleError);
    };

  }, [currentVideo]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.play().catch(() => setError("Failed to play video"));
    } else {
      videoElement.pause();
    }
  }, [isPlaying]);

  return (
    <Card className="overflow-hidden">
      <AspectRatio ratio={9 / 16}>
        {error ? (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 text-red-500">
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            src={currentVideo}
            className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            loop
            autoPlay
            muted
            playsInline
            preload="metadata"
          />
        )}
      </AspectRatio>
    </Card>
  );
});

AIModel.displayName = "AIModel";

export default AIModel;
