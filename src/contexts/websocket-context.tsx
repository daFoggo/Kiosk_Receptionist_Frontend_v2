import {
  ICCCDData,
  IWebcamData,
  IWebsocketContext,
  IWebSocketMessage,
  IWebsocketProviderProps,
} from "@/models/websocket-context";
import { kioskId, WEBSOCKETSTATE } from "@/utils/constant";
import { wsIp } from "@/utils/ip";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const WebsocketContext = createContext<IWebsocketContext | undefined>(
  undefined
);

export const useWebsocket = (): IWebsocketContext => {
  const context = useContext(WebsocketContext);
  if (context === undefined) {
    throw new Error("useWebsocket must be used within a WebsocketProvider");
  }
  return context;
};

export const WebsocketProvider = ({ children }: IWebsocketProviderProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef<number>(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [webcamData, setWebcamData] = useState<IWebcamData | null>(null);
  const [cccdData, setCccdData] = useState<ICCCDData | null>(null);

  const resetCCCDData = useCallback(() => {
    setCccdData(null);
  }, []);

  const connectWebsocket = useCallback(() => {
    if (wsRef.current?.readyState === WEBSOCKETSTATE.OPEN) {
      console.log("Websocket is already connected");
      return;
    }

    try {
      wsRef.current = new WebSocket(wsIp);

      wsRef.current.onopen = () => {
        console.log("Start connecting to websocket");
        wsRef.current?.send(kioskId);

        setIsConnected(true);
        console.log("Websocket connected");

        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as IWebSocketMessage;

          if (data) {
            switch (data.event) {
              case "webcam":
                const webcamPayload = data.payload as IWebcamData;
                if (webcamPayload) {
                  setWebcamData(webcamPayload);
                }
                break;
              case "cccd":
                const cccdPayload = data.payload as ICCCDData;
                if (cccdPayload) {
                  setCccdData(cccdPayload);
                  console.log("CCCD data: ", cccdPayload);
                }
                break;
              default:
                console.warn("Unknown event type:", data.event);
            }
          }
        } catch (error) {
          console.error("Error parsing websocket data: ", error);
        }
      };

      wsRef.current.onclose = () => {
        console.log("Websocket connection closed");
        setIsConnected(false);

        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current += 1;
          const backoffTime = 1000 * Math.pow(2, reconnectAttempts.current);
          reconnectTimeoutRef.current = setTimeout(
            connectWebsocket,
            backoffTime
          );
        }
      };

      wsRef.current.onerror = (error: Event) => {
        console.log("Websocket error: ", error);
        wsRef.current?.close();
      };
    } catch (error) {
      console.error("Error connecting to websocket: ", error);
    }
  }, []);

  const sendFrame = useCallback(
    (frameData: string) => {
      if (wsRef.current?.readyState === WEBSOCKETSTATE.OPEN) {
        wsRef.current.send(frameData);
      } else {
        console.warn("WebSocket is not connected. Attempting to reconnect...");
        connectWebsocket();
      }
    },
    [connectWebsocket]
  );

  // Cleanup function
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, []);

  const value = {
    isConnected,
    webcamData,
    cccdData,
    sendFrame,
    connectWebsocket,
    resetCCCDData,
  };

  return (
    <WebsocketContext.Provider value={value}>
      {children}
    </WebsocketContext.Provider>
  );
};
