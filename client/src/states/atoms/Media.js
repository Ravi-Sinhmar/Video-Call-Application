import { atom } from "recoil";

export const configration = atom({
  key: "constraints",
  default: {
    video: true,
    audio: true,
  }
});

// Atom for audio input device
export const audioInputDeviceState = atom({
  key: "audioId",
  default: null, // Default to no device selected
});

// Atom for audio output device
export const audioOutputDeviceState = atom({
  key: "audioOutputId",
  default: null, // Default to no device selected
});

// Atom for video input device
export const videoInputDeviceState = atom({
  key: "videoId",
  default: null, // Default to no device selected
});

export const mic = atom({
  key: "isMic",
  default: false,
});

export const video = atom({
  key: "isVideo",
  default: false,
});

export const voice = atom({
  key: "isVoice",
  default: false,
});


export const joinState = atom({
  key: "isJoined",
  default: false,
});


export const setting = atom({
  key: "isSetting",
  default: false,
});

