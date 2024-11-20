"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
const WelcomeBanner = () => {
  const controls = useAnimationControls();
  const [gradientAngle, setGradientAngle] = useState(0);

  useEffect(() => {
    controls.start({
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    });

    const intervalId = setInterval(() => {
      setGradientAngle((prevAngle) => (prevAngle + 1) % 360);
    }, 50);

    return () => clearInterval(intervalId);
  }, [controls]);

  return (
    <div
      className="w-full p-4 overflow-hidden rounded-lg shadow-sm"
      style={{
        background: `linear-gradient(${gradientAngle}deg, #00ac5b, #0033cd, #00ac5b)`,
      }}
    >
      <motion.div
        className="flex items-center h-full whitespace-nowrap"
        animate={controls}
      >
        {[...Array(4)].map((_, index) => (
          <motion.h1
            key={index}
            className="text-2xl font-bold text-white px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.5 }}
          >
            WELCOME SEOUL CYBER UNIVERSITY TO RIPT!
          </motion.h1>
        ))}
      </motion.div>
    </div>
  );
};

export default WelcomeBanner;
