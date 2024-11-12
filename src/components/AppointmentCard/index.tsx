import { IAppointmentCardProps } from "@/models/AppointmentTable/type";
import { getStatusColor } from "@/utils/Helper/AppointmentTable";
import { format, parseISO } from "date-fns";

import { useForm } from "react-hook-form";
import { Clock, MapPin, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "../ui/badge";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "../ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { PopoverContent } from "@radix-ui/react-popover";

const AppointmentCard = ({
  appointment,
  style,
}: IAppointmentCardProps & { style?: React.CSSProperties }) => {
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
        className="w-[95%] rounded-lg sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px]"
      >
        <DialogHeader>
          <DialogTitle>{appointment.muc_dich}</DialogTitle>
          <DialogDescription>Thông tin chi tiết lịch hẹn</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6">
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
                            ? `Đã chọn ${field.value.length} người`
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
                                  key={person.cccd || index}
                                  className="flex items-center gap-2 py-2"
                                >
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                    <User className="h-4 w-4 text-primary" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {person.name}
                                    </span>
                                    {person.email && (
                                      <span className="text-xs text-muted-foreground">
                                        {person.email}
                                      </span>
                                    )}
                                    {person.cccd && (
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
              name="trang_thai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Badge
                    className={`${getStatusColor(appointment.trang_thai)} ml-2`}
                  >
                    {field.value}
                  </Badge>
                </FormItem>
              )}
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
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentCard;
