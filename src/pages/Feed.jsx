import { useEffect, useState } from "react";
import {
  Music,
  Heart,
  Star,
  Drum,
  Disc3,
  Headphones,
  SkipForward,
  Volume2,
  SkipBack,
} from "lucide-react";
import { Button } from "../components/ui/button";
import API from "../services/api";

const Feed = () => {
  const [matches, setMatches] = useState([]);
  const [currIdx, setCurrIdx] = useState(0);

  const currMatch = matches[currIdx];
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

  const next = () => {
    if (currIdx < matches.length - 1) {
      setCurrIdx(currIdx + 1);
    }
  };

  const prev = () => {
    if (currIdx > 0) {
      setCurrIdx(currIdx - 1);
    }
  };

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
            {currMatch && (
              <div className="gap-2">
                <span className="inline-flex items-center rounded-xl mt-2 ml-2 bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400">
                  {currMatch.user.name}
                </span>
                <span className="inline-flex items-center rounded-xl mt-2 ml-2 bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400">
                  {currMatch.user.age}
                </span>

                <div className="flex gap-2 flex-wrap">
                  {currMatch.user.availability.map((item, i) => (
                    <span
                      className="inline-flex items-center rounded-xl mt-2 ml-2 bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400"
                      key={i}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {currMatch.user.instrument.map((inst, i) => (
                    <span
                      className="inline-flex items-center rounded-xl mt-2 ml-2 bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400"
                      key={i}
                    >
                      {inst}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="fixed w-4 h-8 bg-[#171414] rounded-r-full z-50 mt-[17vh]"></div>

          <div className="relative w-4 h-8 bg-[#171414] rounded-l-full z-50 mt-[17vh]"></div>
        </div>
        <div className="flex mt-5 w-1/6 justify-between p-5">
          <button
            onClick={prev}
            className="group relative w-14 h-14 border-2 border-border/60 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center transition-all duration-200 hover:border-destructive/50 hover:bg-red-400/5 active:scale-90"
          >
            <SkipBack className="w-5 h-5 text-muted-foreground group-hover:text-[#f699ce] transition-colors" />
            <span className="absolute -bottom-6 text-[12px] text-[#f699ce] font-heading font-medium opacity-0 group-hover:opacity-100 transition-opacity">Back</span>
          </button>

          <button
            className="group relative w-14 h-14 border-2 border-border/60 shadow-[var(--glow-primary)] hover:shadow-[0_0_50px_hsl(28_92%_55%/0.45)] rounded-full bg-white/10 backdrop-blur flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 transition-all duration-200 hover:border-destructive/50 hover:bg-orange-400/5 active:scale-90 hover:scale-110"
            onClick={next}
          >

            <Drum className="w-5 h-5 text-primary-foreground group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-accent/25 opacity-0 group-hover:opacity-100 transition-opacit"></div>
            <span className="absolute -bottom-6 text-[12px] text-primary font-heading font-bold opacity-0 group-hover:opacity-100 transition-opacity">JAM!</span>
          </button>

          <button
            onClick={prev}
            className="group relative w-14 h-14 border-2 border-border/60 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center transition-all duration-200 hover:border-destructive/50 hover:bg-red-400/5 active:scale-90"
          >
            <SkipForward className="w-5 h-5 text-muted-foreground group-hover:text-[#ff2321] transition-colors" />
            <span className="absolute -bottom-6 text-[12px] text-[#ff2321] font-heading font-medium opacity-0 group-hover:opacity-100 transition-opacity">Skip!</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Feed;
