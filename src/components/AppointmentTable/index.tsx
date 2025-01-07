import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IAppointment } from "@/models/appointment-table";
import { getWeekStartDate } from "@/utils/Helper/general-calendar";
import { addDays, addMonths, addWeeks, format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { VIEWS } from "./constant";
import DayView from "./day-view";
import MonthView from "./month-view";
import WeekView from "./week-view";

const AppointmentTable = ({
  appointments,
}: {
  appointments: IAppointment[];
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(VIEWS.DAY);

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

  const goToToday = () => setCurrentDate(new Date());

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
      <CardHeader className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2 font-bold">
            <CalendarIcon className="size-4" />
            <span className="text-lg md:text-xl">
              {currentView === VIEWS.DAY
                ? `Ngày ${format(currentDate, "dd/MM/yyyy", { locale: vi })}`
                : currentView === VIEWS.WEEK
                ? `Từ ${format(getWeekStartDate(currentDate), "dd/MM/yyyy", {
                    locale: vi,
                  })} đến ${format(
                    addDays(getWeekStartDate(currentDate), 6),
                    "dd/MM/yyyy",
                    {
                      locale: vi,
                    }
                  )}`
                : `Tháng ${format(currentDate, "MM/yyyy", { locale: vi })}`}
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate(-1)}
              className="h-8 w-8 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="rounded-full"
            >
              {getTodayLabel()}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate(1)}
              className="h-8 w-8 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          value={currentView}
          onValueChange={(value) =>
            setCurrentView(value as (typeof VIEWS)[keyof typeof VIEWS])
          }
          defaultValue="DAY"
        >
          <TabsList className="grid w-full grid-cols-3">
            {Object.values(VIEWS).map((view) => (
              <TabsTrigger
                key={view}
                value={view}
                className="text-xs sm:text-sm"
              >
                {view}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            <TabsContent value={VIEWS.DAY}>
              <DayView date={currentDate} appointments={appointments} />
            </TabsContent>
            <TabsContent value={VIEWS.WEEK}>
              <WeekView date={currentDate} appointments={appointments} />
            </TabsContent>
            <TabsContent value={VIEWS.MONTH}>
              <MonthView date={currentDate} appointments={appointments} />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AppointmentTable;
