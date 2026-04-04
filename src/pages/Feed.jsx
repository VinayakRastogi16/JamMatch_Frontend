/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Music, Heart, Star, Disc3, Headphones, SkipForward, Volume2} from "lucide-react";
import { Button } from "../components/ui/button";


const Feed = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [liked, setLiked] = useState([]);
    const MUSICIANS = [];

    const resetFeed = () => {
        setCurrentIndex(0);
        setLiked([]);
    };

    const handleAction = (action) => {
        if (action === "like") {
            setLiked((prev) => [...prev, currentIndex]);
        } else if (action === "skip") {
            setCurrentIndex((prev) => Math.min(prev + 1, MUSICIANS.length));
        }
    };

    return (
        <div className="min-h-screen bg-background font-body flex flex-col overflow-hidden relative">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Stage spotlights */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 left-1/4 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[80px]" />
        
        {/* Grid lines like a mixing board */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        
        {/* Floating vinyl */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-primary/[0.06] animate-spin-slow" style={{ animationDuration: "40s" }}>
          <div className="absolute inset-6 rounded-full border border-primary/[0.04]" />
          <div className="absolute inset-12 rounded-full border border-primary/[0.03]" />
          <div className="absolute inset-20 rounded-full bg-primary/[0.04]" />
        </div>
        
        {/* Scattered music icons */}
        <Disc3 className="absolute top-[20%] right-[8%] w-10 h-10 text-primary/[0.05] animate-spin-slow" />
        <Music className="absolute bottom-[30%] left-[8%] w-7 h-7 text-primary/[0.06] animate-float" style={{ animationDelay: "0.5s" }} />
        <Headphones className="absolute top-[60%] right-[15%] w-8 h-8 text-primary/[0.04] animate-float" style={{ animationDelay: "1.5s" }} />
        <Volume2 className="absolute top-[40%] left-[12%] w-6 h-6 text-primary/[0.05] animate-float" style={{ animationDelay: "2s" }} />
      </div>
      </div>


          
    );
};

export default Feed;