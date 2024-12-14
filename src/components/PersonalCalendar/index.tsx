import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  User,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getStudentCalendarIp, getInstructorCalendarIp } from "@/utils/ip";
import {
  formatDateForApi,
  generateHours,
  generateWeekDays,
  getWeekStartDate,
  parseDate,
  isCurrentHour,
  convertColor,
  isCurrentDate,
} from "@/utils/Helper/personal-calendar";
import {
  IPersonalCalendarData,
  IPersonalCalendarProps,
} from "@/models/personal-calendar";

const PersonalCalendar = ({
  currentRole,
  currentCccd,
}: IPersonalCalendarProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [calendarData, setCalendarData] = useState<IPersonalCalendarData[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState("day");
  const hours = generateHours();
  const weekDays = generateWeekDays(currentDate);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 8 * 60);
    }
  }, [viewMode]);

  useEffect(() => {
    getCalendarData();

    return () => {
      setIsLoading(false);
      setCalendarData([]);
    };
  }, [currentRole, currentCccd]);

  const getCalendarData = async (startDate: Date = new Date()) => {
    if (!currentRole || !currentCccd) return;

    try {
      setIsLoading(true);

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      const formattedStartDate = formatDateForApi(startDate);
      const formattedEndDate = formatDateForApi(endDate);

      const baseUrl =
        currentRole === "student"
          ? getStudentCalendarIp
          : getInstructorCalendarIp;

      const url =
        `${baseUrl}?` +
        new URLSearchParams({
          cccd_id: currentCccd,
          role: currentRole === "student" ? "student" : "officer",
          ngay_bat_dau: formattedStartDate,
          ngay_ket_thuc: formattedEndDate,
        }).toString();

      const response = await axios.get(url);
      setCalendarData(response.data.payload);
    } catch (error) {
      console.error("Error getting schedule data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateCalendar = async (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);

    if (viewMode === "week") {
      const weekStart = getWeekStartDate(newDate);
      await getCalendarData(weekStart);
    }
  };

  const goToday = async () => {
    const today = new Date();
    setCurrentDate(today);

    if (viewMode === "week") {
      const weekStart = getWeekStartDate(today);
      await getCalendarData(weekStart);
    }
  };

  const handleEventClick = (event: any) => {
    console.log("Event clicked:", event);
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const renderField = (icon: React.ReactNode, label: string, value: string) => (
    <div className="flex items-center space-x-2">
      <div className="text-primary">{icon}</div>
      <span className="font-semibold">{label}:</span>
      {label === "Loại lịch" ? (
        <Badge
          className={`text-xl px-4 py-1 items-center font-semibold ${convertColor(
            value,
            "badge"
          )}`}
        >
          {value}
        </Badge>
      ) : (
        <span>{value}</span>
      )}
    </div>
  );

  const renderDayView = () => (
    <ScrollArea ref={scrollRef} className="h-[calc(100vh-12rem)] w-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 animate-spin text-primary" />
            <p className="text-xl text-muted-foreground">Đang tải lịch...</p>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pr-4"
        >
          <div className="relative">
            {hours?.map((hour) => (
              <div key={hour} className="flex items-stretch border-t-2 h-20">
                <span className="w-24 text-xl text-muted-foreground py-2 sticky left-0 bg-background z-20">
                  {hour}
                </span>
                <div className="flex-1 relative min-w-[150px]">
                  {isCurrentHour(hour) && (
                    <div className="absolute inset-0 bg-primary/10 z-0"></div>
                  )}
                  {calendarData
                    ?.filter((course) => {
                      const startDate = parseDate(course.ngay_gio_bat_dau);
                      return (
                        startDate.getHours() === parseInt(hour) &&
                        startDate.getDate() === currentDate.getDate() &&
                        startDate.getMonth() === currentDate.getMonth() &&
                        startDate.getFullYear() === currentDate.getFullYear()
                      );
                    })
                    ?.map((course, index) => {
                      const startDate = parseDate(course.ngay_gio_bat_dau);
                      const endDate = parseDate(course.ngay_gio_ket_thuc);
                      const duration =
                        (endDate.getTime() - startDate.getTime()) /
                        (1000 * 60 * 60);
                      return (
                        <div
                          key={index}
                          className={`absolute top-0 left-0 right-0 border-l-8 p-1 ml-1 rounded-md cursor-pointer transition-colors overflow-hidden z-10 ${convertColor(
                            course?.loai_lich,
                            "div"
                          )}`}
                          style={{
                            height: `${duration * 80}px`,
                          }}
                          onClick={() => handleEventClick(course)}
                        >
                          <p className="text-md font-semibold truncate">
                            {course.hoc_phan.ten_hoc_phan}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{`${startDate.getHours()}:${startDate
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")} - ${endDate.getHours()}:${endDate
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")}`}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );

  const renderWeekView = () => (
    <ScrollArea ref={scrollRef} className="w-full h-[calc(100vh-12rem)]">
      <div className="w-full min-w-[1200px] ">
        <div className="flex sticky top-0 bg-background z-10">
          <div className="w-24"></div>
          {weekDays?.map((day, index) => (
            <div
              key={index}
              className={`flex-1 text-center p-2 text-xl font-semibold min-w-[150px]
              ${isCurrentDate(day) ? "bg-primary text-white rounded-md" : ""}`}
            >
              <div>{day.toLocaleDateString("vi-VN", { weekday: "short" })}</div>
              <div>{day.getDate()}</div>
            </div>
          ))}
        </div>
        {hours?.map((hour) => (
          <div key={hour} className="flex items-stretch border-t-2 h-20">
            <span className="w-24 text-xl text-muted-foreground py-2 sticky left-0 bg-background z-20">
              {hour}
            </span>
            {weekDays?.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="flex-1 relative border-l-2 border-gray-100 min-w-[150px]"
              >
                {isCurrentDate(day) && (
                  <div className="absolute inset-0 bg-primary/10 z-0"></div>
                )}
                {calendarData
                  ?.filter((course) => {
                    const startDate = parseDate(course.ngay_gio_bat_dau);
                    return (
                      startDate.getHours() === parseInt(hour) &&
                      startDate.getDate() === day.getDate() &&
                      startDate.getMonth() === day.getMonth() &&
                      startDate.getFullYear() === day.getFullYear()
                    );
                  })
                  ?.map((course, index) => {
                    const startDate = parseDate(course.ngay_gio_bat_dau);
                    const endDate = parseDate(course.ngay_gio_ket_thuc);
                    const duration =
                      (endDate.getTime() - startDate.getTime()) /
                      (1000 * 60 * 60);
                    return (
                      <div
                        key={index}
                        className={`absolute top-0 left-0 right-0 border-l-8 p-1 ml-1 rounded-md cursor-pointer  transition-colors overflow-hidden z-10 ${convertColor(
                          course?.loai_lich,
                          "div"
                        )}`}
                        style={{
                          height: `${duration * 80}px`,
                        }}
                        onClick={() => handleEventClick(course)}
                      >
                        <p className="text-md font-semibold truncate">
                          {course.hoc_phan.ten_hoc_phan}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{`${startDate.getHours()}:${startDate
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")} - ${endDate.getHours()}:${endDate
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}`}</p>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );

  return (
    <Card className="w-full h-full p-6">
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-end sm:justify-between sm:space-y-0 pb-4">
        <CardTitle className="flex flex-col gap-2 font-bold">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl text-muted-foreground"
          >
            {viewMode === "day"
              ? currentDate.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : `Từ ${weekDays[0].toLocaleDateString("vi-VN", {
                  month: "short",
                  day: "numeric",
                })} đến ${weekDays[6].toLocaleDateString("vi-VN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`}
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
            onClick={() => navigateCalendar(viewMode === "day" ? -1 : -7)}
            disabled={isLoading}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            onClick={goToday}
            disabled={isLoading}
            className="font-semibold text-xl"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tải...
              </div>
            ) : viewMode === "day" ? (
              "Hôm nay"
            ) : (
              "Tuần này"
            )}
          </Button>
          <Button
            className="font-semibold "
            size="icon"
            onClick={() => navigateCalendar(viewMode === "day" ? 1 : 7)}
            disabled={isLoading}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </motion.div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs
          value={viewMode}
          onValueChange={setViewMode}
          className="w-full text-xl"
        >
          <TabsList className="flex w-full justify-between py-6">
            <TabsTrigger
              value="day"
              className="font-semibold text-xl flex-1 rounded-md"
            >
              Trong ngày
            </TabsTrigger>
            <TabsTrigger
              value="week"
              className="font-semibold text-xl flex-1 rounded-md"
            >
              Trong tuần
            </TabsTrigger>
          </TabsList>
          <AnimatePresence>
            {viewMode === "day" && (
              <motion.div
                key="day"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="day">{renderDayView()}</TabsContent>
              </motion.div>
            )}
            {viewMode === "week" && (
              <motion.div
                key="week"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="week">{renderWeekView()}</TabsContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>
      </CardContent>

      <AnimatePresence>
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-[98%] rounded-xl sm:rounded-2xl sm:max-w-[70%]">
              <DialogHeader>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <DialogTitle className="text-primary text-3xl">
                    {selectedEvent.hoc_phan.ten_hoc_phan}
                  </DialogTitle>
                </motion.div>
              </DialogHeader>
              <motion.div
                className="mt-6 space-y-4 text-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {renderField(
                  <MapPin className="h-5 w-5" />,
                  "Loại lịch",
                  selectedEvent?.loai_lich
                )}
                {renderField(
                  <MapPin className="h-5 w-5" />,
                  "Phòng",
                  selectedEvent?.phong
                )}
                {renderField(
                  <Clock className="h-5 w-5" />,
                  "Thời gian",
                  `${selectedEvent?.ngay_gio_bat_dau} - ${selectedEvent?.ngay_gio_ket_thuc}`
                )}
                {renderField(
                  <CalendarIcon className="h-5 w-5" />,
                  "Lớp tín chỉ",
                  selectedEvent?.nha
                )}
                {renderField(
                  <User className="h-5 w-5" />,
                  "Giảng viên",
                  selectedEvent?.can_bo?.ho_ten
                )}
              </motion.div>
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
                    Đóng
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

export default PersonalCalendar;
