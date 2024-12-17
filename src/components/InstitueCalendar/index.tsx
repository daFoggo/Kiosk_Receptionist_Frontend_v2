import { memo, useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  FileText,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InstitueCalendarTable from "@/components/InstitueCalendarTable";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { truncateText } from "@/utils/Helper/common";
import { getInstitueCalendarIp } from "@/utils/ip";
import { IInstitueCalendar } from "@/models/institue-calendar";

const InstitueCalendar = memo(() => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [calendar, setCalendar] = useState<IInstitueCalendar | null>(null);
  const [fullCalendar, setFullCalendar] = useState<IInstitueCalendar[]>([]);
  const { t } = useTranslation();

  // enable scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (calendarRef.current) {
        e.preventDefault();
        calendarRef.current.scrollTop += e.deltaY;
      }
    };

    const calendar = calendarRef.current;
    if (calendar) {
      calendar.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (calendar) {
        calendar.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  useEffect(() => {
    getCalendarData();
  }, []);

  const getCalendarData = async () => {
    try {
      const response = await axios.get(getInstitueCalendarIp);
      const calendarData = response.data.payload;
      setFullCalendar(calendarData);
      const nextWork = findUpcomingWork(calendarData);
      setCalendar(nextWork);
    } catch (error) {
      toast.error("Lấy dữ liệu lịch tuần thất bại");
      console.error(error);
    }
  };

  // tim lich sap toi trong ngay
  const findUpcomingWork = useMemo(
    () =>
      (works: IInstitueCalendar[] | null): IInstitueCalendar | null => {
        if (!works || !Array.isArray(works)) return null;
        const currentTime = new Date();
        const todayStart = new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
          0,
          0,
          0,
          0
        ).getTime();

        const todayEnd = new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
          23,
          59,
          59,
          999
        ).getTime();

        // lay lich trong gio sap toi. neu khong con thi lay lich cuoi cung trong ngay
        const todayEvents = works.filter((work: IInstitueCalendar) => {
          const workTime = new Date(work.iso_datetime.toString()).getTime();
          return workTime >= todayStart && workTime <= todayEnd;
        });

        // neu hom nay khong co lich thi tra ve null
        if (todayEvents.length === 0) {
          return null;
        }

        const currentTimeMillis = currentTime.getTime();
        const upcomingEvent = todayEvents.find((work: IInstitueCalendar) => {
          const workTime = new Date(work.iso_datetime.toString()).getTime();
          return workTime > currentTimeMillis;
        });

        return upcomingEvent || todayEvents[todayEvents.length - 1];
      },
    []
  );

  // Render functions
  const renderField = useMemo(
    () => (icon: React.ReactNode, label: string, value: string | undefined) => {
      if (!value || value === "") return null;
      return (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 min-w-[150px]font-semibold text-lg">
            <span className="text-primary">{icon}</span>
            <Label className="text-muted-foreground">{label}</Label>
          </div>
          <Input value={value} readOnly tabIndex={-1} />
        </div>
      );
    },
    []
  );

  return (
    <Card className="h-full flex flex-col p-4 rounded-3xl" ref={calendarRef}>
      <CardTitle className="flex items-center gap-2 mb-4 text-2xl font-semibold">
        <BriefcaseBusiness />
        {t("instituecalendar.component")}
      </CardTitle>
      <CardContent className="p-0 mb-4">
        {calendar ? (
          <h1 className="text-2xl text-left font-semibold text-primary line-clamp-2">
            {calendar?.name}
          </h1>
        ) : (
          <p className="text-2xl text-left text-muted-foreground font-semibold">
            {t("instituecalendar.displaynone")}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-0 flex justify-between">
        {calendar ? (
          <Badge
            variant="secondary"
            className="text-lg font-semibold px-3 py-1 bg-crust"
          >
            <Clock className="mr-2 h-4 w-4" />
            <span>
              {new Date(calendar?.iso_datetime.toString()).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }
              )}
            </span>
          </Badge>
        ) : (
          <div></div>
        )}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              icon={<ArrowUpRight className="h-6 w-6" />}
              className="rounded-3xl text-lg font-semibold bg-secondary"
              iconPosition="right"
            >
              {t("instituecalendar.detail")}
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-4xl [&>button]:hidden overflow-y-hidden h-dvh">
            <SheetHeader>
              <div className="flex justify-between items-center text-center mb-6">
                <SheetTitle className="text-3xl">
                  {t("instituecalendar.dialog.title")}
                </SheetTitle>
                <SheetClose>
                  <span className="text-muted-foreground">
                    <X />
                  </span>
                </SheetClose>
              </div>
              <SheetDescription
                className={`space-y-6 mt-6 ${
                  calendar ? "border-b-2 pb-6" : ""
                }`}
              >
                {renderField(
                  <CalendarDays className="h-6 w-6 text-primary" />,
                  "Thời gian:",
                  calendar
                    ? new Date(
                        calendar?.iso_datetime.toString()
                      ).toLocaleDateString("vi-VN") +
                        " " +
                        new Date(
                          calendar?.iso_datetime.toString()
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                    : ""
                )}
                {renderField(
                  <MapPin className="h-6 w-6 text-primary" />,
                  "Địa điểm:",
                  calendar?.location as string
                )}
                {renderField(
                  <Users className="h-6 w-6 text-primary" />,
                  "Thành phần:",
                  calendar?.attendees as string
                )}
                {renderField(
                  <FileText className="h-6 w-6 text-primary" />,
                  "Chuẩn bị:",
                  calendar?.preparation as string
                )}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 h-full">
              <h1 className="text-2xl font-bold mb-4">
                {t("instituecalendar.dialog.allCalendar")}
              </h1>
              <div className="overflow-auto h-[80%]">
                <InstitueCalendarTable
                  works={fullCalendar}
                ></InstitueCalendarTable>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  );
});

export default InstitueCalendar;
