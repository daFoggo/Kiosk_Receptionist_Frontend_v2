import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IAppointmentCardProps } from "@/models/appointment-table";
import {
  convertStatusName,
  getStatusColor,
} from "@/utils/Helper/appointment-table";
import { backendIp } from "@/utils/ip";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { CalendarOff, Clock, Download, MapPin, User } from 'lucide-react';
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CreateModifyAppointment from "../CreateModifyAppointment";
import { Textarea } from "../ui/textarea";
const AppointmentCard = ({
  appointment,
  style,
}: IAppointmentCardProps & { style?: React.CSSProperties }) => {
  const form = useForm({
    defaultValues: {
      id: appointment.id,
      muc_dich: appointment.muc_dich || "",
      ngay_gio_bat_dau: appointment.ngay_gio_bat_dau || "",
      ngay_gio_ket_thuc: appointment.ngay_gio_ket_thuc || "",
      dia_diem: appointment.dia_diem || "",
      trang_thai: appointment.trang_thai || "",
      ghi_chu: appointment.ghi_chu || "",
      nguoi_duoc_hen: appointment?.nguoi_duoc_hen || [],
      qr_code: appointment.qr_code || "",
    },
  });

  const handleDownloadQRcode = async () => {
    try {
      const qrCodeUrl = `${backendIp}/${appointment.qr_code}`;
      const response = await axios.get(qrCodeUrl, { responseType: "blob" });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(response.data);
      link.download = `QR_${appointment.id}.png`;
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      toast.success("Tải ảnh QR thành công");
    } catch (error) {
      toast.error("Có lỗi khi tải ảnh QR");
      console.error(error);
    }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`p-2 rounded-lg border ${getStatusColor(
            appointment.trang_thai
          )} mb-2 text-xs md:text-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700`}
          style={style}
        >
          <div className="font-semibold truncate">{appointment.muc_dich}</div>
          <div className="space-y-1 mt-1">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 md:h-4 md:w-4" />
              {format(parseISO(appointment.ngay_gio_bat_dau), "HH:mm")} -
              {format(parseISO(appointment.ngay_gio_ket_thuc), "HH:mm")}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 md:h-4 md:w-4" />
              <span className="truncate">{appointment.dia_diem}</span>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[95%] max-h-[95vh] sm:h-auto rounded-lg sm:max-w-[625px] md:max-w-[820px] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="line-clamp-1">
            {appointment.muc_dich}
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết lịch hẹn</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Info */}
              <div className="md:col-span-2 space-y-4">
                <FormField
                  name="trang_thai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Badge className={`${getStatusColor(appointment.trang_thai)} ml-2`}>
                        {convertStatusName(field.value)}
                      </Badge>
                    </FormItem>
                  )}
                />
                <FormField
                  name="muc_dich"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mục đích hẹn</FormLabel>
                      <Textarea {...field} readOnly className="h-20" />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    name="ngay_gio_bat_dau"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bắt đầu</FormLabel>
                        <Input
                          {...field}
                          value={format(parseISO(field.value), "dd/MM/yyyy HH:mm")}
                          readOnly
                        />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="ngay_gio_ket_thuc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kết thúc</FormLabel>
                        <Input
                          {...field}
                          value={format(parseISO(field.value), "dd/MM/yyyy HH:mm")}
                          readOnly
                        />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  name="dia_diem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa điểm</FormLabel>
                      <Input {...field} readOnly />
                    </FormItem>
                  )}
                />
              </div>

              {/* QR Code */}
              <div className="md:col-span-1">
                <Card className="h-full">
                  <CardContent className="p-4 flex flex-col items-center gap-4">
                    <div className="relative group w-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-primary rounded-lg blur-sm opacity-25 group-hover:opacity-40 transition duration-300" />
                      <div className="relative bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                        <Dialog>
                          <DialogTrigger asChild className="p-0 w-full">
                            <img
                              src={`${backendIp}/${form.getValues("qr_code")}`}
                              alt="QR Code"
                              className="dark:bg-white object-cover w-full h-auto rounded-lg"
                            />
                          </DialogTrigger>
                          <DialogContent
                            onOpenAutoFocus={(e) => e.preventDefault()}
                            className="w-[95%] sm:h-auto rounded-lg"
                          >
                            <DialogHeader>
                              <DialogTitle>QR lịch hẹn</DialogTitle>
                              <DialogDescription>
                                Scan mã QR này tại Kiosk để có thể liên hệ với bên
                                cần hẹn khi bạn đến.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center justify-center">
                              <img
                                src={`${backendIp}/${form.getValues("qr_code")}`}
                                alt="QR Code"
                                className="dark:bg-white w-full"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <Button
                      className="font-semibold w-full"
                      onClick={() => handleDownloadQRcode()}
                    >
                      <Download className="w-4 h-4" />
                      Tải xuống QR
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">Hoặc nhấn vào ảnh QR để mở rộng hơn...</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-6 space-y-4">
              <FormField
                name="nguoi_duoc_hen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người được hẹn</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value?.length > 0
                            ? `Đã hẹn ${field.value?.length} người`
                            : `Chọn người cần hẹn`}
                          <User className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        style={{
                          width: "var(--radix-popper-anchor-width)",
                          maxWidth: "var(--radix-popper-anchor-width)",
                          minWidth: "var(--radix-popper-anchor-width)",
                        }}
                      >
                        <Command className="w-full rounded-lg border">
                          <CommandList>
                            <CommandEmpty>
                              Không có người được hẹn.
                            </CommandEmpty>
                            <CommandGroup heading="Danh sách người được hẹn">
                              {field.value.map((person: any, index: any) => (
                                <CommandItem
                                  key={person.cccd_id || index}
                                  className="flex items-center gap-2 py-2"
                                >
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                    <User className="h-4 w-4 text-primary" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-semibold">
                                      {person.ho_ten}
                                    </span>
                                    {person.email && (
                                      <span className="text-xs text-muted-foreground">
                                        {person.email}
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
                  </FormItem>
                )}
              />
              <FormField
                name="ghi_chu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <Textarea {...field} readOnly className="h-20" />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter className="mt-6 flex justify-between items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="font-semibold"
              >
                <CalendarOff className="h-4 w-4" />
                Hủy lịch hẹn
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Bạn có chắc chắn muốn hủy lịch hẹn này
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này sẽ không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction>Đồng ý</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <CreateModifyAppointment
            mode="edit"
            appointment={appointment}
            buttonStyle="w-auto"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentCard;

