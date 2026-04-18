import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";
import { Send, Guitar, Music2 } from "lucide-react";

export default function SideChat() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeRoom, setActiveRoom] = useState(roomId || null);
  const [activeUser, setActiveUser] = useState(null);

  // Generate roomId from two user IDs
  const generateRoom = (id1, id2) => [id1, id2].sort().join("_");

  // Fetch matched users for sidebar
  useEffect(() => {
    API.get("/matched-users").then((res) => {
      setMatches(res.data);

      // If no roomId in URL, auto-select first match
      if (!roomId && res.data.length > 0) {
        const first = res.data[0];
        const room = generateRoom(currentUser.id, first.id);
        setActiveRoom(room);
        setActiveUser(first);
      } else if (roomId) {
        // Find the user for this roomId
        const other = res.data.find((u) => {
          const room = generateRoom(currentUser.id, u.id);
          return room === roomId;
        });
        if (other) setActiveUser(other);
      }
    });
  }, []);

  // Load messages + connect socket when activeRoom changes
  useEffect(() => {
    if (!activeRoom) return;

    // Load history
    API.get(`/chat/${activeRoom}`).then((res) => setMessages(res.data));

    // Socket
    if (socketRef.current) socketRef.current.disconnect();
    socketRef.current = io("http://localhost:8080");
    socketRef.current.emit("join-chat", activeRoom);
    socketRef.current.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socketRef.current?.disconnect();
  }, [activeRoom]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !activeRoom) return;
    socketRef.current.emit("send-message", {
      roomId: activeRoom,
      senderId: currentUser.id,
      text: input.trim(),
    });
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectMatch = (user) => {
    const room = generateRoom(currentUser.id, user.id);
    setActiveRoom(room);
    setActiveUser(user);
    setMessages([]);
    navigate(`/messages/${room}`);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">

      {/* ── Sidebar ── */}
      <div className="w-72 border-r border-border/50 bg-card/60 backdrop-blur-xl flex flex-col">
        {/* Sidebar header */}
        <div className="px-5 py-5 border-b border-border/50">
          <h1 className="font-heading font-bold text-xl text-foreground">Messages</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Your matched musicians</p>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <input
            placeholder="Search musicians..."
            className="w-full bg-secondary/50 border border-border/50 rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50"
          />
        </div>

        {/* Match list */}
        <div className="flex-1 overflow-y-auto">
          {matches.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-6 text-center">
              <Music2 className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No matches yet. Start swiping!</p>
            </div>
          )}
          {matches.map((user) => {
            const room = generateRoom(currentUser.id, user.id);
            const isActive = room === activeRoom;
            return (
              <button
                key={user.id}
                onClick={() => selectMatch(user)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all hover:bg-secondary/50 ${
                  isActive ? "bg-primary/10 border-r-2 border-primary" : ""
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/30 flex items-center justify-center shrink-0">
                  <span className="font-heading font-bold text-primary text-sm">
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                {/* Info */}
                <div className="flex-1 text-left overflow-hidden">
                  <p className="font-heading font-semibold text-sm text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    <Guitar className="w-3 h-3" />
                    {user.instrument?.[0] || "Musician"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Chat area ── */}
      {activeUser ? (
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/60 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/30 flex items-center justify-center">
                <span className="font-heading font-bold text-primary text-sm">
                  {activeUser.name?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-heading font-semibold text-foreground text-sm">
                  {activeUser.name}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Guitar className="w-3 h-3" />
                  {activeUser.instrument?.[0]}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/jam/${activeRoom}`)}
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold font-heading hover:bg-primary/90 transition-all shadow-[var(--glow-primary)]"
            >
              🎸 Start Jam
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Music2 className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">No messages yet. Say hi! 👋</p>
              </div>
            )}
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-sm ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border/50 text-foreground rounded-bl-sm"
                  }`}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-border/50 bg-card/60 backdrop-blur-xl">
            <div className="flex items-center gap-3 bg-secondary/50 border border-border/50 rounded-full px-4 py-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center disabled:opacity-40 transition-all hover:bg-primary/90"
              >
                <Send className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
          <Music2 className="w-12 h-12 mb-3 opacity-20" />
          <p className="font-heading font-semibold">Select a conversation</p>
          <p className="text-sm mt-1">Pick a musician from the sidebar</p>
        </div>
      )}
    </div>
  );
}