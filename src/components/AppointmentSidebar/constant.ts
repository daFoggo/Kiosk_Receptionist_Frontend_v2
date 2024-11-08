import { Building2, CalendarFold } from "lucide-react";

const prefix = "/appointment";
export const menuItems = [
  {
    title: "Lịch hẹn của tôi",
    url: `${prefix}/my-appointments`,
    icon: CalendarFold,
  },
  {
    title: "Danh sách phòng ban",
    url: `${prefix}/department-list`,
    icon: Building2,
  },
];
