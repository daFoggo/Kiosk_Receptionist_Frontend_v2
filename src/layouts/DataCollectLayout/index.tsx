import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import DataCollectNavBar from "@/components/DataCollectNavbar";

const DataCollectLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location.pathname === "/data-collect" ||
      location.pathname === "/data-collect/"
    ) {
      navigate("/data-collect/image-upload");
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full sticky top-0 z-50">
        <DataCollectNavBar />
      </nav>

      <main className="flex-grow flex flex-col px-4 md:px-6 py-4 md:py-6">
        <div className="w-full max-w-7xl mx-auto flex-grow">
          <Outlet />
        </div>

        <Toaster position="top-center" />
      </main>

      <footer className="z-10 px-4 md:px-6 py-4">{/* Footer content */}</footer>
    </div>
  );
};

export default DataCollectLayout;
