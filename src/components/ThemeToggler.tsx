import { Button } from "./ui/button";
import { useTheme } from "@/contexts/ThemeProvider";
import { Moon, Sun } from "lucide-react";

function ThemeToggler() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant={"outline"}
      size={"icon"}
      onClick={toggleTheme}
      className="cursor-pointer fixed z-50 bottom-0 right-0 m-4"
    >
      {theme == "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}

export default ThemeToggler;
