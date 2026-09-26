import {
  Disc3,
  Headphones,
  Music,
  Volume2,
  Bell,
  Eye,
  Locate,
  SlidersVertical,
  Globe,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import Option from "../components/ui/Option";
import { useState } from "react";

const Settings = () => {
  //Notification states
  const [newMatches, setNewMatches] = useState(true);
  const [messages, setMessages] = useState(true);
  const [liveAudioRooms, setLiveAudioRooms] = useState(false);
  const [weeklyEmail, setWeeklyEmail] = useState(true);

  //Profile States
  const [profileVisibility, setProfileVisibility] = useState("Everyone");
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [readReceipts, setReadReceipts] = useState(false);

  //Discovery States
  const [enableDisc, setEnableDisc] = useState(true);
  const [radius, setRadius] = useState(25);

  //Lang States
  const [lang, setLang] = useState("English");

  //Audio/Video States
  const [autoplay, setAutoplay] = useState(false);
  const [hdEnabled, setHdEnabled] = useState(true);
  const [noiseCancellation, setNoiseCancellation] = useState(false);

  const notificationOptions = [
    {
      id: "newMatches",
      title: "New matches",
      desc: "Someone jams back with you",
      type: "toggle",
      value: newMatches,
      onChange: setNewMatches,
    },
    {
      id: "messages",
      title: "Messages",
      desc: "Direct messages and call requests",
      type: "toggle",
      value: messages,
      onChange: setMessages,
    },
    {
      id: "liveAudioRooms",
      title: "Live audio rooms",
      desc: "When a room you follow goes live",
      type: "toggle",
      value: liveAudioRooms,
      onChange: setLiveAudioRooms,
    },
    {
      id: "weeklyEmail",
      title: "Weekly email digest",
      desc: "Highlights from your scene",
      type: "toggle",
      value: weeklyEmail,
      onChange: setWeeklyEmail,
    },
  ];

  const privacyOptions = [
    {
      id: "visibility",
      title: "Profile visibility",
      type: "select",
      value: profileVisibility,
      values: ["Everyone", "Matches", "Nobody"],
      onChange: setProfileVisibility,
    },

    {
      id: "onlineStatus",
      title: "Show online status",
      type: "toggle",
      value: showOnlineStatus,
      onChange: setShowOnlineStatus,
    },

    {
      id: "distance",
      title: "Show distance",
      desc: "Display approximate distance on your card",
      type: "toggle",
      value: showDistance,
      onChange: setShowDistance,
    },

    {
      id: "readReceipts",
      title: "Read receipts",
      type: "toggle",
      value: readReceipts,
      onChange: setReadReceipts,
    },
  ];

  const discoveryOptions = [
    {
      id: "discovery",
      title: "Appear in discovery",
      desc: "Allow other musicians to discover you",
      type: "toggle",
      value: enableDisc,
      onChange: setEnableDisc,
    },

    {
      id: "searchRadius",
      title: "Search Radius",
      type: "slider",
      min: 1,
      max: 100,
      value: radius,
      onChange: setRadius,
    },
  ];

  const regionOptions = [
    {
      id: "language",
      title: "App language",
      type: "select",
      value: lang,
      values: ["English", "हिन्दी", "Coming soon"],
      onChange: setLang,
    },
  ];

  const audioVideoOptions = [
    {
      id: "samples",
      title: "Autoplay audio samples",
      type: "toggle",
      value: autoplay,
      onChange: setAutoplay,
    },

    {
      id: "camera",
      title: "HD Video Calls",
      desc: "Use more bandwidth",
      type: "toggle",
      value: hdEnabled,
      onChange: setHdEnabled,
    },

    {
      id: "noiseCancellation",
      title: "Noise cancellation",
      desc: "Reduce background noise during calls",
      type: "toggle",
      value: noiseCancellation,
      onChange: setNoiseCancellation,
    },
  ];

  return (
    <div className="relative z-10 pt-20 max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-5 animate-fade-in">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Stage spotlights */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 left-1/4 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[80px]" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <Disc3 className="fixed top-[20%] right-[8%] w-10 h-10 text-primary/[.21] animate-spin" />
        <Music className="fixed bottom-[30%] left-[8%] w-7 h-7 text-primary/[.21] animate-bounce" />
        <Headphones className="fixed top-[60%] right-[15%] w-8 h-8 text-primary/[.21] animate-bounce" />
        <Volume2
          className="fixed top-[40%] left-[12%] w-6 h-6 text-primary/[.21] animate-bounce"
          style={{ animationDelay: "2s" }}
        />
      </div>
      <div className="pt-12">
        <h1 className="text-white text-2xl sm:text-3xl font-heading font-bold text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tune your JamMatch experience like a mixing board.
        </p>
      </div>
      <Option
        icon={Bell}
        title="Notifications"
        desc="What reaches you, and how"
        options={notificationOptions}
      />
      <Option
        icon={Eye}
        title="Privacy"
        desc="Control who sees your pass"
        options={privacyOptions}
      />
      <Option
        icon={Locate}
        title="Discovery"
        desc="Who shows up in your feed"
        options={discoveryOptions}
      />
      <Option
        icon={SlidersVertical}
        title="Audio & Video"
        desc="Default for Jams and Calls"
        options={audioVideoOptions}
      />
      <Option icon={Globe} title="Language & Region" options={regionOptions} />

      <div>
        <div className="border rounded-xl p-5 sm:p-6 bg-red-500/10 backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-primary/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-[#f62323]" />
            </div>

            <div>
              <h1 className="font-heading text-base font-bold text-foreground">
                Danger Zone
              </h1>

              <p className="text-sm text-muted-foreground">
                Deleting your account removes matches, chats and samples.
              </p>
            </div>

            <button
              type="button"
              className="flex ms-5 items-center gap-3 align-middle justify-center border p-5 mt-4 backdrop-blur-sm rounded-full bg-red-500 hover:bg-red-600/100 transition"
            >
              <Trash2 /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;