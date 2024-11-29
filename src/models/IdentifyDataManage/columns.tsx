import { ColumnDef } from "@tanstack/react-table";
import { IIdentifyDataManagement } from "./type";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import FilterCol from "@/components/FilterCol";
import { useState } from "react";

const columns: ColumnDef<IIdentifyDataManagement>[] = [
  {
    id: 'stt', 
    header: "STT",
    cell: ({ table, row }) => {
      const filteredRows = table.getFilteredRowModel().rows;
      
      const index = filteredRows.findIndex(
        (filteredRow) => 
          filteredRow.getValue('name') === row.getValue('name') && 
          filteredRow.getValue('cccd_id') === row.getValue('cccd_id')
      );
      
      return index !== -1 ? index + 1 : "";
    }
  },
  {
    accessorKey: "name",
    header: "Họ và tên",
    enableColumnFilter: false,
  },
  {
    accessorKey: "cccd_id",
    header: "Mã căn cước",
    enableColumnFilter: false,
  },
  {
    accessorKey: "role",
    header: ({ column, table }) => {
      const getDisplayValue = (value: string) => {
        if (column.id === "role") {
          switch (value) {
            case "guest":
              return "Khách";
            case "student":
              return "Sinh viên";
            case "officer":
              return "Cán bộ";
            default:
              return value;
          }
        }
        return value;
      };
      return (
        <div className="flex flex-col space-y-2">
          <FilterCol
            title="Vai trò"
            column={column}
            table={table}
            getDisplayValue={getDisplayValue}
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const role = row.getValue("role");
      switch (role) {
        case "guest":
          return "Khách";
        case "student":
          return "Sinh viên";
        case "officer":
          return "Cán bộ";
        default:
          return "Không xác định";
      }
    },
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === "all") return true;
      return row.getValue(columnId) === filterValue;
    },
  },
  {
    accessorKey: "department_name",
    header: ({ column, table }) => (
      <div className="flex flex-col space-y-2">
        <FilterCol title="Mã lớp / phòng ban" column={column} table={table} />
      </div>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === "all") return true;
      return row.getValue(columnId) === filterValue;
    },
  },
  {
    accessorKey: "dob",
    header: "Ngày sinh",
    enableColumnFilter: false,
  },
  {
    accessorKey: "gender",
    header: "Giới tính",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      return gender.charAt(0).toUpperCase() + gender.slice(1);
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "b64",
    header: "Dữ liệu ảnh",
    cell: ({ row }) => {
      const imageData: string[] = row.getValue("b64");
      const [isOpen, setIsOpen] = useState(false);

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-md"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DialogTitle className="text-center">
              Dữ liệu ảnh của {row.getValue("name")}
            </DialogTitle>
            <div className="flex items-center justify-center h-full">
              <Carousel className="w-full max-w-xs">
                <CarouselContent>
                  {imageData?.map((base64, index) => (
                    <CarouselItem key={index}>
                      <img
                        src={base64}
                        alt={`Image ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
    enableColumnFilter: false,
  },
];

export default columns;
