;
import MainNav from "./main-nav";
import MobileNav from "./mobile-nav";
import { ThemeToggle } from "@/components/ThemeToggle";

const NavBar = () => {
  return (
    <header className=" sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between items-center p-6">
      <MainNav />
      <MobileNav />
      <div className="flex flex-1 items-center justify-end space-x-4">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default NavBar;
