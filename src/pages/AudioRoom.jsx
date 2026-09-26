import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Users,
  Radio,
  Plus,
  LogOut,
  Hand,
  Music,
  Crown,
  Headphones,
  Settings,
  Copy,
  Share2,
} from "lucide-react";

const availableRooms = [
  {
    id: "1",
    name: "Jazz Improv Session",
    genre: "Jazz",
    participants: 4,
    maxParticipants: 8,
    isLive: true,
    host: "Luna Vex",
  },
  {
    id: "2",
    name: "Rock Jam Night",
    genre: "Rock",
    participants: 3,
    maxParticipants: 6,
    isLive: true,
    host: "Kai Storm",
  },
  {
    id: "3",
    name: "Lo-Fi Beats Lab",
    genre: "Lo-Fi",
    participants: 5,
    maxParticipants: 10,
    isLive: true,
    host: "Nova Reed",
  },
  {
    id: "4",
    name: "Classical Ensemble",
    genre: "Classical",
    participants: 2,
    maxParticipants: 12,
    isLive: false,
    host: "Zara Keys",
  },
];

const roomParticipants = [
  {
    id: "me",
    name: "You",
    instrument: "Guitar",
    isMuted: false,
    isSpeaking: false,
    isHost: false,
    handRaised: false,
    level: 0,
  },
  {
    id: "1",
    name: "Luna Vex",
    instrument: "Guitar",
    isMuted: false,
    isSpeaking: true,
    isHost: true,
    handRaised: false,
    level: 72,
  },
  {
    id: "2",
    name: "Kai Storm",
    instrument: "Drums",
    isMuted: false,
    isSpeaking: false,
    isHost: false,
    handRaised: false,
    level: 15,
  },
  {
    id: "3",
    name: "Nova Reed",
    instrument: "Bass",
    isMuted: true,
    isSpeaking: false,
    isHost: false,
    handRaised: true,
    level: 0,
  },
  {
    id: "4",
    name: "Zara Keys",
    instrument: "Piano",
    isMuted: false,
    isSpeaking: true,
    isHost: false,
    handRaised: false,
    level: 58,
  },
];

