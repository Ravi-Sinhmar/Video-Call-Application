import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
    audioInputDeviceState,
    audioOutputDeviceState,
    videoInputDeviceState,
} from "../states/atoms/Media";
import { setting } from "../states/atoms/Media";
function Setting() {
    const audioInputEl = useRef(null);
    const audioOutputEl = useRef(null);
    const videoInputEl = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const setIsSetting = useSetRecoilState(setting);
    
    // Recoil state for each device type
    const [audioId, setAudioId] = useRecoilState(audioInputDeviceState);
    const [audioOutputId, setAudioOutputId] = useRecoilState(audioOutputDeviceState);
    const [videoId, setVideoId] = useRecoilState(videoInputDeviceState);

    // Get user media permissions and set loading state
    const getStream = useCallback(async () => {
        try {
            const permission = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            if (permission) {
                setIsLoading(true);
            }
        } catch (err) {
            console.log("Error getting user media:", err);
        }
    }, []);

    // Enumerate available devices and populate dropdowns
    const getDevices = useCallback(async () => {
        if (isLoading) {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                if (devices) {
                    setIsLoading(false);
                }
                console.log("Available devices:", devices);

                // Clear existing options
                audioInputEl.current.innerHTML = "";
                audioOutputEl.current.innerHTML = "";
                videoInputEl.current.innerHTML = "";

                // Variables to store the first device of each type
                let firstAudioInput = null;
                let firstAudioOutput = null;
                let firstVideoInput = null;

                devices.forEach((d) => {
                    const option = document.createElement("option");
                    option.value = d.deviceId;
                    option.text = d.label || `Unknown ${d.kind} (${d.deviceId.slice(0, 5)})`;

                    if (d.kind === "audioinput") {
                        audioInputEl.current.appendChild(option);
                        if (!firstAudioInput) {
                            firstAudioInput = d.deviceId; // Store the first audio input device
                        }
                    } else if (d.kind === "audiooutput") {
                        audioOutputEl.current.appendChild(option);
                        if (!firstAudioOutput) {
                            firstAudioOutput = d.deviceId; // Store the first audio output device
                        }
                    } else if (d.kind === "videoinput") {
                        videoInputEl.current.appendChild(option);
                        if (!firstVideoInput) {
                            firstVideoInput = d.deviceId; // Store the first video input device
                        }
                    }
                });

                // Set the first device as default if no device is selected
                if (!audioId && firstAudioInput) {
                    setAudioId(firstAudioInput);
                    console.log("FirstAudioIinput",firstAudioInput);
                    storeInLocalStorage("audioInput", firstAudioInput);
                }
                if (!audioOutputId && firstAudioOutput) {
                    setAudioOutputId(firstAudioOutput);
                    storeInLocalStorage("audioOutput", firstAudioOutput);
                }
                if (!videoId && firstVideoInput) {
                    setVideoId(firstVideoInput);
                    console.log("firvideo",firstVideoInput);
                    storeInLocalStorage("videoInput", firstVideoInput);
                }
            } catch (err) {
                console.log("Error enumerating devices:", err);
            }
        }
    }, [isLoading, audioId, audioOutputId, videoId, setAudioId, setAudioOutputId, setVideoId]);

    // Store device IDs in localStorage
    const storeInLocalStorage = (key, value) => {
        // Delete existing value if any
        localStorage.removeItem(key);

        // Store the latest value
        localStorage.setItem(key, value);
    };

    // Handle audio input change
    const changeAudioInput = (e) => {
        const deviceId = e.target.value;
        setAudioId(deviceId); // Update audio input state
        storeInLocalStorage("audioInput", deviceId); // Store in localStorage
        console.log("Selected Audio Input:", deviceId);
    };

    // Handle audio output change
    const changeAudioOutput = (e) => {
        const deviceId = e.target.value;
        setAudioOutputId(deviceId); // Update audio output state
        storeInLocalStorage("audioOutput", deviceId); // Store in localStorage
        console.log("Selected Audio Output:", deviceId);
    };

    // Handle video input change
    const changeVideo = (e) => {
        const deviceId = e.target.value;
        setVideoId(deviceId); // Update video input state
        storeInLocalStorage("videoInput", deviceId); // Store in localStorage
        console.log("Selected Video Input:", deviceId);
    };

    // Get user media permissions on mount
    useEffect(() => {
        getStream();
    }, [getStream]);

    // Enumerate devices after permissions are granted
    useEffect(() => {
        getDevices();
    }, [getDevices]);

    // On Continue
    function onContinue() {
        setIsSetting(false);
    }

    return(
        <React.Fragment>
            {isLoading ? (
                <div className="bg-blf">
                    It might take 2 minutes on first time load, so please have patience.
                </div>
            ) : null}
            <div className="flex justify-center bg-blm items-center w-svw h-svh">
                <div className="w-svw h-svh bg-blm px-4 flex flex-col justify-around items-center sm:w-10/12 md:w-3/5 lg:w-2/5 md:aspect-square">
                    <div className="flex flex-col items-center w-full gap-8">
                        <button
                            onClick={onContinue}
                            className="flex items-center w-full rounded-md"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-8 w-8 text-blm p-2 font-[500] bg-blf rounded-full"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                                />
                            </svg>
                        </button>

                        {/* Audio Input */}
                        <div className="flex flex-col gap-3 w-full justify-between">
                            <label className="font-[500] text-blf">Audio Input (Mic)</label>
                            <select
                                onChange={changeAudioInput}
                                ref={audioInputEl}
                                className="text-blt px-2 ring-1 ring-gray-500 bg-blg rounded-md w-full text-sm py-3"
                                id="audio-input"
                            ></select>
                        </div>

                        {/* Audio Output */}
                        <div className="flex flex-col gap-3 w-full justify-between">
                            <label className="text-blf font-[500]">Sound Output (Speaker)</label>
                            <select
                                onChange={changeAudioOutput}
                                ref={audioOutputEl}
                                className="text-blt px-2 ring-1 ring-gray-500 bg-blg rounded-md w-full text-sm py-3"
                                id="audio-output"
                            ></select>
                        </div>

                        {/* Video Input */}
                        <div className="flex flex-col gap-3 w-full justify-between">
                            <label className="text-blf font-[500]">Camera Type</label>
                            <select
                                onChange={changeVideo}
                                ref={videoInputEl}
                                className="text-blt px-2 ring-1 ring-gray-500 bg-blg rounded-md w-full text-sm py-3"
                                id="video-input"
                            ></select>
                        </div>
                    </div>
                    <button
                        onClick={onContinue}
                        className="bg-blf text-blm shadow-sm shadow-black w-full py-2 rounded-full text-lg"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Setting;