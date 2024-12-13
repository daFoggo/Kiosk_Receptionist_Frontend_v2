import { routes } from "@/router/routes";
import { Boxes, CalendarRange } from "lucide-react";

export const NAVIGATION_LINKS = [
  {
    title: "Lịch hẹn của tôi",
    icon: CalendarRange,
    url: routes.appointment.myAppointment(),
    isActive: false,
    items: [
    ],
  },
  {
    title: "Danh sách phòng ban",
    icon: Boxes ,
    url: routes.appointment.departmentList(),
    isActive: false,
    items: [
    ],
  },
];
