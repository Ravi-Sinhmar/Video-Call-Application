import React from 'react'
import { useRecoilState } from "recoil";
import { video, mic } from "../states/atoms/Media";

// Icons
import { MdAddCall } from "react-icons/md";
import { IoVideocamOff, IoVideocam, IoCall } from "react-icons/io5";
import { IoMdMicOff, IoMdMic } from "react-icons/io";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";

export default function ButtonControls() {
    const [isVideo, setIsVideo] = useRecoilState(video);
    const [isMic, setIsMic] = useRecoilState(mic);


    return (
        <>
            <div className="w-full bg-transparent py-2 flex items-center justify-center">
                <div className="flex justify-between w-full rounded-md ring-2 ring-black items-center px-4 py-2 bg-white h-fit">
                    {/* Mic Toggle */}
                    <button className="flex flex-col text-sm items-center justify-center gap-1">
                        {isMic ? (
                            <IoMdMic className="size-8 p-1 bg-blue-500 text-white rounded-full" />
                        ) : (
                            <IoMdMicOff className="size-8 p-1 text-blt rounded-full" />
                        )}

                        <p>Mic</p>
                    </button>

                    {/* Video Toggle */}
                    <button className="flex flex-col text-sm items-center justify-center gap-1">
                        {isVideo ? (
                            <IoVideocam className="size-8 p-1 bg-blue-500 text-white rounded-full" />
                        ) : (
                            <IoVideocamOff className="size-8 p-1 text-blt rounded-full" />
                        )}


                        <p>Video</p>
                    </button>

                    {/* Sound */}

                    <button className="flex flex-col text-sm items-center justify-center gap-1">
                        {isVideo ? (
                            <HiMiniSpeakerWave className="size-8 p-1 bg-blue-500 text-white rounded-full" />
                        ) : (
                            <HiMiniSpeakerXMark className="size-8 p-1 text-blt rounded-full" />
                        )}


                        <p>Voice</p>
                    </button>


                    {/* Disconnect */}
                    <button className="flex flex-col text-sm items-center justify-center gap-1">
                        {isVideo ? (
                            <IoCall className="size-8 p-1 bg-blue-500 text-white rounded-full" />
                        ) : (
                            <MdAddCall className="size-8 p-1 text-blt rounded-full" />
                        )}
                        <p>Voice</p>
                    </button>
                </div>
            </div>
        </>
    )
}
