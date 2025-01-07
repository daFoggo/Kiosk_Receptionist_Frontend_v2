import AppointmentTable from "@/components/AppointmentTable";
import { useAuth } from "@/contexts/auth-context";
import { getAppointmentsIp } from "@/utils/ip";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import AppointmentUtility from "../AppointmentUtility";
import { IAppointment } from "@/models/appointment-table";

const MyAppointment = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<IAppointment[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedValue] = useDebounce(searchValue, 500);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cccdId = useAuth()?.user.cccd_id ?? "";

  useEffect(() => {
    handleGetAppointments();
  }, [cccdId]);

  const handleGetAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${getAppointmentsIp}?cccd_id=${cccdId}`
      );
      setAppointments(response.data.payload);
      setFilteredAppointments(response.data.payload);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    if (!debouncedValue.trim()) {
      setFilteredAppointments(appointments);
      setIsLoading(false);
      return;
    }

    const searchResult = appointments.filter(appointment =>
      appointment.nguoi_duoc_hen.some(attendee =>
        attendee.cccd.toLowerCase().includes(debouncedValue.toLowerCase())
      )
    );

    setFilteredAppointments(searchResult);
    setIsLoading(false);
  }, [debouncedValue, appointments]);

  const handleSearchByAttendee = (value: string) => {
    setSearchValue(value);
    console.log(value);
  };

  const handleSearchByRole = (role: string) => {
    setIsLoading(true);
  
    let filtered = appointments;
  
    // if (role === "isOwner") {
    //   filtered = appointments.filter(appointment => appointment.isOwner);
    // } else if (role === "isParticipant") {
    //   filtered = appointments.filter(appointment => !appointment.isOwner);
    // }
  
    setFilteredAppointments(filtered);
    setIsLoading(false);
  };

  const displayAppointments = useMemo(() =>
    filteredAppointments,
    [filteredAppointments]
  );

  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
      <div className="w-full md:w-3/4">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <AppointmentTable appointments={displayAppointments} />
        )}
      </div>
      <div className="w-full md:w-1/4">
        <AppointmentUtility
          handleSearchByAttendee={handleSearchByAttendee}
          handleSearchByRole={handleSearchByRole}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default MyAppointment;