import { useTheme } from "next-themes";

import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <span
      className="flex items-center cursor-pointer"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
      <Moon className="mr-2 h-4 w-4" />
      ) : (
      <Sun className="mr-2 h-4 w-4" />
      )}
      <span className="hidden md:inline">Thay đổi chủ đề</span>
    </span>
  );
};

export default ThemeToggle;
