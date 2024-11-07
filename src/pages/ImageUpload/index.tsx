import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader2, MoveRight, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ParticlesBackground from "@/components/ui/particles-background";
import { toast } from "sonner";
import { Toaster } from "sonner";
import axios from "axios";
import { updateIdentifyDataIp } from "@/utils/ip";
import { IFormData } from "@/models/ImageUpload/type";

//step 1
const ImageUploadStep = ({
  uploadedImages,
  handleDragOver,
  handleDrop,
  handleFileInput,
  removeImage,
  setCurrentStep,
  setIsDialogOpen,
}: any) => (
  <div className="space-y-4">
    <DialogHeader>
      <DialogTitle>Tải lên 1 - 3 hình ảnh chân dung</DialogTitle>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground text-left">
          <span className="font-semibold">Các lưu ý khi chọn ảnh</span>
        </p>
        <ul className="text-left list-disc list-inside text-sm text-muted-foreground space-y-2">
          <li>
            Chụp ảnh chân dung, không che khuôn mặt, không đeo khẩu trang, đeo
            kính khi chụp
          </li>
          <li>Chụp ảnh tại khu vực có ánh sáng tốt, không quá sáng, quá tối</li>
          <li>Chụp ảnh rõ nét, không bị mờ, không bị rung</li>
          <li>
            Vì có 3 ảnh nên bạn hãy chụp với 3 vị trí: Trước - trái - phải
          </li>
          <li>
            Các thông tin hình ảnh và thông tin cá nhân của bạn sẽ được bảo mật
          </li>
        </ul>
      </div>
    </DialogHeader>
    <div
      className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      {uploadedImages.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {uploadedImages.map((image: any, index: number) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt={`Đã tải ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-1 right-1 bg-base bg-background rounded-full p-1"
                aria-label={`Remove image ${index + 1}`}
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {uploadedImages.length < 3 && (
            <div className="flex items-center justify-center border-2 border-dashed rounded-md h-32">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Kéo và thả hoặc nhấp để chọn hình ảnh
          </p>
        </div>
      )}
      <input
        id="file-input"
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileInput}
      />
    </div>
    <div className="flex justify-end gap-4 mt-4">
      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
        Hủy
      </Button>
      <Button
        onClick={() => setCurrentStep(2)}
        disabled={uploadedImages.length === 0}
      >
        Tiếp tục
      </Button>
    </div>
  </div>
);

// step 2
const InfoFormStep = ({
  control,
  handleSubmit,
  errors,
  setCurrentStep,
  isSubmitting,
}: any) => (
  <>
    <DialogHeader>
      <DialogTitle>Thông tin bổ sung</DialogTitle>
      <DialogDescription>Vui lòng điền các thông tin sau.</DialogDescription>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Họ và tên
        </Label>
        <div className="col-span-3">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Tên là bắt buộc" }}
            render={({ field }) => (
              <Input {...field} placeholder="Nhập tên của bạn" />
            )}
          />
          {errors.name && (
            <p className="text-destructive text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="identity_code" className="text-right">
          Mã CCCD
        </Label>
        <div className="col-span-3">
          <Controller
            name="identity_code"
            control={control}
            rules={{ required: "Mã CCCD là bắt buộc" }}
            render={({ field }) => (
              <Input {...field} placeholder="Nhập mã CCCD của bạn" />
            )}
          />
          {errors.identity_code && (
            <p className="text-destructive text-sm mt-1">
              {errors.identity_code.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role" className="text-right">
          Vai trò
        </Label>
        <div className="col-span-3">
          <Controller
            name="role"
            control={control}
            rules={{ required: "Vai trò là bắt buộc" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Sinh viên</SelectItem>
                  <SelectItem value="officer">Cán bộ</SelectItem>
                  <SelectItem value="guest">Khách</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && (
            <p className="text-destructive text-sm mt-1">
              {errors.role.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="dob" className="text-right">
          Ngày sinh
        </Label>
        <div className="col-span-3 grid grid-cols-3 gap-2">
          <Controller
            name="dobDay"
            control={control}
            rules={{ required: "Ngày sinh là bắt buộc" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Ngày" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <SelectItem
                      key={day}
                      value={day.toString().padStart(2, "0")}
                    >
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="dobMonth"
            control={control}
            rules={{ required: "Tháng sinh là bắt buộc" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Tháng" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem
                      key={month}
                      value={month.toString().padStart(2, "0")}
                    >
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="dobYear"
            control={control}
            rules={{ required: "Năm sinh là bắt buộc" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Năm" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: 100 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.dobDay && (
            <p className="text-destructive text-sm mt-1">
              {errors.dobDay.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="gender" className="text-right">
          Giới tính
        </Label>
        <div className="col-span-3">
          <Controller
            name="gender"
            control={control}
            rules={{ required: "Giới tính là bắt buộc" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nam">Nam</SelectItem>
                  <SelectItem value="nu">Nữ</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && (
            <p className="text-destructive text-sm mt-1">
              {errors.gender.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(1)}
        >
          Quay lại
        </Button>
        <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý
            </>
          ) : (
            "Xác nhận"
          )}
        </Button>
      </div>
    </form>
  </>
);

// main
const ImageUpload = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormData>({
    defaultValues: {
      name: "",
      identity_code: "",
      role: "",
      dobDay: "",
      dobMonth: "",
      dobYear: "",
      gender: "",
    },
  });

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    addImages(files);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        addImages(files);
      }
    },
    []
  );

  const addImages = useCallback((files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setUploadedImages((prev) => {
      const newImages = [...prev, ...imageFiles].slice(0, 3);
      return newImages;
    });
  }, []);

  const removeImage = useCallback((index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // submit data
  const onSubmit = useCallback(
    (data: IFormData) => {
      // convert image to base64
      const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      };

      const submitData = async () => {
        const formattedDob = `${data.dobDay}/${data.dobMonth}/${data.dobYear}`;
        const base64Images = await Promise.all(
          uploadedImages.map(convertToBase64)
        );

        const formattedData = {
          b64_img: base64Images,
          cccd: {
            "Identity Code": data.identity_code,
            Name: data.name,
            DOB: formattedDob,
            Gender: data.gender,
          },
          role: data.role,
        };

        try {
          setIsSubmitting(true);
          await axios.post(updateIdentifyDataIp, formattedData);
          toast.success("Đã tải ảnh thành công");
          localStorage.setItem("isUploaded", "true");
          localStorage.setItem("userName", formattedData.cccd.Name);
          localStorage.setItem("gender", formattedData.cccd.Gender);
        } catch (error) {
          console.error("Error submitting form:", error);
          toast.error("Đã xảy ra lỗi khi tải ảnh");
        } finally {
          setIsSubmitting(false);
          setIsDialogOpen(false);
          setCurrentStep(1);
          setUploadedImages([]);
          reset();
        }
      };

      submitData();
    },
    [uploadedImages, reset]
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      <ParticlesBackground />
      <main className="flex-grow relative z-10 flex justify-center items-center p-1 sm:p-0">
        {localStorage.getItem("isUploaded") ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-background rounded-lg p-4 sm:p-8 flex flex-col items-center gap-4"
          >
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center">
              Cảm ơn người dùng {localStorage.getItem("userName")} đã đóng góp
            </h1>
            <p className="font-medium text-sm sm:text-lg text-center">
              Sự giúp đỡ của bạn sẽ giúp chúng mình hoàn thiện sản phẩm tốt hơn
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col text-center"
            >
              <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-2 sm:mb-4">
                Tải lên hình ảnh của bạn
              </h1>
              <p className="font-medium text-sm  md:text-lg max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                Mỗi hình ảnh của bạn sẽ giúp chúng mình cải thiện được khả năng
                nhận diện của trợ lý ảo
              </p>
            </motion.div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button className="flex items-center gap-2 justify-between px-6 py-3">
                    <p>Bắt đầu tải ảnh</p>
                    <MoveRight />
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent
                className="max-w-[98%] rounded-xl sm:rounded-2xl sm:max-w-[35%]"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                {currentStep === 1 ? (
                  <ImageUploadStep
                    uploadedImages={uploadedImages}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    handleFileInput={handleFileInput}
                    removeImage={removeImage}
                    setCurrentStep={setCurrentStep}
                    setIsDialogOpen={setIsDialogOpen}
                  />
                ) : (
                  <InfoFormStep
                    control={control}
                    handleSubmit={handleSubmit(onSubmit)}
                    errors={errors}
                    setCurrentStep={setCurrentStep}
                    isSubmitting={isSubmitting}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}
        <Toaster position="top-center" />
      </main>
    </div>
  );
};

export default ImageUpload;
