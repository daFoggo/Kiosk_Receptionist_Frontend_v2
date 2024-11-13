"use client";

import { useState } from "react";
import { useZxing } from "react-zxing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function AppointmentChecking() {
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
    <Card className="w-full max-w-full mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl overflow-hidden">
      <CardContent className="p-4 sm:p-6 space-y-6">
        {!result ? (
          <div className="flex flex-col items-center justify-between gap-4">
            {isScanning ? (
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden">
                <video
                  ref={ref}
                  className="w-full h-full object-cover [transform:scaleX(-1)]"
                />
              </div>
            ) : (
              <div className="aspect-square w-full bg-background rounded-2xl flex items-center justify-center">
                <p className="text-muted-foreground text-lg sm:text-xl font-bold text-center px-4">
                  Camera đang hoạt động bình thường
                </p>
              </div>
            )}

            <div className="flex justify-center w-full">
              {!isScanning ? (
                <Button
                  onClick={handleStartScan}
                  className="text-lg sm:text-xl font-semibold px-6 py-4 sm:px-8 sm:py-6 bg-primary w-full"
                >
                  Bắt đầu quét
                </Button>
              ) : (
                <Button
                  onClick={handleStopScan}
                  className="text-lg sm:text-xl font-semibold px-6 py-4 sm:px-8 sm:py-6 bg-red-500 hover:bg-red-600 w-full"
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
              onClick={handleStartScan}
              className="w-full text-lg sm:text-xl font-semibold px-6 py-4 sm:px-8 sm:py-6"
            >
              Quét lại
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
