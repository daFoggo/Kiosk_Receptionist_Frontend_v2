import Footer from "@/components/Footer";
import NavBar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="relative flex min-h-screen flex-col w-full">
      <NavBar />
      <main className="flex-1 p-6 w-full">
        <Outlet />
        <Toaster position="top-center" />
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
