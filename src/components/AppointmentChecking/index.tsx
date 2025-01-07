import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { motion } from "framer-motion";
import { Camera, CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useZxing } from "react-zxing";
import { toast } from "sonner";

const AppointmentChecking = () => {
  const [result, setResult] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const webcamRef = useRef<Webcam>(null);

  const { ref: zxingRef } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
      setIsScanning(false);
      sendImageToBackend();
    },
    paused: !isScanning,
    constraints: {
      video: { facingMode: "environment" },
    },
  });

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsScanning(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const sendImageToBackend = async () => {
    try {
      const imageData = await getImageDataFromResult();
      const response = await axios.post("", {
        image: imageData,
      });

      if (response.data.success) {
        toast.success("Mã QR đã được xử lý thành công");
      }
    } catch (error) {
      console.error("Failed to process qr:", error);
      toast.error("Có lỗi khi xử lý mã QR");
    }
  };

  const getImageDataFromResult = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        resolve(imageSrc);
      } else {
        reject(new Error("Failed to capture image"));
      }
    });
  };

  const handleToggleScan = () => {
    setIsScanning((prev) => !prev);
    if (!isScanning) {
      setResult("");
    }
  };

  const formatResult = (result: string) => {
    try {
      const [dept, , name, time] = result.split("-");
      const date = new Date(time);
      return `${dept} - ${name} - ${date.toLocaleString("vi-VN")}`;
    } catch (error) {
      console.error("Error formatting result:", error);
      return "Mã QR không hợp lệ";
    }
  };

  return (
    <Card className="w-full max-w-full mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl overflow-hidden">
      {!result && (
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-muted-foreground text-center">
            Vui lòng đưa mã QR vào gần camera để có thể thực hiện quét
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-4 sm:p-6 space-y-6">
        {!result ? (
          <div className="flex flex-col items-center justify-between gap-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden">
              {isLoading ? (
                <div className="w-full h-full bg-background flex items-center justify-center">
                  <Loader2 className="size-28 text-primary animate-spin" />
                </div>
              ) : isScanning ? (
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: "environment",
                  }}
                  mirrored={true}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-background flex items-center justify-center">
                  <Camera className="size-28 text-muted-foreground" />
                </div>
              )}
              {isScanning && (
                <video
                  ref={zxingRef}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                  }}
                />
              )}
            </div>

            <div className="flex justify-center w-full">
              <Button
                onClick={handleToggleScan}
                disabled={isLoading}
                className={`text-lg sm:text-xl font-semibold px-6 py-4 sm:px-8 sm:py-6 w-full ${
                  isScanning
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-primary hover:bg-primary/90"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading
                  ? "Đang khởi động camera..."
                  : isScanning
                  ? "Tạm dừng quét"
                  : "Bắt đầu quét"}
              </Button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm flex gap-4 sm:gap-6 flex-col items-center justify-center w-full"
          >
            <Alert className="mt-2 p-4 sm:p-6 shadow-sm space-y-2 border-2 w-full">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <AlertTitle className="text-lg sm:text-xl font-semibold text-primary">
                  Quét QR thành công
                </AlertTitle>
              </div>
              <AlertDescription className="text-lg font-semibold text-muted-foreground">
                Đã quét QR và liên lạc tới bên cần hẹn thành công. Quý khách vui
                lòng đợi nhân viên tiếp đón.
              </AlertDescription>
            </Alert>
            <div className="w-full space-y-2">
              <h2 className="font-semibold text-primary text-lg sm:text-xl">
                Kết quả quét
              </h2>
              <p className="text-secondary-foreground text-base sm:text-lg font-semibold break-words">
                {formatResult(result)}
              </p>
            </div>
            <Button
              onClick={handleToggleScan}
              className="w-full text-lg sm:text-xl font-semibold px-6 py-4 sm:px-8 sm:py-6"
            >
              Quét lại
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentChecking;
