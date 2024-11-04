"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import EventBanner from "@/components/EventBanner/EventBanner";
import LunarCalendar from "@/components/LunarCalendar/LunarCalendar";
import RootNavbar from "@/components/RootNavbar";
import Weather from "@/components/Weather/Weather";
import InstitueCalendar from "@/components/InstitueCalendar";

import { IEvent } from "@/models/EventBanner/EventBanner";
import { navbarVariants, leftItemVariants, rightItemVariants } from "./motion";
const Home = () => {
  const [eventData] = useState<IEvent[]>([
    {
      id: 1,
      title: "Hội thảo Software Engineering",
      start_time: "2021-10-01T00:00:00",
      end_time: "2021-11-01T23:59:59",
      location: "Hội trường 2 - T2",
    },
  ]);

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
      <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-primary/20 to-transparent clip-path-wave" />
    </div>
  );
};

export default Home;
