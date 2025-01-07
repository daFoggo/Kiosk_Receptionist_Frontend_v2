import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import {
  Command,
} from "lucide-react";
import * as React from "react";
import { NAVIGATION_LINKS } from "./constant";
import NavMain from "./nav-main";
import NavUser from "./nav-user";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const user = useAuth()?.user ?? {
    name: "Thay giao ba dao",
    role: "Admin",
  };
  
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary">
                  <Command className="size-4 text-white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Kiosk receptionist
                  </span>
                  <span className="truncate text-xs">
                    Hệ thống đặt lịch hẹn
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAVIGATION_LINKS} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
