import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppointmentMobileNavbar from "@/components/AppointmentMobileNavbar";
import AppointmentSidebar from "@/components/AppointmentSidebar";
import { useEffect } from "react";

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
        <main className="flex-grow w-full p-6">
          <div className="w-full">
            <Outlet />
          </div>
          <Toaster position="top-center" />
        </main>
        <footer className="mt-auto py-4 px-6 border-t bg-background z-10"></footer>
      </div>
    </SidebarProvider>
  );
};

export default AppointmentLayout;
