import { useState, useEffect } from "react";
import axios from "axios";
import AppointmentTable from "@/components/AppointmentTable";
import { getAppointmentsIp } from "@/utils/ip";
import { useAuth } from "@/contexts/auth-context";

const MyAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const cccdId = useAuth()?.user.cccd_id ?? "";

  useEffect(() => {
    handleGetAppointments();
  }, [cccdId]);

  const handleGetAppointments = async () => {
    try {
      const response = await axios.get(
        `${getAppointmentsIp}?cccd_id=${cccdId}`
      );
      setAppointments(response.data.payload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4">
        <AppointmentTable appointments={appointments} />
      </div>
    </div>
  );
};

export default MyAppointment;
