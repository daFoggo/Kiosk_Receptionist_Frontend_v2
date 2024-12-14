import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import QRCode from "react-qr-code";
import {
  Clock,
  MapPin,
  User,
  Download,
  CalendarOff,
  CalendarCheck2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { IAppointmentCardProps } from "@/models/appointment-table";
import { format, parseISO } from "date-fns";
import { getStatusColor } from "@/utils/Helper/appointment-table";

const AppointmentCard = ({
  appointment,
  style,
}: IAppointmentCardProps & { style?: React.CSSProperties }) => {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  
  useEffect(() => {
    handleGetQrCode();
  }, []);

  const form = useForm({
    defaultValues: {
      id: appointment.id,
      muc_dich: appointment.muc_dich,
      ngay_gio_bat_dau: appointment.ngay_gio_bat_dau,
      ngay_gio_ket_thuc: appointment.ngay_gio_ket_thuc,
      dia_diem: appointment.dia_diem,
      trang_thai: appointment.trang_thai,
      ghi_chu: appointment.ghi_chu,
      nguoi_duoc_hen: appointment?.nguoi_duoc_hen || [],
    },
  });

  const handleGetQrCode = async () => {
    try {
      const response = await axios.get(`...?id=${appointment.id}`);

      if (response.data.success) {
        setQrCodeData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getTemporaryQR = () => {
    const qrData = {
      id: appointment.id,
      purpose: appointment.muc_dich,
      startTime: appointment.ngay_gio_bat_dau,
      endTime: appointment.ngay_gio_ket_thuc,
      location: appointment.dia_diem,
    };
    return JSON.stringify(qrData);
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
        className="w-[95%] h-[95%] sm:h-auto rounded-lg sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>{appointment.muc_dich}</DialogTitle>
          <DialogDescription>Thông tin chi tiết lịch hẹn</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col-reverse sm:flex-row gap-6 justify-between">
          {/* Info */}
          <Form {...form}>
            <form className="space-y-6 flex-1">
              <FormField
                name="trang_thai"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Badge
                      className={`${getStatusColor(
                        appointment.trang_thai
                      )} ml-2`}
                    >
                      {field.value}
                    </Badge>
                  </FormItem>
                )}
              />
              <FormField
                name="nguoi_duoc_hen"
                render={({ field }) => {
                  return (
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
                              ? `Đã chọn ${field.value?.length} người`
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
                                      {person.cccd_id && (
                                        <span className="text-xs text-muted-foreground">
                                          CCCD: {person.cccd}
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
                  );
                }}
              />
              <FormField
                name="ngay_gio_bat_dau"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày giờ bắt đầu</FormLabel>
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
                    <FormLabel>Ngày giờ kết thúc</FormLabel>
                    <Input
                      {...field}
                      value={format(parseISO(field.value), "dd/MM/yyyy HH:mm")}
                      readOnly
                    />
                  </FormItem>
                )}
              />
              <FormField
                name="dia_diem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa điểm</FormLabel>
                    <Input {...field} readOnly />
                  </FormItem>
                )}
              />
              <FormField
                name="ghi_chu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <Input {...field} readOnly />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <Separator orientation="vertical" className="hidden sm:block" />

          {/* QR Code Section */}
          <div className="flex flex-col items-center gap-6 sm:w-2/5">
            <Card className="w-full h-full">
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-primary rounded-lg blur-sm opacity-25 group-hover:opacity-40 transition duration-300" />
                  <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    {/* Display QR code from API*/}
                    {/* <img
                      src={getQRCodeUrl()}
                      alt="QR Code"
                      className="w-full h-auto"
                    /> */}
                    <div className="bg-white p-2 rounded-lg">
                      <Dialog>
                        <DialogTrigger asChild>
                          <QRCode
                            value={getTemporaryQR()}
                            size={180}
                            style={{
                              height: "auto",
                              maxWidth: "100%",
                              width: "100%",
                            }}
                            viewBox={`0 0 256 256`}
                            className="dark:bg-white cursor-pointer"
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
                          <div className="p-6">
                            <QRCode
                              value={getTemporaryQR()}
                              size={180}
                              style={{
                                height: "auto",
                                maxWidth: "100%",
                                width: "100%",
                              }}
                              viewBox={`0 0 256 256`}
                              className="dark:bg-white"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div className="font-semibold">QR lịch hẹn</div>
                  <div className="text-sm text-muted-foreground">
                    Scan mã QR này tại Kiosk để có thể liên hệ với bên cần hẹn
                    khi bạn đến.
                  </div>
                </div>

                <Button
                  className="font-semibold"
                  icon={<Download className="w-4 h-4" />}
                >
                  Tải xuống
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <DialogFooter className="mt-6 flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="font-semibold"
                icon={<CalendarOff className="h-4 w-4" />}
              >
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="font-semibold"
                variant="default"
                icon={<CalendarCheck2 className="h-4 w-4" />}
              >
                Đánh dấu đã hoàn thành
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Bạn có chắc chắn muốn đánh dấu lịch hẹn này là đã hoàn thành
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentCard;
