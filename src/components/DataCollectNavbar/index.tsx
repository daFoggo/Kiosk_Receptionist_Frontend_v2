import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import { Sparkles } from "lucide-react";

const DataCollectNavBar = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 flex justify-between items-center w-full border-b shadow-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="">
        <Button
          variant="ghost"
          className="text-2xl font-semibold font-clash hover:scale-105 transition-transform"
          icon={<Sparkles size={24} className="h-6 w-6" />}
          onClick={() => navigate("/data-collect/image-upload")}
        >
          Kiosk Receptionist
        </Button>
      </div>

      <div className="font-semibold">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default DataCollectNavBar;
