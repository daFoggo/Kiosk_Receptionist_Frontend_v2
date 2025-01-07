import Logo from "@/components/Logo";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const MainNav = () => {
  return (
    <div className="mr-4 hidden md:flex items-center">
      <Link to="/auth/login" className="mr-6 flex items-center space-x-2">
        <Logo />
      </Link>
      <NavigationMenu></NavigationMenu>
    </div>
  );
};

export default MainNav;
