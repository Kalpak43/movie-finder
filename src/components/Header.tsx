import { Button } from "./ui/button";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { signOut } from "@/features/auth/authThunk";
import Searchbar from "./Searchbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Search, X } from "lucide-react";
import { useState } from "react";

function Header() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [open, setOpen] = useState(false);

  const handleSignout = () => {
    dispatch(signOut());
  };

  return (
    <header className="bg-black flex items-center gap-8 justify-between border-b-1 py-4 px-4 md:px-8 sticky top-0 z-50 border-b-2">
      <Link to={"/"}>
        <h2 className="md:text-2xl font-bold text-[#f6c700]">Movie Finder</h2>
      </Link>

      <nav className="flex items-center gap-4">
        <Button
          className="md:hidden"
          variant={"ghost"}
          onClick={() => setOpen((x) => !x)}
        >
          {open ? <X /> : <Search />}
        </Button>
        <div className="max-md:hidden">
          <Searchbar />
        </div>
        {user ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="rounded-full bg-[var(--highlight)] text-black"
                >
                  {user.email?.slice(0, 1).toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Button className="w-full" variant="ghost">
                  <Link to="/favorites">Favorites</Link>
                </Button>
                <Button
                  className="w-full text-red-500"
                  variant="ghost"
                  onClick={handleSignout}
                >
                  Sign out
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="rounded-full"
                >
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Button className="w-full" variant="ghost">
                  <Link to={"/login"}>Log in</Link>
                </Button>
                <Button className="w-full" variant="ghost">
                  <Link to={"/signup"}>Sign up</Link>
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </nav>

      {open && (
        <div className="p-4 absolute inset-x-0 top-full bg-[var(--header)] md:hidden">
          <Searchbar />
        </div>
      )}
    </header>
  );
}

export default Header;
