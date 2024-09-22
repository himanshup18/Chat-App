// VideoCall.js
import React, { useRef, useEffect } from "react";

const VideoCall = ({ roomId, socket }) => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnectionRef = useRef();

  useEffect(() => {
    // Setup WebRTC
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnectionRef.current = peerConnection;

    // Get local media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => {
            if (peerConnection.signalingState !== 'closed') {
                peerConnection.addTrack(track, stream);
            }
            
        });
      });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", { room: roomId, signal: event.candidate });
      }
    };

    peerConnection.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    socket.on("signal", (data) => {
      if (data.signal) {
        peerConnection.addIceCandidate(new RTCIceCandidate(data.signal));
      }
    });

    return () => {
      socket.off("signal");
      peerConnection.close();
    };
  }, [roomId, socket]);

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
    </div>
  );
};

export default VideoCall;
