"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarHeart,
  Clock,
  ClockArrowDown,
  ClockArrowUp,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IEventBannerProps } from "@/models/EventBanner/EventBanner";

export default function EventBanner({ eventData }: IEventBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const currentEvent = eventData[currentIndex];

  useEffect(() => {
    if (eventData.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % eventData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [eventData.length]);

  const handlePrevious = () =>
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + eventData.length) % eventData.length
    );
  const handleNext = () =>
    setCurrentIndex((prevIndex) => (prevIndex + 1) % eventData.length);

  const formatDate = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.getHours() === 0 && date.getMinutes() === 0
      ? ""
      : date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const areDatesSame = (startDate: string, endDate: string) => {
    return (
      new Date(startDate).toDateString() === new Date(endDate).toDateString()
    );
  };

  return (
    <Card className="relative h-full flex flex-col p-4 rounded-3xl overflow-hidden">
      <CardTitle className="flex items-center gap-2 text-2xl font-semibold mb-4">
        <CalendarHeart />
        Sự kiện
      </CardTitle>

      <CardContent className="p-0 flex-grow flex flex-col">
        <div className="h-[2.5rem] relative">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentEvent.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-semibold text-primary absolute w-full cursor-pointer hover:text-ring"
              onClick={() => setIsDialogOpen(true)}
            >
              {currentEvent.title}
            </motion.h2>
          </AnimatePresence>
        </div>
      </CardContent>

      <CardFooter className="p-0 mt-4 flex flex-wrap items-center gap-2">
        {areDatesSame(currentEvent.start_time, currentEvent.end_time) ? (
          <>
            <ResponsiveBadge
              icon={<CalendarHeart />}
              text={formatDate(currentEvent.start_time)}
            />
            {formatTime(currentEvent.start_time) && (
              <ResponsiveBadge
                icon={<Clock />}
                text={`${formatTime(currentEvent.start_time)} - ${formatTime(
                  currentEvent.end_time
                )}`}
              />
            )}
          </>
        ) : (
          <>
            <ResponsiveBadge
              icon={<ClockArrowUp />}
              text={`${formatDate(currentEvent.start_time)} ${formatTime(
                currentEvent.start_time
              )}`}
            />
            <ResponsiveBadge
              icon={<ClockArrowDown />}
              text={`${formatDate(currentEvent.end_time)} ${formatTime(
                currentEvent.end_time
              )}`}
            />
          </>
        )}
        {currentEvent.location && (
          <ResponsiveBadge icon={<MapPin />} text={currentEvent.location} />
        )}
      </CardFooter>

      {eventData.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-secondary/50 hover:bg-secondary"
            onClick={handlePrevious}
            aria-label="Previous event"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-secondary/50 hover:bg-secondary"
            onClick={handleNext}
            aria-label="Next event"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[98%] rounded-xl sm:rounded-2xl sm:max-w-[70%]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-primary">
              Chi tiết sự kiện
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6 space-y-4">
            {renderField(<CalendarHeart />, "Tên sự kiện", currentEvent.title)}
            {renderField(
              <Clock />,
              "Ngày diễn ra",
              formatDate(currentEvent.start_time)
            )}
            {renderField(
              <ClockArrowUp />,
              "Thời điểm bắt đầu",
              `${formatDate(currentEvent.start_time)} ${formatTime(
                currentEvent.start_time
              )}`
            )}
            {renderField(
              <ClockArrowDown />,
              "Thời điểm kết thúc",
              `${formatDate(currentEvent.end_time)} ${formatTime(
                currentEvent.end_time
              )}`
            )}
            {currentEvent.location &&
              renderField(<MapPin />, "Địa điểm", currentEvent.location)}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

interface ResponsiveBadgeProps {
  icon: React.ReactNode;
  text: string;
}

const ResponsiveBadge = ({ icon, text }: ResponsiveBadgeProps) => {
  return (
    <Badge variant="secondary" className="px-2 py-1 max-w-[180px]" title={text}>
      <div className="flex items-center gap-1 w-full">
        {icon}
        <span className="text-sm truncate">{text}</span>
      </div>
    </Badge>
  );
};

const renderField = (icon: React.ReactNode, label: string, value: string) => {
  return (
    <div className="flex items-center space-x-2 text-base font-semibold">
      <span className="text-primary">{icon}</span>
      <span className="text-muted-foreground">{label}:</span>
      <span>{value}</span>
    </div>
  );
};
