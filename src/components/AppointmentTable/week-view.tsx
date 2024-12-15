import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, isSameDay, startOfDay, differenceInMinutes, isToday } from "date-fns";
import { vi } from "date-fns/locale";
import { IAppointment } from "@/models/appointment-table";
import AppointmentCard from "@/components/AppointmentCard";

const WeekView = ({ date, appointments }: { date: Date; appointments: IAppointment[] }) => {
  const weekDays = eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  });
  
  const hours = Array.from({ length: 13 }, (_, i) => i + 7);
  
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt) => isSameDay(parseISO(apt.ngay_gio_bat_dau), day));
  };
  
  const calculateAppointmentPosition = (appointment: IAppointment) => {
    const startTime = parseISO(appointment.ngay_gio_bat_dau);
    const endTime = parseISO(appointment.ngay_gio_ket_thuc);
    const dayStart = startOfDay(startTime).setHours(7);
    const top = (differenceInMinutes(startTime, dayStart) / 60) * 100;
    const height = (differenceInMinutes(endTime, startTime) / 60) * 100;
    return { top, height };
  };
  
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-8 gap-2 min-w-[800px]">
        <div className="sticky left-0 bg-background z-10">
          <div className="h-10" />
          <div className="space-y-[88px] pt-2 text-xs text-muted-foreground">
            {hours.map((hour) => (
              <div key={hour}>{`${hour}:00`}</div>
            ))}
          </div>
        </div>
        {weekDays.map((day) => (
          <div key={day.toString()} className="flex-1">
            <div
              className={`h-10 flex items-center justify-center font-semibold text-sm rounded-lg ${
                isToday(day) ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <div className="text-center">
                <div>{format(day, "EE", { locale: vi })}</div>
                <div>{format(day, "dd")}</div>
              </div>
            </div>
            <div className="relative" style={{ height: `${hours.length * 100}px` }}>
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="absolute w-full border-t border-muted"
                  style={{ 
                    top: `${(hour - 7) * 100}px`, 
                    height: "100px", 
                    borderTopWidth: hour === 7 ? 0 : 1 
                  }}
                />
              ))}
              {getAppointmentsForDay(day).map((apt) => {
                const { top, height } = calculateAppointmentPosition(apt);
                return (
                  <div
                    key={apt.id}
                    className="absolute left-0 right-0 px-1"
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    <AppointmentCard appointment={apt} style={{ height: "100%" }} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;