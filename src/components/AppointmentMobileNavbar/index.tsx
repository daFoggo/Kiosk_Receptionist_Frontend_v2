import { useEffect, useState } from "react";
import {
  Menu,
  ChevronUp,
  LogOut,
  User2,
  UserPen,
  Sparkles,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/ThemeToggle";
import { menuItems } from "@/components/AppointmentSidebar/constant";
import { useNavigate } from "react-router-dom";

const AppointmentMobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    username: "User name",
    ho_ten: "",
    gioi_tinh:  "",
    vai_tro: "",
    ngay_sinh: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = (e: any) => {
    e.preventDefault();
    localStorage.removeItem("access_token");
    navigate("/auth/appointment/login");
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <a href="/" className="flex items-center space-x-2">
          <Sparkles size={24} />
          <span className="text-xl font-semibold font-clash">
            Kiosk Appointment
          </span>
        </a>
        <Sheet open={isOpen} onOpenChange={() => setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetTitle>Kiosk Appointmenet</SheetTitle>
            <nav className="flex flex-col h-full">
              <div className="flex-1 py-4">
                <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                  Chính
                </h2>
                {menuItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.url}
                    className="flex items-center py-2 px-4 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </a>
                ))}
              </div>
              <div className="border-t py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <User2 className="mr-2 h-4 w-4" />
                      {user.ho_ten}
                      <ChevronUp className="ml-auto h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem>
                      <ThemeToggle />
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default AppointmentMobileNavbar;
