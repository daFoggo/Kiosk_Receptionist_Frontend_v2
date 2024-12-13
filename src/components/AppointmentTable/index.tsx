;

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  startOfWeek,
  endOfWeek,
  parseISO,
  isSameDay,
  addDays,
  eachHourOfInterval,
  startOfDay,
  addWeeks,
  addMonths,
  differenceInMinutes,
} from "date-fns";
import { vi } from "date-fns/locale";

import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppointmentCard from "../AppointmentCard";

import { VIEWS } from "./constant";
import { IAppointment } from "@/models/appointment-table";

const DayView = ({
  date,
  appointments,
}: {
  date: Date;
  appointments: IAppointment[];
}) => {
  const hours = eachHourOfInterval({
    start: startOfDay(date).setHours(7),
    end: startOfDay(date).setHours(19),
  });

  const getAppointmentsForDay = () => {
    return appointments.filter((apt) =>
      isSameDay(parseISO(apt.ngay_gio_bat_dau), date)
    );
  };

  const calculateAppointmentPosition = (appointment: IAppointment) => {
    const startTime = parseISO(appointment.ngay_gio_bat_dau);
    const endTime = parseISO(appointment.ngay_gio_ket_thuc);
    const dayStart = startOfDay(date).setHours(7);
    const top = (differenceInMinutes(startTime, dayStart) / 60) * 80; // 1 hour = 80px
    const height = (differenceInMinutes(endTime, startTime) / 60) * 80;
    return { top, height };
  };

  return (
    <div className="relative">
      <div className="sticky top-0 left-0 right-0 z-50 bg-background">
        <div
          className={`h-16 flex items-center justify-center text-center p-1 md:p-2 font-semibold text-sm rounded-lg ${
            isToday(date) ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          {format(date, "EEEE", { locale: vi })}
          <br />
          {format(date, "dd/MM")}
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[100px_1fr] gap-2 min-w-[600px]">
          <div className="sticky left-0 bg-background z-10">
            {hours.map((hour) => (
              <div
                key={hour.toString()}
                className="h-20 border-b text-sm text-muted-foreground py-1"
              >
                {format(hour, "HH:mm")}
              </div>
            ))}
          </div>
          <div>
            <div
              className="relative"
              style={{ height: `${hours.length * 80}px` }}
            >
              {hours.map((hour, index) => (
                <div
                  key={hour.toString()}
                  className="absolute w-full border-b border-border"
                  style={{ top: `${index * 80}px`, height: "80px" }}
                ></div>
              ))}
              {getAppointmentsForDay().map((apt) => {
                const { top, height } = calculateAppointmentPosition(apt);
                return (
                  <div
                    key={apt.id}
                    className="absolute left-0 right-0 px-1"
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    <AppointmentCard
                      appointment={apt}
                      style={{ height: "100%" }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeekView = ({
  date,
  appointments,
}: {
  date: Date;
  appointments: IAppointment[];
}) => {
  const weekDays = eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  });

  const hours = eachHourOfInterval({
    start: startOfDay(date).setHours(7),
    end: startOfDay(date).setHours(19),
  });

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt) =>
      isSameDay(parseISO(apt.ngay_gio_bat_dau), day)
    );
  };

  const calculateAppointmentPosition = (appointment: IAppointment) => {
    const startTime = parseISO(appointment.ngay_gio_bat_dau);
    const endTime = parseISO(appointment.ngay_gio_ket_thuc);
    const dayStart = startOfDay(startTime).setHours(7);
    const top = (differenceInMinutes(startTime, dayStart) / 60) * 80; // 80px per hour
    const height = (differenceInMinutes(endTime, startTime) / 60) * 80;
    return { top, height };
  };

  return (
    <div className="overflow-x-auto relative">
      <div className="grid grid-cols-8 gap-2 min-w-[800px]">
        <div className="sticky left-0 bg-background z-10">
          <div className="h-16"></div>
          {hours.map((hour) => (
            <div
              key={hour.toString()}
              className="h-20 border-b text-sm text-muted-foreground py-1"
            >
              {format(hour, "HH:mm")}
            </div>
          ))}
        </div>
        {weekDays.map((day) => (
          <div key={day.toString()} className="flex-1">
            <div
              className={`h-16 flex items-center p-1 sm:p-2 text-center justify-center font-semibold text-sm rounded-lg ${
                isToday(day) ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {format(day, "EE", { locale: vi })}
              <br />
              {format(day, "dd")}
            </div>
            <div
              className="relative"
              style={{ height: `${hours.length * 80}px` }}
            >
              {hours.map((hour, index) => (
                <div
                  key={hour.toString()}
                  className="absolute w-full border-b border-border"
                  style={{ top: `${index * 80}px`, height: "80px" }}
                ></div>
              ))}
              {getAppointmentsForDay(day).map((apt) => {
                const { top, height } = calculateAppointmentPosition(apt);
                return (
                  <div
                    key={apt.id}
                    className="absolute left-0 right-0 px-1"
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    <AppointmentCard
                      appointment={apt}
                      style={{ height: "100%" }}
                    />
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

const MonthView = ({
  date,
  appointments,
}: {
  date: Date;
  appointments: IAppointment[];
}) => {
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });

  return (
    <div className="grid grid-cols-7 gap-2 md:gap-4 min-w-[700px]">
      {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
        <div
          key={day}
          className="text-center font-semibold p-1 md:p-2 bg-muted text-xs md:text-sm rounded-lg"
        >
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
              isToday(day) ? "border-primary" : "border-border"
            }`}
          >
            <div className="font-semibold mb-1 md:mb-2 text-xs md:text-sm">
              {format(day, "d")}
            </div>
            <div className="space-y-1">
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

const AppointmentTable = ({
  appointments,
}: {
  appointments: IAppointment[];
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(VIEWS.WEEK);

  const navigateDate = (amount: number) => {
    switch (currentView) {
      case VIEWS.DAY:
        setCurrentDate((prev) => addDays(prev, amount));
        break;
      case VIEWS.WEEK:
        setCurrentDate((prev) => addWeeks(prev, amount));
        break;
      case VIEWS.MONTH:
        setCurrentDate((prev) => addMonths(prev, amount));
        break;
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getTodayLabel = () => {
    switch (currentView) {
      case VIEWS.DAY:
        return "Hôm nay";
      case VIEWS.WEEK:
        return "Tuần này";
      case VIEWS.MONTH:
        return "Tháng này";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <span className="text-lg md:text-xl font-semibold">
              {format(currentDate, "dd MMMM yyyy", { locale: vi })}
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate(-1)}
              className="p-0 w-9 h-9"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              {getTodayLabel()}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate(1)}
              className="p-0 w-9 h-9"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {Object.values(VIEWS).map((view) => (
            <Button
              key={view}
              variant={currentView === view ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentView(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="w-full overflow-x-auto">
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
          {currentView === VIEWS.DAY && (
            <DayView date={currentDate} appointments={appointments} />
          )}
          {currentView === VIEWS.WEEK && (
            <WeekView date={currentDate} appointments={appointments} />
          )}
          {currentView === VIEWS.MONTH && (
            <MonthView date={currentDate} appointments={appointments} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentTable;
