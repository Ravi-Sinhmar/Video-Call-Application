import { atom } from "recoil";
export const admin = atom({
    key : 'isAdmin',
    default : false
});

export const both = atom({
    key : 'isBoth',
    default : false
});

export const meetingDetails = atom({
    key : 'meetingId',
    default : null
});

export const loading = atom({
    key: "isLoading", // Unique key for the atom
    default: false    // Default value for the atom
});

export const userSocket = atom({
    key : 'isUserConnected',
    default : false
});

export const adminSocket = atom({
    key : 'isAdminConnected',
    default : false
});

export const peerState = atom({
    key : 'isPeer',
    default : false
});