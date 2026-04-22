import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Music2 } from "lucide-react";
import API from "../services/api.js";
import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatWindow from "../components/Chat/ChatWindow";

const Chat = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeRoom, setActiveRoom] = useState(roomId || null);
  const [activeUser, setActiveUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const typingTimeoutRef = useRef(null);

  const generateRoom = (id1, id2) => [id1, id2].sort().join("_");

  const filteredMatches = matches.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.username?.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const socket = io("http://localhost:8080");
    socket.emit("user-online", currentUser.id);
    API.get("/matched-users").then((res) => {
      setMatches(res.data);

      if (!roomId && res.data.length > 0) {
        const first = res.data[0];
        const room = generateRoom(currentUser.id, first.id);
        setActiveRoom(room);
        setActiveUser(first);
      } else if (roomId) {
        const other = res.data.find((u) => {
          const room = generateRoom(currentUser.id, u.id);
          setActiveRoom(room);
          return room === roomId;
        });

        if (other) {
          setActiveUser(other);
        }
      }
    });

    socket.on("user-status", ({ userId, isOnline }) => {
      setOnlineUsers((prev) => {
        if (!Array.isArray(prev)) return isOnline ? [userId] : []; // ← guard
        return isOnline
          ? [...new Set([...prev, userId])]
          : prev.filter((id) => id !== userId);
      });
    });

    return () => socket.disconnect();
  }, [currentUser.id, roomId]);

  useEffect(() => {
    if (!activeRoom) return;

    API.get(`/chat/${activeRoom}`).then((res) => {
      setMessages(res.data);
    });

    if (socketRef.current) socketRef.current.disconnect();
    socketRef.current = io("http://localhost:8080");
    socketRef.current.emit("join-chat", activeRoom);
    socketRef.current.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socketRef.current.on("typing", () => setIsTyping(true));
    socketRef.current.on("stop-typing", () => setIsTyping(false));
    socketRef.current.on("message-read", () => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === currentUser.id ? { ...msg, read: true } : msg,
        ),
      );
    });

    socketRef.current.emit("message-read", {
      roomId: activeRoom,
      userId: currentUser.id,
    });

    return () => socketRef.current?.disconnect();
  }, [currentUser.id, activeRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  const sendMessages = () => {
    if (!input.trim() || !activeRoom) return;

    socketRef.current.emit("send-message", {
      roomId: activeRoom,
      senderId: currentUser.id,
      text: input.trim(),
    });

    socketRef.current.emit("stop-typing", {
      roomId: activeRoom,
      userId: currentUser.id,
    });

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessages();
    }

    socketRef.current?.emit("typing", {
      roomId: activeRoom,
      userId: currentUser.id,
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("stop-typing", {
        roomId: activeRoom,
        userId: currentUser.id,
      });
    }, 500);
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
      <ChatSidebar
        filteredMatches={filteredMatches}
        activeRoom={activeRoom}
        search={search}
        setSearch={setSearch}
        selectMatch={selectMatch}
        generateRoom={generateRoom}
        currentUser={currentUser}
        onlineUsers={onlineUsers}
      />
      {activeUser ? (
        <ChatWindow
          activeUser={activeUser}
          messages={messages}
          input={input}
          setInput={setInput}
          sendMessage={sendMessages}
          handleKeyDown={handleKeyDown}
          bottomRef={bottomRef}
          currentUser={currentUser}
          activeRoom={activeRoom}
          navigate={navigate}
          isTyping={isTyping}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
          <Music2 className="w-12 h-12 mb-3 opacity-20" />
          <p className="font-heading font-semibold">Select a conversation</p>
          <p className="text-sm mt-1">Pick a musician from the sidebar</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
