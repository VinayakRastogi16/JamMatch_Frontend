import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Music,
  Guitar,
  Mic2,
  Drum,
  Piano,
  ArrowRight,
  Plus,
  X,
  Disc3,
  Headphones,
  Volume2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import API from "../services/api";

const INSTRUMENT_OPTIONS = [
  "Vocals",
  "Guitar",
  "Bass Guitar",
  "Drums",
  "Keyboard",
  "Synth",
  "Violin",
  "Cello",
  "Flute",
  "Saxophone",
  "Trumpet",
  "Percussion",
  "Ukulele",
  "Harmonica",
  "DJ / Turntables",
];

const GENRE_OPTIONS = [
  "Rock",
  "Pop",
  "Jazz",
  "Blues",
  "Funk",
  "Metal",
  "Hip-Hop",
  "Electronic",
  "Classical",
  "Folk",
  "Indie",
  "R&B",
  "Reggae",
  "Country",
  "Lo-fi",
  "Carnatic",
  "World",
  "Acoustic",
];

const AVAILABILITY_OPTIONS = [
  "Weekday Evenings",
  "Weekday Mornings",
  "Weekends",
  "Full-time",
  "Flexible",
];

const ProfileForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    instruments: [],
    genres: [],
    availability: [],
    experience: [3],
    age: "",
    location: "",
    bio: "",
    skillLevel: "",
  });
  const toggleItem = (field, item) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  const steps = [
    {
      title: "What do you play?",
      subtitle: "Pick your instruments",
      icon: "🎸",
    },
    { title: "Your sound", subtitle: "Choose your genres", icon: "🎵" },
    { title: "About you", subtitle: "Tell us the basics", icon: "🎤" },
    {
      title: "Availability & Level",
      subtitle: "When can you jam?",
      icon: "🗓️",
    },
  ];

  const canProceed = () => {
    switch (step) {
      case 0:
        return form.instruments.length > 0;
      case 1:
        return form.genres.length > 0;
      case 2:
        return Number(form.age) && form.location.trim().length>0;
      case 3:
        return form.availability.length > 0 && form.skillLevel;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
  try {
    await API.put("/profile", {
      instruments: form.instruments.filter(Boolean),
      skillLevel: form.skillLevel,
      experience: form.experience?.[0] || 0,
      genres: form.genres,
      availability: form.availability,
      age: Number(form.age),
      location: form.location.trim(),
      bio: form.bio.trim(),
      profileCompleted:true
    });

    const existing = JSON.parse(localStorage.getItem("user")||"{}");
    localStorage.setItem("user", JSON.stringify({
      ...existing,
      profileCompleted:true,
    }))

    navigate("/feed");
  } catch (e) {
    console.log(e);
    alert(e.response?.data?.error || "Something went wrong");
  }
};

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <Disc3 className="absolute top-[15%] right-[6%] w-12 h-12 text-primary/[0.31] animate-spin" />
        <Headphones
          className="absolute bottom-[20%] left-[6%] w-8 h-8 text-primary/[0.31] animate-bounce"
        />
        <Volume2
          className="absolute top-[50%] right-[12%] w-6 h-6 text-primary/[0.31] animate-bounce"
        />
      </div>

      <main className="flex-1 flex items-start justify-center mt-[10vh] px-4 py-8 relative z-10">
        <div className="w-full max-w-lg animate-fade-in">
          <div className="flex items-center gap-1.5 mb-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1.5 rounded-full overflow-hidden bg-border/60"
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    i < step
                      ? "w-full bg-primary"
                      : i === step
                        ? "w-full bg-gradient-to-r from-primary to-accent animate-shimmer bg-[length:200%_100%]"
                        : "w-0"
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <span className="text-4xl mb-3 block">{steps[step].icon}</span>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {steps[step].title}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {steps[step].subtitle}
            </p>
          </div>

          <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-xl">
            {step === 0 && (
              <div className="space-y-4">
                <Label className="text-sm text-muted-foreground font-heading uppercase tracking-wider">
                  Select instruments
                </Label>
                <div className="flex flex-wrap gap-2">
                  {INSTRUMENT_OPTIONS.map((inst) => (
                    <button
                      key={inst}
                      onClick={() => toggleItem("instruments", inst)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        form.instruments.includes(inst)
                          ? "bg-primary/15 border-primary/50 text-primary shadow-[0_0_15px_hsl(28_92%_55%/0.15)]"
                          : "bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {inst}
                    </button>
                  ))}
                </div>
                {form.instruments.length > 0 && (
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs text-muted-foreground">
                      {form.instruments.length} selected
                    </span>
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <Label className="text-sm text-muted-foreground font-heading uppercase tracking-wider">
                  Select genres
                </Label>
                <div className="flex flex-wrap gap-2">
                  {GENRE_OPTIONS.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleItem("genres", genre)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        form.genres.includes(genre)
                          ? "bg-primary/15 border-primary/50 text-primary shadow-[0_0_15px_hsl(340_75%_55%/0.15)]"
                          : "bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
                {form.genres.length > 0 && (
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs text-muted-foreground">
                      {form.genres.length} selected
                    </span>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="age"
                      className="text-sm text-muted-foreground font-heading uppercase tracking-wider"
                    >
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min={13}
                      max={99}
                      value={form.age}
                      onChange={(e) => setForm((prev)=>({
                        ...prev,
                        age: e.target.value
                      }))}
                      placeholder="25"
                      className="bg-secondary/50 border-border/50 h-12 rounded-xl focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className="text-sm text-muted-foreground font-heading uppercase tracking-wider"
                    >
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(e) => setForm((prev)=>({
                        ...prev,
                        location:e.target.value
                      }))}
                      placeholder="Mumbai"
                      className="bg-secondary/50 border-border/50 h-12 rounded-xl focus:border-primary/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="bio"
                    className="text-sm text-muted-foreground font-heading uppercase tracking-wider"
                  >
                    Bio{" "}
                    <span className="normal-case text-muted-foreground/60">
                      (optional)
                    </span>
                  </Label>
                  <Textarea
                    id="bio"
                    value={form.bio}
                    onChange={(e) => setForm((prev)=>({
                        ...prev,
                        bio: e.target.value
                    }))}
                    placeholder="Tell other musicians about yourself..."
                    rows={3}
                    className="bg-secondary/50 border-border/50 rounded-xl focus:border-primary/50 resize-none"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground font-heading uppercase tracking-wider">
                    Experience
                  </Label>
                  <div className="px-2">
                    <Slider
                      value={form.experience}
                      onValueChange={(val) =>
                        setForm((prev) => ({
                          ...prev,
                          experience: val,
                        }))
                      }
                      min={0}
                      max={20}
                      step={1}
                      className="py-2 bg-white/10 hover:border-[#f68532] rounded-xl"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Beginner</span>
                    <span className="text-primary font-bold font-heading text-sm">
                      {form.experience[0]} years
                    </span>
                    <span>20+ years</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground font-heading uppercase tracking-wider">
                    Skill Level
                  </Label>
                  <Select
                    value={form.skillLevel}
                    onValueChange={(val)=>{
                        setForm((prev)=>({
                            ...prev,
                            skillLevel: val
                        }))
                    }}
                  >
                    <SelectTrigger className=" bg-secondary/50 border-border/50 h-12 rounded-xl">
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent className="absolute backdrop-blur-md backdrop-grayscale">
                      <SelectItem value="beginner">🌱 Beginner</SelectItem>
                      <SelectItem value="intermediate">
                        🎯 Intermediate
                      </SelectItem>
                      <SelectItem value="advanced">⚡ Advanced</SelectItem>
                      <SelectItem value="professional">
                        🏆 Professional
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground font-heading uppercase tracking-wider">
                    Availability
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABILITY_OPTIONS.map((slot) => (
                      <button
                        key={slot}
                        onClick={() =>
                          toggleItem(
                            "availability",
                            slot
                          )
                        }
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                          form.availability.includes(slot)
                            ? "bg-primary/15 border-primary/50 text-primary"
                            : "bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className={`px-5 py-2.5 rounded-full text-sm font-heading font-medium transition-all border border-border/50 text-muted-foreground hover:text-foreground hover:border-border ${
                step === 0 ? "opacity-0 pointer-events-none" : ""
              }`}
            >
              ← Back
            </button>

            {step < steps.length - 1 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-heading font-semibold shadow-[var(--glow-primary)] disabled:opacity-40 disabled:shadow-none"
              >
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="h-11 px-8 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 rounded-full font-heading font-semibold shadow-[var(--glow-primary)] disabled:opacity-40 disabled:shadow-none"
              >
                🎶 Start Jamming
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileForm;
