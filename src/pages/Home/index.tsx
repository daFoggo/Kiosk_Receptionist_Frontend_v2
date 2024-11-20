import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import WelcomeBanner from "@/components/WelcomeBanner";
import EventBanner from "@/components/EventBanner";
import LunarCalendar from "@/components/LunarCalendar";
import RootNavbar from "@/components/RootNavbar";
import Weather from "@/components/Weather";
import InstitueCalendar from "@/components/InstitueCalendar";
import AIModel from "@/components/AIModel";

import AITranscript from "@/components/AITranscript";
import HomeWebcam from "@/components/HomeWebcam";
import InteractionMenu from "@/components/InteractionMenu";

import { navbarVariants, leftItemVariants, rightItemVariants } from "./motion";
import { useWebsocket } from "@/contexts/WebsocketContext";
import { IMenuItem } from "@/models/InteractionMenu/type";

const Home = () => {
  const [eventData, setEventData] = useState([
    {
      id: 1,
      title: "Opening Ceremony Vietnam - Korea center",
      start_time: "2024-11-20T09:00:00",
      end_time: "2024-11-20T09:30:00",
      location: "RIPT",
    },
  ]);

  const [mainRole, setMainRole] = useState("guest");
  const [currentCccd, setCurrentCccd] = useState("");

  const menuItemsData = {
    currentRole: mainRole,
    currentCccd,
  };

  const { isConnected, webcamData, connectWebsocket, sendFrame } =
    useWebsocket();

  useEffect(() => {
    connectWebsocket();
  }, [connectWebsocket]);

  useEffect(() => {
    if (webcamData?.main) {
      setMainRole(webcamData.main.role);
      setCurrentCccd(webcamData.main.cccd || "");
    }
  }, [webcamData]);

  const handleFrameCapture = (frameData: string) => {
    sendFrame(frameData);
  };

  const handleMenuItemClick = (item: IMenuItem) => {
    // Handle menu item click
  };

  return (
    <div className="relative h-screen bg-gradient-to-b from-indigo-100 to-violet-100 dark:from-indigo-900 dark:to-violet-900 w-full flex flex-col items-center p-6 space-y-6 overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        className="w-full flex flex-col gap-6"
      >
        <WelcomeBanner />
        <RootNavbar />
      </motion.div>

      {/*Utility components */}
      <div className="grid grid-cols-4 gap-6 w-full">
        <motion.div
          className="col-span-3"
          initial="hidden"
          animate="visible"
          variants={leftItemVariants}
        >
          <LunarCalendar />
        </motion.div>
        <motion.div
          className="col-span-1"
          initial="hidden"
          animate="visible"
          variants={rightItemVariants}
        >
          <Weather />
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-6 w-full">
        <motion.div
          className="col-span-2"
          initial="hidden"
          animate="visible"
          variants={leftItemVariants}
        >
          <EventBanner eventData={eventData} />
        </motion.div>
        <motion.div
          className="col-span-1"
          initial="hidden"
          animate="visible"
          variants={rightItemVariants}
        >
          <InstitueCalendar />
        </motion.div>
      </div>

      {/* Interaction components */}
      <div className="grid grid-cols-2 gap-6 w-full mt-6">
        {/* Left side*/}
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={leftItemVariants}
        >
          {/* AI Video Container */}
          <AIModel />

          {/* AI Transcript Container */}
          <AITranscript />
        </motion.div>

        {/* Right side */}
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={rightItemVariants}
        >
          {/* Webcam Container */}
          <HomeWebcam
            isConnected={isConnected}
            onFrameCapture={handleFrameCapture}
            webcamData={webcamData}
          />

          <InteractionMenu
            userRole={mainRole}
            onMenuItemClick={handleMenuItemClick}
            itemsData={menuItemsData}
          />
        </motion.div>
      </div>

      {/* Footer */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-primary/20 to-transparent clip-path-wave -z-10" /> */}
    </div>
  );
};

export default Home;
function useAIContext(): { speak: any; stopSpeaking: any } {
  throw new Error("Function not implemented.");
}
