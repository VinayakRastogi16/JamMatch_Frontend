import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Mic, MicOff, Volume2, VolumeX, Phone } from "lucide-react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";

const AudioCall = ({ roomId, onEndCall, pipWindow, activeUser }) => {
  const callRoomId = `call_${roomId}`;

  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const roleRef = useRef(null);
  const timerRef = useRef(null);

  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const [status, setStatus] = useState("Ringing...");

  const toggleMute = () => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setIsMuted(!audioTrack.enabled);
  };

  const endCall = () => {
    peerRef.current?.close();

    localStreamRef.current?.getTracks().forEach((t) => {
      t.stop();
    });

    localStreamRef.current = null;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    socketRef.current?.emit("call-ended", {
      roomId: callRoomId,
    });

    pipWindow?.close();
    onEndCall();
  };

  useEffect(() => {
    let cancelled = false;
    const socket = io("http://localhost:8080");
    socketRef.current = socket;

    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 48000,
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStreamRef.current = stream;

        console.log("Mic access granted");
        console.log("Audio tracks", stream.getAudioTracks());

        const peer = new RTCPeerConnection();
        peerRef.current = peer;

        peer.onconnectionstatechange = () => {
          console.log("Connection state:", peer.connectionState);

          if (peer.connectionState === "connected") {
            setStatus("connected");

            if (!timerRef.current) {
              setCallDuration(0);

              timerRef.current = setInterval(() => {
                setCallDuration((prev) => prev + 1);
              }, 1000);
            }
          }

          if (peer.connectionState === "disconnected") {
            setStatus("disconnected");
          }
        };

        peer.oniceconnectionstatechange = () => {
          console.log("Ice connection state: ", peer.iceConnectionState);
          if (peer.iceConnectionState === "failed") {
            setStatus("Connection failed");
          }
        };

        stream.getTracks().forEach((e) => {
          peer.addTrack(e, stream);
        });

        peer.ontrack = (e) => {
          console.log("Remote audio received");

          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = e.streams[0];
          }
        };

        peer.onicecandidate = (e) => {
          if (e.candidate) {
            socketRef.current?.emit("ice-candidate", {
              roomId: callRoomId,
              candidate: e.candidate,
            });
          }
        };

        socketRef.current?.on("ice-candidate", async (candidate) => {
          try {
            await peer.addIceCandidate(candidate);
          } catch (e) {
            console.error("Error adding ice-candidate: ", e);
          }
        });

        socketRef.current?.on("role", async (role) => {
          console.log("My role: ", role);

          roleRef.current = role;

          if (role === "caller") {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            socketRef.current?.emit("offer", {
              roomId: callRoomId,
              offer,
            });
          }
        });

        socketRef.current?.on("offer", async (offer) => {
          try {
            console.log("offer received");
            setStatus("Connecting...");
            await peer.setRemoteDescription(offer);

            const answer = await peer.createAnswer();

            await peer.setLocalDescription(answer);

            socketRef.current?.emit("answer", {
              roomId: callRoomId,
              answer,
            });
          } catch (e) {
            console.error("Error handling offer: ", e);
          }
        });

        socketRef.current?.on("call-ended", () => {
          console.log("Other user ended the call");

          peerRef.current?.close();

          localStreamRef.current?.getTracks().forEach((t) => {
            t.stop();
          });

          localStreamRef.current = null;

          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          pipWindow?.close();

          onEndCall();
        });

        socketRef.current?.on("answer", async (answer) => {
          try {
            console.log("Answer received");

            setStatus("Connecting...");
            await peer.setRemoteDescription(answer);
          } catch (e) {
            console.error("Error handling answer: ", e);
          }
        });

        socketRef.current?.on("room-full", () => {
          console.log("call room is full");
          setStatus("call unavailable");
          onEndCall();
        });

        console.log("Joining call room:", {
          roomId: callRoomId,
          socketId: socket.id,
        });

        socket.emit("join-room", callRoomId);
      } catch (e) {
        console.log("Mic access failes: ", e);
      }
    };

    startCall();

    return () => {
      cancelled = true;

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      console.log("Audio call cleanup");

      localStreamRef.current?.getTracks().forEach((e) => {
        e.stop();
      });

      localStreamRef.current = null;

      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callRoomId]);

  useEffect(() => {
    if (!pipWindow) return;

    const styles = document.head.querySelectorAll(
      'style, link[rel = "stylesheet"]',
    );

    styles.forEach((style) => {
      pipWindow.document.head.appendChild(style.cloneNode(true));
    });
  }, [pipWindow]);

  const minutes = Math.floor(callDuration / 60);
  const seconds = callDuration % 60;

  return pipWindow
    ? createPortal(
        <div className="w-screen h-screen bg-[#111] text-white flex flex-col items-center justify-center gap-4">
          <audio
            ref={remoteAudioRef}
            autoPlay
            playsInline
            muted={!isSpeakerOn}
          />

          <div className="w-24 h-24 rounded-full bg-[#2a2a2a] flex items-center justify-center text-4xl">
            {(activeUser?.name || activeUser?.username || "U")[0].toUpperCase()}
          </div>

          <h1 className="text-xl font-semibold m-0">
            {activeUser?.name || activeUser?.username || "Unknown User"}
          </h1>

          <span className="text-gray-500">{status.toUpperCase()}</span>
          {status === "connected" && (
            <span>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          )}

          <div className="absolute bottom-5 flex gap-3 border w-1/2 h-20 justify-center items-center rounded-full bg-white/5 backdrop-blur-3xl">
            <Button
              className="rounded-full h-12 w-12 bg-transparent border-orange-400 border"
              onClick={toggleMute}
            >
              {isMuted ? (
                <MicOff className="w-full h-full text-lg" />
              ) : (
                <Mic className="w-full h-full" />
              )}
            </Button>

            <Button
              className="rounded-full h-12 w-12 bg-transparent border-orange-400 border"
              onClick={() => setIsSpeakerOn((prev) => !prev)}
            >
              {isSpeakerOn ? (
                <Volume2 className="w-full h-full text-lg" />
              ) : (
                <VolumeX className="w-full h-full" />
              )}
            </Button>

            <Button
              className="rounded-full h-12 w-12 bg-red-600/20 hover:bg-red-600 border-red-600 border"
              onClick={endCall}
            >
              <Phone className="w-full h-full text-lg rotate-[135deg]" />
            </Button>
          </div>
        </div>,
        pipWindow.document.body,
      )
    : null;
};

export default AudioCall;
