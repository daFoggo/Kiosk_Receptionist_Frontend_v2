import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Inbox } from "lucide-react";
import { useEffect, useState } from "react";
import { notificationData, tabList } from "./constant";

const Notification = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [visibleNotifications, setVisibleNotifications] = useState(10);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const newNotificationCount = notificationData.inbox.length;
    setNotificationCount(newNotificationCount);
  }, []);

  const handleViewMore = () => {
    setVisibleNotifications((prev) =>
      Math.min(
        prev + 5,
        activeTab === "inbox"
          ? notificationData.inbox.length
          : notificationData.archived.length
      )
    );
  };

  const currentNotifications =
    activeTab === "inbox" ? notificationData.inbox : notificationData.archived;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Inbox />
          {notificationCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs h-auto min-w-[20px] rounded-full"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[300px] sm:w-[425px] p-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between mx-4 mt-4">
            <h1 className="font-semibold">Thông báo</h1>
            {notificationCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {notificationCount} thông báo mới
              </Badge>
            )}
          </div>
          <Tabs
            defaultValue="inbox"
            onValueChange={(value) => {
              setActiveTab(value);
              setVisibleNotifications(5);
            }}
          >
            <TabsList className="mx-4">
              {tabList.map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key}>
                  {tab.tab}
                </TabsTrigger>
              ))}
            </TabsList>
            <Separator className="my-2" />
            <TabsContent value="inbox">
              <ScrollArea className="h-[200px]">
                {notificationData.inbox
                  .slice(0, visibleNotifications)
                  .map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`p-4 ${
                        index < visibleNotifications - 1 ? "border-b" : ""
                      }`}
                    >
                      <p>{notification.title}</p>
                    </div>
                  ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="archived">
              <ScrollArea className="h-[200px]">
                {notificationData.archived
                  .slice(0, visibleNotifications)
                  .map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`p-4 ${
                        index < visibleNotifications - 1 ? "border-b" : ""
                      }`}
                    >
                      <p>{notification.title}</p>
                    </div>
                  ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
          {visibleNotifications < currentNotifications.length && (
            <Button
              className="rounded-t-none border-t"
              variant="ghost"
              onClick={handleViewMore}
            >
              Xem thêm
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
