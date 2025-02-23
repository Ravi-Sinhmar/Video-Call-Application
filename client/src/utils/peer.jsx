import React, { createContext, useContext, useState, useEffect } from "react";

const PeerContext = createContext(null);

export const usePeer = () => {
  return useContext(PeerContext);
};

const peerConfiguration = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:global.stun.twilio.com:3478",
      ],
    },
  ],
};

function PeerProvider({ children }) {
  const [peer, setPeer] = useState(new RTCPeerConnection(peerConfiguration));

  useEffect(() => {
    const newPeer = new RTCPeerConnection(peerConfiguration);

    newPeer.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", newPeer.iceConnectionState);
      if (newPeer.iceConnectionState === "connected") {
        console.log("WebRTC connection established!");
        alert("WebRTC connection established!");
      }
    };

    newPeer.onconnectionstatechange = () => {
      console.log("Connection State:", newPeer.connectionState);
      if (newPeer.connectionState === "connected") {
        console.log("WebRTC connection is fully connected!");
        alert("WebRTC connection is fully connected!");
      }
    };

    setPeer(newPeer);

    return () => {
      newPeer.close();
    };
  }, []);

  const createOffer = async () => {
    if (!peer) {
      console.log("Peer is not instantiated");
      return null;
    }
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    if (!peer) {
      console.log("Peer is not instantiated");
      return null;
    }
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAnswer = async (answer) => {
    if (!peer) {
      console.log("Peer is not instantiated");
      return false;
    }
    await peer.setRemoteDescription(new RTCSessionDescription(answer));
    return true;
  };

  const sendVideo = async (video) => {
    if (!video || !peer) {  
      console.log("Video or peer is not initialized");
      return; 
    }
  
    const tracks = video.getTracks(); // Get tracks from MediaStream
    const senders = peer.getSenders(); // Get existing senders
  
    console.log("Video:", video);
    console.log("Tracks:", tracks);
    console.log("Senders:", senders);
  
    for (const track of tracks) {
      const senderExists = senders.some(sender => sender.track && sender.track.id === track.id);
  
      if (!senderExists) {
        console.log("Adding track:", track);
        peer.addTrack(track, video);
      } else {
        console.log("Track already added:", track.id);
      }
    }
  };

  return (
    <PeerContext.Provider value={{ peer, sendVideo, createOffer, createAnswer, setRemoteAnswer }}>
      {children}
    </PeerContext.Provider>
  );
}

export default PeerProvider;