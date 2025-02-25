import React, { createContext, useContext, useState, useEffect ,useMemo} from "react";

const PeerContext = createContext(null);

export const usePeer = () => {
  return useContext(PeerContext);
};

function PeerProvider({ children }) {
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );

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
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAnswer = async (answer) => {
    if (!peer) {
      console.log("Peer is not instantiated");
      return false;
    }
    await peer.setRemoteDescription(answer);
    return true;
  };

  const sendVideo = async (video) => {
    if (!video || !peer) {
      console.log("Video or peer is not initialized");
      return;
    }

    const tracks = video.getTracks();
    const senders = peer.getSenders();

    for (const track of tracks) {
      const senderExists = senders.some((sender) => sender.track && sender.track.id === track.id);

      if (!senderExists) {
        console.log("Adding track:", track);
        peer.addTrack(track, video);
      } else {
        console.log("Track already added:", track.id);
      }
    }
  };

  const closePeerConnection = () => {
    if (peer) {
      peer.close();
    }
  };

  useEffect(() => {
    return () => {
      closePeerConnection();
    };
  }, [peer]);

  return (
    <PeerContext.Provider value={{ peer, sendVideo, createOffer, createAnswer, setRemoteAnswer, closePeerConnection }}>
      {children}
    </PeerContext.Provider>
  );
}

export default PeerProvider;