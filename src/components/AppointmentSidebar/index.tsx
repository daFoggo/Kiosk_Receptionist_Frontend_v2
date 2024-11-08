import { ChevronUp, LogOut, Sparkles, User2, } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ThemeToggle from "../ThemeToggle";
import { menuItems } from "./constant";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AdminSidebar = () => {
  const [user, setUser] = useState({
    id: "",
    username: "User name",
    email: "",
    fullName: "",
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
    localStorage.removeItem("token");
    navigate("/auth/appointment/login");
  };

  return (
    <Sidebar collapsible="icon" className="hidden md:flex">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="font-semibold">
              <SidebarMenuItem key="header">
                <SidebarMenuButton className="lg" asChild>
                  <a href="/appointment/">
                    <Sparkles size={24} />
                    <span className="text-xl font-semibold font-clash">
                      Kiosk Appointment
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        <SidebarGroup>
          <SidebarGroupLabel>Chính</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="font-semibold">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user.username}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <ThemeToggle />
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout}>
                  <span className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarTrigger></SidebarTrigger>
    </Sidebar>
  );
};

export default AdminSidebar;
