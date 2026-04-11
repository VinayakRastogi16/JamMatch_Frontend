import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:8080");

export default function Jam() {
  const { id: roomId } = useParams();

  const peerRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    startConnection();
  }, []);

  const startConnection = async () => {
    socket.emit("join-room", roomId);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    localStreamRef.current = stream;

    const peer = new RTCPeerConnection();

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
      audio.play();
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

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("offer", { roomId, offer });
  };

  return <h2>🎵 Jam Room: {roomId}</h2>;
}
