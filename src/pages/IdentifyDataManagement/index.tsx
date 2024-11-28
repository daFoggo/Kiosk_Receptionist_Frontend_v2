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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getIdentifyDataIp } from "@/utils/ip";
import { IIdentifyDataManagement } from "@/models/IdentifyDataManage/type";
import columns from "@/models/IdentifyDataManage/columns";
import { Button } from "@/components/ui/button";
import StatisticBlock from "@/components/StatisticBlock";
import { Users } from "lucide-react";

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
      setIdentifyData(response.data.payload);
      toast.success("Lấy dữ liệu thành công");
    } catch (error) {
      toast.error("Lấy dữ liệu thất bại");
      console.error("Error getting user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col gap-4 mt-2">
        <h1 className="font-semibold text-lg sm:text-xl">Dữ liệu nhận diện</h1>

        {isLoading ? (
          <div>Đang tải dữ liệu...</div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="w-full grid grid-cols-4 gap-4">
              <StatisticBlock
                icon={<Users className="size-4" />}
                title="Tổng số"
                value={identifyData.length.toString()}
                description="người dùng đã xác nhận dữ liệu"
              />
            </div>
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
        )}
      </div>
    </div>
  );
};

export default IdentifyDataManagement;
