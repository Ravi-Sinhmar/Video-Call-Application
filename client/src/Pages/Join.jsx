import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { both, admin, meetingDetails, userSocket, adminSocket } from "../states/atoms/User";
import { configration } from "../states/atoms/Media";
import ButtonControls from "../components/ButtonControls";
import { useRecoilState } from "recoil";
import LocalVideo from "../components/LocalVideo";
import { socket } from "../utils/websocket";
import { webRtc } from "../states/atoms/Call";
import { peerState } from "../states/atoms/User";
import { usePeer } from "../utils/peer";


export default function Join() {
    const [isAdmin, setIsAdmin] = useRecoilState(admin);
    const [isBoth, setIsBoth] = useRecoilState(both);
    const [meetingId, setMeetingId] = useRecoilState(meetingDetails);
    const [isConnected, setIsConnected] = useRecoilState(webRtc);
    const [isPeer, setIsPeer] = useRecoilState(peerState);
    const [isAdminConnected, setIsAdminConnected] = useRecoilState(adminSocket);
    const [isUserConnected, setIsUserConnected] = useRecoilState(userSocket);
    const [searchParams] = useSearchParams();
    const remoteVideoRef = useRef();
    const { peer, createOffer, createAnswer, setRemoteAnswer } = usePeer();


            const BACKEND_URL =
  import.meta.env.VITE_ENV === "Production"
    ? import.meta.env.VITE_PRODUCTION_BACKEND_URL
    : import.meta.env.VITE_LOCAL_BACKEND_URL;

    useEffect(() => {
        const meetingId = searchParams.get("meetingId");
        if (!meetingId) return;

        fetch(`${BACKEND_URL}/seeMeet`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ meetingId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setMeetingId(meetingId);
                    if (meetingId === localStorage.getItem("meetingId")) {
                        setIsAdmin(true);
                    }
                }
            })
            .catch(error => console.error("Error sending meetingId:", error));
    }, [searchParams]);

    useEffect(() => {
        if (!meetingId) return;
        socket.connect();
        const email = isAdmin ? "admin@gmail.com" : "user@gmail.com";
        socket.emit("room:join", { email, room: meetingId });
        socket.on("room:joined", (data) => {
            console.log(`You are a ${data.role} in meeting ${data.meetingId}`);
            if (isAdmin) {
                setIsAdminConnected(true);
            } else {
                setIsUserConnected(true);
            }
        });

        socket.on("peer:joined", (data) => {
            console.log(`${data.role} joined the meeting: ${data.meetingId}`);
            if (!isAdmin) {
                setIsAdminConnected(true);
            } else {
                setIsUserConnected(true);
            }
        });

        socket.on("peer:left", (data) => {
            console.log(`${data.role} left the meeting: ${data.meetingId}`);
            setIsBoth(false);
            if (isAdmin) {
                setIsUserConnected(false);
            } else {
                setIsAdminConnected(false);
            }
        });

        return () => {
            // Notify server that user is leaving
            socket.emit("room:leave", { email, room: meetingId });
            if (isAdmin) {
                setIsAdminConnected(false);
            } else {
                setIsUserConnected(false);
            }
            socket.disconnect();
        };
    }, [meetingId, isAdmin]);

    async function handleConnect() {
        console.log("Connect");
        const email = isAdmin ? "admin@gmail.com" : "user@gmail.com";
        console.log(email);
        if (!isAdmin) {
            setIsPeer(true);
            const offer = await createOffer();
            console.log("Offer", offer);
            socket.emit("user:call", { email, room: meetingId, offer });
            console.log("Offer sent from user :", email, meetingId, offer);
        }
    }

    useEffect(() => {
        if (isAdmin) {
            const email = isAdmin ? "admin@gmail.com" : "user@gmail.com";
            const handleUserCall = async ({ offer }) => {
                setIsPeer(true);
                console.log("Got offer--->")
                const answer = await createAnswer(offer);
                console.log("Created answer from offer", answer);
                socket.emit("user:answer", { email, room: meetingId, answer });
            };
            const handleDone = () => {
                setIsConnected(true);
                alert("Connected Me as well");
            }

            socket.on("user:call", handleUserCall);
            socket.on("user:done", handleDone);

            return () => {
                socket.off("user:call", handleUserCall); // Cleanup listener
                socket.off("user:done", handleDone); // Cleanup listener
            };
        }
    }, [isAdmin, socket, createAnswer, meetingId]); // Added missing dependencies

    useEffect(() => {
        if (!isAdmin) {
            const email = isAdmin ? "admin@gmail.com" : "user@gmail.com";
            const handleAdminAnswer = async ({ answer }) => {
                const status = await setRemoteAnswer(answer);
                if (status) {
                    setIsConnected(true);
                    socket.emit("user:done", { email, room: meetingId });
                    alert("All Set");
                }
            }

            socket.on("user:answer", handleAdminAnswer);
            return () => {
                socket.off("user:answer", handleAdminAnswer); // Cleanup listener
            };
        }
    }, [isAdmin, socket, setRemoteAnswer, setIsConnected, meetingId]);

    const handleSendVideo = (event) => {
        console.log("Handle Send Video Runs");

        if (!event.streams.length) {
            console.log("No streams received");
            return;
        }

        const video = event.streams[0]; // Get the MediaStream
        const tracks = video.getTracks(); // Get tracks from the stream

        console.log("Remote Tracks:", tracks); // Corrected logging
    };

    useEffect(() => {
        if (isConnected && peer && !isAdmin) {
            console.log("Event Listener added");
            peer.addEventListener("track", handleSendVideo);

            return () => {
                console.log("Event Listener Removed");
                peer.removeEventListener("track", handleSendVideo);
            };
        }
    }, [isConnected, isAdmin, peer]); // Removed handleSendVideo from dependencies

    return (
        <React.Fragment>
            <div className="flex justify-center bg-white items-center w-svw h-svh">
                <div className="w-svw h-svh bg-white flex justify-center items-center sm:w-10/12 md:w-3/5 lg:w-2/5 md:aspect-square">
                    <div className="bg-transparent ring-4 ring-blf rounded-lg h-full w-full flex flex-col justify-between overflow-hidden relative px-2 pt-2">
                        <button onClick={handleConnect}>Connect</button>
                        <button onClick={(() => setIsConnected(!isConnected))}>change isConne</button>
                        <LocalVideo />
                        {/* Remote Video */}
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