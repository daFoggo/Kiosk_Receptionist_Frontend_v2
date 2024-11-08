import { createBrowserRouter, RouteObject } from "react-router-dom";
import routes from "./routerConfig";

import RootLayout from "@/layouts/RootLayout";
import ManageLayout from "@/layouts/ManageLayout";
import AppointmentLayout from "@/layouts/AppointmentLayout";
import DataCollectLayout from "@/layouts/DataCollectLayout";
import AuthLayout from "@/layouts/AuthLayout";

import Home from "@/pages/Home";
import ImageUpload from "@/pages/ImageUpload";
import IdentifyDataManagement from "@/pages/IdentifyDataManagement";
import InstitueCalendarManagement from "@/pages/InstitueCalendarManagement";
import EventManagement from "@/pages/EventManagement";
import AppointmentLogin from "@/pages/AppointmentLogin";
import AppointmentRegister from "@/pages/AppointmentRegister";
import AdminLogin from "@/pages/AdminLogin";
import MyAppointment from "@/pages/MyAppointment";
import DepartmentList from "@/pages/DepartmentList/";

const routeLayout: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/admin",
    element: <ManageLayout />,
    children: [
      {
        path: routes.identifyData,
        element: <IdentifyDataManagement />,
      },
      {
        path: routes.institueCalendar,
        element: <InstitueCalendarManagement />,
      },
      {
        path: routes.eventManagement,
        element: <EventManagement />,
      },
    ],
  },
  {
    path: "/data-collect",
    element: <DataCollectLayout />,
    children: [
      {
        path: routes.imageUpload,
        element: <ImageUpload />,
      },
    ],
  },
  {
    path: "/appointment",
    element: <AppointmentLayout />,
    children: [
      {
        path: routes.myAppointment,
        element: <MyAppointment />,
      },
      {
        path: routes.departmentList,
        element: <DepartmentList />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: routes.adminLogin,
        element: <AdminLogin />,
      },
      {
        path: routes.appointmentLogin,
        element: <AppointmentLogin />,
      },
      {
        path: routes.appointmentRegister,
        element: <AppointmentRegister />,
      },
    ],
  },
];

const router = createBrowserRouter(routeLayout);

export default router;
