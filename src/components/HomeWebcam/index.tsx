import { useState } from "react";
import Webcam from "react-webcam";
import { Users, SignalHigh, Scan } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const HomeWebcam = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [recognizeData, setRecognizeData] = useState([
    {
      id: 1,
      name: "Nguyễn Trường Giang",
      role: "Sinh viên",
    },
  ]);

  return (
    <div className="flex flex-col space-y-3">
      <div className="relative w-full aspect-video overflow-hidden rounded-3xl">
        <Webcam
          audio={false}
          className="w-full h-full object-cover"
          mirrored={true}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "user",
            width: 1920,
            height: 1080,
          }}
        />

        {/* Detect frame */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative animate-pulse">
            <Scan className="w-72 h-72 text-white/30 stroke-[0.75]" />
            <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent blur-xl" />
          </div>
        </div>

        {/* Gradient top */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/20" />

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-5 py-1 bg-background/60 backdrop-blur-sm border-none text-xl font-semibold transition-colors"
          >
            <Users className="text-white" />
            <span className="text-white">{recognizeData?.length}</span>
            <SignalHigh
              className={`${isConnected ? "text-green-400" : "text-red-400"}`}
            />
          </Badge>
        </div>

        {/* Gradient bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Recognition data */}
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex space-x-2 p-1">
          {recognizeData.map((person) => (
            <Badge
              key={person.id}
              variant="outline"
              className="inline-flex px-4 py-2 text-base bg-background/50 backdrop-blur-sm hover:bg-background/60 transition-all duration-300 border-primary/20"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{person.name}</span>
                <span className="w-1 h-1 rounded-full bg-primary/40" />
                <span className="text-muted-foreground">{person.role}</span>
              </div>
            </Badge>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="bg-background/20" />
      </ScrollArea>
    </div>
  );
};

export default HomeWebcam;
