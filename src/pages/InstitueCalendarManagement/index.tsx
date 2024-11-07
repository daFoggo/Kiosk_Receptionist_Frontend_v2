;

import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReuseBreadcrumb from "@/components/ReuseBreadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { getInstitueCalendarIp, updateInstitueCalendarIp } from "@/utils/ip";
import {
  IInstitueCalendarManagement,
  IFormData,
} from "@/models/InstitueCalendarManagement/type";
import { columns } from "@/models/InstitueCalendarManagement/columns";

const InstitueCalendarManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [institueCalendar, setInstitueCalendar] = useState<
    IInstitueCalendarManagement[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<IFormData>({
    defaultValues: {
      file: undefined,
    },
  });
  const table = useReactTable({
    data: institueCalendar,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  useEffect(() => {
    getInstitueCalendar();
  }, []);

  const getInstitueCalendar = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(getInstitueCalendarIp);
      setInstitueCalendar(response.data);
      toast.success("Lấy dữ liệu lịch tuần thành công");
    } catch (error) {
      toast.error("Lấy dữ liệu lịch tuần thất bại");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateInstitueCalendar = () => {
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: IFormData) => {
    try {
      const file = data.file[0];
      if (!file) {
        toast.error("Vui lòng chọn một tệp để tải lên");
        return;
      }

      if (
        file.type !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        toast.error("Chỉ chấp nhận tệp .docx");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      console.log(file);

      const response = await axios.post(updateInstitueCalendarIp, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200) {
        throw new Error("Tải lên thất bại");
      }

      toast.success("Tệp đã được tải lên thành công");
      setIsDialogOpen(false);

      getInstitueCalendar();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Đã xảy ra lỗi khi tải lên tệp");
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="space-y-2 py-3 px-4 sm:p-0 sm:py-4">
        <ReuseBreadcrumb
          origin={{ name: "Chính", link: "/admin/identify-data" }}
          pageList={[
            { name: "Lịch công tác viện", link: "/admin/institue-calendar" },
          ]}
        />
        <h1 className="font-semibold text-lg sm:text-xl">Lịch công tác viện</h1>
      </div>
      <Separator className="my-1 sm:my-2" />

      <div className="p-4">
        <Button onClick={handleUpdateInstitueCalendar} className="mb-4">
          Cập nhật lịch tuần
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
        <DialogContent className="w-[90%] rounded-xl sm:w-full" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Tải lên lịch tuần mới</DialogTitle>
            <DialogDescription>Chỉ chấp nhận tệp .docx.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tệp lịch tuần</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".docx"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Tải lên</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstitueCalendarManagement;
