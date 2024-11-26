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
      <div className="sticky top-0 space-y-2 py-2">
        <ReuseBreadcrumb
          origin={{ name: "Chính", link: "/appointment/my-appointments" }}
          pageList={[
            {
              name: "Lịch hẹn của tôi",
              link: "/appointment/my-appointments",
            },
          ]}
        />
        <Separator/>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <h1 className="font-semibold text-xl sm:text-2xl">Lịch hẹn của tôi</h1>
        <AppointmentTable appointments={appointments} />
      </div>
    </div>
  );
};

export default MyAppointment;
