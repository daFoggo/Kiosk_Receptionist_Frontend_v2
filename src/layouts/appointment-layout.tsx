import { Outlet } from "react-router-dom";
import { BreadcrumbProvider } from "@/contexts/bread-crumb-context";
import { Toaster } from "@/components/ui/sonner";

const AppointmentLayout = () => {
  return (
    <BreadcrumbProvider>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
        <Toaster position="top-center" />
      </main>
    </BreadcrumbProvider>
  );
};

export default AppointmentLayout;
