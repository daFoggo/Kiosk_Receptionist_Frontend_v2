import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppointmentMobileNavbar from "@/components/AppointmentMobileNavbar";
import AppointmentSidebar from "@/components/AppointmentSidebar";
import { useEffect } from "react";
import Notification from "@/components/Notification";

const AppointmentLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location.pathname === "/appointment" ||
      location.pathname === "/appointment/"
    ) {
      navigate("/appointment/my-appointments");
    }
  }, [location, navigate]);

  return (
    <SidebarProvider>
      <div className="flex flex-col md:flex-row min-h-screen w-full">
        <AppointmentMobileNavbar />
        <AppointmentSidebar />
        <main className="flex-grow w-full px-6">
          <div className="w-full">
            <div className="flex justify-between items-center py-4">
              <div></div>
              <Notification />
            </div>
            <Outlet />
          </div>
          <Toaster position="top-center" />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppointmentLayout;
