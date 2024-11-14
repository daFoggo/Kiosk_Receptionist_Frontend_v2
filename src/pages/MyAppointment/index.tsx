import { useState, useEffect } from "react";
import axios from "axios";
import AppointmentTable from "@/components/AppointmentTable";
import ReuseBreadcrumb from "@/components/ReuseBreadcrumb";
import { Separator } from "@/components/ui/separator";
import { getAppointmentsIp } from "@/utils/ip";

const MyAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [cccdNguoiHen, setCccdNguoiHen] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const userObj = JSON.parse(user);
      setCccdNguoiHen(userObj.username);
    }
  }, []);

  useEffect(() => {
    handleGetAppointments();
  }, [cccdNguoiHen]);

  const handleGetAppointments = async () => {
    try {
      const response = await axios.get(getAppointmentsIp, {
        params: {
          cccd_id: cccdNguoiHen,
        },
      });
      setAppointments(response.data.payload);
    } catch (error) {
      console.error(error);
    }
  };

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
