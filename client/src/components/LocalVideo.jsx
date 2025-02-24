import React, { useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getMediaStream } from "../utils/getStream";
import { video, mic, configration } from "../states/atoms/Media";
import { usePeer } from '../Contexts/peer';

export default function LocalVideo() {
    const localVideoRef = useRef();
    const constraints = useRecoilValue(configration);
    const setIsMic = useSetRecoilState(mic);
    const setIsVideo = useSetRecoilState(video);
    const { peer, sendVideo } = usePeer();

    const openMediaDevices = async () => {
        // Ensure at least one of audio or video is true
        if (!constraints.audio && !constraints.video) {
            console.log("Both audio and video are disabled. Skipping getUserMedia.");
            return;
        }

        try {
            const stream = await getMediaStream(constraints);
            if (stream && localVideoRef.current) {
                setIsMic(constraints.audio);
                setIsVideo(constraints.video);
                localVideoRef.current.srcObject = stream;
                if (peer) {
                    await sendVideo(stream);
                }
            }
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    useEffect(() => {
        console.log("Constraints updated:", constraints);
        if (peer) {
            openMediaDevices();
        }
    }, [peer, JSON.stringify(constraints)]); // Deep comparison

    // Cleanup media tracks on unmount
    useEffect(() => {
        return () => {
            if (localVideoRef.current?.srcObject) {
                localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted={true} // Mute local video to avoid feedback
            className="absolute right-4 top-4 rounded-md object-cover h-28 w-20 sm:h-32 sm:w-24 ring-2 ring-black"
        />
    );
}