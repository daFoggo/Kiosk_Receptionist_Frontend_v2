import { ScanFace, CalendarDays, Theater } from "lucide-react";

const prefix = "/admin";
export const menuItems = [
  {
    title: "Dữ liệu nhận diện",
    url: `${prefix}/identify-data`,
    icon: ScanFace,
  },
  {
    title: "Lịch công tác viện",
    url: `${prefix}/institue-calendar`,
    icon: CalendarDays,
  },
  {
    title: "Quản lý sự kiện",
    url: `${prefix}/event-management`,
    icon: Theater,
  },
];
