import { IAIModelProps } from "@/models/AIModel/type";

const AIModel = ({ videoSrc }: IAIModelProps) => {
  return (
    <div className="relative w-full aspect-reels">
      <video
        src={videoSrc}
        className="w-full h-full object-cover rounded-3xl"
        loop
        autoPlay
      />
    </div>
  );
};

export default AIModel;
