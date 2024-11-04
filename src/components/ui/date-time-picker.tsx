import { formatInTimeZone, toZonedTime} from 'date-fns-tz';
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "./time-picker";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const timeZone = 'Asia/Ho_Chi_Minh';

  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    
    let newDate: Date;
    if (date) {
      const zonedDate = toZonedTime(date, timeZone);
      newDate = new Date(newDay);
      newDate.setHours(zonedDate.getHours(), zonedDate.getMinutes(), zonedDate.getSeconds());
    } else {
      newDate = new Date(newDay);
      const now = new Date();
      newDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    }

    setDate(toZonedTime(newDate, timeZone));
  };

  const handleTimeChange = (newTime: Date | undefined) => {
    if (!newTime) return;
    
    let newDate: Date;
    if (date) {
      const zonedDate = toZonedTime(date, timeZone);
      newDate = new Date(zonedDate);
      newDate.setHours(newTime.getHours(), newTime.getMinutes(), newTime.getSeconds());
    } else {
      newDate = new Date();
      newDate.setHours(newTime.getHours(), newTime.getMinutes(), newTime.getSeconds());
    }

    console.log(newDate);

    setDate(toZonedTime(newDate, timeZone));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-auto justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            formatInTimeZone(date, timeZone, 'PPP HH:mm:ss', { locale: vi })
          ) : (
            <span>Chọn thời gian</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date ? toZonedTime(date, timeZone) : undefined}
          onSelect={handleSelect}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <TimePicker 
            setDate={handleTimeChange} 
            date={date ? toZonedTime(date, timeZone) : undefined} 
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}