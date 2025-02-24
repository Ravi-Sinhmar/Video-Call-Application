import React from 'react'
import { useRecoilState } from "recoil";
import { video, mic,voice,join } from "../states/atoms/Media";



// Icons
import { IoVideocamOff, IoVideocam, IoCall } from "react-icons/io5";
import { IoMdMicOff, IoMdMic } from "react-icons/io";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { ImPhoneHangUp } from "react-icons/im";




export default function ButtonControls() {
    const [isVideo, setIsVideo] = useRecoilState(video);
    const [isMic, setIsMic] = useRecoilState(mic);
    const [isVoice, setIsVoice] = useRecoilState(voice);
    const [isJoin, setIsJoin] = useRecoilState(join);

    function handleJoin(){
        if(!isJoin){
            console.log("Join");
            setIsJoin(true);
        }else{

            console.log("Disconnect");
            setIsJoin(false);
        }
    };

    function handleMic(){
        if(!isMic){
            console.log("Mic Start");
            setIsMic(true);
        }else{
            console.log("Mic Off");
            setIsMic(false);
        }

    }

    function handleVideo(){
        if(!isVideo){
            console.log("Video Start");
            setIsVideo(true);
        }else{
            console.log("Vidoe Off");
            setIsVideo(false);
        }

    };

    function handleVoice(){
        if(!isVoice){
            console.log("Voice Start");
            setIsVoice(true);
        }else{
            console.log("Voice Off");
            setIsVoice(false);
        }
    }


  



    return (
        <>
            <div className="w-full bg-transparent py-2 flex items-center justify-center">
                <div className="flex justify-between w-full rounded-md ring-2 ring-black items-center px-4 py-2 bg-white h-fit">
                    {/* Mic Toggle */}
                    <button onClick={handleMic} className="flex flex-col text-sm items-center justify-center gap-1">
                        {isMic ? (
                            <IoMdMic className="size-8 p-1 bg-blue-500 text-white rounded-full" />
                        ) : (
                            <IoMdMicOff className="size-8 p-1 text-blt rounded-full bg-zinc-200" />
                        )}

                        <p>Mic</p>
                    </button>

                    {/* Video Toggle */}
                    <button onClick={handleVideo} className="flex flex-col text-sm items-center justify-center gap-1">
                        {isVideo ? (
                            <IoVideocam className="size-8 p-1 bg-blue-500 text-white rounded-full" />
                        ) : (
                            <IoVideocamOff className="size-8 p-1 text-blt rounded-full bg-zinc-200" />
                        )}


                        <p>Video</p>
                    </button>

                    {/* Sound */}

                    <button onClick={handleVoice} className="flex flex-col text-sm items-center justify-center gap-1">
                        {isVoice ? (
                            <HiMiniSpeakerWave className="size-8 p-1 bg-blue-500 text-white rounded-full" />
                        ) : (
                            <HiMiniSpeakerXMark className="size-8 p-1 text-blt rounded-full bg-zinc-200" />
                        )}


                        <p>Speaker</p>
                    </button>


                    {/* Disconnect */}
                    <button onClick={handleJoin} className="flex flex-col text-sm items-center justify-center gap-1">
                        {isJoin ? (
                            <ImPhoneHangUp className="size-8 p-1 bg-red-700 text-white rounded-full" />
                        ) : (
                            <IoCall className="size-8 p-1 text-blt rounded-full bg-zinc-200" />
                        )}
                        <p>{isJoin? "Cut" : "Call"}</p>
                    </button>
                </div>
            </div>
        </>
    )
}
