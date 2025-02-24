import React, { useEffect, useRef } from 'react';
import { getMediaStream } from "../utils/localStream";
import { video, mic, configration } from "../states/atoms/Media";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { usePeer } from '../Contexts/peer';

export default function LocalVideo() {
    const localVideoRef = useRef();
    const setIsVideo = useSetRecoilState(video);
    const constraints = useRecoilValue(configration);
    const setIsMic = useSetRecoilState(mic);
    const { peer, sendVideo } = usePeer();

    const openMediaDevices = async () => {
        const stream = await getMediaStream(constraints);
        if (stream && localVideoRef.current) {
            setIsMic(true);
            setIsVideo(true);
            localVideoRef.current.srcObject = stream;
            if (peer) {
                await sendVideo(stream)
            }
        }
    };

    useEffect(() => {
        if (peer) {
            openMediaDevices();
        }
    }, [peer,constraints]);
    return (
        <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted // Correct way to handle "muted"
            className="absolute right-4 top-4 rounded-md object-cover h-28 w-20 sm:h-32 sm:w-24 ring-2 ring-black"
        />

    );
}
