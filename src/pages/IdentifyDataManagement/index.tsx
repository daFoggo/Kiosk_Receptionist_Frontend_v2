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
import { getIdentifyDataIp } from "@/utils/ip";
import { IIdentifyDataManagement } from "@/models/IdentifyDataManage/type";
import columns from "@/models/IdentifyDataManage/columns";
import { Button } from "@/components/ui/button";

const IdentifyDataManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [identifyData, setIdentifyData] = useState<IIdentifyDataManagement[]>(
    []
  );

  const table = useReactTable({
    data: identifyData,
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
    getIdentifyData();
  }, []);

  const getIdentifyData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(getIdentifyDataIp);
      setIdentifyData(response.data);
      toast.success("Lấy dữ liệu thành công");
    } catch (error) {
      toast.error("Lấy dữ liệu thất bại");
      console.error("Error getting user data:", error);
    } finally {
      setIsLoading(false);
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
            { name: "Dữ liệu nhận diện", link: "/admin/identify-data" },
          ]}
        />
        <h1 className="font-semibold text-lg sm:text-xl">Dữ liệu nhận diện</h1>
      </div>
      <Separator className="my-1 sm:my-2" />

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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  );
};

export default IdentifyDataManagement;
