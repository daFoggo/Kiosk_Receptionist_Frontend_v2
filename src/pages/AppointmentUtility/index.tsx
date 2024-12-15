import { vi } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AppointmentUtility = () => {
  return (
    <div className="flex flex-col gap-4">
      <Card className="p-2">
        <Calendar
          classNames={{
            months:
              "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1 text-center",
            month: "space-y-4 w-full flex flex-col",
            table: "w-full h-full border-collapse space-y-1",
            head_row: "",
            row: "w-full mt-2",
          }}
          mode="multiple"
          locale={vi}
        />
      </Card>
      <Input placeholder="Tìm kiếm người cần hẹn..." className="w-full" />
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="filter-role"
      >
        <AccordionItem value="filter-role">
          <AccordionTrigger className="hover:no-underline">
            Lọc theo vai trò
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="isOwner" defaultChecked />
              <label
                htmlFor="isOwner"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Là chủ cuộc hẹn
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isParticpant"
                className="border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                defaultChecked
              />
              <label
                htmlFor="isParticpant"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Là người tham gia
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AppointmentUtility;
