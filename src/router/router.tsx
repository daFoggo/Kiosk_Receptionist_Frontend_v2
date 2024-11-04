import { createBrowserRouter, RouteObject } from "react-router-dom";
import routes from "./routerConfig";

import RootLayout from "@/layouts/RootLayout";
import ManageLayout from "@/layouts/ManageLayout";
import DataCollectLayout from "@/layouts/DataCollectLayout";
import AuthLayout from "@/layouts/AuthLayout";

import Login from "@/pages/Login";
import Home from "@/pages/Home";
import ImageUpload from "@/pages/ImageUpload";
import IdentifyDataManagement from "@/pages/IdentifyDataManagement";
import InstitueCalendarManagement from "@/pages/InstitueCalendarManagement";
import EventManagement from "@/pages/EventManagement";

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
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: routes.login,
        element: <Login />,
      },
    ],
  },
];

const router = createBrowserRouter(routeLayout);

export default router;
