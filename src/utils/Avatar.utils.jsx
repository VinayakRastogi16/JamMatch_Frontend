import {
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {Settings} from "lucide-react"

export function DropdownMenuAvatar({setIsSignedIn}) {

  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("user")
  setIsSignedIn(false);
  navigate("/")
}
  return (
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="hover:opacity-50">
            <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="backdrop-blur-lg backdrop-grayscale bg-white/10 mt-4 mr-10 rounded-3xl" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BellIcon />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Account Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          
          <button className="flex w-full place-items-start pe-[7vh]" onClick={handleLogout}><LogOutIcon className="mt-[0.2vh]"/><span className="ms-3 place-items-center">Log Out</span></button>
        </DropdownMenuItem>
      </DropdownMenuContent>
      
    </DropdownMenu>
    </div>
  )
}
