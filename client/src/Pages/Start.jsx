import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Start() {
    const navigate = useNavigate();
    const [isClick, setIsClick] = useState(false);
    const [name, setName] = useState("");
    const [smallLink, setSmallLink] = useState(null);
    const [shareLink, setShareLink] = useState(null);
    const linkRef = useRef(null);
    // Save the meeting info in database
    const BACKEND_URL =
    process.env.REACT_APP_ENV === "Production"
        ? process.env.REACT_APP_PRODUCTION_BACKEND_URL
        : process.env.REACT_APP_LOCAL_BACKEND_URL;

        const FRONTEND_URL =
        process.env.REACT_APP_ENV === "Production"
            ? process.env.REACT_APP_PRODUCTION_FRONTEND_URL
            : process.env.REACT_APP_LOCAL_FRONTEND_URL;
    const saveMeet = useCallback(() => {
        console.log("Data gone");
        const content = { Name: name };
        fetch(`${BACKEND_URL}/saveMeet`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(content),
        })
            .then((data) => data.json())
            .then((response) => {
                if (response.success) {
                    const meetingId = response.data;
    
                    // Store meetingId in localStorage
                    localStorage.setItem("meetingId", meetingId);
    
                    setSmallLink(`/meeting?meetingId=${meetingId}`);
                    setShareLink(
                        `${FRONTEND_URL}/meeting?meetingId=${meetingId}`
                    );
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [name]);

    //   Copy Link and Forward
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(linkRef.current.value);
            navigate(smallLink);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };



    return (
        <React.Fragment>
            <div className=" font-rob flex flex-col h-svh w-full items-center justify-center gap-2 pb-9">
                <div className="flex flex-col  items-center gap-4">
                    <img
                        className="w-40 aspect-square "
                        src="/images/welcome.png"
                        alt="Welcome"
                    />
                    <div className="flex flex-col items-center justify-center gap-4">
                        <h1 className="text-3xl font-[500] text-blf">Face Sync</h1>
                        <p className="text-gray-500 font-[400] text-center w-10/12">
                            {!isClick
                                ? "Connect, Laugh, and Create moments. Anytime, Anywhere with Love😚"
                                : shareLink
                                    ? "Copy and Share the link with your friend :"
                                    : "Enter name, Generate link, Share Link with friend and roast him/her😎"}
                        </p>
                    </div>
                </div>

                {!isClick && (
                    <button
                        onClick={() => setIsClick(true)}
                        className="bg-blue-500 text-white rounded-full py-2 w-4/5 font-[500] text-lg mt-6"
                    >
                        Start Instant Meeting
                    </button>
                )}

                {shareLink !== null ? (
                    <div className="px-2 py-1 rounded-lg gap-2  flex flex-col items-center justify-center ">
                        <h3 className="text-lg text-blm px-2 rounded-md font-[500]">
                            Copy & Share
                        </h3>
                        <div className="flex items-center justify-center gap-2">
                            <input
                                className="bg-blue-300 w-11/12 px-2 py-2 text-sm rounded-md ring-1 "
                                ref={linkRef}
                                type="text"
                                value={shareLink}
                                readOnly
                                style={{
                                    marginRight: "10px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            />
                            <button
                                className="bg-blue-500  px-4 py-2 text-sm rounded-md text-blm"
                                onClick={copyToClipboard}
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                ) : null}

                {isClick && !shareLink ? (
                    <div className="w-full flex flex-col justify-center items-center gap-4 pb-10 ">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className=" border-[1px] border-blf w-4/5 py-2 px-3 bg-gray-100 rounded-full mt-8"
                            placeholder="Your name please"
                            type="text"
                        />
                        <button
                            onClick={saveMeet}
                            className="bg-blue-500 text-white rounded-full py-2 w-4/5 font-[500] text-lg"
                        >
                            Generate Link
                        </button>
                    </div>
                ) : null}
            </div>
        </React.Fragment>
    );
}
export default Start;
