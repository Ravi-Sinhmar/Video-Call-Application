export const getMediaStream = async (constraints) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Got MediaStream:', stream);
        return stream;
    } catch (error) {
        console.error('Error accessing media devices.', error);
        return null;
    }
};
