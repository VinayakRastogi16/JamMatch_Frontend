import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import logo from "../assets/image.svg"
import { DropdownMenuAvatar } from "../utils/Avatar.utils";
import {
  Bell,
  Layers,
  MessageCircle,
  Menu,
  Radar,
  Settings,
  User,
  Users,
} from "lucide-react";
import { AudioWaveform } from "lucide-react";
import { SlidersHorizontal } from "lucide-react";
import NavbarDrawer from "./NavbarDrawer/Drawer.jsx";

const Navbar = ({ isSignedIn, setIsSignedIn }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-14 
                backdrop-blur-lg 
                border-b
                bg-[#111113] shadow-lg
                flex items-center px-4 sm:px-6 lg:px-10 xl:px-16"
    >
      <Link to="/feed" className="shrink-0">
        <img
          src={logo}
          className="h-14 mt-3 sm:h-16 w-auto object-contain"
          alt="JamMatch"
        />
      </Link>

      {isSignedIn ? (
        <>
          <div className="hidden lg:flex ml-auto items-center gap-2">
            <Link to="/feed">
              <div
                title="Feed"
                className="nav-links bg-[#1B1B1D] text-gray-500 hover:text-[#E6E3DE] transition items-center justify-center flex h-8 w-8"
              >
                <span>
                  <Layers className="h-4 w-4" />
                </span>
              </div>
            </Link>


            <Link to="/radar">
              <div
                title="Jam Radar"
                className="nav-links bg-[#1B1B1D] text-gray-500 hover:text-[#E6E3DE] transition items-center justify-center flex h-8 w-8"
              >
                <span>
                  <Radar className="h-4 w-4" />
                </span>
              </div>
            </Link>


            <Link to="/band">
              <div
                title="Band Builder"
                className="nav-links bg-[#1B1B1D] text-gray-500 hover:text-[#E6E3DE] transition items-center justify-center flex h-8 w-8"
              >
                <span>
                  <Users className="h-4 w-4" />
                </span>
              </div>
            </Link>


            <Link to="/tuner">
              <div
                title="Stage Tools"
                className="nav-links bg-[#1B1B1D] text-gray-500 hover:text-[#E6E3DE] transition items-center justify-center flex h-8 w-8"
              >
                <span>
                  <SlidersHorizontal className="h-4 w-4" />
                </span>
              </div>
            </Link>


            <Link to="/messages">
              <div
                title="Messages"
                className="nav-links bg-[#1B1B1D] w-8 h-8 flex justify-center text-gray-500 items-center hover:text-[#E6E3DE] transition-colors cursor-pointer"
              >
                <span>
                  <MessageCircle className="h-4 w-4" />
                </span>
              </div>
            </Link>


            <Link to="/notifications">
              <div
                title="Notifications"
                className="nav-links bg-[#1B1B1D] text-gray-500 hover:text-[#E6E3DE] transition items-center justify-center flex h-8 w-8"
              >
                <span>
                  <Bell className="h-4 w-4" />
                </span>
              </div>
            </Link>


            <Link to="/audio1">
              <div
                title="Audio Rooms"
                className="nav-links bg-[#1B1B1D] text-gray-500 hover:text-[#E6E3DE] transition items-center justify-center flex h-8 w-8"
              >
                <span>
                  <AudioWaveform className="h-4 w-4" />
                </span>
              </div>
            </Link>


            <Link to="/editProfle">
              <div
                title="Profile"
                className="nav-links bg-[#1B1B1D] text-gray-500 hover:text-[#E6E3DE] transition items-center justify-center flex h-8 w-8"
              >
                <span>
                  <User className="h-4 w-4" />
                </span>
              </div>
            </Link>


            <Link to="/settings">
              <div
                title="Settings"
                className="nav-links bg-[#1B1B1D] text-gray-500 hover:text-[#E6E3DE] transition items-center justify-center flex h-8 w-8"
              >
                <span>
                  <Settings className="h-4 w-4" />
                </span>
              </div>
            </Link>


            <DropdownMenuAvatar setIsSignedIn={setIsSignedIn} />
          </div>

          {/* Mobile Menu */}
          <div className="ml-auto lg:hidden">
            <button onClick={()=>setDrawerOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#1b1b1d] transition ">
            <Menu className="h-6 w-6"/>
          </button>
          </div>
          <NavbarDrawer open={drawerOpen}
            setOpen={setDrawerOpen}
          />
        </>
      ) : (
        <div className="ml-auto flex items-center gap-4 font-extrabold">
          <Link to="/signup" className="text-sm font-medium">
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
