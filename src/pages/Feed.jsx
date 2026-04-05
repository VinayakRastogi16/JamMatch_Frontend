import { useEffect, useState } from "react";
import {
  Music,
  Heart,
  Star,
  Disc3,
  Headphones,
  SkipForward,
  Volume2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import API from "../services/api";

const Feed = () => {
  const [matches, setMatches] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/matches");
        setMatches(res.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <div className="min-h-screen bg-background font-body flex flex-col overflow-hidden relative place-items-center">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Stage spotlights */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 left-1/4 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[80px]" />

          {/* Grid lines like a mixing board */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          <div
            className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-primary/[0.06] animate-spin-slow"
            style={{ animationDuration: "40s" }}
          >
            <div className="absolute inset-6 rounded-full border border-primary/[0.04]" />
            <div className="absolute inset-12 rounded-full border border-primary/[0.03]" />
            <div className="absolute inset-20 rounded-full bg-primary/[0.04]" />
          </div>

          {/* Scattered music icons */}
          <Disc3 className="absolute top-[20%] right-[8%] w-10 h-10 text-primary/[0.05] animate-spin-slow" />
          <Music
            className="absolute bottom-[30%] left-[8%] w-7 h-7 text-primary/[0.06] animate-float"
            style={{ animationDelay: "0.5s" }}
          />
          <Headphones
            className="absolute top-[60%] right-[15%] w-8 h-8 text-primary/[0.04] animate-float"
            style={{ animationDelay: "1.5s" }}
          />
          <Volume2
            className="absolute top-[40%] left-[12%] w-6 h-6 text-primary/[0.05] animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="flex justify-between h-[60vh] w-[40vh] rounded-xl bg-white/10 backdrop-blur-md z-50 mt-[20vh] left-10">
          <div className="h-[18.7vh] border-b-2 border-dashed border-zinc-700 w-[40vh]">
            <span class="inline-flex items-center rounded-xl mt-2 ml-2 bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 inset-ring inset-ring-gray-400/20">
            </span>
          </div>
          <div className="fixed w-4 h-8 bg-[#171414] rounded-r-full z-50 mt-[17vh]"></div>

          <div className="relative w-4 h-8 bg-[#171414] rounded-l-full z-50 mt-[17vh]"></div>
        </div>
      </div>
    </>
  );
};

export default Feed;
