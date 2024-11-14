import { useRef, useEffect, useState, memo } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { useAISpeech } from "@/contexts/AISpeechContext";

const AIModel = memo(() => {
  const { currentVideo, isPlaying } = useAISpeech();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("loadeddata", () => setIsLoaded(true));
      videoElement.addEventListener("error", () =>
        setError("Failed to load video")
      );
      return () => {
        videoElement.removeEventListener("loadeddata", () => setIsLoaded(true));
        videoElement.removeEventListener("error", () =>
          setError("Failed to load video")
        );
      };
    }
  }, []);

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
            autoPlay={isPlaying}
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
