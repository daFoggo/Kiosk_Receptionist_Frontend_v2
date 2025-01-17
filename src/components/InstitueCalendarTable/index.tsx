import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  IInstitueCalendarTableProps,
  IWork,
} from "@/models/institue-calendar-table";
import { generateHours } from "@/utils/Helper/common";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const WeeklySchedule = ({ works }: IInstitueCalendarTableProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWork, setSelectedWork] = useState<IWork | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const hours = generateHours(14);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 2 * 60);
    }
  }, []);

  // Handlers
  const handleWorkClick = (work: IWork) => {
    setSelectedWork(work);
    setIsDialogOpen(true);
  };

  // Utilities
  const getWeekDates = (date: Date) => {
    const firstDay = new Date(date);
    const lastDay = new Date(date);
    const currentDay = date.getDay();
    
    const mondayDiff = currentDay === 0 ? -6 : 1 - currentDay;
    firstDay.setDate(date.getDate() + mondayDiff);
    
    lastDay.setDate(firstDay.getDate() + 6);

    return { monday: firstDay, sunday: lastDay };
  };

  const navigateCalendar = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    
    const { monday, sunday } = getWeekDates(newDate);
    

    if (newDate >= monday && newDate <= sunday) {
      setCurrentDate(newDate);
    }
  };

  const getLocale = () => {
    return i18n.language === "vi"
      ? "vi"
      : i18n.language === "en"
      ? "en-US"
      : "ko";
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

  const isCurrentHour = (hour: string) => {
    const currentHour = new Date().getHours();
    return parseInt(hour) === currentHour;
  };

  const renderField = (icon: React.ReactNode, label: string, value: string) => (
    <div className="flex items-center space-x-2 font-semibold">
      <div className="text-primary">{icon}</div>
      <span className="text-muted-foregrounds">{label}:</span>
      <span className="font-bold">{value}</span>
    </div>
  );

  const renderDayView = () => (
    <ScrollArea ref={scrollRef} className="h-[calc(100vh-12rem)] w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="pr-4"
      >
        {hours.map((hour) => (
          <motion.div
            key={hour}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: parseInt(hour) * 0.02 }}
            className={`flex items-stretch text-xl ${
              hour === hours[0] ? "" : "border-t-2"
            } border-gray-300 h-20`}
          >
            <span
              className={`w-24 text-muted-foreground py-2 sticky left-0 z-20 ${
                isCurrentHour(hour) ? "bg-primary/10" : "bg-background"
              }`}
            >
              {hour}
            </span>
            <div className={`flex-1 relative`}>
              {isCurrentHour(hour) && (
                <div className="absolute inset-0 bg-primary/10 z-0"></div>
              )}

              {works
                .filter((work) => {
                  const workDate = new Date(work.iso_datetime);
                  return (
                    workDate.getHours() === parseInt(hour) &&
                    workDate.getDate() === currentDate.getDate() &&
                    workDate.getMonth() === currentDate.getMonth() &&
                    workDate.getFullYear() === currentDate.getFullYear()
                  );
                })
                .map((work, index) => {
                  const workDate = new Date(work.iso_datetime);
                  return (
                    <div
                      key={index}
                      className="absolute left-0 right-0 border-l-8 border-ring p-2 rounded-md cursor-pointer bg-[#dfe8ff] hover:bg-[#c5d4ff] transition-colors overflow-hidden z-10"
                      style={{
                        top: "0px",
                        height: "80px",
                      }}
                      onClick={() => handleWorkClick(work)}
                    >
                      <p className="text-lg font-semibold truncate">
                        {work.name}
                      </p>
                      <p className="text-md text-muted-foreground truncate">
                        {`${workDate.getHours()}:${workDate
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}`}
                      </p>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        ))}
      </motion.div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );

  const { monday, sunday } = getWeekDates(new Date());

  return (
    <Card className="w-full h-full p-4 rounded-3xl">
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-end sm:justify-between sm:space-y-0 py-4 px-0">
        <CardTitle className="flex flex-col gap-2 font-bold">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl text-muted-foreground"
          >
            {currentDate.toLocaleDateString(getLocale(), {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </motion.p>
        </CardTitle>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <Button
            className="font-semibold"
            size="icon"
            onClick={() => navigateCalendar(-1)}
            disabled={currentDate <= monday}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            className="font-semibold text-lg"
            onClick={goToday}

          >
            {t("instituecalendar.table.today")}
          </Button>
          <Button
            className="font-semibold"
            size="icon"
            onClick={() => navigateCalendar(1)}
            disabled={currentDate >= sunday}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </motion.div>
      </CardHeader>
      <CardContent className="p-0">{renderDayView()}</CardContent>

      <AnimatePresence>
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent
              className="max-w-[98%] rounded-xl sm:rounded-2xl sm:max-w-[70%]"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <DialogTitle className="text-primary text-3xl">
                    {selectedWork?.name}
                  </DialogTitle>
                </motion.div>
                <DialogDescription>
                  <motion.div
                    className="mt-6 space-y-4 text-2xl"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {renderField(
                      <MapPin className="h-5 w-5" />,
                      t("instituecalendar.table.field.location"),
                      selectedWork?.location || ""
                    )}
                    {renderField(
                      <Clock className="h-5 w-5" />,
                      t("instituecalendar.table.field.time"),
                      new Date(selectedWork?.iso_datetime || "").toLocaleString(
                        getLocale()
                      )
                    )}
                    {renderField(
                      <User className="h-5 w-5" />,
                      t("instituecalendar.table.field.attendances"),
                      selectedWork?.attendees || ""
                    )}
                    {selectedWork?.preparation &&
                      renderField(
                        <CalendarIcon className="h-5 w-5" />,
                        t("instituecalendar.table.field.preparation"),
                        selectedWork.preparation
                      )}
                  </motion.div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Button
                    onClick={() => setIsDialogOpen(false)}
                    className="font-semibold bg-primary hover:bg-primary/90 text-xl p-4"
                  >
                    {t("instituecalendar.table.close")}
                  </Button>
                </motion.div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default WeeklySchedule;