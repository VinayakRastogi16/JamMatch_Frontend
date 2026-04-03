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

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border/40 bg-background/50 backdrop-blur-2xl">
                <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
                    <div className="flex items-center gap-2.5">
                        <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20">
                            <Music className="w-4.5 h-4.5 text-primary" />
                        </div>
                        <span className="font-heading text-lg font-bold text-foreground tracking-tight">
                            Jam<span className="text-primary">Match</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <span className="font-heading font-bold text-foreground">{currentIndex + 1}</span>
                            <span>/</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                            <Heart className="w-3.5 h-3.5 text-accent" fill="currentColor" />
                            <span className="text-sm font-bold text-accent">{liked.length}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center px-4 py-6 relative z-10">
                    <div className="text-center space-y-8 max-w-sm animate-fade-in">
                        <div className="relative w-28 h-28 mx-auto">
                            <div className="absolute inset-0 rounded-full bg-primary/15 animate-ping" style={{ animationDuration: "2s" }} />
                            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/15 border border-primary/25 flex items-center justify-center">
                                <Star className="w-14 h-14 text-primary" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h2 className="font-heading text-3xl font-bold text-foreground">Set Complete! 🎶</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                You vibed with <span className="text-primary font-bold">{liked.length}</span> musician{liked.length !== 1 && "s"}.
                                <br />Time for an encore?
                            </p>
                        </div>
                        <Button onClick={resetFeed} className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-heading font-semibold shadow-[var(--glow-primary)]">
                            🔄 Encore
                        </Button>
                    </div>
                        

                        {/* Card stack */}
                        <div className="relative">
                            {currentIndex + 2 < MUSICIANS.length && (
                                <div className="absolute inset-x-6 top-4 h-full rounded-2xl bg-card/20 border border-border/20 -z-20 blur-[1px]" />
                            )}
                            {currentIndex + 1 < MUSICIANS.length && (
                                <div className="absolute inset-x-3 top-2 h-full rounded-2xl bg-card/40 border border-border/30 -z-10" />
                            )}

                            {/* <MusicianCard
                                musician={currentMusician}
                                showOverlay={showOverlay}
                                animDirection={animDirection}
                                cardKey={cardKey}
                            /> */}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-center gap-8 mt-7">
                            <button
                                onClick={() => handleAction("skip")}
                                className="group relative w-14 h-14 rounded-full border-2 border-border/60 bg-card/80 backdrop-blur flex items-center justify-center transition-all duration-200 hover:border-destructive/50 hover:bg-destructive/5 active:scale-90"
                            >
                                <SkipForward className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
                                <span className="absolute -bottom-6 text-[10px] text-muted-foreground font-heading font-medium opacity-0 group-hover:opacity-100 transition-opacity">SKIP</span>
                            </button>


                            <button
                                onClick={() => handleAction("like")}
                                className="group relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-[var(--glow-primary)] transition-all duration-200 hover:shadow-[0_0_50px_hsl(28_92%_55%/0.45)] hover:scale-105 active:scale-90"
                            >
                                <Heart className="w-7 h-7 text-primary-foreground group-hover:scale-110 transition-transform" />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-accent/25 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="absolute -bottom-6 text-[10px] text-primary font-heading font-bold opacity-0 group-hover:opacity-100 transition-opacity">JAM!</span>
                            </button>
                        </div>

                        {/* Hint */}
                        <p className="text-center text-[11px] text-muted-foreground/60 mt-10 font-heading tracking-widest uppercase">
                            ♪ Find your jam partner ♪
                        </p>
                    </main>
                </div>
    );
};

export default Feed;