import { Link } from "react-router-dom";
import { Button } from "./components/ui/button";
import { DropdownMenuAvatar } from "./utils/Avatar.utils";

const Navbar = ({isSignedIn, setIsSignedIn}) => {

  return (
    <div
      className="fixed top-6 left-10 right-10 z-50 h-16 
                backdrop-blur-lg 
                border 
                bg-white/10
                rounded-xl shadow-lg 
                overflow-visible
                flex items-center justify-between px-6"
    >
      <img
        src="/image.svg"
        className="h-[100px] mt-5 object-contain"
        alt="logo"
      />

      {isSignedIn ? (
        <DropdownMenuAvatar setIsSignedIn={setIsSignedIn}/>
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
