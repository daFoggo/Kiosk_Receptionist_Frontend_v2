import { useState } from "react";
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

const columns: ColumnDef<IIdentifyDataManagement>[] = [
  {
    accessorKey: "name",
    header: "Họ và tên",
  },
  {
    accessorKey: "identity_code",
    header: "Mã căn cước",
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ row }) => {
      let role = row.getValue("role");
      console.log(role);
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
  },
  {
    accessorKey: "dob",
    header: "Ngày sinh",
  },
  {
    accessorKey: "gender",
    header: "Giới tính",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as String;
      return gender.charAt(0).toUpperCase() + gender.slice(1);
    },
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
          <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
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
  },
];

export default columns;
