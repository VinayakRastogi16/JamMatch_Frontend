import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff } from 'lucide-react';

export default function Jam() {
  const { id: roomId } = useParams();
  console.log("roomId:", roomId);
  const roleRef = useRef(null);
  const socketRef = useRef(null)
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [status, setStatus] = useState("connecting...")

  useEffect(() => {
    socketRef.current = io("http://localhost:8080");
    const socket = socketRef.current

    const startConnection = async () => {
      console.log("Room ID:", roomId);
      console.log("Token:", localStorage.getItem("token"));

      try {
        const res = await API.get(`/verify-match/${roomId}`);
        console.log("Verify response:", res.data);
      } catch (e) {
        console.log("Verify error:", e.response?.data);
        console.log("Verify status:", e.response?.status);
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

      const peer = new RTCPeerConnection();

      peer.onconnectionstatechange = () => {
        console.log("STATE:", peer.connectionState);

        if (peer.connectionState === "connected") {
          setStatus("Connected 🎵");
        } else if (peer.connectionState === "disconnected") {
          setStatus("Disconnected ❌");
        }
      };

      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      peer.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            roomId,
            candidate: e.candidate,
          });
        }
      };

      peer.ontrack = (e) => {
        const audio = new Audio();
        audio.srcObject = e.streams[0];
        audio.muted = false;
        audio.autoplay = true;
      };

      peerRef.current = peer;

      socket.on("offer", async (offer) => {
        await peer.setRemoteDescription(offer);

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        socket.emit("answer", { roomId, answer });
      });

      socket.on("answer", async (answer) => {
        await peer.setRemoteDescription(answer);
      });

      socket.on("ice-candidate", async (candidate) => {
        await peer.addIceCandidate(candidate);
      });

      socket.on("role", async (role) => {
        console.log("Role", role);
        roleRef.current = role;

        if (role === "caller") {
          console.log("I am a caller");
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);

          socket.emit("offer", { roomId, offer });
        }

        if (role === "receiver") {
          console.log("I'm a reciever");
        }
      });

      socket.on("room-full", () => {
        console.log("Room is full");
        navigate("/feed");
      });

      socket.emit("join-room", roomId);
    };

    startConnection();

    return () => {
      const socket = socketRef.current;
      socket.off("offer")
      socket.off("answer")
      socket.off("ice-candidate")
      socket.off("role")
      socket.off("room-full")
      socket.disconnect();
      peerRef.current?.close();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [roomId, navigate]);

  const toggleMute = () => {
  const stream = localStreamRef.current;
  stream.getAudioTracks().forEach(track => {
    track.enabled = muted;
  });
  setMuted(!muted);
};

  return (<div style={{ textAlign: "center", marginTop: "50vh" }}>
      <h2>🎵 Jam Room: {roomId}</h2>

      <h3>{status}</h3>

      <button onClick={toggleMute} style={{ marginTop: "20px" }}>
        {muted ? <MicOff /> : <Mic />}
      </button>

      <br /><br />

      <button
        onClick={() => navigate(`/messages/${roomId}`)}
        style={{ background: "red", color: "white", padding: "10px" }}
      >
        Leave
      </button>
    </div>);
}
