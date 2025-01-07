import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { routes } from "@/router/routes";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex flex-col p-0"
      >
        <SheetTitle className="p-4">
          <Logo />
        </SheetTitle>
        <Link to={routes.appointment.myAppointment()}>
          <Button variant="ghost">Lịch hẹn của tôi</Button>
        </Link>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
