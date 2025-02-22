import { Button } from "./ui/button";
import { Link, useLocation, useNavigate } from "react-router";
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
import { useToast } from "@/hooks/use-toast";
import { ButtonLink } from "./ui/ButtonLink";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

function Header() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [open, setOpen] = useState(false);

  const handleSignout = async () => {
    await dispatch(signOut());
    toast({
      title: "Logged out successfully",
      variant: "destructive",
    });
  };

  const onClickNavigate = async (path: string) => {
    navigate(path, { state: { from: location } });
  };

  return (
    <header className="bg-black flex items-center gap-8 justify-between border-b-1 py-4 px-4 md:px-8 sticky top-0 z-50 border-b-2">
      <Link to={"/"}>
        <h2 className="md:text-2xl font-bold text-[#f6c700]">Movie Finder</h2>
      </Link>

      <nav className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="md:hidden"
                variant={"ghost"}
                onClick={() => setOpen((x) => !x)}
              >
                {open ? <X /> : <Search />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Search a movie</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="max-md:hidden">
          <Searchbar />
        </div>
        {user ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        className="rounded-full bg-[var(--highlight)] text-black"
                      >
                        {user.user_metadata.avatar_url ? (
                          <img src={user.user_metadata.avatar_url} alt="" className="rounded-full" />
                        ) : (
                          user.email?.slice(0, 1).toUpperCase()
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View your options</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <ButtonLink to="/favorites" className="w-full" variant="ghost">
                  Favorites
                </ButtonLink>
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        className="rounded-full"
                      >
                        <EllipsisVertical />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>More options</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Button
                  onClick={() => onClickNavigate("/login")}
                  className="w-full"
                  variant="ghost"
                >
                  Log in
                </Button>
                <Button
                  onClick={() => onClickNavigate("/signup")}
                  className="w-full"
                  variant="ghost"
                >
                  Sign up
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
