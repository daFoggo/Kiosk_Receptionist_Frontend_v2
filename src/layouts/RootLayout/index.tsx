import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col">
        <div className="w-full max-w-7xl mx-auto flex-grow">
          <Outlet />
        </div>

        <Toaster position="top-center" />
      </main>
    </div>
  );
};

export default RootLayout;
