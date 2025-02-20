import { useTheme } from "@/contexts/ThemeProvider";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { signOut } from "@/features/auth/authThunk";

function Header() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = () => {
    dispatch(signOut());
  };

  return (
    <header className="flex items-center gap-8 justify-between border-b-1 py-4 px-8">
      <Link to={"/"}>
        <h2 className="text-2xl font-bold">Movie Finder</h2>
      </Link>
      <nav className="flex items-center gap-8">
        {user ? (
          <>
            <Link to="/favorites">Favorites</Link>
            <Button variant="ghost" onClick={handleSubmit}>
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Link to={"/login"}>Log in</Link>
            <Link to={"/signup"}>Sign up</Link>
          </>
        )}
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={toggleTheme}
          className="cursor-pointer"
        >
          {theme == "dark" ? <Sun /> : <Moon />}
        </Button>
      </nav>
    </header>
  );
}

export default Header;
