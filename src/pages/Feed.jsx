import { useEffect, useState } from "react";
import {
  Music,
  Heart,
  Star,
  Guitar,
  Drum,
  ClockFading,
  Disc3,
  Headphones,
  SkipForward,
  Volume2,
  SkipBack,
  MapPin,
  MicVocal,
  Activity,
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
        console.log(res.data);
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
          <Disc3 className="absolute top-[20%] right-[8%] w-10 h-10 text-primary/[.31] animate-spin" />
          <Music
            className="absolute bottom-[30%] left-[8%] w-7 h-7 text-primary/[.31] animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
          <Headphones
            className="absolute top-[60%] right-[15%] w-8 h-8 text-primary/[.31] animate-bounce"
            style={{ animationDelay: "1.5s" }}
          />
          <Volume2
            className="absolute top-[40%] left-[12%] w-6 h-6 text-primary/[.31] animate-bounce"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="flex justify-between h-[66vh] w-[44vh] rounded-xl bg-white/10 backdrop-blur z-50 mt-[20vh] left-10">
          <div className="absolute rounded-xl bg-gradient-to-br from-secondary/100 via-accent to-primary/10 h-[18.5vh] w-full bg-white/10">
            <div className="absolute top-0 left-1/4 w-32 h-full bg-gradient-to-tl from-fuchsia-700/30 to-transparent blur-2xl"></div>
            <div className="absolute top-0 right-1/4 w-24 h-full bg-gradient-to-tl from-mauve-600/10 to-transparent blur-2xl"></div>
            <div className="absolute top-0 inset-x-0 h-full rounded-t-xl bg-gradient-to-tr from-card to-transparent z-10"></div>

            <span
              class="absolute top-6 left-8 text-2xl opacity-20 animate-bounce"
              style={{ animationDelay: "1s" }}
            >
              ♪
            </span>
            <span
              class="absolute top-12 right-12 text-lg opacity-15 animate-bounce"
              style={{ animationDelay: "1s" }}
            >
              ♫
            </span>
            <span
              class="absolute bottom-16 left-16 text-xl opacity-10 animate-bounce"
              style={{ animationDelay: "0.5s" }}
            >
              ♬
            </span>

            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 z-10">
              <div class="relative w-24 h-24">
                <div class="absolute -inset-2 rounded-full bg-primary/10 blur-xl animate-pulse-glow"></div>
                <div class="absolute inset-0 rounded-full border-[3px] border-primary/25 animate-spin-slow">
                  <div class="absolute inset-1 rounded-full border border-primary/10"></div>
                  <div class="absolute inset-2 rounded-full border border-primary/5"></div>
                  <div class="absolute inset-3 rounded-full border border-primary/10"></div>
                  <div class="absolute inset-4 rounded-full border border-primary/5"></div>
                </div>
                <span class="flex shrink-0  overflow-hidden rounded-full absolute inset-[16px] w-[64px] h-[64px] border-2 border-primary/40 z-10 ring-2 ring-primary/10 ring-offset-2 ring-offset-card">
                  <span class="flex h-full w-full items-center justify-center rounded-full bg-muted bg-gradient-to-br from-primary/30 to-accent/20 text-primary font-heading text-lg font-bold">RS</span>
                </span>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary/70 z-20 shadow-[0_0_8px_hsl(var(--primary)/0.5)]"></div>
              </div>
            </div>
          </div>

          <div className="flex w-full justify-between rounded-xl ">
            <div className="h-[47.5vh]  bg-[#1d1d20] w-full absolute bottom-0 rounded-b-xl shadow-none z-50">

              <div className=" border-t-[2px] border-dashed border-zinc-500/50 top-0 p-8">
            {currMatch && (
              <div className="flex-wrap ml-3 place-items-center">
                <div className=" mb-20">
                  <div className="place-items-center">
                    <div className="relative font-bold text-2xl">
                      {currMatch.user.name} 🎤
                    </div>
                    <div>
                      <div className="flex gap-10 justify-center text-sm text-gray-300/50">
                        <p>
                          <MapPin className="pl-1 pe-1 pb-1 inline-flex" />
                          {currMatch.user.location}
                        </p>
                        <p>{currMatch.user.age} yrs.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-evenly gap-2">
                    <span className="inline-flex items-center rounded-xl mt-2  bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400">
                      <p>🔥</p> {currMatch.user.skillLevel}
                    </span>
                    <span className="inline-flex items-center rounded-xl mt-2  bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400">
                      <ClockFading className=" h-4" />{" "}
                      {currMatch.user.experience} yr exp.
                    </span>
                  </div>

                  <div className="text-lg">
                    <p>{currMatch.user.bio}</p>
                  </div>

                </div>

                <div className="absolute right-6 w-full flex flex-wrap justify-start">
                  <div className="relative gap-2 ps-[5vh] flex-wrap me-20">
                    <span className="text-sm">
                      <Guitar className="h-4 text-orange-400 inline-flex" />
                      Instruments :
                    </span>
                    <div>
                      {currMatch.user.instrument.map((inst, i) => (
                        <span
                          className="inline-flex items-center text-orange-400 rounded-xl mt-2 justify-between ms-2 bg-orange-600/10 border border-orange-400 px-2 py-1 text-xs font-medium"
                          key={i}
                        >
                          {inst}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="gap-2 w-full ps-[5vh] mt-2 flex-wrap me-20">
                    <div className="block">
                      <span className="text-sm block">
                        <MicVocal className="h-4 text-pink-600 inline-flex" />
                        Genre
                      </span>
                      {currMatch.user.genre.map((item, i) => (
                        <span
                          className="inline-flex items-center rounded-xl mt-2 justify-between ms-2 bg-pink-600/10 text-pink-600 border border-rose-800 px-2 py-1 text-xs font-medium"
                          key={i}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="gap-2 w-full ps-[5vh] flex-wrap me-20 mt-2">
                    <span className="">
                      <Activity className="h-4 text-green-400 inline-flex" />
                      Available at :
                    </span>
                    <br />
                    {currMatch.user.availability.map((item, i) => (
                      <span
                        className="inline-flex items-center rounded-xl mt-2 justify-between ms-2 bg-green-600/10 border border-green-800 text-green-400 px-2 py-1 text-xs font-medium"
                        key={i}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
            </div>
            <div className=" w-4 h-8 bg-[#171414] rounded-r-full z-50 mt-[17vh]"></div>
            
            <div className=" w-4 h-8 bg-[#171414] rounded-l-full z-50 mt-[17vh]"></div>
            
          </div>
        </div>
        
        <div className="flex mt-5 w-1/4 justify-between p-5">
          <button
            onClick={prev}
            className="group relative w-14 h-14 border-2 border-border/60 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center transition-all duration-200 hover:border-destructive/50 hover:bg-red-400/5 active:scale-90"
          >
            <SkipBack className="w-5 h-5 text-muted-foreground group-hover:text-[#f699ce] transition-colors" />
            <span className="absolute -bottom-6 text-[12px] text-[#f699ce] font-heading font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Back
            </span>
          </button>

          <button
            className="group relative w-14 h-14 border-2 border-border/60 shadow-[var(--glow-primary)] hover:shadow-[0_0_50px_hsl(28_92%_55%/0.45)] rounded-full bg-white/10 backdrop-blur flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 transition-all duration-200 hover:border-destructive/50 hover:bg-orange-400/5 active:scale-90 hover:scale-110"
            onClick={next}
          >
            <Drum className="w-5 h-5 text-primary-foreground group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-accent/25 opacity-0 group-hover:opacity-100 transition-opacit"></div>
            <span className="absolute -bottom-6 text-[12px] text-primary font-heading font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              JAM!
            </span>
          </button>

          <button
            onClick={prev}
            className="group relative w-14 h-14 border-2 border-border/60 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center transition-all duration-200 hover:border-destructive/50 hover:bg-red-400/5 active:scale-90"
          >
            <SkipForward className="w-5 h-5 text-muted-foreground group-hover:text-[#ff2321] transition-colors" />
            <span className="absolute -bottom-6 text-[12px] text-[#ff2321] font-heading font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Skip!
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Feed;
