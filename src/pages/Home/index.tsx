import { useEffect, useState } from "react";
import { useWebsocket } from "@/contexts/websocket-context";
import EventBanner from "@/components/EventBanner";
import LunarCalendar from "@/components/LunarCalendar";
import RootNavbar from "@/components/RootNavbar";
import Weather from "@/components/Weather";
import InstitueCalendar from "@/components/InstitueCalendar";
import AIModel from "@/components/AIModel";
import AITranscript from "@/components/AITranscript";
import HomeWebcam from "@/components/HomeWebcam";
import InteractionMenu from "@/components/InteractionMenu";
import { IMenuItem } from "@/models/interaction-menu";

const Home = () => {
  const [eventData, setEventData] = useState([
    {
      id: 1,
      title: "Opening Ceremony Vietnam - Japan center",
      start_time: "2024-12-17T13:15:00",
      end_time: "2024-12-17T14:15:00",
      location: "122 Hoang Quoc Viet Street, Cau Giay District, Hanoi",
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
      <div className="w-full flex flex-col gap-6">
        <RootNavbar />
      </div>

      {/*Utility components */}
      <div className="grid grid-cols-4 gap-6 w-full">
        <div className="col-span-3 z-10">
          <LunarCalendar />
        </div>
        <div className="col-span-1">
          <Weather />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 w-full">
        <div className="col-span-2">
          <EventBanner eventData={eventData} />
        </div>
        <div className="col-span-1">
          <InstitueCalendar />
        </div>
      </div>

      {/* Interaction components */}
      <div className="grid grid-cols-2 gap-6 w-full mt-6">
        {/* Left side*/}
        <div className="space-y-4">
          {/* AI Video Container */}
          <AIModel />

          {/* AI Transcript Container */}
          <AITranscript />
        </div>

        {/* Right side */}
        <div className="space-y-4">
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
        </div>
      </div>
    </div>
  );
};

export default Home;
