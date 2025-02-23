import { atom } from "recoil";

export const call = atom({
    key : 'isLive',
    default : false
});

export const settings = atom({
    key : 'isDone',
    default : false
});

export const remoteStream = atom({
    key : 'isRemoteStream',
    default : false
});


export const webRtc = atom({
    key : 'isConnected',
    default : false
});



