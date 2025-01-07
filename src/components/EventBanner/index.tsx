import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IEvent, IEventBannerProps } from "@/models/event-banner";
import { dateUtils } from "@/utils/Helper/event-banner";
import { AnimatePresence, motion } from "framer-motion";
import { t } from "i18next";
import {
  CalendarHeart,
  ChevronLeft,
  ChevronRight,
  Clock,
  ClockArrowDown,
  ClockArrowUp,
  MapPin,
} from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Memoized components
const ResponsiveBadge = memo(
  ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <Badge variant="secondary" className="px-2 py-1 max-w-[300px]" title={text}>
      <div className="flex items-center gap-1 w-full">
        {icon}
        <span className="text-sm truncate">{text}</span>
      </div>
    </Badge>
  )
);
ResponsiveBadge.displayName = "ResponsiveBadge";

const EventField = memo(
  ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <div className="flex items-center space-x-2 text-base font-semibold">
      <span className="text-primary">{icon}</span>
      <span className="text-muted-foreground">{label}:</span>
      <span>{value}</span>
    </div>
  )
);
EventField.displayName = "EventField";

const NavigationButton = memo(
  ({
    direction,
    onClick,
  }: {
    direction: "left" | "right";
    onClick: () => void;
  }) => (
    <Button
      variant="ghost"
      size="icon"
      className={`absolute ${
        direction === "left" ? "left-2" : "right-2"
      } top-1/2 -translate-y-1/2 rounded-full bg-secondary/50 hover:bg-secondary`}
      onClick={onClick}
      aria-label={`${direction === "left" ? "Previous" : "Next"} event`}
    >
      {direction === "left" ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  )
);
NavigationButton.displayName = "NavigationButton";

const EventDialog = memo(
  ({
    isOpen,
    onClose,
    event,
  }: {
    isOpen: boolean;
    onClose: () => void;
    event: IEvent;
  }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[98%] rounded-xl sm:rounded-2xl sm:max-w-[70%]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary line-clamp-2">
            {t("eventbanner.dialog.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          <EventField
            icon={<CalendarHeart />}
            label={t("eventbanner.dialog.field.title")}
            value={event.title}
          />
          <EventField
            icon={<Clock />}
            label={t("eventbanner.dialog.field.date")}
            value={dateUtils.formatDate(event.start_time)}
          />
          <EventField
            icon={<ClockArrowUp />}
            label={t("eventbanner.dialog.field.start_date")}
            value={`${dateUtils.formatDate(
              event.start_time
            )} ${dateUtils.formatTime(event.start_time)}`}
          />
          <EventField
            icon={<ClockArrowDown />}
            label={t("eventbanner.dialog.field.end_date")}
            value={`${dateUtils.formatDate(
              event.end_time
            )} ${dateUtils.formatTime(event.end_time)}`}
          />
          {event.location && (
            <EventField
              icon={<MapPin />}
              label={t("eventbanner.dialog.field.location")}
              value={event.location}
            />
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
);
EventDialog.displayName = "EventDialog";

const EventTitle = memo(
  ({ title, onClick }: { title: string; onClick: () => void }) => (
    <motion.h2
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="text-2xl font-semibold text-primary absolute w-full cursor-pointer hover:text-ring"
      onClick={onClick}
    >
      {title}
    </motion.h2>
  )
);
EventTitle.displayName = "EventTitle";

const EventBanner = ({ eventData }: IEventBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const currentEvent = eventData[currentIndex];
  const { t } = useTranslation();

  const handlePrevious = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + eventData.length) % eventData.length
    );
  }, [eventData.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % eventData.length);
  }, [eventData.length]);

  useEffect(() => {
    if (eventData.length <= 1) return;

    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [eventData.length, handleNext]);

  const renderDateBadges = useCallback(() => {
    if (
      dateUtils.areDatesSame(currentEvent.start_time, currentEvent.end_time)
    ) {
      return (
        <>
          <ResponsiveBadge
            icon={<CalendarHeart />}
            text={dateUtils.formatDate(currentEvent.start_time)}
          />
          {dateUtils.formatTime(currentEvent.start_time) && (
            <ResponsiveBadge
              icon={<Clock />}
              text={`${dateUtils.formatTime(
                currentEvent.start_time
              )} - ${dateUtils.formatTime(currentEvent.end_time)}`}
            />
          )}
        </>
      );
    }

    return (
      <>
        <ResponsiveBadge
          icon={<ClockArrowUp />}
          text={`${dateUtils.formatDate(
            currentEvent.start_time
          )} ${dateUtils.formatTime(currentEvent.start_time)}`}
        />
        <ResponsiveBadge
          icon={<ClockArrowDown />}
          text={`${dateUtils.formatDate(
            currentEvent.end_time
          )} ${dateUtils.formatTime(currentEvent.end_time)}`}
        />
      </>
    );
  }, [currentEvent]);

  return (
    <Card className="relative h-full flex flex-col p-4 rounded-3xl overflow-hidden">
      <CardTitle className="flex items-center gap-2 text-2xl font-semibold mb-4">
        <CalendarHeart />
        {t("eventbanner.component")}
      </CardTitle>

      <CardContent className="p-0 flex-grow flex flex-col">
        <div className="h-[2.5rem] relative">
          <AnimatePresence mode="wait">
            <EventTitle
              key={currentEvent.id}
              title={currentEvent.title}
              onClick={() => setIsDialogOpen(true)}
            />
          </AnimatePresence>
        </div>
      </CardContent>

      <CardFooter className="p-0 mt-4 flex flex-wrap items-center gap-2">
        {renderDateBadges()}
        {currentEvent.location && (
          <ResponsiveBadge icon={<MapPin />} text={currentEvent.location} />
        )}
      </CardFooter>

      {eventData.length > 1 && (
        <>
          <NavigationButton direction="left" onClick={handlePrevious} />
          <NavigationButton direction="right" onClick={handleNext} />
        </>
      )}

      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        event={currentEvent}
      />
    </Card>
  );
};

export default memo(EventBanner);
