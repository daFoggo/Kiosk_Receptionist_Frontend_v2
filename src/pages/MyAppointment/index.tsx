import AppointmentTable from "@/components/AppointmentTable";
import ReuseBreadcrumb from "@/components/ReuseBreadcrumb";
import { Separator } from "@/components/ui/separator";
import { appointments } from "./constant";

const MyAppointment = () => {
  return (
    <div className="flex flex-col">
      <div className="space-y-2 py-3 px-4 sm:p-0 sm:py-4">
        <ReuseBreadcrumb
          origin={{ name: "Chính", link: "/appointment/my-appointments" }}
          pageList={[
            {
              name: "Lịch hẹn của tôi",
              link: "/appointment/my-appointments",
            },
          ]}
        />
        <h1 className="font-semibold text-lg sm:text-xl">Lịch hẹn của tôi</h1>
      </div>
      <Separator className="my-1 sm:my-2" />

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-3 sm:mt-4">
        <AppointmentTable appointments={appointments} />
      </div>
    </div>
  );
};

export default MyAppointment;