const AudioRoom = () => {
  const navigate = useNavigate();

  const [inRoom, setInRoom] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [participants, setParticipants] = useState(roomParticipants);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [roomSearch, setRoomSearch] = useState("");

  const joinRoom = (room) => {
    setCurrentRoom(room);
    setInRoom(true);
  };

  const leaveRoom = () => {
    setInRoom(false);
    setCurrentRoom(null);
    setIsMuted(false);
    setIsDeafened(false);
    setHandRaised(false);
  };

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);

    setParticipants((prev) =>
      prev.map((p) =>
        p.id === "me"
          ? { ...p, isMuted: !p.isMuted }
          : p
      )
    );
  }, []);

  const toggleDeafen = useCallback(() => {
    setIsDeafened((prev) => !prev);
  }, []);

  const toggleHand = useCallback(() => {
    setHandRaised((prev) => !prev);

    setParticipants((prev) =>
      prev.map((p) =>
        p.id === "me"
          ? { ...p, handRaised: !p.handRaised }
          : p
      )
    );
  }, []);

  const filteredRooms = availableRooms.filter((r) =>
    r.name.toLowerCase().includes(roomSearch.toLowerCase())
  );

  // Audio level bars component
  const AudioBars = ({ level, active }) => (
    <div className="flex items-end gap-[2px] h-4">
      {[1, 2, 3, 4, 5].map((bar) => (
        <div
          key={bar}
          className={`w-[3px] rounded-full transition-all duration-150 ${
            active && level > bar * 18
              ? "bg-primary"
              : "bg-muted"
          }`}
          style={{
            height: active
              ? `${Math.max(4, (bar / 5) * 16)}px`
              : "4px",
          }}
        />
      ))}
    </div>
  );

  // =========================
  // ROOM VIEW
  // =========================

  if (inRoom && currentRoom) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">

        {/* Ambient glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        {/* Room Header */}
        <header className="border-b border-border px-4 py-3 flex items-center justify-between bg-card/50 backdrop-blur-sm relative z-10">
          <div className="flex items-center gap-3">

            <Button
              variant="ghost"
              size="icon"
              onClick={leaveRoom}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-destructive animate-pulse" />

                <h1 className="text-lg">
                  {currentRoom.name}
                </h1>
              </div>

              <p className="text-xs text-muted-foreground ml-6">
                {participants.length} participants ·{" "}
                {currentRoom.genre}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Participants Grid */}
        <div className="flex-1 p-6">

          {/* Speakers Section */}
          <div className="mb-8">

            <div className="flex items-center gap-2 mb-4">
              <Headphones className="w-4 h-4 text-primary" />

              <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
                On Stage
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

              {participants
                .filter(
                  (p) =>
                    p.isHost ||
                    p.isSpeaking ||
                    p.id === "me"
                )
                .map((participant) => (
                  <div
                    key={participant.id}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
                  >

                    <div className="relative">

                      <div
                        className={`absolute inset-0 rounded-full transition-all duration-300 ${
                          participant.isSpeaking &&
                          !participant.isMuted
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                            : ""
                        }`}
                      />

                      <Avatar className="h-16 w-16 relative z-10">
                        <AvatarFallback className="bg-secondary text-foreground font-bold text-lg">
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      {participant.isHost && (
                        <div className="absolute -top-1 -right-1 z-20 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Crown className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}

                      {participant.isMuted && (
                        <div className="absolute -bottom-1 -right-1 z-20 w-6 h-6 rounded-full bg-destructive flex items-center justify-center">
                          <MicOff className="w-3 h-3 text-destructive-foreground" />
                        </div>
                      )}

                      {participant.handRaised && (
                        <div className="absolute -top-1 -left-1 z-20 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                          <Hand className="w-3 h-3 text-accent-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground truncate max-w-[100px]">
                        {participant.id === "me"
                          ? "You"
                          : participant.name}
                      </p>

                      <p className="text-[10px] text-muted-foreground">
                        {participant.instrument}
                      </p>
                    </div>

                    <AudioBars
                      level={participant.level}
                      active={
                        participant.isSpeaking &&
                        !participant.isMuted
                      }
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Listeners Section */}
          <div>

            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-muted-foreground" />

              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Listening
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

              {participants
                .filter(
                  (p) =>
                    !p.isHost &&
                    !p.isSpeaking &&
                    p.id !== "me"
                )
                .map((participant) => (
                  <div
                    key={participant.id}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card/50 border border-border/50"
                  >

                    <div className="relative">

                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm">
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      {participant.isMuted && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-destructive flex items-center justify-center">
                          <MicOff className="w-2.5 h-2.5 text-destructive-foreground" />
                        </div>
                      )}

                      {participant.handRaised && (
                        <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                          <Hand className="w-2.5 h-2.5 text-accent-foreground" />
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground truncate max-w-[90px]">
                      {participant.name}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="border-t border-border p-4 bg-card/50 backdrop-blur-sm">

          <div className="flex items-center justify-center gap-3 max-w-md mx-auto">

            {/* Mute */}
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={toggleMute}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>

            {/* Deafen */}
            <Button
              variant={isDeafened ? "destructive" : "secondary"}
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={toggleDeafen}
            >
              {isDeafened ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>

            {/* Raise Hand */}
            <Button
              variant={handRaised ? "default" : "secondary"}
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={toggleHand}
            >
              <Hand className="w-5 h-5" />
            </Button>

            {/* Leave */}
            <Button
              variant="destructive"
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={leaveRoom}
            >
              <LogOut className="w-5 h-5" />
            </Button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* Ambient glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-border px-4 py-3 flex items-center gap-3 bg-card/50 backdrop-blur-sm">

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <Radio className="w-5 h-5 text-primary" />

        <h1 className="text-lg">
          Live Audio Rooms
        </h1>

      </header>

      <div className="flex-1 p-4 max-w-3xl mx-auto w-full">

        {/* Search & Create */}
        <div className="flex items-center gap-3 mb-6">

          <Input
            placeholder="Search rooms..."
            value={roomSearch}
            onChange={(e) => setRoomSearch(e.target.value)}
            className="bg-secondary border-border"
          />

          <Button className="shrink-0 gap-2">
            <Plus className="w-4 h-4" />
            Create Room
          </Button>

        </div>

        {/* Rooms List */}
        <div className="space-y-3">

          {filteredRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => joinRoom(room)}
              className="w-full text-left p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all group"
            >

              <div className="flex items-start justify-between mb-3">

                <div>

                  <div className="flex items-center gap-2">

                    {room.isLive && (
                      <span className="flex items-center gap-1">

                        <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />

                        <span className="text-[10px] font-semibold text-destructive uppercase">
                          Live
                        </span>

                      </span>
                    )}

                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {room.name}
                    </h3>

                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    Hosted by {room.host}
                  </p>

                </div>

                <div
                  variant="secondary"
                  className="text-[10px]"
                >
                  {room.genre}
                </div>

              </div>

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">

                  <Users className="w-3.5 h-3.5" />

                  <span>
                    {room.participants}/{room.maxParticipants}
                  </span>

                </div>

                <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Tap to join →
                </span>

              </div>

            </button>
          ))}

        </div>
      </div>
    </div>
  );
};

export default AudioRoom;