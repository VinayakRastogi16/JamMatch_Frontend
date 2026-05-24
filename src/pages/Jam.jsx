import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Mic, MicOff, Volume2, VolumeX, PhoneOff, Circle } from "lucide-react";

const Jam = () => {
  const { id: roomId } = useParams();
  const roleRef = useRef(null);
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const navigate = useNavigate();

  const [muted, setMuted] = useState(false);
  const [speakerOff, setSpeakerOff] = useState(false);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("Connecting...");
  const [duration, setDuration] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef(null);
  const analyzerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isSpeaking = (stream) => {
    const audioContext = new AudioContext();
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyzer);
    analyzerRef.current = analyzer;

    const freqArray = new Uint8Array(analyzer.frequencyBinCount);

    const detect = () => {
      analyzer.getByteFrequencyData(freqArray);
      const avg = freqArray.reduce((a, b) => a + b, 0) / freqArray.length;
      setSpeaking(avg > 10 && !muted);
      animationRef.current = requestAnimationFrame(detect);
    };
    detect();
  };

  useEffect(() => {
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
      });

      localStreamRef.current = stream;
      isSpeaking(stream);

      const peer = new RTCPeerConnection();

      peer.onconnectionstatechange = () => {
        if (peer.connectionState === "connected") setStatus("Connected");
        else if (peer.connectionState === "disconnected")
          setStatus("Disconnected");
      };

      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      peer.onicecandidate = (e) => {
        if (e.candidate)
          socket.emit("ice-candidate", { roomId, candidate: e.candidate });
      };

      peer.ontrack = (e) => {
        const audio = new Audio();
        audio.srcObject = e.streams[0];
        audio.muted = speakerOff;
        audio.autoplay = true;
      };

      peerRef.current = peer;

      socket.on("offer", async (offer) => {
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer });
      });

      socket.on(
        "answer",
        async (answer) => await peer.setRemoteDescription(answer),
      );
      socket.on(
        "ice-candidate",
        async (candidate) => await peer.addIceCandidate(candidate),
      );

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
      cancelAnimationFrame(animationRef.current);
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("role");
      socket.off("room-full");
      socket.disconnect();
      peerRef.current?.close();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [roomId, navigate]);

  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = muted;
    });
    setMuted(!muted);
    setSpeaking(false);
  };

  const toggleSpeaker = () => {
    setSpeakerOff(!speakerOff);
  };

  const toggleRecording = () => {
    if (!recording) {
      const stream = localStreamRef.current;
      if (!stream) {
        return;
      }

      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `jam-session-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      mediaRecorder.start();
      setRecording(true);
    } else {
      mediaRecorderRef.current?.stop();
      setRecording(false);
    }
  };

  const handleLeave = () => {
    if (recording) mediaRecorderRef.current?.stop();

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    peerRef.current?.close();
    socketRef.current?.disconnect();
    cancelAnimationFrame(animationRef.current);
    window.location.href = `/messages/${roomId}`;
  };

  return (
    <div
      className="w-full h-screen overflow-hidden relative flex flex-col items-center justify-between py-10"
      style={{
        backgroundColor: "#0f0f0f",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,140,0,0.06) 0%, transparent 70%)" }}
      />

      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
            <Mic className="w-4 h-4 text-black" />
          </div>
          <h1 className="text-orange-500 font-bold text-xl tracking-tight">JamMatch Audio</h1>
          <div className="ml-2 px-3 py-1 rounded-full flex items-center gap-2"
            style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-white text-xs font-medium">{formatDuration(duration)}</span>
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full text-orange-400"
          style={{ background: "rgba(255,140,0,0.1)", border: "1px solid rgba(255,140,0,0.2)" }}
        >
          {status}
        </span>
      </header>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-6 z-10">
        <div className="relative flex items-center justify-center">

          {/* Pulsing rings when speaking */}
          {speaking && (
            <>
              <div className="absolute w-56 h-56 rounded-full animate-ping"
                style={{ border: "2px solid rgba(255,140,0,0.3)", animationDuration: "1.5s" }}
              />
              <div className="absolute w-48 h-48 rounded-full animate-ping"
                style={{ border: "2px solid rgba(255,140,0,0.5)", animationDuration: "1s" }}
              />
            </>
          )}

          {/* Static ring */}
          <div className="absolute w-44 h-44 rounded-full"
            style={{
              border: `2px solid ${speaking ? "rgba(255,140,0,0.8)" : "rgba(255,255,255,0.1)"}`,
              transition: "border-color 0.3s",
              boxShadow: speaking ? "0 0 20px rgba(255,140,0,0.3)" : "none",
            }}
          />

          {/* Avatar circle */}
          <div className="w-36 h-36 rounded-full flex items-center justify-center text-5xl font-bold relative z-10"
            style={{
              background: "linear-gradient(135deg, rgba(255,140,0,0.3), rgba(255,140,0,0.05))",
              border: "2px solid rgba(255,140,0,0.4)",
            }}
          >
            Y
          </div>

          {/* Mute badge */}
          {muted && (
            <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center z-20"
              style={{ background: "#dc2626", border: "2px solid #0f0f0f" }}
            >
              <MicOff className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-white font-semibold text-lg">You</p>
          <p className="text-gray-500 text-sm mt-1">
            {speaking ? "🎵 Speaking..." : muted ? "🔇 Muted" : "🎤 Listening"}
          </p>
        </div>

        {/* Recording indicator */}
        {recording && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.4)" }}
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-medium">Recording</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <nav className="z-10">
        <div className="flex items-center gap-3 px-6 py-3 rounded-full"
          style={{
            background: "rgba(20,20,20,0.9)",
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
            {muted
              ? <MicOff className="w-5 h-5 text-red-400" />
              : <Mic className="w-5 h-5 text-white" />
            }
          </button>

          {/* Speaker */}
          <button
            onClick={toggleSpeaker}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105"
            style={{ background: speakerOff ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)" }}
            title={speakerOff ? "Speaker On" : "Speaker Off"}
          >
            {speakerOff
              ? <VolumeX className="w-5 h-5 text-red-400" />
              : <Volume2 className="w-5 h-5 text-white" />
            }
          </button>

          {/* Record */}
          <button
            onClick={toggleRecording}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105"
            style={{ background: recording ? "rgba(220,38,38,0.3)" : "rgba(255,255,255,0.05)" }}
            title={recording ? "Stop Recording" : "Start Recording"}
          >
            <Circle
              className="w-5 h-5"
              style={{ color: recording ? "#f87171" : "white" }}
              fill={recording ? "#f87171" : "none"}
            />
          </button>

          {/* Leave */}
          <button
            onClick={handleLeave}
            className="h-14 px-6 rounded-full flex items-center gap-2 ml-2 transition-all hover:scale-105"
            style={{ background: "#dc2626" }}
            title="Leave"
          >
            <PhoneOff className="w-5 h-5 text-white" />
            <span className="text-white text-sm font-semibold">Leave</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Jam;
