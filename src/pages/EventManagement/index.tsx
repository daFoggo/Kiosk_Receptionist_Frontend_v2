"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { isAfter, parseISO } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { useForm } from "react-hook-form";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getEventsIp,
  createEventIp,
  putEventIp,
  deleteEventIp,
} from "@/utils/ip";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import ReuseBreadcrumb from "@/components/ReuseBreadcrumb";
import { Separator } from "@/components/ui/separator";

import { IEventManagement, IFormData } from "@/models/EventManagement/type";
import createColumns from "@/models/EventManagement/columns";

const timeZone = "Asia/Ho_Chi_Minh";

export default function Component() {
  const [isLoading, setIsLoading] = useState(false);
  const [eventData, setEventData] = useState<IEventManagement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IEventManagement | null>(
    null
  );
  const form = useForm<IFormData>({
    defaultValues: {
      name: "",
      start_time: toZonedTime(new Date(), timeZone),
      end_time: toZonedTime(new Date(), timeZone),
      location: "",
    },
  });

  useEffect(() => {
    getEventData();
  }, []);

  const getEventData = async () => {
    try {
      const response = await axios.get(getEventsIp, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEventData(response.data);
      toast.success("Lấy dữ liệu thành công");
    } catch (error) {
      toast.error("Lấy dữ liệu thất bại");
      console.error("Error getting event data:", error);
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    form.reset({
      name: "",
      start_time: toZonedTime(new Date(), timeZone),
      end_time: toZonedTime(new Date(), timeZone),
      location: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event: IEventManagement) => {
    setEditingEvent(event);
    form.reset({
      name: event.name,
      start_time: toZonedTime(parseISO(event.start_time), timeZone),
      end_time: toZonedTime(parseISO(event.end_time), timeZone),
      location: event.location,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = async (event: IEventManagement) => {
    try {
      await axios.delete(`${deleteEventIp}/${event.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Xóa sự kiện thành công");
      getEventData();
    } catch (error) {
      toast.error("Xóa sự kiện thất bại");
      console.error("Error deleting event:", error);
    }
  };

  const onSubmit = async (data: IFormData) => {
    if (isAfter(data.start_time, data.end_time)) {
      toast.error("Thời gian kết thúc phải sau thời gian bắt đầu");
      return;
    }

    const adjustedData = {
      ...data,
      start_time: formatInTimeZone(
        data.start_time,
        timeZone,
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      end_time: formatInTimeZone(
        data.end_time,
        timeZone,
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
    };

    try {
      if (editingEvent) {
        await axios.put(`${putEventIp}/${editingEvent.id}`, adjustedData);
        toast.success("Cập nhật sự kiện thành công");
      } else {
        await axios.post(createEventIp, adjustedData);
        toast.success("Thêm sự kiện thành công");
      }
      setIsDialogOpen(false);
      getEventData();
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Thêm sự kiện thất bại");
    }
  };

  const columns = createColumns({
    handleEditEvent,
    handleDeleteEvent,
  });

  const table = useReactTable({
    data: eventData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="space-y-2 py-3 px-4 sm:p-0 sm:py-4">
        <ReuseBreadcrumb
          origin={{ name: "Chính", link: "/admin/identify-data" }}
          pageList={[
            { name: "Quản lý sự kiện", link: "/admin/event-management" },
          ]}
        />
        <h1 className="font-semibold text-lg sm:text-xl">Quản lý sự kiện</h1>
      </div>
      <Separator className="my-1 sm:my-2" />

      <div className="p-4">
        <Button onClick={handleAddEvent} className="mb-4">
          Tạo sự kiện
        </Button>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trang trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Trang sau
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[90%] rounded-xl sm:w-full">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Tên sự kiện không được để trống" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sự kiện</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tên sự kiện" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_time"
                rules={{ required: "Thời gian bắt đầu không được để trống" }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Thời gian bắt đầu</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={(date: any) =>
                          field.onChange(toZonedTime(date, timeZone))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                rules={{ required: "Thời gian kết thúc không được để trống" }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Thời gian kết thúc</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={(date: any) =>
                          field.onChange(toZonedTime(date, timeZone))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                rules={{ required: "Địa điểm không được để trống" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa điểm</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập địa điểm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  onClick={() => {
                    form.reset();
                    setIsDialogOpen(false);
                  }}
                  variant="outline"
                >
                  Hủy
                </Button>
                <Button type="submit">
                  {editingEvent ? "Cập nhật" : "Thêm"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
