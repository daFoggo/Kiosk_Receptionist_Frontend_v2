;

import { useState } from "react";
import { useZxing } from "react-zxing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const AppointmentChecking = () => {
  const [result, setResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
      setIsScanning(false);
      sendImageToBackend(result);
    },
    paused: !isScanning,
  });

  const sendImageToBackend = async (result: any) => {
    try {
      const imageData = await getImageDataFromResult(result);
      const response = await fetch("/api/scan-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (response.ok) {
        toast.success("Mã QR đã được xử lý thành công");
      } else {
        throw new Error("Failed to process qr");
      }
    } catch (error) {
      console.error("Failed to process qr:", error);
      toast.error("Có lỗi khi xử lý mã QR");
    }
  };

  const getImageDataFromResult = async (result: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const video = ref.current;
      if (video) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas
          .getContext("2d")
          ?.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          } else {
            reject(new Error("Failed to create blob from canvas"));
          }
        }, "image/jpeg");
      } else {
        reject(new Error("Video element not found"));
      }
    });
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setResult("");
  };

  const handleStopScan = () => {
    setIsScanning(false);
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
    <Card className="flex flex-col justify-center items-center space-y-6 p-6 bg-gradient-to-br bg-primary/10 rounded-2xl">
      <CardContent className="p-6 space-y-6 w-full">
        {!result ? (
          <div className="w-full flex flex-col items-center justify-between gap-4">
            {isScanning ? (
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <video
                  ref={ref}
                  className="w-full h-full object-cover transform]"
                />
              </div>
            ) : (
              <></>
            )}

            <div className="flex justify-center">
              {!isScanning ? (
                <Button
                  onClick={handleStartScan}
                  className="text-xl font-semibold px-8 py-6 bg-primary"
                >
                  Bắt đầu quét
                </Button>
              ) : (
                <Button
                  onClick={handleStopScan}
                  className="text-xl font-semibold px-8 py-6 bg-red-500 hover:bg-red-600"
                >
                  Hủy
                </Button>
              )}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm flex gap-6 flex-col items-center justify-center w-full"
          >
            <Alert className="mt-4 p-6 shadow-sm space-x-6 border-2">
              <CheckCircle className="mt-4 h-8 w-8 text-primary" />
              <AlertTitle className="text-2xl font-semibold text-primary">Quét QR thành công</AlertTitle>
              <AlertDescription className="text-xl font-semibold text-muted-foreground">
                Đã quét QR và liên lạc tới bên cần hẹn thành công. Quý khách vui
                lòng đợi nhân viên tiếp đón.
              </AlertDescription>
            </Alert>
            <h1 className="font-semibold text-primary text-2xl">
              Kết quả quét
            </h1>
            <p className="text-secondary-foreground break-words text-xl font-semibold">
              {formatResult(result)}
            </p>
            <Button
              onClick={handleStartScan}
              className="w-full text-xl font-semibold px-8 py-6"
            >
              Quét lại
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}


export default AppointmentChecking;