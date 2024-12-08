"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { vi } from "date-fns/locale";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "sonner";

import { CalendarIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import TimeSelector from "../ui/time-selector";

import { ICreateModifyAppointmentProps } from "@/models/CreateModifyAppointment/type";
import {
  createAppointmentIp,
  getOfficerIp,
  updateAppointmentIp,
} from "@/utils/ip";
import { IOfficer } from "@/models/DepartmentList/type";
import { Checkbox } from "../ui/checkbox";

const formSchema = z.object({
  cccd_nguoi_hen: z.string(),
  cccd_nguoi_duoc_hen: z.array(z.string()).min(1, "Chọn ít nhất 1 người"),
  ngay_gio_bat_dau: z.date(),
  ngay_gio_ket_thuc: z.date(),
  dia_diem: z.string().min(1, "Cần phải nhập địa điểm"),
  muc_dich: z.string().min(1, "Cần phải nhập mục đích"),
  ghi_chu: z.string().optional(),
});

const CreateModifyAppointment = ({
  mode = "create",
  appointment,
  onSuccess,
  trigger,
  officers,
  department,
  convertDepartmentIdToName,
}: ICreateModifyAppointmentProps) => {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [currentCccd, setCurrentCccd] = useState<string | null>(null);
  const [allOfficers, setAllOfficers] = useState<IOfficer[]>([]);
  const [includeAllDepartments, setIncludeAllDepartments] = useState(false);
  const currentOfficerList = includeAllDepartments ? allOfficers : officers;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cccd_nguoi_hen: currentCccd || "",
      cccd_nguoi_duoc_hen:
        mode === "edit" ? appointment?.cccd_nguoi_duoc_hen : [],
      dia_diem: mode === "edit" ? appointment?.dia_diem : "",
      muc_dich: mode === "edit" ? appointment?.muc_dich : "",
      ghi_chu: mode === "edit" ? appointment?.ghi_chu : "",
      ngay_gio_bat_dau:
        mode === "edit"
          ? new Date(appointment?.ngay_gio_bat_dau || "")
          : undefined,
      ngay_gio_ket_thuc:
        mode === "edit"
          ? new Date(appointment?.ngay_gio_ket_thuc || "")
          : undefined,
    },
  });

  useEffect(() => {
    handleGetAllOfficer();
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      const cccdValue =
        mode === "edit" ? appointment?.cccd_nguoi_hen : parsedUser?.username;
      setCurrentCccd(cccdValue);
      form.setValue("cccd_nguoi_hen", parsedUser.username, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.ngay_gio_ket_thuc <= values.ngay_gio_bat_dau) {
      setFormError("Thời gian kết thúc phải sau thời gian bắt đầu");
      return;
    }

    const formattedData = {
      ...values,
      ngay_gio_bat_dau: format(
        values.ngay_gio_bat_dau,
        "yyyy-MM-dd'T'HH:mm:ss"
      ),
      ngay_gio_ket_thuc: format(
        values.ngay_gio_ket_thuc,
        "yyyy-MM-dd'T'HH:mm:ss"
      ),
    };

    try {
      let response;
      if (mode === "edit" && appointment?.id) {
        response = await axios.put(
          `${updateAppointmentIp}/${appointment.id}`,
          formattedData
        );
      } else {
        response = await axios.post(`${createAppointmentIp}`, formattedData);
      }

      if (response.data.success) {
        toast.success("Đặt lịch hẹn thành công");
        setOpen(false);
        form.reset();
        onSuccess?.();
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
        console.error("API Error:", response.data.error);
        setFormError(response.data.error);
      }
    } catch (error) {
      console.error("Error handling appointment:", error);
      setFormError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    const subscription = form.watch(() => setFormError(null));
    return () => subscription.unsubscribe();
  }, [form]);

  const handleGetAllOfficer = async () => {
    const response = await axios.get(getOfficerIp);
    setAllOfficers(response.data.payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full font-semibold">
            {mode === "edit" ? "Chỉnh sửa lịch hẹn" : "Đặt lịch hẹn mới"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95%] rounded-lg sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Chỉnh sửa lịch hẹn" : "Đặt lịch hẹn mới"}
          </DialogTitle>
          <DialogDescription>
            Quý khách vui lòng cung cấp đầy đủ các thông tin bên dưới
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{formError}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-all-departments"
                checked={includeAllDepartments}
                onCheckedChange={(checked) =>
                  setIncludeAllDepartments(!!checked)
                }
              />
              <label
                htmlFor="include-all-departments"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Bao gồm cả phòng ban khác
              </label>
            </div>
            <FormField
              control={form.control}
              name="cccd_nguoi_duoc_hen"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{`Chọn người cần hẹn ( Có thể nhiều người )`}</FormLabel>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value?.length > 0
                            ? `Đã chọn ${field.value.length} người`
                            : `Chọn người cần hẹn`}
                          <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      style={{
                        width: "var(--radix-popper-anchor-width)",
                        maxWidth: "var(--radix-popper-anchor-width)",
                        minWidth: "var(--radix-popper-anchor-width)",
                      }}
                    >
                      <Command className="w-full">
                        <CommandInput
                          placeholder="Tìm người cần hẹn..."
                          className="my-2"
                        />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy người này.</CommandEmpty>
                          <CommandGroup>
                            {currentOfficerList?.map((officer) => (
                              <CommandItem
                                key={officer.cccd_id}
                                onSelect={() => {
                                  const currentValues = field.value || [];
                                  const isSelected =
                                    Array.isArray(currentValues) &&
                                    currentValues.some(
                                      (id) => id === officer.cccd_id
                                    );

                                  const newValue = isSelected
                                    ? currentValues.filter(
                                        (id) => id !== officer.cccd_id
                                      )
                                    : [...currentValues, officer.cccd_id];

                                  form.setValue(
                                    "cccd_nguoi_duoc_hen",
                                    newValue,
                                    {
                                      shouldValidate: true,
                                    }
                                  );
                                }}
                              >
                                <div className="flex items-center">
                                  {officer.ho_ten} - {convertDepartmentIdToName(Number(officer.phong_ban_id))}
                                  {Array.isArray(field.value) &&
                                    field.value.some(
                                      (id) => id === officer.cccd_id
                                    ) && (
                                      <span className="ml-2 text-green-500 font-semibold">
                                        ✓
                                      </span>
                                    )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ngay_gio_bat_dau"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày & Thời gian bắt đầu</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP HH:mm", { locale: vi })
                            ) : (
                              <span>Chọn ngày bắt đầu</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={vi}
                        />
                        <div className="p-3 border-t">
                          <TimeSelector
                            value={
                              field.value ? format(field.value, "HH:mm") : ""
                            }
                            onChange={(time) => {
                              const [hours, minutes] = time.split(":");
                              const newDate = new Date(
                                field.value || new Date()
                              );
                              newDate.setHours(
                                parseInt(hours),
                                parseInt(minutes)
                              );
                              field.onChange(newDate);
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ngay_gio_ket_thuc"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày & Thời gian kết thúc</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP HH:mm", { locale: vi })
                            ) : (
                              <span>Chọn ngày kết thúc</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={vi}
                          initialFocus
                        />
                        <div className="p-3 border-t">
                          <TimeSelector
                            value={
                              field.value ? format(field.value, "HH:mm") : ""
                            }
                            onChange={(time) => {
                              const [hours, minutes] = time.split(":");
                              const newDate = new Date(
                                field.value || new Date()
                              );
                              newDate.setHours(
                                parseInt(hours),
                                parseInt(minutes)
                              );
                              field.onChange(newDate);
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="dia_diem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa điểm</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa điểm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="muc_dich"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mục đích</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mục đích" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ghi_chu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập ghi chú" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              onClick={() => {
                if (!form.formState.isValid) {
                  setFormError(
                    "Vui lòng điền toàn bộ các thông tin chính xác."
                  );
                }
              }}
            >
              Đặt lịch hẹn
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModifyAppointment;
