import { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useWebsocket } from "@/contexts/websocket-context";
import { convertFormKey } from "@/utils/Helper/VerifyCCCD";
import { getClassIp, getDepartmentIp, updateIdentifyDataIp } from "@/utils/ip";
import { extractedFields, captureSteps } from "./constant";
import { ICCCDData } from "@/models/websocket-context";
import {
  TRole,
  IFormData,
  IClass,
  IVerifyCCCDProps,
} from "@/models/verify-cccd";
import { IDepartment } from "@/models/department-list";

const VerifyCCCD = ({ onClose }: IVerifyCCCDProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const webcamRef = useRef<Webcam>(null);
  const { register, handleSubmit, setValue, watch, reset } = useForm<IFormData>(
    {
      defaultValues: {
        role: "",
      },
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const role = watch("role");
  const { cccdData, resetCCCDData } = useWebsocket();
  const [classData, setClassData] = useState<IClass[]>([]);
  const [departmentData, setDepartmentData] = useState<IDepartment[]>([]);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  useEffect(() => {
    handleGetClassData();
    handleGetDepartmentData();
  }, []);

  useEffect(() => {
    if (cccdData && step === 5) {
      extractedFields.forEach((field) => {
        setValue(
          field.formKey as keyof IFormData,
          cccdData[field.key as keyof ICCCDData] || ""
        );
      });
    }
  }, [cccdData, step, setValue]);

  const handleGetClassData = async () => {
    try {
      const response = await axios.get(getClassIp);
      setClassData(response.data.payload);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy dữ liệu lớp học");
      console.error("Error getting class data: ", error);
    }
  };

  const handleGetDepartmentData = async () => {
    try {
      const response = await axios.get(getDepartmentIp);
      setDepartmentData(response.data.payload);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy dữ liệu phòng ban");
      console.error("Error getting department data: ", error);
    }
  };

  const resetForm = useCallback(() => {
    reset();
    setCapturedImages([]);
    setSelectedDepartment("");
    extractedFields.forEach((field) => {
      setValue(field.formKey as keyof IFormData, "");
    });
    setStep(0);
  }, [reset, setValue]);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages((prev) => [...prev, imageSrc]);
      if (capturedImages.length < 2) {
        setStep((prev) => prev + 1);
      } else {
        setStep(5);
      }
    }
  }, [capturedImages]);

  const handleRoleSelect = (selectedRole: TRole) => {
    setValue("role", selectedRole);
    setStep(selectedRole === "guest" ? 2 : 1);
  };

  const handleBack = () => {
    if (step > 2 && step <= 4) {
      setCapturedImages((prev) => prev.slice(0, -1));
    }

    if (step === 1) {
      reset({
        role: "",
      });
      setStep(0);
      return;
    }

    if (role === "guest" && step === 2) {
      reset({
        role: "",
      });
      setStep(0);
      return;
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
      ...(role !== "guest" && { department_code: selectedDepartment }),
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
              {t("verify.step1.title")}
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
                <span>{t("verify.step1.guest")}</span>
              </Label>
              <Label className="flex flex-col items-center space-y-2 cursor-pointer text-xl">
                <RadioGroupItem value="student" className="sr-only" />
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-12 h-12 text-primary" />
                </div>
                <span>{t("verify.step1.student")}</span>
              </Label>
              <Label className="flex flex-col items-center space-y-2 cursor-pointer text-xl">
                <RadioGroupItem value="staff" className="sr-only" />
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-12 h-12 text-primary" />
                </div>
                <span>{t("verify.step1.staff")}</span>
              </Label>
            </RadioGroup>
          </Card>
        );
      case 1:
        return (
          <Card className="py-6 px-12 space-y-6 rounded-2xl">
            <h2 className="text-3xl font-bold text-center">
              {role === "student" ? "Chọn lớp" : "Chọn phòng ban"}
            </h2>
            <Select
              onValueChange={setSelectedDepartment}
              value={selectedDepartment}
            >
              <SelectTrigger className="text-xl font-semibold">
                <SelectValue
                  placeholder={`Chọn ${
                    role === "student" ? "lớp hành chính" : "phòng ban"
                  }`}
                />
              </SelectTrigger>
              <SelectContent>
                {(role === "student" ? classData : departmentData)?.map(
                  (item) => (
                    <SelectItem
                      key={item.id}
                      value={item.id.toString()}
                      className="text-xl font-semibold"
                    >
                      {role === "student"
                        ? (item as IClass)?.ten_lop_hanh_chinh
                        : (item as IDepartment)?.ten_phong_ban}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <div className="flex space-x-6 font-semibold text-xl">
              <Button onClick={handleBack} variant="outline" className="p-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("verify.back")}
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="flex-1 p-6"
                disabled={!selectedDepartment}
              >
                {t("verify.next")}
              </Button>
            </div>
          </Card>
        );
      case 2:
      case 3:
      case 4:
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
              <h3 className="text-3xl">{captureSteps[step - 2]?.label}</h3>
              <p className="text-xl text-muted-foreground">
                {captureSteps[step - 2]?.instruction}
              </p>
            </div>
            <div className="flex space-x-6 font-semibold text-xl">
              <Button onClick={handleBack} variant="outline" className="p-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("verify.back")}
              </Button>
              <Button onClick={capturePhoto} className="p-6">
                <Camera className="mr-2 h-4 w-4" />
                {t("verify.capture")}
              </Button>
            </div>
          </>
        );
      case 5:
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
              <Button onClick={handleBack} variant="outline" className="p-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("verify.back")}
              </Button>
              <Button
                onClick={() => setStep(6)}
                className="flex-1 p-6"
                disabled={extractedFields.some(
                  (field) => !watch(field.formKey as keyof IFormData)
                )}
              >
                {t("verify.confirm")}
              </Button>
            </div>
          </motion.div>
        );
      case 6:
        return (
          <motion.div
            className="w-full max-w-md space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center space-y-2 font-semibold">
              <h2 className="text-3xl text-center">
                {t("verify.step4.title")}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t("verify.step4.description")}
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
            {selectedDepartment && (
              <div className="space-y-2">
                <Label className="text-xl font-semibold text-muted-foreground">
                  {role === "student" ? "Lớp hành chính" : "Phòng ban"}
                </Label>
                <Input
                  value={
                    role === "student"
                      ? classData.find(
                          (cls) => cls.id.toString() === selectedDepartment
                        )?.ten_lop_hanh_chinh
                      : departmentData.find(
                          (dept) => dept.id.toString() === selectedDepartment
                        )?.ten_phong_ban
                  }
                  readOnly
                  className="text-lg font-semibold"
                />
              </div>
            )}
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
              <Button onClick={handleBack} variant="outline" className="p-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("verify.back")}
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
      <Progress value={(step / 6) * 100} className="w-full max-w-md" />
      {renderStep()}
    </Card>
  );
};

export default VerifyCCCD;
