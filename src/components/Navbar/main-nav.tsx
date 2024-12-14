import { Link } from "react-router-dom";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { routes } from "@/router/routes";

const MainNav = () => {
  return (
    <div className="mr-4 hidden md:flex items-center">
      <Link to="/" className="mr-6 flex items-center space-x-2">
        <Logo />
      </Link>
      <NavigationMenu>
      <Link to={routes.appointment.myAppointment()}>
          <Button variant="ghost">Lịch hẹn của tôi</Button>
        </Link>
      </NavigationMenu>
    </div>
  );
};

export default MainNav;
