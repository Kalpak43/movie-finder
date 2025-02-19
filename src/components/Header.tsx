import { useTheme } from "@/contexts/ThemeProvider";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="flex items-center gap-8 justify-between border-b-1 py-4 px-8">
      <h2 className="text-2xl font-bold">Movie Finder</h2>
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={toggleTheme}
        className="cursor-pointer"
      >
        {theme == "dark" ? <Sun /> : <Moon />}
      </Button>
    </header>
  );
}

export default Header;
