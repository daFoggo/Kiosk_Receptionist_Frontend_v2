import { CalendarPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

const MakeAppointment = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full font-semibold" icon={<CalendarPlus className="h-5 w-5"/>}>
          Đặt lịch hẹn
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo lịch hẹn mới</DialogTitle>
          <DialogDescription>amongus</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MakeAppointment;
