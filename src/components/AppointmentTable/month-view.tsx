import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isSameDay, isToday } from "date-fns";
import { IAppointment } from "@/models/appointment-table";
import AppointmentCard from "@/components/AppointmentCard";

const MonthView = ({ date, appointments }: { date: Date; appointments: IAppointment[] }) => {
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });

  return (
    <div className="grid grid-cols-7 gap-2 md:gap-4">
      {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
        <div key={day} className="text-center font-semibold p-1 md:p-2 bg-muted text-xs md:text-sm rounded-lg">
          {day}
        </div>
      ))}

      {daysInMonth.map((day) => {
        const dayAppointments = appointments.filter((apt) =>
          isSameDay(parseISO(apt.ngay_gio_bat_dau), day)
        );

        return (
          <div
            key={day.toString()}
            className={`min-h-[80px] md:min-h-[120px] p-1 md:p-2 border rounded-lg ${
              isToday(day) ? "border-primary" : "border-muted"
            }`}
          >
            <div className="font-semibold mb-1 md:mb-2 text-xs md:text-sm">
              {format(day, "d")}
            </div>
            <div className="space-y-1 overflow-y-auto max-h-[60px] md:max-h-[100px]">
              {dayAppointments.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MonthView;

