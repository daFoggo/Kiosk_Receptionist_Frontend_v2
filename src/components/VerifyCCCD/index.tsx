import { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";

import {
  Camera,
  Scan,
  ArrowLeft,
  UserCircle2,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useWebsocket } from "@/contexts/WebsocketContext";
import { TRole, IFormData } from "@/models/VerifyCCCD/type";
import { convertFormKey } from "@/utils/Helper/VerifyCCCD";
import { ICCCDData } from "@/models/WebsocketContext/type";
import { extractedFields, captureSteps } from "./constant";
import { updateIdentifyDataIp } from "@/utils/ip";

interface VerifyCCCDProps {
  onClose?: () => void;
}

const VerifyCCCD = ({ onClose }: VerifyCCCDProps) => {
  const [step, setStep] = useState(0);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const webcamRef = useRef<Webcam>(null);
  const { cccdData, resetCCCDData } = useWebsocket();
  const { register, handleSubmit, setValue, watch, reset } = useForm<IFormData>(
    {
      defaultValues: {
        role: "",
      },
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const role = watch("role");

  useEffect(() => {
    if (cccdData && step === 4) {
      extractedFields.forEach((field) => {
        setValue(
          field.formKey as keyof IFormData,
          cccdData[field.key as keyof ICCCDData] || ""
        );
      });
    }
  }, [cccdData, step, setValue]);

  const resetForm = useCallback(() => {
    reset();
    setCapturedImages([]);
    extractedFields.forEach((field) => {
      setValue(field.formKey as keyof IFormData, "");
    });
    setStep(0);
  }, [reset]);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages((prev) => {
        const newImages = [...prev];
        newImages[step - 1] = imageSrc;
        return newImages;
      });

      if (step < 3) {
        setStep((prev) => prev + 1);
      } else {
        setStep(4);
      }
    }
  }, [step]);

  const handleRoleSelect = (selectedRole: TRole) => {
    setValue("role", selectedRole);
    setStep(1);
  };

  const handleBack = () => {
    if (step > 1 && step <= 3) {
      setCapturedImages((prev) => prev.slice(0, -1));
    }
    if (step === 1) {
      setValue("role", "");
    }
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: IFormData) => {
    const formDataWithImages = {
      b64_img: capturedImages,
      cccd: {
        "Identity Code": data.idNumber,
        Name: data.fullName,
        DOB: data.dateOfBirth,
        Gender: data.gender,
      },
      role: data.role,
    };

    try {
      setIsSubmitting(true);
      await axios.post(updateIdentifyDataIp, formDataWithImages);
      toast.success("Xác thực thành công");
      resetForm();
      resetCCCDData();
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast.error("Có lỗi xảy ra khi xác thực");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Card className="py-6 px-12 space-y-6 rounded-2xl">
            <h2 className="text-3xl font-bold text-center">
              Chọn vai trò của bạn
            </h2>
            <RadioGroup
              className="grid grid-cols-3 gap-6"
              value={role}
              onValueChange={handleRoleSelect as (value: string) => void}
            >
              <Label className="flex flex-col items-center space-y-2 cursor-pointer text-xl">
                <RadioGroupItem value="guest" className="sr-only" />
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCircle2 className="w-12 h-12 text-primary" />
                </div>
                <span>Khách</span>
              </Label>
              <Label className="flex flex-col items-center space-y-2 cursor-pointer text-xl">
                <RadioGroupItem value="student" className="sr-only" />
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-12 h-12 text-primary" />
                </div>
                <span>Sinh viên</span>
              </Label>
              <Label className="flex flex-col items-center space-y-2 cursor-pointer text-xl">
                <RadioGroupItem value="staff" className="sr-only" />
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-12 h-12 text-primary" />
                </div>
                <span>Cán bộ</span>
              </Label>
            </RadioGroup>
          </Card>
        );
      case 1:
      case 2:
      case 3:
        return (
          <>
            <div className="relative w-full max-w-md aspect-video bg-background rounded-2xl overflow-hidden shadow-sm">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{
                  facingMode: "user",
                  width: 1080,
                  height: 720,
                }}
                mirrored
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative animate-pulse">
                  <Scan className="w-72 h-72 text-white/80 stroke-[0.75]" />
                  <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent blur-xl" />
                </div>
              </div>
            </div>
            <div className="text-center font-semibold space-y-2">
              <h3 className="text-3xl">{captureSteps[step - 1]?.label}</h3>
              <p className="text-xl text-muted-foreground">
                {captureSteps[step - 1]?.instruction}
              </p>
            </div>
            <div className="flex space-x-6 font-semibold text-xl">
              <Button
                onClick={handleBack}
                variant="outline"
                icon={<ArrowLeft />}
                className="p-6"
              >
                Quay lại
              </Button>
              <Button onClick={capturePhoto} icon={<Camera />} className="p-6">
                Chụp ảnh
              </Button>
            </div>
          </>
        );
      case 4:
        return (
          <motion.div
            className="w-full max-w-md space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {extractedFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label
                  htmlFor={field.formKey}
                  className="text-xl font-semibold text-muted-foreground"
                >
                  {field.label}
                </Label>
                <Input
                  id={field.formKey}
                  {...register(field.formKey as keyof IFormData)}
                  placeholder="Đang chờ nhận dữ liệu..."
                  readOnly
                  className="placeholder:text-base placeholder:font-semibold"
                />
              </div>
            ))}
            <div className="flex space-x-6 font-semibold text-xl">
              <Button
                onClick={handleBack}
                variant="outline"
                icon={<ArrowLeft />}
                className="p-6 "
              >
                Quay lại
              </Button>
              <Button
                onClick={() => setStep(5)}
                className="flex-1 p-6"
                disabled={extractedFields.some(
                  (field) => !watch(field.formKey as keyof IFormData)
                )}
              >
                Xác nhận
              </Button>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            className="w-full max-w-md space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center space-y-2 font-semibold">
              <h2 className="text-3xl text-center">Xác nhận thông tin</h2>
              <p className="text-xl text-muted-foreground">
                Tổng hợp thông tin của bạn từ các bước trên
              </p>
            </div>
            {Object.entries(watch()).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label className="text-xl font-semibold text-muted-foreground">
                  {convertFormKey(key)}
                </Label>
                <Input
                  value={value}
                  readOnly
                  className="text-lg font-semibold"
                />
              </div>
            ))}
            <div className="space-y-2">
              <Label className="text-xl font-semibold text-muted-foreground">
                Ảnh đã chụp
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {capturedImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Captured image ${index + 1}`}
                    className="w-full h-auto rounded-md shadow-sm"
                  />
                ))}
              </div>
            </div>
            <div className="flex space-x-6 font-semibold text-xl">
              <Button
                onClick={handleBack}
                variant="outline"
                icon={<ArrowLeft />}
                className="p-6"
              >
                Quay lại
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="flex-1 p-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="flex flex-col items-center space-y-6 p-6 bg-gradient-to-br bg-primary/10 rounded-2xl">
      <Progress value={(step / 5) * 100} className="w-full max-w-md" />
      {renderStep()}
    </Card>
  );
};

export default VerifyCCCD;
