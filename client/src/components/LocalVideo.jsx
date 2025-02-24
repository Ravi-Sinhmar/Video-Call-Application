import React, { useEffect, useRef } from 'react';
import { getMediaStream } from "../utils/localStream";
import { video, mic, configration } from "../states/atoms/Media";
import { useRecoilState } from 'recoil';
import { IoVideocamOff, IoVideocam } from "react-icons/io5";
import { admin } from '../states/atoms/User';
import { webRtc } from '../states/atoms/Call';
import { peerState } from '../states/atoms/User';
import { usePeer } from '../utils/peer';
export default function LocalVideo() {
    const localVideoRef = useRef();
    const [isAdmin, setIsAdmin] = useRecoilState(admin);
    const [isConnected, setIsConnected] = useRecoilState(webRtc);
    const [isVideo, setIsVideo] = useRecoilState(video);
    const [constraints, setconstraints] = useRecoilState(configration);
    const [isMic, setIsMic] = useRecoilState(mic);
    const [isPeer, setIsPeer] = useRecoilState(peerState);
    const { peer, sendVideo } = usePeer();

    const openMediaDevices = async () => {
        console.log(constraints);
        const stream = await getMediaStream(constraints);
        if (stream && localVideoRef.current) {
            setIsMic(true);
            setIsVideo(true);
            localVideoRef.current.srcObject = stream;
            if (peer) {
                console.log("Yes peer", peer.connectionState);
                console.log(stream);
                await sendVideo(stream)
            }
        }
    };

    useEffect(() => {
        if (peer) {
            openMediaDevices();
        }
    }, [peer]);

    const closeMediaDevices = async () => {
        const stream = await getMediaStream(constraints);
        if (stream && localVideoRef.current) {
            setIsMic(false);
            setIsVideo(false);
            localVideoRef.current.srcObject = null;
        }
    };
    return (
        <>
            <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted={isMic} // Correct way to handle "muted"
                className="absolute right-4 top-4 rounded-md object-cover h-28 w-20 sm:h-32 sm:w-24 ring-2 ring-black"
            />
            <button onClick={!isVideo ? openMediaDevices : closeMediaDevices} className="absolute right-4 top-4 flex flex-col text-sm items-center justify-center gap-1 z-10 cursor-pointer">
                {isVideo ? (
                    <IoVideocam className="size-8 p-1 bg-blue-500 text-white rounded-full" />
                ) : (
                    <IoVideocamOff className="size-8 p-1 text-blt rounded-full" />
                )}

            </button>
        </>
    );
}
