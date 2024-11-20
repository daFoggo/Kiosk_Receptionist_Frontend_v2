import { useState, useRef, useEffect, useCallback, memo } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Users, SignalHigh, Scan } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IHomeWebcamProps } from "@/models/HomeWebcam/type";
import PersonBadge from "@/components/PersonBadge";
import { useAISpeech } from "@/contexts/AISpeechContext";
import { IPersonData } from "@/models/WebsocketContext/type";

const HomeWebcam = memo(
  ({ isConnected, onFrameCapture, webcamData }: IHomeWebcamProps) => {
    const { speak, stopSpeaking } = useAISpeech();
    const webcamRef = useRef<Webcam>(null);
    const captureIntervalRef = useRef<NodeJS.Timeout>();
    const lastAnnouncedPersonRef = useRef<IPersonData | null>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [error, setError] = useState<string | null>(null);

    const debouncedWelcomeSpeech = useCallback(
      (person: IPersonData) => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
          if (
            !lastAnnouncedPersonRef.current ||
            lastAnnouncedPersonRef.current.name !== person.name
          ) {
            speak(
              `Chào mừng quý khách ${person.name !== "Khách" ? person.name : ""} đến với Viện Khoa học Kĩ thuật Bưu điện`,
              `Research Institute of Posts and Telecommunications에 ${person.name}님을 진심으로 환영합니다.`
            );
        
            lastAnnouncedPersonRef.current = person;
          }
        }, 500);
      },
      [speak, stopSpeaking]
    );

    const captureFrame = useCallback(() => {
      if (webcamRef.current && isConnected) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          onFrameCapture(imageSrc);
        }
      }
    }, [isConnected, onFrameCapture]);

    useEffect(() => {
      if (webcamData?.main) {
        debouncedWelcomeSpeech(webcamData.main);
      }

      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
      };
    }, [webcamData?.main, debouncedWelcomeSpeech]);

    useEffect(() => {
      if (isConnected) {
        captureIntervalRef.current = setInterval(captureFrame, 1500);
      }

      return () => {
        if (captureIntervalRef.current) {
          clearInterval(captureIntervalRef.current);
        }
      };
    }, [isConnected, captureFrame]);

    const handleWebcamError = useCallback((error: string | DOMException) => {
      console.error("Webcam error:", error);
      setError("Chưa cấp quyền truy cập Webcam");
    }, []);

    const totalDetectedPeople =
      (webcamData?.main ? 1 : 0) + (webcamData?.others?.length || 0);

    const containerVariants = {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    return (
      <div className="flex flex-col space-y-3">
        <div className="relative w-full aspect-video overflow-hidden rounded-3xl">
          {error ? (
            <div className="w-full h-full flex items-center justify-center bg-red-100 text-red-600">
              {error}
            </div>
          ) : (
            <Webcam
              ref={webcamRef}
              audio={false}
              className="w-full h-full object-cover"
              mirrored={true}
              screenshotFormat="image/jpeg"
              onUserMediaError={handleWebcamError}
              videoConstraints={{
                facingMode: "user",
                width: { ideal: 1080 },
                height: { ideal: 720 },
              }}
            />
          )}

          {isConnected && !error && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative animate-pulse">
                <Scan className="w-72 h-72 text-white/80 stroke-[0.75]" />
                <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent blur-xl" />
              </div>
            </motion.div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/10" />

          <motion.div
            className="absolute top-4 right-4 z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Badge
              variant="secondary"
              className="flex items-center gap-2 px-5 py-1 bg-background/60 backdrop-blur-sm border-none text-xl font-semibold transition-colors"
            >
              <Users className="text-white" aria-hidden="true" />
              <motion.span
                key={totalDetectedPeople}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-white"
              >
                {totalDetectedPeople}
              </motion.span>
              <SignalHigh
                className={`${isConnected ? "text-green-400" : "text-red-400"}`}
                aria-hidden="true"
              />
              <span className="sr-only">
                {isConnected ? "Connected" : "Disconnected"},{" "}
                {totalDetectedPeople} people detected
              </span>
            </Badge>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <ScrollArea className="w-full rounded-3xl">
          <motion.div
            className="flex h-12 items-center p-1"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <div className="flex space-x-2 min-w-full">
              <AnimatePresence mode="popLayout">
                {!webcamData?.main &&
                  (!webcamData?.others || webcamData.others.length === 0) && (
                    <motion.div
                      key="skeleton"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex-1 h-12 bg-background/20 rounded-3xl animate-pulse"
                    />
                  )}

                {webcamData?.main && (
                  <PersonBadge
                    key={`main-${webcamData.main.name}`}
                    person={webcamData.main}
                    isMain
                  />
                )}

                {webcamData?.others?.map((person, index) => (
                  <PersonBadge
                    key={`other-${person.name}-${index}`}
                    person={person}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
          <ScrollBar orientation="horizontal" className="bg-background/20" />
        </ScrollArea>
      </div>
    );
  }
);

HomeWebcam.displayName = "HomeWebcam";

export default HomeWebcam;
