import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { video, mic, voice, joinState, configration , setting} from "../states/atoms/Media";
import { startJoining } from '../states/atoms/Media';

// Icons
import { IoVideocamOff, IoVideocam, IoCall } from "react-icons/io5";
import { IoMdMicOff, IoMdMic } from "react-icons/io";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { ImPhoneHangUp } from "react-icons/im";
import { IoSettings } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";



export default function ButtonControls() {
    const [isVideo, setIsVideo] = useRecoilState(video);
    const [isMic, setIsMic] = useRecoilState(mic);
    const [isVoice, setIsVoice] = useRecoilState(voice);
    const [isJoined, setIsJoined] = useRecoilState(joinState);
    const [constraints, setConstraints] = useRecoilState(configration);
    const [isSetting,setIsSetting] = useRecoilState(setting);
    const [isJoining,setIsJoining] = useRecoilState(startJoining);


    function handleJoin() {
       setIsJoining(true);
    }
    
    function handleMic() {
        const newConstraints = { ...constraints, audio: !isMic };

        // Ensure at least one of audio or video is true
        if (!newConstraints.audio && !newConstraints.video) {
            newConstraints.audio = true; // Force audio to be true
        }

        setConstraints(newConstraints);
        setIsMic(!isMic);
        console.log(isMic ? "Mic Off" : "Mic Start");
    }

    function handleVideo() {
        const newConstraints = { ...constraints, video: !isVideo };

        // Ensure at least one of audio or video is true
        if (!newConstraints.audio && !newConstraints.video) {
            newConstraints.video = true; // Force video to be true
        }

        setConstraints(newConstraints);
        setIsVideo(!isVideo);
        console.log(isVideo ? "Video Off" : "Video Start");
    }

    function handleVoice() {
        setIsVoice(!isVoice);
        console.log(isVoice ? "Voice Off" : "Voice Start");
    };


    function handleSetting(){{
        setIsSetting(!isSetting);
        console.log(isSetting ? "Setting close" : "Setting open");
    }}

    return (
        <div className="w-full bg-transparent py-2 flex items-center justify-center">
            <div className="flex justify-between w-full rounded-md shadow-sm items-center px-4 py-2 bg-white h-fit">
                {/* Mic Toggle */}
                <button onClick={handleMic} className="flex flex-col text-sm items-center justify-center gap-1">
                    {isMic ? (
                        <IoMdMic className="size-8 p-2 bg-blue-500 text-white rounded-full" />
                    ) : (
                        <IoMdMicOff className="size-8 p-2 text-gray-800 rounded-full bg-zinc-200" />
                    )}
                    <p>Mic</p>
                </button>

                {/* Video Toggle */}
                <button onClick={handleVideo} className="flex flex-col text-sm items-center justify-center gap-1">
                    {isVideo ? (
                        <IoVideocam className="size-8 p-2 bg-blue-500 text-white rounded-full" />
                    ) : (
                        <IoVideocamOff className="size-8 p-2 text-gray-800 rounded-full bg-zinc-200" />
                    )}
                    <p>Video</p>
                </button>

                   {/* Disconnect */}
                   <button onClick={handleJoin} className="flex flex-col text-sm items-center justify-center gap-1">
                    {isJoined ? (
                        <ImPhoneHangUp className="size-8 p-2 bg-red-700 text-white rounded-full" />
                    ) : (
                        <IoCall className="size-8 p-2 text-gray-800 rounded-full bg-zinc-200" />
                    )}
                    {isJoining ? <p>Joining</p> : <p>{isJoined ? "Disconnect" : "Join"}</p>}
                    

                </button>

                {/* Sound Toggle */}
                <button onClick={handleVoice} className="flex flex-col text-sm items-center justify-center gap-1">
                    {isVoice ? (
                        <HiMiniSpeakerWave className="size-8 p-2 bg-blue-500 text-white rounded-full" />
                    ) : (
                        <HiMiniSpeakerXMark className="size-8 p-2 text-gray-800 rounded-full bg-zinc-200" />
                    )}
                    <p>Speaker</p>
                </button>

             

                   {/* Settings */}
                   <button onClick={handleSetting} className="flex flex-col text-sm items-center justify-center gap-1">
                    {isSetting ? (
                        <FaXmark className="size-8 p-2 bg-red-700 text-white rounded-full" />
                    ) : (
                        <IoSettings className="size-8 p-2 text-gray-800 rounded-full bg-zinc-200" />
                    )}
                    <p>Settings</p>
                </button>
            </div>
        </div>
    );
}