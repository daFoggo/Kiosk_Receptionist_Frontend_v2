import { motion } from "framer-motion";
import { memo } from "react";
import { INITIAL_BANNERS } from "./constant";

const WelcomeBanner = memo(() => {
  return (
    <div
      id="welcome-banner"
      className="w-full p-4 overflow-hidden rounded-lg shadow-sm font-clash bg-gradient-to-r from-[#ffa7a6] via-[#ffffff] via-50% to-[#d4e0ee]"
    >
      <motion.div
        className="flex items-center h-full w-full gap-14"
        animate={{
          x: [0, -1000],
          transition: {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          },
        }}
      >
        {INITIAL_BANNERS.map((_, index) => (
          <div key={index} className="flex items-center min-w-max">
            <motion.h1
              className="text-2xl font-semibold text-foreground whitespace-pre "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.5 }}
            >
              WELCOME DELEGATES TO THE OPENING CEREMONY OF THE VIETNAM - JAPAN
              CENTER
            </motion.h1>
          </div>
        ))}
      </motion.div>
    </div>
  );
});

WelcomeBanner.displayName = "WelcomeBanner";
export default WelcomeBanner;