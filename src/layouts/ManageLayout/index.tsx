import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import RootSidebar from "@/components/RootSidebar";
import MobileRootNavbar from "@/components/MobileRootNavBar";
import { isTokenValid } from "@/utils/Helper/common";
import { useEffect } from "react";

const ManageLayout = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   checkToken()
  // }, [navigate])

  useEffect(() => {
    if (location.pathname === "/admin" || location.pathname === "/admin/") {
      navigate("/admin/identify-data");
    }
  }, [location, navigate]);

  const checkToken = async () => {
    const token = localStorage.getItem("token");
    const tokenCheck = await isTokenValid(token);
    if (tokenCheck.success) {
      navigate("/dashboard");
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col md:flex-row min-h-screen w-full">
        <MobileRootNavbar />
        <RootSidebar />
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

export default ManageLayout;
