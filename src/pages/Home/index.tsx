import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import EventBanner from "@/components/EventBanner/EventBanner";
import LunarCalendar from "@/components/LunarCalendar/LunarCalendar";
import RootNavbar from "@/components/RootNavbar";
import Weather from "@/components/Weather/Weather";
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
      title: "Hội thảo Software Engineering",
      start_time: "2021-10-01T00:00:00",
      end_time: "2021-11-01T23:59:59",
      location: "Hội trường 2 - T2",
    },
  ]);

  const [mainRole, setMainRole] = useState("student");
  const [currentCccd, setCurrentCccd] = useState("123456789");

  const menuItemsData = {
    currentCccd,
    mainRole,
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
    console.log(item);
  };

  return (
    <div className="relative h-screen bg-gradient-to-b from-indigo-100 to-violet-100 dark:from-indigo-900 dark:to-violet-900 w-full flex flex-col items-center p-6 space-y-6 overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        className="w-full"
      >
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
          <AIModel videoSrc="/src/assets/videos/default.mp4" />

          {/* AI Transcript Container */}
          <AITranscript transcript="Chào mừng quý khách đến với Viện Khoa học Kỹ thuật Bưu điện" />
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
      <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-primary/20 to-transparent clip-path-wave" />
    </div>
  );
};

export default Home;
