import { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";

import { Users, SignalHigh, Scan } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { IHomeWebcamProps } from "@/models/HomeWebcam/type";
import { convertRole } from "@/utils/Helper/common";

const HomeWebcam = ({
  isConnected,
  onFrameCapture,
  webcamData,
}: IHomeWebcamProps) => {
  const webcamRef = useRef<Webcam>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout>();

  const captureFrame = useCallback(() => {
    if (webcamRef.current && isConnected) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onFrameCapture(imageSrc);
      }
    }
  }, [isConnected, onFrameCapture]);

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

  const handleWebcamError = (error: string | DOMException) => {
    console.error("Webcam error:", error);
  };

  const totalDetectedPeople =
    (webcamData?.main ? 1 : 0) + (webcamData?.others?.length || 0);

  // Animation variants for stack effect
  const badgeVariants = {
    initial: {
      opacity: 0,
      x: 100,
      scale: 0.8,
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  // Stagger children delay for stack effect
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.08,
        staggerDirection: -1, // Reverse stagger direction for right-to-left effect
      },
    },
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="relative w-full aspect-video overflow-hidden rounded-3xl">
        <Webcam
          ref={webcamRef}
          audio={false}
          className="w-full h-full object-cover"
          mirrored={true}
          screenshotFormat="image/jpeg"
          onUserMediaError={handleWebcamError}
          videoConstraints={{
            facingMode: "user",
            width: 1920,
            height: 1080,
          }}
        />

        {isConnected && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative animate-pulse">
              <Scan className="w-72 h-72 text-white/30 stroke-[0.75]" />
              <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent blur-xl" />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/10" />

        <div className="absolute top-4 right-4 z-10">
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-5 py-1 bg-background/60 backdrop-blur-sm border-none text-xl font-semibold transition-colors"
          >
            <Users className="text-white" />
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
            />
          </Badge>
        </div>

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
                    variants={badgeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="flex-1 h-12 bg-background/20 rounded-3xl animate-pulse"
                  />
                )}

              {webcamData?.main && (
                <motion.div
                  key={`main-${webcamData.main.name}`}
                  layout
                  variants={badgeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Badge
                    variant="outline"
                    className="inline-flex px-4 py-2 text-base bg-background/50 backdrop-blur-sm hover:bg-background/60 transition-all duration-300 border-primary border-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {webcamData.main.name}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-primary/40" />
                      <span className="text-muted-foreground">
                        {convertRole(webcamData.main.role)}
                      </span>
                    </div>
                  </Badge>
                </motion.div>
              )}

              {webcamData?.others?.map((person, index) => (
                <motion.div
                  key={`other-${person.name}-${index}`}
                  layout
                  variants={badgeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Badge
                    variant="outline"
                    className="inline-flex px-4 py-2 text-base bg-background/50 backdrop-blur-sm hover:bg-background/60 transition-all duration-300 border-primary/20"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{person.name}</span>
                      <span className="w-1 h-1 rounded-full bg-primary/40" />
                      <span className="text-muted-foreground">
                        {convertRole(person.role)}
                      </span>
                    </div>
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
        <ScrollBar orientation="horizontal" className="bg-background/20" />
      </ScrollArea>
    </div>
  );
};

export default HomeWebcam;
