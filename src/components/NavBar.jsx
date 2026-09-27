import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { DropdownMenuAvatar } from "../utils/Avatar.utils";
import {
  Bell,
  Layers,
  LogOut,
  MessageCircle,
  Radar,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react";
import { AudioWaveform } from "lucide-react";
import { SlidersHorizontal } from "lucide-react";

const Navbar = ({ isSignedIn, setIsSignedIn }) => {
  return (
    <div
      className="fixed left-0 right-0 z-50 h-14 
                backdrop-blur-lg 
                border-b
                outline-none
                bg-[#111113] shadow-lg
                flex items-center justify-between px-[50vh] py-7"
    >
      <img
        src="/image.svg"
        className="h-[100px] mt-5 object-contain"
        alt="logo"
      />

      {isSignedIn ? (
        <div className=" flex gap-2 relative p-2 rounded-full hover:from-orange-500/70 transition">
          <Link to="/feed">
            <div
              title="Feed"
              className="nav-links bg-[#1B1B1D] text-gray-500 hover:text-[#E6E3DE] transition align-middle items-center justify-center flex h-8 w-8"
            >
              <span>
                <Layers className="h-4 w-4" />
              </span>
            </div>
          </Link>
          <Link to="/radar">
            <div
              title="Jam Radar"
              className="nav-links bg-[#1B1B1D] text-gray-500 hover:text-[#E6E3DE] transition align-middle items-center justify-center flex h-8 w-8"
            >
              <span>
                <Radar className="h-4 w-4" />
              </span>
            </div>
          </Link>
          <Link to="/band">
            <div
              title="Band Builder"
              className="nav-links bg-[#1B1B1D] text-gray-500 hover:text-[#E6E3DE] transition align-middle items-center justify-center flex h-8 w-8"
            >
              <span>
                <Users className="h-4 w-4" />
              </span>
            </div>
          </Link>
          <Link to="/tuner">
            <div
              title="Stage Tools"
              className="nav-links bg-[#1B1B1D] text-gray-500 hover:text-[#E6E3DE] transition align-middle items-center justify-center flex h-8 w-8"
            >
              <span>
                <SlidersHorizontal className="h-4 w-4" />
              </span>
            </div>
          </Link>
          <Link to="/messages">
            <div
              title="Messages"
              className="nav-links bg-[#1B1B1D] w-8 h-8 flex justify-center align-middle text-gray-500 items-center hover:text-[#E6E3DE] transition-colors cursor-pointer"
            >
              <span>
                <MessageCircle className="h-4 w-4" />
              </span>
            </div>
          </Link>
          <Link to="/notifications">
            <div
              title="Notifications"
              className="nav-links bg-[#1B1B1D] text-gray-500 hover:text-[#E6E3DE] transition align-middle items-center justify-center flex h-8 w-8"
            >
              <span>
                <Bell className="h-4 w-4" />
              </span>
            </div>
          </Link>
          <Link to="/audio1">
            <div
              title="Audio Rooms"
              className="nav-links bg-[#1B1B1D] text-gray-500 hover:text-[#E6E3DE] transition align-middle items-center justify-center flex h-8 w-8"
            >
              <span>
                <AudioWaveform className="h-4 w-4" />
              </span>
            </div>
          </Link>
          <Link to="/editProfle">
            <div
              title="Profile"
              className="nav-links bg-[#1B1B1D] text-gray-500 hover:text-[#E6E3DE] transition align-middle items-center justify-center flex h-8 w-8"
            >
              <span>
                <User className="h-4 w-4" />
              </span>
            </div>
          </Link>
          <Link to="/settings">
            <div
              title="Settings"
              className="nav-links bg-[#1B1B1D] text-gray-500 hover:text-[#E6E3DE] transition align-middle items-center justify-center flex h-8 w-8"
            >
              <span>
                <Settings className="h-4 w-4" />
              </span>
            </div>
          </Link>
          <DropdownMenuAvatar setIsSignedIn={setIsSignedIn}/>
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
