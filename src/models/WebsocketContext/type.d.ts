export interface IWebsocketProviderProps {
  children: React.ReactNode;
}

export interface IWebsocketContext {
  isConnected: boolean;
  webcamData: IWebcamData | null;
  cccdData: ICCCDData | null;
  sendFrame: (frameData: string) => void;
  connectWebsocket: () => void;
  resetCCCDData: () => void;
  [key: string]: any;
}

export interface IWebSocketMessage {
  event: "webcam" | "cccd";
  payload: WebcamData | CCCDData;
}

export interface IWebcamData {
  main: IPersonData;
  others: IPersonData[];
}

export interface ICCCDData {
  "Identity Code": "";
  Name: "";
  DOB: "";
  Gender: "";
  Nationality: "";
  Ethnic: "";
  Religion: "";
  Hometown: "";
  "Permanent Address": "";
  "Identifying Features": "";
  "Card Issuance Date": "";
  "Expiration Date": "";
}

export interface IPersonData {
  name: string;
  role: string;
  cccd?: string;
}
