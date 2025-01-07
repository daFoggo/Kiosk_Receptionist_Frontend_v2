import {
  createBrowserRouter,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { routes } from "./routes";

import { useAuth } from "@/contexts/auth-context";

import AppointmentLayout from "@/layouts/appointment-layout";
import AuthLayout from "@/layouts/auth-layout";

import DepartmentList from "@/pages/DepartmentList/";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import MyAppointment from "@/pages/MyAppointment";

import frogJumping from "@/assets/gifs/frog-laughing.gif";
import { IAuthContextType } from "@/models/auth-context";
import AppointmentDashboard from "@/pages/AppointmentDashboard";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { isAuthenticated = false, user } = useAuth() as IAuthContextType;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser && !isAuthenticated) {
      return;
    }

    if (!storedToken || !storedUser) {
      navigate(routes.login, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Outlet /> : null;
};

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: routes.login,
        element: <Login />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: routes.appointment.dashboard,
        element: <AppointmentLayout />,
        children: [
          {
            path: routes.appointment.dashboard,
            element: <AppointmentDashboard />,
            children: [
              {
                path: routes.appointment.myAppointment(),
                element: <MyAppointment />,
              },
              {
                path: routes.appointment.departmentList(),
                element: <DepartmentList />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "*",
    element: (
      <div className="flex flex-col gap-2 items-center justify-center h-screen w-full">
        <p className="font-semibold">Biết ông bốn không ? </p>
        <p className="font-semibold">404 Not Found</p>
        <img
          src={frogJumping}
          alt="insert ảnh ếch cười vào mặt bạn"
          className="rounded-md"
        />
      </div>
    ),
  },
]);

export default router;
