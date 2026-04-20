import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { DropdownMenuAvatar } from "../utils/Avatar.utils";
import { MessageCircle, Search } from "lucide-react";

const Navbar = ({ isSignedIn, setIsSignedIn }) => {
  return (
    <div
      className="fixed top-6 left-10 right-10 z-50 h-16 
                backdrop-blur-lg 
                border
                outline-none
                bg-white/10
                rounded-full shadow-lg
                flex items-center justify-between px-6"
    >
      <img
        src="/image.svg"
        className="h-[100px] mt-5 object-contain"
        alt="logo"
      />

      {
        isSignedIn? (<div className="flex justify-center w-full">
  <div className="relative w-[400px]">

    {/* Icon */}
    <Search
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
    />

    {/* Input */}
    <input
      type="text"
      placeholder="Search musicians, genres..."
      className="
        w-full pl-10 pr-4 py-2.5
        rounded-full
        bg-white/5
        border border-white/10
        text-sm text-white
        placeholder-gray-400
        backdrop-blur-md
        transition-all duration-300

        focus:outline-none
        focus:border-orange-500
        focus:bg-white/10
        focus:shadow-[0_0_10px_rgba(249,115,22,0.4)]
      "
    />
  </div>
</div>):<></>
      }

      {isSignedIn ? (
        <div  className=" flex gap-3 relative p-2 rounded-full bg-gradient-to-br from-orange-500/40 to-transparent hover:from-orange-500/70 transition">
          <Link to="/messages">
            <MessageCircle className="w-8 h-8 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
          </Link>
          <DropdownMenuAvatar setIsSignedIn={setIsSignedIn} />
        </div>
      ) : (
        <div className="font-extrabold ">
          <Link to="/signup" className="text-sm font-medium me-[4vh]">
            <span>Sign</span> <span className="text-[#f68523]">Up</span>
          </Link>

          <Link to="/" className="text-sm font-medium">
            <span>Log</span> <span className="text-[#f68523]">In</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
