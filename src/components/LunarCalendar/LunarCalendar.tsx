;
import { SolarDate } from "@nghiavuive/lunar_date_vi";
import { useState, useEffect } from "react";
import { format } from "date-fns";
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
import { Card, CardContent, CardTitle } from "../ui/card";

const LunarCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [startOfWeek, setStartOfWeek] = useState(new Date());
  const today = new Date();
  const weekDays = ["Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "CN"];

  useEffect(() => {
    const updatedStartOfWeek = new Date(date);
    const dayOfWeek = date.getDay();
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    updatedStartOfWeek.setDate(date.getDate() + offset);
    setStartOfWeek(updatedStartOfWeek);
  }, [date]);

  // Handlers
  const handleSelectDate = (selectedDate: Date | undefined) => {
    const today = new Date();

    if (selectedDate?.toDateString() === date?.toDateString()) {
      setDate(today);
    } else {
      setDate(selectedDate || today);
    }
  };

  // Render Functions
  const renderCalendar = () => {
    return weekDays.map((day, index) => {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + index);

      const solarDate = new SolarDate(currentDate);
      const lunarDate = solarDate.toLunarDate();

      const isToday = currentDate.toDateString() === today.toDateString();

      return (
        <div
          key={index}
          className={`flex flex-col items-center gap-2 py-2 ${
            isToday ? "bg-primary" : "bg-secondary"
          } rounded-2xl`}
        >
          <div
            className={`text-xl font-semibold pb-2 border-b-2 ${
              isToday ? "text-white" : ""
            }`}
          >
            {day}
          </div>
          <div
            className={`text-3xl font-bold px-2 py-1 text-center ${
              isToday ? "text-white" : ""
            }`}
          >
            {currentDate.getDate()}
          </div>
          <div
            className={`text-base font-semibold ${
              isToday ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {lunarDate.get().day} AL
          </div>
        </div>
      );
    });
  };

  return (
    <Card className="p-4 rounded-3xl h-full">
      <div className="flex justify-between items-center mb-4">
        <CardTitle className="text-2xl font-semibold">Lịch</CardTitle>
        <div className="flex items-center justify-between">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-fit justify-start text-left font-semibold rounded-xl text-xl ",
                  !date && "text-muted-foreground"
                )}
                icon={<CalendarIcon />}
              >
                {date &&
                  format(date, "MMMM", { locale: vi }).charAt(0).toUpperCase() +
                    format(date, "MMMM", { locale: vi }).slice(1)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelectDate}
                initialFocus
                className="text-3xl"
                locale={vi}
                classNames={{
                  day_selected:
                    "bg-primary text-white hover:bg-primary hover:text-white",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <CardContent className="p-0 grid grid-cols-7 gap-6">
        {renderCalendar()}
      </CardContent>
    </Card>
  );
};

export default LunarCalendar;
