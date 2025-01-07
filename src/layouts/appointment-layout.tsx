import { Toaster } from "@/components/ui/sonner";
import { BreadcrumbProvider } from "@/contexts/bread-crumb-context";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const AppointmentLayout = () => {
  const location = useLocation();

  return (
    <BreadcrumbProvider>
      <main className="flex-1 overflow-y-auto">
        {location.pathname === "/appointment" && (
          <Navigate to="/appointment/my-appointments" replace />
        )}
        <Outlet />
        <Toaster position="top-center" />
      </main>
    </BreadcrumbProvider>
  );
};

export default AppointmentLayout;