"use client";

import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
  parseISO,
  isSameDay,
  addDays,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  addWeeks,
  addMonths,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const VIEWS = {
  DAY: "ngày",
  WEEK: "tuần",
  MONTH: "tháng",
};

const getStatusColor = (status) => {
  switch (status) {
    case "Đã xác nhận":
      return "bg-green-100 text-green-800 border-green-200";
    case "Chờ xác nhận":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Đã hủy":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const AppointmentCard = ({ appointment }) => (
  <div
    className={`p-2 rounded-lg border ${getStatusColor(
      appointment.trang_thai
    )} mb-2 text-xs md:text-sm`}
  >
    <div className="font-semibold truncate">{appointment.muc_dich}</div>
    <div className="space-y-1 mt-1">
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3 md:h-4 md:w-4" />
        {format(parseISO(appointment.ngay_gio_bat_dau), "HH:mm")} -
        {format(parseISO(appointment.ngay_gio_ket_thuc), "HH:mm")}
      </div>
      <div className="flex items-center gap-1">
        <MapPin className="h-3 w-3 md:h-4 md:w-4" />
        <span className="truncate">{appointment.dia_diem}</span>
      </div>
    </div>
  </div>
);

const DayView = ({ date, appointments }) => {
  const hours = eachHourOfInterval({
    start: startOfDay(date).setHours(7),
    end: startOfDay(date).setHours(19),
  });

  const getAppointmentsForHour = (hour) => {
    return appointments.filter((apt) => {
      const startTime = parseISO(apt.ngay_gio_bat_dau);
      return (
        isSameDay(startTime, date) &&
        format(startTime, "HH") === format(hour, "HH")
      );
    });
  };

  return (
    <div className="space-y-2 w-full">
      {hours.map((hour) => {
        const hourAppointments = getAppointmentsForHour(hour);
        return (
          <div key={hour.toString()} className="grid grid-cols-12 gap-2">
            <div className="col-span-2 py-2 text-left text-muted-foreground text-xs md:text-sm">
              {format(hour, "HH:mm")}
            </div>
            <div className="col-span-10 min-h-[60px] border-b-2 py-2">
              {hourAppointments.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const WeekView = ({ date, appointments }) => {
  const weekDays = eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  });

  return (
    <div className="grid grid-cols-7 gap-2 md:gap-4 min-w-[700px]">
      {weekDays.map((day) => {
        const dayAppointments = appointments.filter((apt) =>
          isSameDay(parseISO(apt.ngay_gio_bat_dau), day)
        );

        return (
          <div key={day.toString()} className="min-h-[200px]">
            <div
              className={`text-center p-1 md:p-2 font-semibold text-xs md:text-sm ${
                isToday(day) ? "bg-primary/20 rounded-lg" : ""
              }`}
            >
              {format(day, "EE", { locale: vi })}
            </div>
            <div className="p-1 md:p-2">
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

const MonthView = ({ date, appointments }) => {
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });

  return (
    <div className="grid grid-cols-7 gap-2 md:gap-4 min-w-[700px]">
      {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
        <div
          key={day}
          className="text-center font-semibold p-1 md:p-2 bg-gray-50 rounded text-xs md:text-sm"
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
              isToday(day) ? "border-primary" : "border-gray-200"
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

const AppointmentTable = ({ appointments }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(VIEWS.WEEK);

  const navigateDate = (amount) => {
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
              iconPosition="center"
              icon={<ChevronLeft className="h-4 w-4" />}
            ></Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              {getTodayLabel()}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate(1)}
              icon={<ChevronRight className="h-4 w-4" />}
              iconPosition="center"
            ></Button>
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