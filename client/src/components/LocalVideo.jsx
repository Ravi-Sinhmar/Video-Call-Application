import React, { useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { getMediaStream } from "../utils/getStream";
import { video, mic,configration, audioInputDeviceState,videoInputDeviceState, audioOutputDeviceState } from "../states/atoms/Media";
import { usePeer } from '../Contexts/peer';

export default function LocalVideo() {
    const localVideoRef = useRef();
    const constraints = useRecoilValue(configration);
    const [audioId,setAudioId] = useRecoilState(audioInputDeviceState);
    const [videoId,setVideoId] = useRecoilState(videoInputDeviceState);
    const setIsMic = useSetRecoilState(mic);
    const setIsVideo = useSetRecoilState(video);
    const { peer, sendVideo } = usePeer();

    const openMediaDevices = async () => {
        // Ensure at least one of audio or video is true
        if (!audioId && !videoId) {
            console.log("Both audio and video are disabled. Skipping getUserMedia.");
            return;
        }
        try {
            console.log("IDs",audioId,videoId);
            const stream = await getMediaStream({aduio: { deviceId: { exact: audioId } },video: { deviceId: { exact: videoId } }});
            if (stream && localVideoRef.current) {
                // setIsMic(constraints.audio ? true : false);
                // setIsVideo(constraints.video ? true : false);
                localVideoRef.current.srcObject = stream;
                setIsMic(true);
                setIsVideo(true);
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
    }, [peer, audioId,videoId]); // Deep comparison

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
            className="absolute right-4 top-4 rounded-md object-cover h-28 w-20 sm:h-32 sm:w-24  shadow-md"
        />
    );
}