import { useState, useEffect } from "react";
import axios from "axios";
import AppointmentTable from "@/components/AppointmentTable";
import { getAppointmentsIp } from "@/utils/ip";
import { useAuth } from "@/contexts/auth-context";
import AppointmentUtility from "../AppointmentUtility";

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
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
      <div className="w-full md:w-3/4">
        <AppointmentTable appointments={appointments} />
      </div>
      <div className="w-full md:w-1/4">
        <AppointmentUtility />
      </div>
    </div>
  );
};

export default MyAppointment;

