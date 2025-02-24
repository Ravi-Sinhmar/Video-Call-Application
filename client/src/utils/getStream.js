
export const getMediaStream = async (constraints) => {
    if (!constraints.audio && !constraints.video) {
        throw new Error("At least one of audio or video must be requested");
    }
    return await navigator.mediaDevices.getUserMedia(constraints);
};