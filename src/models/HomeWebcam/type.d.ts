import { IWebcamData } from "../WebsocketContext/type";

export interface IHomeWebcamProps {
  isConnected: boolean;
  onFrameCapture: (frameData: string) => void;
  webcamData: IWebcamData | null;
}
