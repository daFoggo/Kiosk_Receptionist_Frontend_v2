"use client";

import { motion, useAnimationControls } from "framer-motion";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import logoScu from "/src/assets/logo/logo-scu.png";
import { ANIMATION_DURATION, INITIAL_BANNERS } from "./constant";

const WelcomeBanner = memo(() => {
  const controls = useAnimationControls();
  const gradientRef = useRef({ angle: 0 });
  const requestRef = useRef<number | null>(null);

  const updateGradient = useCallback(() => {
    const element = document.getElementById("welcome-banner");
    if (element) {
      gradientRef.current.angle = (gradientRef.current.angle + 1) % 360;
      element.style.background = `linear-gradient(${gradientRef.current.angle}deg, 
        rgba(0, 172, 91, 0.7), 
        rgba(0, 51, 205, 0.7), 
        rgba(0, 172, 91, 0.7))`;
    }
    requestRef.current = requestAnimationFrame(updateGradient);
  }, []);

  useEffect(() => {
    controls.start({
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: ANIMATION_DURATION,
          ease: "linear",
        },
      },
    });

    requestRef.current = requestAnimationFrame(updateGradient);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [controls, updateGradient]);

  const bannerContent = useMemo(
    () =>
      INITIAL_BANNERS.map((_, index) => (
        <div key={index} className="flex items-center gap-2 min-w-max">
          <motion.h1
            className="text-2xl font-semibold text-white whitespace-pre"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.5 }}
          >
            WELCOME SCU DELIGATES TO THE OPENING CEREMONY OF VIETNAM - KOREAN CENTER
          </motion.h1>
          <img src={logoScu} className="w-14"></img>
        </div>
      )),
    []
  );

  return (
    <div
      id="welcome-banner"
      className="w-full p-4 overflow-hidden rounded-lg shadow-sm font-clash"
    >
      <motion.div
        className="flex items-center h-full w-full gap-2"
        animate={controls}
      >
        {bannerContent}
      </motion.div>
    </div>
  );
});

WelcomeBanner.displayName = "WelcomeBanner";

export default WelcomeBanner;
