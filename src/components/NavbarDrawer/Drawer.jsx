import { Link } from "react-router-dom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
  DrawerFooter,
} from "../ui/drawer";
import {
  Bell,
  Layers,
  MessageCircle,
  Radar,
  Settings,
  User,
  Users,
  AudioWaveform,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "../ui/button";

const NavbarDrawer = ({ open, setOpen }) => {
  const navigation = [
    {
      to: "/feed",
      label: "Feed",
      icon: Layers,
    },
    {
      to: "/radar",
      label: "Radar",
      icon: Radar,
    },
    {
      to: "/band",
      label: "Band Builder",
      icon: Users,
    },
    {
      to: "/tuner",
      label: "Stage Tool",
      icon: SlidersHorizontal,
    },
    {
      to: "/messages",
      label: "Chats",
      icon: MessageCircle,
    },
    {
      to: "/notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      to: "/audio1",
      label: "Audio Rooms",
      icon: AudioWaveform,
    },
    {
      to: "/editProfile",
      label: "Profile",
      icon: User,
    },
    {
      to: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <Drawer
  open={open}
  onOpenChange={setOpen}
  direction="right"
>
  <DrawerContent
    className="
      h-full
      w-[320px]
      max-w-[85vw]
      rounded-l-xl
      border-l
      border-gray-800
      bg-[#111113]
      p-0
    "
  >
    <DrawerHeader className="px-6 pt-6">
      <DrawerTitle className="text-left text-[#E6E3DE] text-lg">
        Navigation
      </DrawerTitle>
    </DrawerHeader>

    <div className="flex-1 overflow-y-auto hide-scrollbar px-4">
      <nav className="mt-4 flex flex-col gap-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="
                flex
                items-center
                gap-4
                rounded-lg
                p-4
                text-gray-400
                hover:bg-orange-400/50
                hover:text-[#E6E3DE]
                transition-colors
              "
            >
              <Icon className="h-5 w-5" />

              <span className="text-sm font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>

    <DrawerFooter>
      <DrawerClose render={<Button variant="outline">Cancel</Button>} />
    </DrawerFooter>
  </DrawerContent>
</Drawer>
  );
};

export default NavbarDrawer;
