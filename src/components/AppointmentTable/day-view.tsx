import AppointmentCard from "@/components/AppointmentCard";
import { IAppointment } from "@/models/appointment-table";
import { differenceInMinutes, format, isSameDay, parseISO, startOfDay } from "date-fns";
import { vi } from "date-fns/locale";

const DayView = ({ date, appointments }: { date: Date; appointments: IAppointment[] }) => {
  const hours = Array.from({ length: 13 }, (_, i) => i + 7);

  const getAppointmentsForDay = () => {
    return appointments.filter((apt) => isSameDay(parseISO(apt.ngay_gio_bat_dau), date));
  };

  const calculateAppointmentPosition = (appointment: IAppointment) => {
    const startTime = parseISO(appointment.ngay_gio_bat_dau);
    const endTime = parseISO(appointment.ngay_gio_ket_thuc);
    const dayStart = startOfDay(date).setHours(7);
    const top = (differenceInMinutes(startTime, dayStart) / 60) * 100; 
    const height = (differenceInMinutes(endTime, startTime) / 60) * 100;
    return { top, height };
  };

  return (
    <div className="relative">
      <div className="sticky top-0 left-0 right-0 z-10 bg-background p-2">
        <div className="text-center font-semibold text-primary">
          {format(date, "EEEE, dd/MM", { locale: vi })}
        </div>
      </div>
      <div className="grid grid-cols-[60px_1fr] gap-2">
        <div className="space-y-[88px] pt-2 text-xs text-muted-foreground">
          {hours.map((hour) => (
            <div key={hour}>{`${hour}:00`}</div>
          ))}
        </div>
        <div className="relative" style={{ height: `${hours.length * 100}px` }}>
          {hours.map((hour) => (
            <div
              key={hour}
              className="absolute w-full border-t border-muted"
              style={{ top: `${(hour - 7) * 100}px`, height: "100px" }}
            />
          ))}
          {getAppointmentsForDay().map((apt) => {
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
    </div>
  );
};

export default DayView;
