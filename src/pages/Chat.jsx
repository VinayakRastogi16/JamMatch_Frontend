import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Music2 } from "lucide-react";
import API from "../services/api.js";
import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import AudioCall from "../components/Call/AudioCall.jsx";

const Chat = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeOutRef = useRef(null);

  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const [activeRoom, setActiveRoom] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [pipWindow, setPipWindow] = useState(null);

  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [callActive, setCallActive] = useState(false);

  const [callStatus, setCallStatus] = useState("idle");

  const generateRoom = (id1, id2) => {
    return [id1, id2].sort().join("_");
  };

  const filteredMatches = matches.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.username?.toLowerCase().includes(search.toLowerCase()),
  );

  const selectMatch = (user) => {
    const room = generateRoom(currentUser.id, user.id);

    setActiveRoom(room);
    setActiveUser(user);
    setMessages([]);
  };

  const startCall = async () => {
    if (!activeRoom) return;

    const newPipWindow = await documentPictureInPicture.requestWindow({
      width: 360,
      height: 500,
    });

    setPipWindow(newPipWindow);

    console.log("PiP window open", pipWindow);
    setCallActive(true);
  };

  const endCall = () => {
    setCallActive(false);
  };

  const sendMessages = () => {
    if (!input.trim() || !activeRoom) return;

    socketRef.current?.emit("send-message", {
      roomId: activeRoom,
      senderId: currentUser.id,
      text: input.trim(),
    });

    socketRef.current?.emit("stop-typing", {
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

    clearTimeout(typingTimeOutRef.current);

    typingTimeOutRef.current = setTimeout(() => {
      socketRef.current?.emit("stop-typing", {
        roomId: activeRoom,
        userId: currentUser.id,
      });
    }, 400);
  };

  useEffect(() => {
    const socket = io("http://localhost:8080");

    socketRef.current = socket;

    socket.emit("user-online", currentUser.id);

    API.get("/matched-users").then((res) => {
      setMatches(res.data);
    });

    socket.on("online-users", (users) => {
      setOnlineUsers(users.map((user) => user._id));
    });

    socket.on("user-status", ({ userId, isOnline }) => {
      setOnlineUsers((prev) => {
        return isOnline
          ? [...new Set([...prev, userId])]
          : prev.filter((id) => id !== userId);
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUser.id]);

  useEffect(() => {
    if (!activeRoom) return;

    API.get(`/chat/${activeRoom}`).then((res) => {
      setMessages(res.data);

      socketRef.current?.emit("message-read", {
        roomId: activeRoom,
        userId: currentUser.id,
      });
    });

    if (socketRef.current) {
      socketRef.current.emit("join-chat", activeRoom);
    }

    socketRef.current?.on("receive-message", (msg) => {
      console.log("New message received:", msg);
      setMessages((prev) => [...prev, msg]);

      if (msg.senderId !== currentUser.id) {
        socketRef.current?.emit("message-read", {
          roomId: activeRoom,
          userId: currentUser.id,
        });
      }
    });

    socketRef.current?.on("typing", () => {
      setIsTyping(true);
    });

    socketRef.current?.on("stop-typing", () => {
      setIsTyping(false);
    });

    socketRef.current?.on("message-read", () => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === currentUser.id ? { ...msg, isSeen: true } : msg,
        ),
      );
    });

    return () => {
      socketRef.current?.off("receive-message");
      socketRef.current?.off("typing");
      socketRef.current?.off("stop-typing");
      socketRef.current?.off("message-read");
    };
  }, [currentUser.id, activeRoom]);

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({
      behavior:"smooth"
    })
  }, [messages])

  return (
    <>
      {callActive && (
        <AudioCall
          roomId={activeRoom}
          onEndCall={endCall}
          pipWindow={pipWindow}
          activeUser={activeUser}
        />
      )}
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
        {activeRoom&&activeUser ? (
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
            onStartCall={startCall}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <Music2 className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-heading font-semibold">Select a conversation</p>
            <p className="text-sm mt-1">Pick a musician from the sidebar</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
