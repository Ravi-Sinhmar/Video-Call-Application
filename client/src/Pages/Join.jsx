import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { admin, meetingDetails } from "../states/atoms/User";
import ButtonControls from "../components/ButtonControls";
import { useRecoilState, useSetRecoilState } from "recoil";
import LocalVideo from "../components/LocalVideo";
import { socket } from "../utils/websocket";
import { peerState } from "../states/atoms/User";
import { usePeer } from "../Contexts/peer";
import { loading } from "../states/atoms/User";

export default function Join() {
    const setIsLoading= useSetRecoilState(loading)
  const [isAdmin, setIsAdmin] = useRecoilState(admin);
  const [meetingId, setMeetingId] = useRecoilState(meetingDetails);
  const [isPeer, setIsPeer] = useRecoilState(peerState);
  const [searchParams] = useSearchParams();
  const remoteVideoRef = useRef();
  const { peer, createOffer, createAnswer, setRemoteAnswer, closePeerConnection } = usePeer();

  const BACKEND_URL =
    import.meta.env.VITE_ENV === "Production"
      ? import.meta.env.VITE_PRODUCTION_BACKEND_URL
      : import.meta.env.VITE_LOCAL_BACKEND_URL;

  useEffect(() => {
    const meetingId = searchParams.get("meetingId");
    if (!meetingId) return;
    setIsLoading(true);

    fetch(`${BACKEND_URL}/seeMeet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ meetingId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        if (data.success) {
          setMeetingId(meetingId);
          if (meetingId === localStorage.getItem("meetingId")) {
            setIsAdmin(true);
          }
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error sending meetingId:", error)});
  }, [searchParams]);

  useEffect(() => {
    if (!meetingId) return;
    socket.connect();
    const email = isAdmin ? "admin@gmail.com" : "user@gmail.com";
    socket.emit("room:join", { email, room: meetingId });

    socket.on("room:joined", (data) => {
      console.log(`You are a ${data.role} in meeting ${data.meetingId}`);
    });

    socket.on("peer:joined", (data) => {
      console.log(`${data.role} joined the meeting: ${data.meetingId}`);
    });

    socket.on("peer:left", (data) => {
      console.log(`${data.role} left the meeting: ${data.meetingId}`);
    });

    return () => {
      socket.emit("room:leave", { email, room: meetingId });
      socket.disconnect();
      closePeerConnection();
    };
  }, [meetingId, isAdmin]);

  async function handleConnect() {
    const email = isAdmin ? "admin@gmail.com" : "user@gmail.com";
    if (!isAdmin) {
      setIsPeer(true);
      const offer = await createOffer();
      socket.emit("user:call", { email, room: meetingId, offer });
      console.log("Offer sent from user:", offer);
    }
  }

  useEffect(() => {
    if (isAdmin) {
      const email = isAdmin ? "admin@gmail.com" : "user@gmail.com";
      const handleUserCall = async ({ offer }) => {
        setIsPeer(true);
        console.log("Got offer, now I will create answer and send");
        const answer = await createAnswer(offer);
        console.log("Created answer from offer:", answer);
        socket.emit("user:answer", { email, room: meetingId, answer });
      };
      const handleDone = () => {
        console.log("Done connection");
      };

      socket.on("user:call", handleUserCall);
      socket.on("user:done", handleDone);

      return () => {
        socket.off("user:call", handleUserCall);
        socket.off("user:done", handleDone);
      };
    }
  }, [isAdmin, socket, createAnswer, meetingId]);

  useEffect(() => {
    if (!isAdmin) {
      const email = isAdmin ? "admin@gmail.com" : "user@gmail.com";
      const handleAdminAnswer = async ({ answer }) => {
        console.log("Got the answer, now I will set it in my remoteAnswer");
        const status = await setRemoteAnswer(answer);
        if (status) {
   
          socket.emit("user:done", { email, room: meetingId });
          console.log("Done sent");
        }
      };

      socket.on("user:answer", handleAdminAnswer);
      return () => {
        socket.off("user:answer", handleAdminAnswer);
      };
    }
  }, [isAdmin, socket, setRemoteAnswer, meetingId]);

  useEffect(() => {
    const handleNegoNeeded = async () => {
      console.log("Negotiation needed");
      const email = isAdmin ? "admin@gmail.com" : "user@gmail.com";
      const offer = await createOffer();
      socket.emit("nego:offer", { email, room: meetingId, offer });
    };

    peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [socket, peer, isAdmin, createOffer]);

  useEffect(() => {
      const email = isAdmin ? "admin@gmail.com" : "user@gmail.com";
      const handleNegAnswer = async ({ offer }) => {
        setIsPeer(true);
        console.log("Got offer, now I will create answer and send");
        const answer = await createAnswer(offer);
        console.log("Created answer from offer:", answer);
        socket.emit("nego:answer", { email, room: meetingId, answer });
      };

      const handleNegDone = () => {
        console.log("Neg Done");
      };
      const handleNegSetAnswer = async ({ answer }) => {
        console.log("Got the answer, now I will set it in my remoteAnswer");
        const status = await setRemoteAnswer(answer);
        if (status) {
          socket.emit("nego:done", { email, room: meetingId });
          console.log("Sent Neg");
        }
      };
      socket.on("nego:offer", handleNegAnswer);
      socket.on("nego:answer", handleNegSetAnswer);
      socket.on("nego:done", handleNegDone);

      return () => {
        socket.off("nego:offer", handleNegAnswer);
        socket.off("nego:answer", handleNegSetAnswer);
        socket.off("nego:done", handleNegDone);
      };
    
  }, [isAdmin, socket, createAnswer, meetingId]);



  

  useEffect(() => {
    const handleTrack = (event) => {
      console.log("Remote track received");
      console.log(event.streams);
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peer.addEventListener("track", handleTrack);
    return () => {
      peer.removeEventListener("track", handleTrack);
    };
  }, [peer]);

  return (
    <React.Fragment>
      <div className="flex justify-center bg-white items-center w-svw h-svh">
        <div className="w-svw h-svh bg-white flex justify-center items-center sm:w-10/12 md:w-3/5 lg:w-2/5 md:aspect-square">
          <div className="bg-transparent ring-4 ring-blf rounded-lg h-full w-full flex flex-col justify-between overflow-hidden relative px-2 pt-2">
            <button onClick={handleConnect}>Connect</button>
            <LocalVideo />
            <div className="flex flex-col justify-center items-center h-full">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full md:aspect-square ring-2 ring-blt bg-white rounded-md object-cover"
              ></video>
            </div>
            <ButtonControls />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}