import { Button } from "./ui/button";
import { useTheme } from "@/contexts/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

function ThemeToggler() {
  const { theme, toggleTheme } = useTheme();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={toggleTheme}
            className="cursor-pointer fixed z-50 bottom-0 right-0 m-4"
          >
            {theme == "dark" ? <Sun /> : <Moon />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{theme == "dark" ? "light " : "dark "} theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ThemeToggler;
