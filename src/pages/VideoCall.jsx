import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, Settings, MessageCircle } from 'lucide-react';

export default function VideoCall() {
  const { id: roomId } = useParams();
  const roleRef = useRef(null);
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const streamRef = useRef(null); // ← extra ref for reliable cleanup
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const navigate = useNavigate();

  const [muted, setMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [status, setStatus] = useState("Connecting...");
  const [callDuration, setCallDuration] = useState(0);

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => setCallDuration(d => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    const localVideoElement = localVideoRef.current;
    const remoteVideoElement = remoteVideoRef.current;

    socketRef.current = io("http://localhost:8080");
    const socket = socketRef.current;

    const startConnection = async () => {
      try {
        await API.get(`/verify-match/${roomId}`);
      } catch (e) {
        console.error(e);
        navigate("/feed");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
        },
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      // Save to both refs
      localStreamRef.current = stream;
      streamRef.current = stream;

      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;

      const peer = new RTCPeerConnection();

      peer.onconnectionstatechange = () => {
        if (peer.connectionState === "connected") setStatus("Connected");
        else if (peer.connectionState === "disconnected") setStatus("Disconnected");
      };

      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      peer.onicecandidate = (e) => {
        if (e.candidate) socket.emit("ice-candidate", { roomId, candidate: e.candidate });
      };

      peer.ontrack = (e) => {
        if (e.track.kind === "audio") {
          const audio = new Audio();
          audio.srcObject = e.streams[0];
          audio.autoplay = true;
        } else if (e.track.kind === "video" && remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = e.streams[0];
        }
      };

      peerRef.current = peer;

      socket.on("offer", async (offer) => {
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer });
      });

      socket.on("answer", async (answer) => await peer.setRemoteDescription(answer));
      socket.on("ice-candidate", async (candidate) => await peer.addIceCandidate(candidate));

      socket.on("role", async (role) => {
        roleRef.current = role;
        if (role === "caller") {
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          socket.emit("offer", { roomId, offer });
        }
      });

      socket.on("room-full", () => navigate("/feed"));
      socket.emit("join-room", roomId);
    };

    startConnection();

    return () => {
      // Use streamRef for reliable cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      if (peerRef.current) { peerRef.current.close(); peerRef.current = null; }
      if (socketRef.current) {
        socketRef.current.off("offer");
        socketRef.current.off("answer");
        socketRef.current.off("ice-candidate");
        socketRef.current.off("role");
        socketRef.current.off("room-full");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (localVideoElement) localVideoElement.srcObject = null;
      if (remoteVideoElement) remoteVideoElement.srcObject = null;
    };
  }, [roomId, navigate]);

  const toggleMute = () => {
    streamRef.current?.getAudioTracks().forEach(t => { t.enabled = muted; });
    setMuted(!muted);
  };

  const toggleVideo = () => {
    streamRef.current?.getVideoTracks().forEach(t => { t.enabled = videoEnabled; });
    setVideoEnabled(!videoEnabled);
  };

const handleLeave = () => {
  // Stop all tracks
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  if (localStreamRef.current) {
    localStreamRef.current.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
  }

  if (localVideoRef.current) {
    localVideoRef.current.pause();
    localVideoRef.current.srcObject = null;
    localVideoRef.current.load();
  }

  if (remoteVideoRef.current) {
    remoteVideoRef.current.pause();
    remoteVideoRef.current.srcObject = null;
    remoteVideoRef.current.load();
  }

  if (peerRef.current) { peerRef.current.close(); peerRef.current = null; }
  if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }

  // ✅ Force full page reload instead of SPA navigation
  window.location.href = `/messages/${roomId}`;
};

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative flex flex-col">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,140,0,0.08) 0%, transparent 70%)" }}
      />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-40 flex justify-between items-center px-6 py-4"
        style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
            <Video className="w-4 h-4 text-black" />
          </div>
          <h1 className="text-orange-500 font-bold text-xl tracking-tight">JamMatch Live</h1>
          <div className="ml-4 px-3 py-1 rounded-full flex items-center gap-2"
            style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-white text-xs font-medium">{formatDuration(callDuration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full text-orange-400"
            style={{ background: "rgba(255,140,0,0.1)", border: "1px solid rgba(255,140,0,0.2)" }}
          >
            {status}
          </span>
          <button
            onClick={() => window.location.href = `/messages/${roomId}`}
            className="p-2 rounded-full text-gray-400 hover:text-orange-500 transition-colors"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full text-gray-400 hover:text-orange-500 transition-colors"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main video area */}
      <main className="flex-1 relative pt-[72px] pb-[100px] px-4 flex items-center justify-center">
        {/* Remote video (main) */}
        <div className="relative w-full h-full max-w-6xl rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.1)", background: "#0a0a0a" }}
        >
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 px-3 py-2 rounded flex items-center gap-2"
            style={{ background: "rgba(10,10,10,0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,140,0,0.3)" }}
          >
            <span className="text-white font-medium text-sm">Guest</span>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"
              style={{ boxShadow: "0 0 8px rgba(255,140,0,0.8)" }}
            />
          </div>
        </div>

        {/* Local video PiP */}
        <div className="absolute bottom-[120px] right-10 w-64 rounded-xl overflow-hidden z-30"
          style={{
            aspectRatio: "16/9",
            background: "#0a0a0a",
            border: "2px solid #ff8c00",
            boxShadow: "0 0 12px rgba(255,140,0,0.3)"
          }}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded flex items-center gap-1"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <span className="text-white text-xs">You</span>
            {muted && <MicOff className="w-3 h-3 text-red-400" />}
          </div>
        </div>
      </main>

      {/* Controls */}
      <nav className="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
        <div className="flex items-center gap-2 px-6 py-3 rounded-full"
          style={{
            background: "rgba(0,0,0,0.9)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,140,0,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
          }}
        >
          {/* Mute */}
          <button
            onClick={toggleMute}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105"
            style={{ background: muted ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)" }}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <MicOff className="w-5 h-5 text-red-400" /> : <Mic className="w-5 h-5 text-white" />}
          </button>

          {/* Camera */}
          <button
            onClick={toggleVideo}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: videoEnabled ? "rgba(239,68,68,0.2)": "#ff8c00" ,
              boxShadow: videoEnabled ? "none": "0 0 20px rgba(255,140,0,0.5)"
            }}
            title={videoEnabled ? "Turn off camera" : "Turn on camera"}
          >
            {videoEnabled ? <VideoOff className="w-5 h-5 text-red-400" /> : <Video className="w-5 h-5 text-black" />}
          </button>

          {/* Screen share placeholder */}
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105"
            style={{ background: "rgba(255,255,255,0.05)" }}
            title="Share screen"
          >
            <ScreenShare className="w-5 h-5 text-gray-400" />
          </button>

          {/* Leave */}
          <button
            onClick={handleLeave}
            className="h-14 px-6 rounded-full flex items-center gap-2 ml-2 transition-all hover:scale-105"
            style={{ background: "#dc2626" }}
          >
            <PhoneOff className="w-5 h-5 text-white" />
            <span className="text-white text-sm font-semibold">Leave</span>
          </button>
        </div>
      </nav>
    </div>
  );
}