import { Inbox } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

import { tabList } from "./constant";

const Notification = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          icon={<Inbox />}
          iconPosition="center"
        ></Button>
      </PopoverTrigger>
      <PopoverContent align="end" className=" w-[300px] sm:w-[425px]">
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold">Thông báo</h1>
          <Tabs defaultValue="inbox">
            <TabsList>
              {tabList.map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key}>
                  {tab.tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Separator />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
